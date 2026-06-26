export const formatEuro = (amount) => {
  if (!amount && amount !== 0) return '—';
  return '€' + new Intl.NumberFormat('en-US').format(Math.round(amount));
};

export const SPECIES = [
  'Perruche ondulée', 'Inséparable', 'Perruche Catherine', 'Forpus',
  'Perruche moine', 'Perruche de Bourke', 'Gris du Gabon',
  'Conure soleil', 'Amazone', 'Perruche à collier',
  'Youyou du Sénégal', 'Caique', 'Ara', 'Cacatoès',
];

export function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getAgeString(birthDate, lang = 'fr') {
  const now = new Date();
  const birth = new Date(birthDate);
  const months = Math.floor((now - birth) / (30 * 24 * 60 * 60 * 1000));
  if (months < 1) {
    const weeks = Math.floor((now - birth) / (7 * 24 * 60 * 60 * 1000));
    return `${weeks} ${lang === 'fr' ? 'semaines' : lang === 'nl' ? 'weken' : 'weeks'}`;
  }
  return `${months} ${lang === 'fr' ? 'mois' : lang === 'nl' ? 'maanden' : 'months'}`;
}

export const STATUS_LABELS = {
  pending: 'Demande reçue',
  deposit_confirmed: 'Acompte confirmé',
  preparing: 'En préparation',
  ready: 'Prêt(e) à partir',
  delivered: 'Remis(e) à la famille',
  cancelled: 'Annulée',
};

export const PARROT_STATUS_LABELS = {
  available: 'Disponible',
  reserved: 'Réservé',
  sold: 'Vendu',
};

export function getInitials(name) {
  return name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}
