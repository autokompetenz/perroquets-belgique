# PROMPT COMPLET — Site de vente de chiots (Belgique)
### Réutilisation du design system "Auto Kompetenz GmbH"

---

## 0. Contexte / objectif

Crée un site web complet de vente/réservation de chiots pour une entreprise basée en **Belgique**. Le site doit reprendre **exactement le même design system** que le projet de référence "Auto Kompetenz" (concession automobile) : mêmes couleurs, mêmes polices, mêmes composants UI (boutons, cards, badges, navbar, chatbot, sidebar admin), mais avec un contenu et des fonctionnalités adaptées à la vente de chiots.

Stack technique à reprendre à l'identique :
- **Frontend** : React 18 + Vite + React Router + Tailwind CSS
- **State management** : Zustand (store global : auth, langue, panier/réservations, thème)
- **Backend** : Node.js + Express (API REST), Prisma ORM
- **Base de données** : PostgreSQL (Supabase ou Neon)
- **Déploiement** : Vercel (frontend + API serverless)
- **Emailing** : module mailer dédié pour confirmations (réservation, paiement, livraison)
- **Multilingue** : FR / EN / NL (le NL est important car la Belgique a 3 régions linguistiques — remplacer l'italien/anglais du projet d'origine par **FR / NL / EN**, avec gestion RTL désactivée)

---

## 1. Design system à répliquer (structure identique, couleur changée)

### 1.1 Palette de couleurs (CSS variables, thème clair + sombre)

> ⚠️ Changement demandé : on garde **toute la structure** du design (mêmes variables, mêmes composants `.btn-primary`, `.badge`, `.card`, etc.) mais on **remplace le rouge** par une autre couleur de marque, plus adaptée à un univers "chiots/élevage" et moins associée à l'automobile/luxe agressif.
>
> **Couleur recommandée : Terracotta doré `#C9762E`** (chaleureux, rappelle la robe d'un chiot, reste premium et se démarque du rouge/du bleu déjà très utilisés par les sites animaliers).
> Alternative possible si le client préfère une teinte plus apaisante : **Vert sauge `#4F7A5B`** (rassurant, "nature/bien-être animal").
>
> Pour limiter les changements de code, on garde les **mêmes noms de variables CSS** (`--red`, `--red-dark`, etc.) en interne, mais on recommande de les renommer en `--primary / --primary-dark / --primary-light / --primary-bg / --primary-border` dans le code final pour éviter toute confusion (un simple rechercher/remplacer global, sans impact visuel).

```css
:root {
  --red:         #C9762E;  /* terracotta doré — couleur principale de la marque (remplace le rouge) */
  --red-dark:    #A85F22;
  --red-light:   #E0954C;
  --red-bg:      rgba(201,118,46,0.08);
  --red-border:  rgba(201,118,46,0.22);

  --bg:          #F5F5F7;
  --bg-card:     #FFFFFF;
  --bg-card2:    #F0F0F2;
  --bg-input:    #FFFFFF;
  --bg-nav:      rgba(255,255,255,0.95);
  --bg-dropdown: #FFFFFF;

  --text:        #111113;
  --text-2:      #444448;
  --text-3:      #8A8A90;
  --text-inv:    #FFFFFF;

  --border:      rgba(0,0,0,0.08);
  --border-2:    rgba(0,0,0,0.12);

  --shadow-sm:   0 2px 8px rgba(0,0,0,0.06);
  --shadow-md:   0 8px 28px rgba(0,0,0,0.10);
  --shadow-xl:   0 24px 64px rgba(0,0,0,0.14);

  --gold:        #C9A84C;
  --green:       #16A34A;
  --radius:      8px;
  --ease:        cubic-bezier(0.16,1,0.3,1);
}

[data-theme="dark"] {
  --bg: #0A0A0B; --bg-card: #18181A; --bg-card2: #111113;
  --bg-input: rgba(255,255,255,0.04); --bg-nav: rgba(10,10,11,0.96); --bg-dropdown: #18181A;
  --text: #F0F0F2; --text-2: rgba(240,240,242,0.65); --text-3: rgba(240,240,242,0.35); --text-inv: #0A0A0B;
  --border: rgba(255,255,255,0.07); --border-2: rgba(255,255,255,0.12);
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.3); --shadow-md: 0 8px 28px rgba(0,0,0,0.5); --shadow-xl: 0 24px 64px rgba(0,0,0,0.7);
  --green: #22C55E;
}
```

> Tout le reste de la palette (fonds, textes, bordures, ombres) reste strictement identique au projet de référence — seule la couleur d'accent change.

### 1.2 Typographies
- Titres : **Outfit** (300 à 900), `font-weight: 800-900`, `letter-spacing: -0.02em`
- Accents éditoriaux (citations, eyebrow élégant) : **Playfair Display** (italique 700-900)
- Import Google Fonts identique au projet d'origine.

### 1.3 Composants UI à reprendre tels quels
- `.btn-primary` (rouge plein, ombre colorée, hover translateY -2px)
- `.btn-ghost` (bordure fine, hover bordure rouge)
- `.btn-gold` / `.btn-outline` (variantes secondaires)
- `.card` (radius 12px, hover border rouge + élévation)
- `.input-luxury` (focus ring rouge translucide)
- `.section-eyebrow` (petit label majuscule avec trait rouge avant le texte)
- `.badge-pending / confirmed / processing / shipped / delivered / cancelled` → à remapper sur le cycle de vie d'une **réservation de chiot** (voir section 4)
- `.timeline-item` / `.timeline-dot` → pour le suivi de réservation
- `.chat-btn` / `.chat-window` (chatbot flottant bas-droite, animation float)
- `.cookie-banner`, `.theme-toggle`, `.toast-container`, `.shimmer` (loading skeleton)
- Sidebar admin (`.admin-sidebar`, `.admin-nav-link`, `.admin-stats-grid`) — layout fixe 268px, responsive en drawer mobile

---

## 2. Identité de marque à définir

Le prompt doit production-ready générer aussi le contenu textuel. Demander/définir :
- **Nom de l'entreprise** (ex: "Royal Puppy Belgium", "Élevage [Nom]") — à adapter
- **Localisation** : ville en Belgique (ex: Bruxelles, Anvers, Liège, Namur) + mention claire **N° d'agrément/enregistrement d'élevage** (obligatoire en Belgique — voir section 6 conformité)
- **Races proposées** (ex: Golden Retriever, Bouledogue Français, Cavalier King Charles, Berger Australien, Yorkshire, Caniche, Maltipoo, etc.)
- **Ton de marque** : rassurant, transparent, premium mais chaleureux (pas "concession" froide — adapter les textes du template auto vers un univers familial/affectif)

---

## 3. Structure des pages (mapping depuis le site auto)

| Page Auto Kompetenz | Équivalent site chiots | Contenu |
|---|---|---|
| `Home.jsx` | **Accueil** | Hero (photo chiot + accroche), chiots vedettes du moment, races disponibles, processus de réservation en 4 étapes, garanties santé, témoignages clients, formulaire de contact |
| `Catalog.jsx` | **Nos chiots disponibles** | Grille de fiches chiots avec filtres (race, sexe, âge, prix, disponibilité, région de retrait) |
| `CarDetails.jsx` | **Fiche chiot** | Galerie photos/vidéo, race, date de naissance, sexe, couleur, poids actuel/estimé adulte, statut vaccination/puce/vermifuge, pedigree LOSH/parents, prix, bouton "Réserver" |
| `Simulation.jsx` | **Simulateur de budget** | Calcul du coût total (prix chiot + vaccins + assurance santé animale + accessoires + frais vétérinaires première année) — remplace la simulation de financement auto |
| `Cart.jsx` | **Ma réservation** | Récapitulatif chiot(s) réservé(s), acompte à verser (généralement 20-30%), choix mode de retrait (sur place / livraison sécurisée en Belgique) |
| `Track.jsx` | **Suivi de réservation** | Timeline : Acompte reçu → Préparation (vaccins/puce) → Disponible pour visite → Solde payé → Remise du chiot |
| `OrderConfirm.jsx` / `Orders.jsx` | **Confirmation / Historique** | Récapitulatif, contrat de cession, certificat de bonne santé vétérinaire en PJ |
| `Warranty.jsx` | **Garantie santé** | Garantie contractuelle (ex: garantie vices rédhibitoires 6 mois conforme à la législation belge), conditions de retour |
| `Insurance.jsx` | **Assurance chiot** | Offres d'assurance santé animale partenaires (frais vétérinaires, RC) |
| `CampingCar.jsx` | **Notre élevage** | Présentation de l'élevage : méthode d'élevage, socialisation, visite des installations, photos des parents/reproducteurs |
| `Reviews.jsx` | **Avis clients** | Témoignages avec photos des chiots adoptés chez leurs nouveaux propriétaires |
| `Legal.jsx` | **Mentions légales / Confidentialité / CGV / Cookies** | Voir conformité légale belge (section 6) |
| `Login.jsx` / `Register.jsx` | **(supprimées côté client)** | Pas de création de compte obligatoire pour réserver — voir section 4bis |
| Espace `Dashboard/Profile` | **Suivi par numéro de réservation** | Le client retrouve sa réservation via son numéro + email/téléphone, sans compte (voir section 4bis) |
| `Login.jsx` (admin) | **Accès admin par code secret** | Pas de login classique : un champ unique "Code d'accès" protège `/admin/*` — voir section 4bis |
| Espace `/admin/*` | **Back-office éleveur** | Gestion des chiots (CRUD, photos, statut), gestion des réservations (avec **suppression définitive possible**), gestion des clients, statistiques de ventes |

---

## 4. Statuts de réservation (remplace les statuts de commande auto)

Remapper les badges existants :
- `badge-pending` → **Demande reçue**
- `badge-confirmed` → **Acompte confirmé**
- `badge-processing` → **En préparation** (vaccins, puce électronique, vermifuge)
- `badge-shipped` → **Prêt(e) à partir** / en cours de livraison
- `badge-delivered` → **Remis(e) à la famille**
- `badge-cancelled` → **Annulée / Remboursée**

Champs de données par chiot (Prisma model `Puppy` à la place de `Car`) :
```
id, name, breed, sex, birthDate, color, microchipNumber, vaccinationStatus,
dewormingStatus, weightCurrent, weightEstimatedAdult, price, deposit,
pedigreeDocUrl, parentMotherName, parentFatherName, healthCertificateUrl,
status (available | reserved | sold), photos[], videoUrl, description,
availableFrom, location
```

Modèle `Reservation` (remplace `Order`) :
```
id, puppyId, userId (nullable — réservation invité), guestName, guestEmail, guestPhone,
depositAmount, depositPaidAt, balanceAmount, balancePaidAt,
deliveryMethod (pickup | delivery), deliveryAddress, status, reservationNumber,
contractUrl, createdAt, updatedAt
```

---

---

## 4bis. Parcours sans compte client + accès admin par code

### Côté client — réservation "invité" (pas de compte)
- Le client choisit un chiot, clique sur **"Réserver"**, remplit un formulaire simple : nom, email, téléphone, adresse (si livraison souhaitée), réponses au questionnaire de pré-qualification (logement, expérience, etc.).
- Aucune création de mot de passe, aucun compte utilisateur n'est requis.
- Côté base de données : le modèle `Reservation` a un champ `userId` **nullable** (même logique que le panier invité déjà implémenté sur le projet Punto Cosmetico) ; les informations du client (nom, email, téléphone) sont stockées directement sur la réservation (`guestName`, `guestEmail`, `guestPhone`).
- Un **numéro de réservation unique** est généré et envoyé par email au client à la confirmation. C'est ce numéro (+ son email ou son n° de téléphone en vérification) qui lui permet de suivre l'état de sa réservation sur la page `Track.jsx` ("Suivre ma réservation"), sans avoir besoin de se connecter.
- Toutes les pages `Login.jsx` / `Register.jsx` / `Dashboard.jsx` / `Profile.jsx` côté client sont **retirées du parcours public** (à conserver uniquement si le client final souhaite plus tard un espace fidélité optionnel — non prioritaire ici).

### Côté admin — accès par code secret (pas de login classique)
- `/admin` n'affiche pas un formulaire email/mot de passe classique, mais un **champ unique "Code d'accès"**.
- Le code est vérifié côté API contre une valeur stockée en variable d'environnement (`ADMIN_ACCESS_CODE`), jamais en dur dans le frontend.
- Une fois le bon code saisi, un token de session (JWT ou cookie signé, durée limitée, ex. 8h) est délivré pour accéder à tout `/admin/*`.
- Prévoir une limitation des tentatives (rate-limit / verrouillage temporaire après X échecs) pour éviter le brute-force sur ce code unique.
- Si plusieurs personnes de l'élevage doivent avoir des accès différenciés à l'avenir, prévoir que l'architecture puisse évoluer vers plusieurs codes/rôles, mais pour la V1 : **un seul code d'accès global** suffit.

### Suppression définitive des réservations (admin)
- Dans `AdminReservationDetail.jsx` (ex `AdminOrderDetail.jsx`), ajouter, en plus du changement de statut, un bouton **"Supprimer définitivement"**.
- Action protégée par une **modale de confirmation explicite** ("Cette action est irréversible, la réservation et toutes ses données seront supprimées définitivement").
- Côté API : un endpoint `DELETE /api/admin/reservations/:id` qui effectue un **hard delete** en base (suppression réelle de la ligne, pas un simple changement de statut `cancelled`), avec suppression en cascade des éventuels documents liés (contrat, certificat) si stockés.
- Recommandé : garder une trace minimale dans un log d'audit côté serveur (qui a supprimé, quand) pour la traçabilité interne, sans bloquer la suppression effective des données personnelles (utile aussi pour la conformité RGPD — droit à l'effacement).

---

## 5. Fonctionnalités spécifiques à ajouter (absentes du template auto)

1. **Filtre par race + âge + disponibilité immédiate** sur le catalogue.
2. **Compte à rebours "disponible à partir du J+X"** pour les chiots trop jeunes pour partir (légalement min. 8 semaines en Belgique).
3. **Upload de pedigree/LOSH** (Livre des Origines Saint-Hubert) en PDF, visible sur la fiche chiot.
4. **Formulaire de pré-qualification adoptant** (avant réservation) : logement, présence d'enfants/autres animaux, expérience — pratique courante et rassurante pour les éleveurs sérieux.
5. **Module "Liste d'attente"** quand une race/portée n'est pas encore née (notification email à la mise en ligne).
6. **Carte interactive** des points de retrait / zones de livraison en Belgique (Bruxelles, Flandre, Wallonie).
7. **Chatbot** reconfiguré avec FAQ chiots (santé, transport, garanties, paiement) au lieu de FAQ auto.

---

## 6. Conformité légale Belgique (à intégrer dans `Legal.jsx`/CGV)

⚠️ Important — la vente de chiots est très réglementée en Belgique. Les pages légales doivent mentionner :
- **Numéro d'agrément d'élevage** (loi du 14 août 1986 relative à la protection et au bien-être des animaux) et **numéro d'enregistrement régional** (AFSCA / Région wallonne, flamande ou bruxelloise selon le siège).
- **Âge minimum de cession** : 8 semaines, puce électronique obligatoire + enregistrement dans la base de données régionale (DogID en Flandre, Catid/équivalent en Wallonie/Bruxelles).
- **Carnet de santé / passeport européen pour animal de compagnie** remis à la cession.
- **Garantie légale** vices rédhibitoires (délais légaux à faire vérifier avec le client final / un juriste — Claude ne fournit pas de conseil juridique définitif).
- **TVA belge** applicable, mentions d'entreprise (n° BCE/TVA) en footer.
- **RGPD** : politique de confidentialité sur les données clients (formulaire pré-qualification, documents d'identité éventuels).

*(Recommandation : faire valider ces mentions par un professionnel du droit/un vétérinaire agréé belge avant mise en ligne — ce prompt structure le site mais ne remplace pas un avis juridique.)*

---

## 7. Arborescence technique suggérée (identique au projet de référence)

```
/src
  /components
    Navbar.jsx
    PuppyCard.jsx        (ex CarCard.jsx)
    Chatbot.jsx
    ClientBottomNav.jsx
    Toast.jsx
    UI.jsx
  /pages
    Home.jsx
    Catalog.jsx
    PuppyDetails.jsx     (ex CarDetails.jsx)
    BudgetSimulator.jsx  (ex Simulation.jsx)
    Cart.jsx
    Track.jsx
    OrderConfirm.jsx
    Orders.jsx
    Dashboard.jsx
    Profile.jsx
    Login.jsx / Register.jsx
    Warranty.jsx
    Insurance.jsx
    OurKennel.jsx         (ex CampingCar.jsx)
    Reviews.jsx
    Legal.jsx
    /admin
      AdminLayout.jsx
      AdminDashboard.jsx
      AdminPuppies.jsx
      AdminPuppyForm.jsx
      AdminReservations.jsx
      AdminReservationDetail.jsx
      AdminClients.jsx
  /store (zustand: auth, lang, cart/reservation, theme)
  /utils (i18n FR/NL/EN, helpers, categories=races)
/api (Express + Prisma)
/prisma/schema.prisma
```

---

## 8. Ton et style des textes (à générer)

- Hero accroche type : *"Votre futur compagnon vous attend"* / *"Élevage familial reconnu — santé, pedigree et amour garantis"*
- Eyebrow sections : *"NOTRE ÉLEVAGE"*, *"CHIOTS DISPONIBLES"*, *"AVIS DE NOS FAMILLES"*, *"GARANTIE SANTÉ"*
- Process en 4 étapes (à afficher comme dans la home auto) : 1) Choisissez votre chiot → 2) Rencontrez-le en visio ou sur place → 3) Versez l'acompte → 4) Accueillez-le chez vous
- Toujours rassurer sur la traçabilité (puce, LOSH, vétérinaire) — c'est l'argument de confiance n°1 dans ce secteur.

---

## 9. Récapitulatif de la demande à donner à l'IA de développement (Claude / Cursor / etc.)

> "Crée un site complet de vente/réservation de chiots pour une entreprise basée en Belgique, en React + Vite + Tailwind + Zustand + Express + Prisma + PostgreSQL, déployé sur Vercel. Reprends EXACTEMENT le design system (structure des CSS variables, polices Outfit/Playfair Display, composants .btn-primary/.btn-ghost/.card/.badge/.timeline-item, navbar, chatbot flottant, sidebar admin) du projet 'Auto Kompetenz' fourni en référence, **en remplaçant la couleur d'accent rouge par un terracotta doré (#C9762E)**. Remplace tout le contenu automobile par du contenu chiots/élevage selon le mapping de pages et les modèles de données Puppy/Reservation détaillés ci-dessus. **Aucune création de compte n'est requise côté client** : la réservation se fait en mode invité (nom/email/téléphone), avec suivi via un numéro de réservation unique. **L'accès au back-office admin se fait via un code d'accès secret unique** (pas de login email/mot de passe), et l'admin doit pouvoir **supprimer définitivement** une réservation (hard delete, pas juste un changement de statut). Langues : FR (par défaut) / NL / EN. Intègre les mentions légales belges spécifiques à la vente d'animaux (agrément élevage, puce électronique, âge minimum 8 semaines, TVA, RGPD). Architecture front/back, pages publiques, back-office admin (CRUD chiots + gestion réservations + suppression définitive + statistiques) à reproduire à l'identique du projet de référence."

---

## 10. Points à clarifier avec le client avant de lancer le développement

- Nom de l'entreprise et races d'élevage proposées
- Numéro d'agrément officiel (obligatoire pour la conformité légale)
- Moyens de paiement souhaités (Bancontact, carte, virement — Bancontact est quasi indispensable pour un site belge B2C)
- Mode de livraison des chiots (retrait uniquement vs transport sécurisé)
- Présence ou non d'un module de paiement en ligne réel vs acompte par virement manuel
- Le **code d'accès admin** souhaité (valeur secrète, à stocker en variable d'environnement, jamais partagée par écrit en clair une fois le site en ligne)
