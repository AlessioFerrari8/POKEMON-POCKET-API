# Pokemon Manager

A web application for **Pokémon Pocket** players. Browse the full card catalog, track your missing cards by expansion, build decks, and manage your profile — all behind a secure Google login.

Live site: [pokemon-manager.vercel.app](https://pokemon-manager-deploy.vercel.app/home) 

---

## Features

| Page | Description |
|---|---|
| **Home** | Landing page after login |
| **Cards** | Browse and search the entire Pokémon TCG Pocket card catalog |
| **Expansion Detail** | View all cards belonging to a specific set |
| **Missing Cards** | Track cards you still need, filtered by expansion |
| **Decks** | Browse and build Pokémon Pocket decks |
| **Your Profile** | View and manage your account info |

- Google OAuth sign-in via Firebase
- Route protection with an `authGuard` (unauthenticated users are redirected to `/login`)
- Runtime Firebase config loaded from `public/config.json` (no secrets in the build)
- Responsive UI with TailwindCSS and scroll-animated cards

---

## Technologies Used

| Layer | Technology |
|---|---|
| Framework | [Angular 21](https://angular.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + [@tailwindplus/elements](https://www.npmjs.com/package/@tailwindplus/elements) |
| Authentication | [Firebase Auth](https://firebase.google.com/docs/auth) (Google provider) |
| Cards API | [TCGDex SDK](https://tcgdex.dev/sdks) |
| Decks API | [Limitless TCG](https://docs.limitlesstcg.com/developer.html) |
| Deployment | [Vercel](https://vercel.com) |

---

## Supported Expansions

The missing-cards tracker supports all current Pokémon Pocket expansions:

- **A1** – Genetic Apex
- **A1a** – Mythical Island
- **A2** – Space-Time Smackdown
- **A2a** – Triumphant Light
- **A2b** – Shining Revelry
- **A3** – Celestial Guardians
- **A3a** – Extradimensional Crisis
- **A3b** – Eevee Groove
- **A4** – Wisdom of Sea and Sky
- **A4a** – Secluded Springs
- **B1** – Mega Rising
- **B1a** – Crimson Blaze

---

## Modyfing the project

### Prerequisites

- Node.js ≥ 18
- npm ≥ 11

### 1. Clone the repository

```bash
git clone hhttps://github.com/AlessioFerrari8/POKEMON-POCKET-API.git
cd POKEMON-POCKET-API/pokemon-manager
```

### 2. Install dependencies

```bash
npm install -g @angular/cli
npm install 
```

### 3. Configure Firebase

Copy the example config and fill in your Firebase project credentials:

```bash
cp public/config.example.json public/config.json
```

Edit `public/config.json`:

```json
{
  "firebase": {
    "apiKey": "YOUR_API_KEY",
    "authDomain": "your-project.firebaseapp.com",
    "projectId": "your-project-id",
    "storageBucket": "your-project.firebasestorage.app",
    "messagingSenderId": "YOUR_SENDER_ID",
    "appId": "YOUR_APP_ID"
  }
}
```

> `config.json` is listed in `.gitignore` — your secrets will never be committed.

### 4. Run the development server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## Project Structure

```
pokemon-manager/
├── public/
│   ├── config.example.json     # Firebase config template
│   └── config.json             # Your local Firebase config (gitignored)
├── scripts/
│   └── build-config.js         # Injects config at build time for Vercel
└── src/app/
    ├── components/             # Reusable UI components
    │   ├── card-grid/
    │   ├── card-item/
    │   ├── deck-card/
    │   ├── login/
    │   ├── nav-bar/
    │   ├── search-bar/
    │   ├── settings/
    │   └── user-profile/
    ├── directives/
    │   └── scroll-animate.directive.ts
    ├── guards/
    │   └── auth.guard.ts       # Protects routes from unauthenticated users
    ├── pages/                  # Routed pages
    │   ├── home/
    │   ├── cards/
    │   ├── decks/
    │   ├── expansion-detail/
    │   └── missing-cards/
    └── services/
        ├── pokemon-sdk.ts      # TCGDex SDK wrapper
        └── users-service.ts    # Firebase Auth + user state
```

---
