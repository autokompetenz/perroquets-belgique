const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function d(day, month, year = 2026) {
  return new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
}

const SPECIES_SHORT = {
  'Perruche ondulée': 'OND',
  'Inséparable': 'INS',
  'Perruche Catherine': 'CAT',
  'Forpus': 'FOR',
  'Perruche moine': 'MOI',
  'Perruche de Bourke': 'BOU',
  'Gris du Gabon': 'GAB',
  'Conure soleil': 'CON',
  'Amazone': 'AMA',
  'Perruche à collier': 'COL',
  'Youyou du Sénégal': 'YOU',
  'Caique': 'CAI',
  'Ara': 'ARA',
  'Cacatoès': 'CAC',
};

const PREFIX = 'PRQ';

function generateRingNumber(species, index, year = 2026) {
  const code = SPECIES_SHORT[species] || 'PRQ';
  return `${code}-${year}-${String(index).padStart(4, '0')}`;
}

const soloParrots = [
  // ── Perruche ondulée ──
  { name:'Kiwi',   species:'Perruche ondulée', sex:'Male',   birthDate:d(10,5), color:'Vert clair',      price:45,  handFed:true,  talkingAbility:'Imite quelques sons', desc:'Petit perroquet vif et curieux, déjà bien sevré et bagué.', parentMotherName:'Pistache', parentFatherName:'Titi', location:'Bren' },
  { name:'Pistache',species:'Perruche ondulée', sex:'Female', birthDate:d(12,5), color:'Bleu cobalt',      price:55,  handFed:true,  talkingAbility:'Quelques mots', desc:'Belle femelle bleu cobalt, très sociable.', parentMotherName:'Saphir', parentFatherName:'Titi', location:'Bren' },
  { name:'Skippy', species:'Perruche ondulée', sex:'Male',   birthDate:d(8,4),  color:'Vert panaché',     price:40,  handFed:false, talkingAbility:null, desc:'Jeune mâle vif, aime explorer son environnement.', parentMotherName:'Pistache', parentFatherName:'Perle', location:'Bren' },

  // ── Inséparable ──
  { name:'Romeo',  species:'Inséparable', sex:'Male',   birthDate:d(15,4), color:'Vert pomme',       price:80,  handFed:true,  talkingAbility:null, desc:'Mâle inséparable très affectueux, recherche sa moitié.', parentMotherName:'Olive', parentFatherName:'Mango', location:'Bren' },
  { name:'Juliette',species:'Inséparable', sex:'Female', birthDate:d(15,4), color:'Jaune pastel',      price:80,  handFed:true,  talkingAbility:null, desc:'Femelle douce et câline, idéale pour un couple.', parentMotherName:'Olive', parentFatherName:'Mango', location:'Bren' },
  { name:'Peach',  species:'Inséparable', sex:'Female', birthDate:d(20,3), color:'Pêche',             price:75,  handFed:true,  talkingAbility:null, desc:'Élevée à la main, très proche de l\'humain.', parentMotherName:'Pêche', parentFatherName:'Mango', location:'Bren' },

  // ── Forpus ──
  { name:'Blu',    species:'Forpus', sex:'Male',   birthDate:d(1,6),  color:'Bleu ciel',         price:120, handFed:true,  talkingAbility:'Quelques sons', desc:'Petit perroquet vif et espiègle, tout mignon.', parentMotherName:'Coco', parentFatherName:'Turquoise', location:'Bren' },
  { name:'Coco',   species:'Forpus', sex:'Female', birthDate:d(28,5), color:'Vert émeraude',      price:110, handFed:true,  talkingAbility:null, desc:'Femelle calme et curieuse.', parentMotherName:'Perle', parentFatherName:'Turquoise', location:'Bren' },

  // ── Perruche Catherine ──
  { name:'Rosie',  species:'Perruche Catherine', sex:'Female', birthDate:d(5,5),  color:'Rouge et bleu',    price:180, handFed:true,  talkingAbility:null, desc:'Superbe femelle aux couleurs vives.', parentMotherName:'Scarlett', parentFatherName:'Rougeaud', location:'Bren' },
  { name:'Ruby',   species:'Perruche Catherine', sex:'Male',   birthDate:d(5,5),  color:'Rouge et jaune',   price:180, handFed:true,  talkingAbility:null, desc:'Mâle robuste, très actif dans sa volière.', parentMotherName:'Scarlett', parentFatherName:'Rougeaud', location:'Bren' },

  // ── Perruche moine ──
  { name:'Momo',   species:'Perruche moine', sex:'Male',   birthDate:d(10,3), color:'Vert',              price:200, handFed:true,  talkingAbility:'Quelques mots', desc:'Perruche moine bavarde et très joueuse.', parentMotherName:'Verte', parentFatherName:'Grisou', location:'Bren' },
  { name:'Grisou', species:'Perruche moine', sex:'Male',   birthDate:d(22,4), color:'Gris',              price:190, handFed:true,  talkingAbility:'Imite bien', desc:'Mâle gris, déjà très à l\'aise à la main.', parentMotherName:'Verte', parentFatherName:'Grisou', location:'Bren' },

  // ── Perruche de Bourke ──
  { name:'Bourke', species:'Perruche de Bourke', sex:'Male',   birthDate:d(18,5), color:'Rose et gris',     price:220, handFed:true,  talkingAbility:null, desc:'Mâle paisible, couleur rose magnifique.', parentMotherName:'Rose', parentFatherName:'Gris', location:'Bren' },
  { name:'Nova',   species:'Perruche de Bourke', sex:'Female', birthDate:d(18,5), color:'Rose clair',       price:220, handFed:true,  talkingAbility:null, desc:'Femelle douce, parfaite pour débuter.', parentMotherName:'Rose', parentFatherName:'Gris', location:'Bren' },

  // ── Perruche à collier ──
  { name:'Collier',species:'Perruche à collier', sex:'Male',   birthDate:d(2,4),  color:'Vert et collier noir', price:250, handFed:true,  talkingAbility:'Parle bien', desc:'Mâle reproducteur avec beau collier noir.', parentMotherName:'Lime', parentFatherName:'Collier', location:'Bren' },
  { name:'Lime',  species:'Perruche à collier', sex:'Female', birthDate:d(2,4),  color:'Vert',             price:250, handFed:true,  talkingAbility:'Quelques mots', desc:'Femelle verte, déjà baguée et prête.', parentMotherName:'Lime', parentFatherName:'Collier', location:'Bren' },

  // ── Conure soleil ──
  { name:'Soleil', species:'Conure soleil', sex:'Male',   birthDate:d(20,2), color:'Jaune et orange',    price:500, handFed:true,  talkingAbility:null, desc:'Conure soleil aux couleurs flamboyantes.', parentMotherName:'Sunny', parentFatherName:'Ray', location:'Bren' },
  { name:'Sunny',  species:'Conure soleil', sex:'Female', birthDate:d(20,2), color:'Jaune vif',          price:500, handFed:true,  talkingAbility:'Quelques cris', desc:'Femelle très sociable, aime les interactions.', parentMotherName:'Sunny', parentFatherName:'Ray', location:'Bren' },

  // ── Youyou du Sénégal ──
  { name:'Yoyo',   species:'Youyou du Sénégal', sex:'Male',   birthDate:d(15,1), color:'Vert et ventre jaune', price:650, handFed:true,  talkingAbility:'Imite bien, quelques mots', desc:'Youyou mâle très intelligent et affectueux.', parentMotherName:'Sénégala', parentFatherName:'King', location:'Bren' },
  { name:'Suki',   species:'Youyou du Sénégal', sex:'Female', birthDate:d(18,1), color:'Vert et ventre jaune', price:650, handFed:true,  talkingAbility:'Quelques sons', desc:'Femelle calme, parfaite pour une adoption.', parentMotherName:'Sénégala', parentFatherName:'King', location:'Bren' },

  // ── Caique ──
  { name:'Pixie',  species:'Caique', sex:'Female', birthDate:d(10,12,2025), color:'Jaune et vert',        price:950, handFed:true,  talkingAbility:'Quelques sons', desc:'Caique femelle très joueuse, adore les câlins.', parentMotherName:'Bella', parentFatherName:'Capi', location:'Bren' },
  { name:'Capi',   species:'Caique', sex:'Male',   birthDate:d(8,12,2025),  color:'Vert et blanc',        price:950, handFed:true,  talkingAbility:null, desc:'Caique mâle espiègle, toujours en mouvement.', parentMotherName:'Bella', parentFatherName:'Capi', location:'Bren' },

  // ── Gris du Gabon ──
  { name:'Timneh', species:'Gris du Gabon', sex:'Male',   birthDate:d(5,11,2025), color:'Gris ardoise',        price:1500, handFed:true,  talkingAbility:'Parle très bien, grande capacité', desc:'Gris du Gabon mâle, déjà sevré et très intelligent.', parentMotherName:'Grisha', parentFatherName:'Grisou', location:'Bren' },
  { name:'Shady',  species:'Gris du Gabon', sex:'Female', birthDate:d(5,11,2025), color:'Gris queue rouge',    price:1600, handFed:true,  talkingAbility:'Parle bien', desc:'Femelle gris queue rouge, magnifique plumage.', parentMotherName:'Grisha', parentFatherName:'Grisou', location:'Bren' },

  // ── Amazone ──
  { name:'Azu',    species:'Amazone', sex:'Male',   birthDate:d(12,10,2025), color:'Vert',                 price:1800, handFed:true,  talkingAbility:'Imite bien, grande capacité', desc:'Amazone mâle, très bavard et affectueux.', parentMotherName:'Verda', parentFatherName:'Jade', location:'Bren' },
  { name:'Jade',   species:'Amazone', sex:'Female', birthDate:d(12,10,2025), color:'Vert et bleu',         price:1900, handFed:true,  talkingAbility:'Parle plusieurs mots', desc:'Femelle amazone, plumage magnifique.', parentMotherName:'Verda', parentFatherName:'Jade', location:'Bren' },

  // ── Ara ──
  { name:'Blu',    species:'Ara', sex:'Male',   birthDate:d(1,9,2025),  color:'Bleu et jaune',       price:2800, handFed:true,  talkingAbility:'Parle bien, imite', desc:'Ara bleu et jaune mâle, impressionnant.', parentMotherName:'Azur', parentFatherName:'Marine', location:'Bren' },
  { name:'Scarlett',species:'Ara', sex:'Female', birthDate:d(1,9,2025),  color:'Bleu et jaune',       price:3000, handFed:true,  talkingAbility:'Quelques mots', desc:'Ara femelle, très attachante.', parentMotherName:'Azur', parentFatherName:'Marine', location:'Bren' },

  // ── Cacatoès ──
  { name:'Blanche',species:'Cacatoès', sex:'Female', birthDate:d(20,8,2025), color:'Blanc pur',            price:3200, handFed:true,  talkingAbility:'Parle plusieurs mots', desc:'Cacatoès blanc femelle, très affectueuse.', parentMotherName:'Blanche', parentFatherName:'Blanc', location:'Bren' },
  { name:'Neige', species:'Cacatoès', sex:'Male',   birthDate:d(20,8,2025), color:'Blanc',               price:3500, handFed:true,  talkingAbility:'Imite beaucoup de sons', desc:'Cacatoès mâle, magnifique spécimen.', parentMotherName:'Blanche', parentFatherName:'Blanc', location:'Bren' },
];

const coupleSales = [
  {
    name: 'Roméo & Juliette',
    species: 'Inséparable',
    saleType: 'couple',
    sex: 'Male',
    birthDate: d(1,4),
    color: 'Vert pomme / Jaune pastel',
    price: 150,
    handFed: true,
    talkingAbility: null,
    desc: 'Superbe couple d\'inséparables déjà formé et très attaché l\'un à l\'autre.',
    parentMotherName: 'Olive',
    parentFatherName: 'Mango',
    partnerName: 'Juliette',
    partnerSex: 'Female',
    partnerBirthDate: d(1,4),
    partnerColor: 'Jaune pastel',
    location: 'Bren',
    ringNumber: 'INS-2026-0100',
  },
  {
    name: 'Soleil & Luna',
    species: 'Conure soleil',
    saleType: 'couple',
    sex: 'Male',
    birthDate: d(10,2),
    color: 'Jaune et orange',
    price: 950,
    handFed: true,
    talkingAbility: null,
    desc: 'Couple de conures soleil déjà apparié, ils sont inséparables.',
    parentMotherName: 'Sunny',
    parentFatherName: 'Ray',
    partnerName: 'Luna',
    partnerSex: 'Female',
    partnerBirthDate: d(10,2),
    partnerColor: 'Jaune et orange clair',
    location: 'Bren',
    ringNumber: 'CON-2026-0200',
  },
  {
    name: 'Yin & Yang',
    species: 'Forpus',
    saleType: 'couple',
    sex: 'Male',
    birthDate: d(20,4),
    color: 'Bleu ciel',
    price: 220,
    handFed: true,
    talkingAbility: null,
    desc: 'Couple de forpus déjà formé, mâle bleu et femelle verte.',
    parentMotherName: 'Coco',
    parentFatherName: 'Turquoise',
    partnerName: 'Lotus',
    partnerSex: 'Female',
    partnerBirthDate: d(20,4),
    partnerColor: 'Vert émeraude',
    location: 'Bren',
    ringNumber: 'FOR-2026-0300',
  },
];

async function main() {
  console.log('🌱 Seeding Le Parc des Perroquets...');

  // Supprime anciennes données
  await prisma.reservationTracking.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.adminLog.deleteMany();
  await prisma.parrot.deleteMany();
  await prisma.guest.deleteMany();

  let ringIndex = 1;

  for (const p of soloParrots) {
    const ringNumber = generateRingNumber(p.species, ringIndex);
    ringIndex++;
    await prisma.parrot.create({
      data: {
        name: p.name,
        species: p.species,
        sex: p.sex,
        birthDate: p.birthDate,
        color: p.color,
        price: p.price,
        saleType: 'solo',
        handFed: p.handFed,
        talkingAbility: p.talkingAbility,
        description: p.desc,
        ringNumber,
        parentMotherName: p.parentMotherName,
        parentFatherName: p.parentFatherName,
        status: 'available',
        location: p.location || 'Bren',
        isActive: true,
      },
    });
    console.log(`  ✅ ${p.name} (${p.species})`);
  }

  for (const c of coupleSales) {
    const ringNumber = c.ringNumber || generateRingNumber(c.species, ringIndex);
    ringIndex++;
    await prisma.parrot.create({
      data: {
        name: c.name,
        species: c.species,
        sex: c.sex,
        birthDate: c.birthDate,
        color: c.color,
        price: c.price,
        saleType: 'couple',
        handFed: c.handFed,
        talkingAbility: c.talkingAbility,
        description: c.desc,
        ringNumber,
        parentMotherName: c.parentMotherName,
        parentFatherName: c.parentFatherName,
        partnerName: c.partnerName,
        partnerSex: c.partnerSex,
        partnerBirthDate: c.partnerBirthDate,
        partnerColor: c.partnerColor,
        status: 'available',
        location: c.location,
        isActive: true,
      },
    });
    console.log(`  ✅ ${c.name} (${c.species}) — COUPLE`);
  }

  const total = soloParrots.length + coupleSales.length;
  console.log(`\n🎉 ${total} perroquets créés (${soloParrots.length} solo, ${coupleSales.length} couple)`);
  console.log('🌱 Seeding terminé !');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
