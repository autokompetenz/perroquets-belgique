# Le Parc des Perroquets

Site de réservation en ligne pour l'élevage Le Parc des Perroquets (Jérôme Vuillamy, Bren, Drôme).

- React 18 + Vite + Zustand
- Express + Prisma + PostgreSQL (Supabase)
- Multilingue FR / NL / EN

## Setup

```bash
npm install
cp .env.example .env   # remplir les vraies valeurs
npx prisma migrate dev
npm run seed
npm run dev
```

## Déploiement Vercel

1. Créer un repo GitHub et pusher
2. Importer sur Vercel depuis GitHub
3. Ajouter les variables d'environnement (DATABASE_URL, SUPABASE_URL, etc.)
4. Déployer

Site : leparcdesperroquets.fr
