const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit');
const { prisma } = require('../lib/prisma.js');
const { sendReservationConfirmation, sendAdminNotification, sendStatusNotification, sendReplyToCustomer } = require('../lib/mailer.js');
const { generateReservationNumber } = require('../lib/helpers.js');

const app = express();

if (!process.env.SUPABASE_URL) throw new Error('SUPABASE_URL manquant');
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY manquant');
if (!process.env.ADMIN_ACCESS_CODE) console.warn('⚠ ADMIN_ACCESS_CODE non défini');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET manquant');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Ensure storage bucket exists
(async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'parrots')) {
    const { error } = await supabase.storage.createBucket('parrots', { public: true });
    if (error) console.error('⚠ Erreur création bucket parrots:', error.message);
    else console.log('✅ Bucket parrots créé');
  }
})();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, fieldSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype && (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image et PDF sont autorisés'), false);
    }
  }
});

async function uploadFiles(files, folder = 'parrots') {
  const sorted = [...files].sort((a, b) =>
    a.originalname.localeCompare(b.originalname, undefined, { numeric: true })
  );
  const results = await Promise.all(
    sorted.map(async (file, index) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const fileName = `${Date.now()}-${index}-${safeName}`;
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/${folder}/${fileName}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': file.mimetype,
        },
        body: file.buffer,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload ${response.status}: ${text}`);
      }
      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${folder}/${fileName}`;
      return { index, url: publicUrl };
    })
  );
  const urls = {};
  results.forEach(({ index, url }) => {
    urls[index === 0 ? 'imageUrl' : `imageUrl${index + 1}`] = url;
  });
  return urls;
}

const corsOptions = {
  origin: [
    'https://leparcdesperroquets.fr',
    'https://leparcdesperroquets.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiter for admin code attempts
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' },
});

// ─── Admin Auth ────────────────────────────────────────────────────────────
app.post('/api/admin/login', adminLoginLimiter, (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code requis' });
  if (code !== process.env.ADMIN_ACCESS_CODE) {
    return res.status(401).json({ error: 'Code incorrect' });
  }
  const token = jwt.sign({ role: 'admin', id: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, expiresIn: '8h' });
});

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Code d'accès manquant" });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Code invalide ou expiré' });
  }
}

// ─── API Root ──────────────────────────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Le Parc des Perroquets API',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// ─── Parrots Routes ────────────────────────────────────────────────────────
app.get('/api/parrots', async (req, res) => {
  try {
    const { species, sex, status, saleType, featured, search, minPrice, maxPrice, limit, page = 1 } = req.query;
    const take = limit ? parseInt(limit) : undefined;
    const skip = page ? (parseInt(page) - 1) * (take || 12) : 0;
    const where = { isActive: true, status: { not: 'sold' } };

    if (species) where.species = { contains: species, mode: 'insensitive' };
    if (sex) where.sex = sex;
    if (status) where.status = status;
    if (saleType) where.saleType = saleType;
    if (featured !== undefined) where.featured = featured === 'true';
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { species: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };

    const [parrots, total] = await Promise.all([
      prisma.parrot.findMany({ where, take, skip, orderBy: { createdAt: 'desc' } }),
      prisma.parrot.count({ where })
    ]);

    res.json({ parrots, total });
  } catch (error) {
    console.error('GET /api/parrots error:', error);
    res.status(500).json({ error: error.message || 'Erreur serveur', parrots: [], total: 0 });
  }
});

app.get('/api/parrots/species', async (req, res) => {
  try {
    const species = await prisma.parrot.groupBy({
      by: ['species'],
      where: { isActive: true, status: { not: 'sold' } },
      _count: { species: true }
    });
    res.json({ species: species.map(s => ({ species: s.species, count: s._count.species })) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', species: [] });
  }
});

app.get('/api/parrots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parrotId = Number(id);
    if (isNaN(parrotId) || parrotId <= 0) {
      return res.status(400).json({ error: 'ID invalide' });
    }
    const parrot = await prisma.parrot.findUnique({ where: { id: parrotId } });
    if (!parrot) return res.status(404).json({ error: 'Perroquet non trouvé' });
    res.json({ parrot });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Erreur serveur' });
  }
});

// ─── Admin: Parrots CRUD ──────────────────────────────────────────────────
app.get('/api/admin/parrots', authenticateAdmin, async (req, res) => {
  try {
    const parrots = await prisma.parrot.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ parrots, total: parrots.length });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', parrots: [], total: 0 });
  }
});

app.get('/api/admin/parrots/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const parrotId = Number(id);
    if (isNaN(parrotId) || parrotId <= 0) return res.status(400).json({ error: 'ID invalide' });
    const parrot = await prisma.parrot.findUnique({ where: { id: parrotId } });
    if (!parrot) return res.status(404).json({ error: 'Perroquet non trouvé' });
    res.json({ parrot });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/admin/parrots', authenticateAdmin, upload.any(), async (req, res) => {
  req.files = (req.files || []).filter(f => f.fieldname === 'images');
  try {
    if (!req.body.name) {
      return res.status(400).json({ error: 'Champ obligatoire: name' });
    }

    const parrotData = {
      name: req.body.name,
      description: req.body.description || null,
      ringNumber: req.body.ringNumber || null,
      color: req.body.color || null,
    };

    if (req.files && req.files.length > 0) {
      Object.assign(parrotData, await uploadFiles(req.files, 'parrots'));
    }

    const parrot = await prisma.parrot.create({ data: parrotData });
    res.status(201).json({ parrot });
  } catch (error) {
    console.error('Create parrot error:', error);
    res.status(500).json({ error: "Erreur lors de la création du perroquet" });
  }
});

app.put('/api/admin/parrots/:id', authenticateAdmin, upload.any(), async (req, res) => {
  req.files = (req.files || []).filter(f => f.fieldname === 'images');
  try {
    const { id } = req.params;
    const parrotId = Number(id);
    if (isNaN(parrotId) || parrotId <= 0) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const parrotData = {
      name: req.body.name,
      description: req.body.description || null,
      ringNumber: req.body.ringNumber || null,
      color: req.body.color || null,
    };

    if (req.files && req.files.length > 0) {
      Object.assign(parrotData, await uploadFiles(req.files, 'parrots'));
    }

    if (req.body.existingImages) {
      const existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
      existingImages.forEach((url, idx) => {
        const fieldName = idx === 0 ? 'imageUrl' : `imageUrl${idx + 1}`;
        if (!parrotData[fieldName]) parrotData[fieldName] = url;
      });
    }

    const parrot = await prisma.parrot.update({ where: { id: parrotId }, data: parrotData });
    res.json({ parrot });
  } catch (error) {
    console.error('Update parrot error:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

app.patch('/api/admin/parrots/:id/toggle', authenticateAdmin, async (req, res) => {
  try {
    const parrotId = parseInt(req.params.id);
    if (isNaN(parrotId)) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.parrot.findUnique({ where: { id: parrotId } });
    if (!existing) return res.status(404).json({ error: 'Perroquet non trouvé' });
    const parrot = await prisma.parrot.update({
      where: { id: parrotId },
      data: { isActive: !existing.isActive },
    });
    res.json({ parrot });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/admin/parrots/:id', authenticateAdmin, async (req, res) => {
  try {
    const parrotId = parseInt(req.params.id);
    if (isNaN(parrotId) || parrotId <= 0) return res.status(400).json({ error: 'ID invalide' });
    const existing = await prisma.parrot.findUnique({ where: { id: parrotId } });
    if (!existing) return res.status(404).json({ error: 'Perroquet non trouvé' });
    await prisma.$transaction([
      prisma.reservationTracking.deleteMany({ where: { reservation: { parrotId } } }),
      prisma.reservation.deleteMany({ where: { parrotId } }),
      prisma.parrot.delete({ where: { id: parrotId } }),
    ]);
    res.json({ success: true, message: 'Perroquet supprimé' });
  } catch (e) {
    console.error('Delete parrot error:', e);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ─── Waitlist ───────────────────────────────────────────────────────────────
app.post('/api/waitlist', async (req, res) => {
  try {
    const { species, name, email, phone } = req.body;
    if (!species || !name || !email) {
      return res.status(400).json({ error: 'Espèce, nom et email requis' });
    }
    const entry = await prisma.waitlistEntry.create({
      data: { species, name, email, phone: phone || null }
    });
    res.status(201).json({ success: true, entry });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Reservations ─────────────────────────────────────────────────────────
app.post('/api/reservations', async (req, res) => {
  try {
    const { parrotId, guestName, guestEmail, guestPhone, guestProfession, guestHomeAddress, deliveryMethod, deliveryAddress, notes, paymentMethod, hasPet, hasLostPet } = req.body;
    if (!parrotId || !guestName || !guestEmail || !guestPhone) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const parrot = await prisma.parrot.findUnique({ where: { id: parseInt(parrotId) } });
    if (!parrot || !parrot.isActive || parrot.status === 'sold') {
      return res.status(404).json({ error: 'Perroquet non trouvé' });
    }

    // Payment logic
    const isFullPayment = paymentMethod === 'full';
    const discountPercent = isFullPayment ? 15 : 0;
    const discountAmount = isFullPayment ? Math.round(parrot.price * 0.15) : 0;
    const totalPrice = parrot.price - discountAmount;
    const depositAmount = isFullPayment ? totalPrice : Math.round(parrot.price * 0.5);
    const balanceAmount = isFullPayment ? 0 : parrot.price - depositAmount;
    const paymentLabel = isFullPayment
      ? `Paiement intégral (-${discountPercent}%)`
      : `Acompte 50% (solde à la livraison)`;

    let reservationNumber;
    let exists = true;
    while (exists) {
      reservationNumber = generateReservationNumber();
      exists = !!(await prisma.reservation.findUnique({ where: { reservationNumber } }));
    }

    // Upsert guest
    let guest = await prisma.guest.findFirst({ where: { email: guestEmail } });
    if (!guest) {
      guest = await prisma.guest.create({
        data: { name: guestName, email: guestEmail, phone: guestPhone, address: deliveryAddress || null, hasPet: hasPet === 'true' || hasPet === true || null, hasLostPet: hasLostPet === 'true' || hasLostPet === true || null }
      });
    }

    const reservation = await prisma.$transaction(async (tx) => {
      const newReservation = await tx.reservation.create({
        data: {
          reservationNumber,
          parrotId: parrot.id,
          guestId: guest.id,
          guestName, guestEmail, guestPhone,
          guestProfession: guestProfession || null,
          guestHomeAddress: guestHomeAddress || null,
          paymentMethod: isFullPayment ? 'full' : 'deposit',
          paymentLabel,
          hasPet: hasPet === 'true' || hasPet === true || null,
          hasLostPet: hasLostPet === 'true' || hasLostPet === true || null,
          discountPercent, discountAmount, totalPrice,
          depositAmount, balanceAmount,
          deliveryMethod: deliveryMethod || 'pickup',
          deliveryAddress: deliveryAddress || null,
          notes: notes || null,
          status: 'pending',
        },
      });

      await tx.reservationTracking.create({
        data: {
          reservationId: newReservation.id,
          status: 'pending',
          comment: 'Demande de réservation reçue',
        },
      });

      return newReservation;
    });

    // Send confirmation emails (sequential, shares 1 pooled connection)
    try {
      await sendReservationConfirmation({ email: guestEmail, name: guestName, reservation, parrot });
      console.log('Confirmation email sent to', guestEmail);
    } catch (err) {
      console.error('Confirmation email error:', err.message);
    }
    try {
      await sendAdminNotification({ reservation, parrot });
      console.log('Admin notification sent');
    } catch (err) {
      console.error('Admin notification error:', err.message);
    }

    res.status(201).json({ success: true, reservationNumber: reservation.reservationNumber, reservation });
  } catch (e) {
    console.error('Create reservation error:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/reservations/track/:reservationNumber', async (req, res) => {
  try {
    const { reservationNumber } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { reservationNumber },
      include: {
        parrot: true,
        tracking: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });
    res.json({ reservation });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Admin: Reservations ───────────────────────────────────────────────────
app.get('/api/admin/reservations', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          parrot: { select: { name: true, species: true, imageUrl: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page)-1)*parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.reservation.count({ where }),
    ]);
    const statusCounts = await prisma.reservation.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    res.json({ reservations, total, statusCounts });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/admin/reservations/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const reservationId = parseInt(id);
    const isNumeric = !isNaN(reservationId) && reservationId > 0;
    const where = isNumeric ? { id: reservationId } : { reservationNumber: id };

    const reservation = await prisma.reservation.findFirst({
      where,
      include: {
        parrot: true,
        tracking: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });
    res.json({ reservation });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/admin/reservations/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment } = req.body;
    const validStatuses = ['pending', 'deposit_confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    await prisma.reservationTracking.create({
      data: { reservationId: reservation.id, status, comment: comment || null },
    });

    // If delivered, set parrot to sold
    if (status === 'delivered') {
      await prisma.parrot.update({
        where: { id: reservation.parrotId },
        data: { status: 'sold' },
      });
    }

    // Notify customer of status change
    const parrot = await prisma.parrot.findUnique({ where: { id: reservation.parrotId }, select: { name: true, species: true } });
    try {
      await sendStatusNotification({
        email: reservation.guestEmail,
        name: reservation.guestName,
        reservationNumber: reservation.reservationNumber,
        status,
        parrot: parrot || null,
      });
    } catch (err) {
      console.error('Status notification failed:', err.message);
    }

    res.json({ success: true, reservation });
  } catch (e) {
    console.error('Update reservation error:', e);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Admin: Reply to customer ─────────────────────────────────────────────
app.post('/api/admin/reservations/:id/reply', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const reservationId = parseInt(id);
    if (isNaN(reservationId)) return res.status(400).json({ error: 'ID invalide' });

    const { message, subject } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { parrot: { select: { name: true } } },
    });
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });

    await sendReplyToCustomer({
      email: reservation.guestEmail,
      name: reservation.guestName,
      subject: subject || `Le Parc des Perroquets — Suivi réservation ${reservation.reservationNumber}`,
      message: message.trim(),
    });

    await prisma.reservationTracking.create({
      data: {
        reservationId,
        status: reservation.status,
        comment: `📧 Message envoyé au client : ${message.trim().substring(0, 100)}${message.length > 100 ? '...' : ''}`,
      },
    });

    res.json({ success: true, message: 'Message envoyé au client' });
  } catch (e) {
    console.error('Reply error:', e);
    res.status(500).json({ error: "Erreur lors de l'envoi du message" });
  }
});

// ─── Admin: Hard delete reservation ────────────────────────────────────────
app.delete('/api/admin/reservations/:id', authenticateAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID invalide' });

    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) return res.status(404).json({ error: 'Réservation non trouvée' });

    await prisma.$transaction(async (tx) => {
      await tx.reservationTracking.deleteMany({ where: { reservationId: id } });
      await tx.reservation.delete({ where: { id } });
    });

    await prisma.adminLog.create({
      data: { action: 'DELETE_RESERVATION', detail: `Réservation #${reservation.reservationNumber} supprimée` },
    });

    res.json({ success: true, message: 'Réservation supprimée définitivement' });
  } catch (e) {
    console.error('Hard delete reservation error:', e);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// ─── Admin: Stats ──────────────────────────────────────────────────────────
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalParrots = await prisma.parrot.count();
    const availableParrots = await prisma.parrot.count({ where: { status: 'available' } });
    const totalReservations = await prisma.reservation.count();
    const pendingReservations = await prisma.reservation.count({ where: { status: 'pending' } });
    const totalRevenue = await prisma.reservation.aggregate({ _sum: { depositAmount: true } });

    const recentReservations = await prisma.reservation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        parrot: { select: { name: true, species: true } },
      },
    });

    res.json({
      totalParrots, availableParrots, totalReservations,
      pendingReservations,
      totalRevenue: totalRevenue._sum.depositAmount || 0,
      recentReservations,
    });
  } catch (e) {
    res.status(500).json({
      totalParrots: 0, availableParrots: 0, totalReservations: 0,
      pendingReservations: 0, totalRevenue: 0, recentReservations: [],
      error: 'Erreur récupération statistiques'
    });
  }
});

// ─── Admin: Clients ────────────────────────────────────────────────────────
app.get('/api/admin/clients', authenticateAdmin, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [clients, total] = await Promise.all([
      prisma.guest.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
      prisma.guest.count({ where }),
    ]);
    res.json({ clients, total, page: parseInt(page), limit: take });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── Waitlist (admin) ──────────────────────────────────────────────────────
app.get('/api/admin/waitlist', authenticateAdmin, async (req, res) => {
  try {
    const entries = await prisma.waitlistEntry.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ entries });
  } catch (e) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

module.exports = app;