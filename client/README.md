# ♠️ Poker Planning

Application de Planning Poker en temps réel pour les équipes agiles.

Poker Planning permet aux membres d’une équipe d’estimer des tâches de manière collaborative,synchrone et sans biais, grâce à un système de vote caché puis révélé.

---

## 🚀 Fonctionnalités

* 🔗 Création de room avec lien de partage
* 👥 Rejoindre une room en temps réel
* 🃏 Vote via cartes de Planning Poker
* 👀 Révélation simultanée des votes
* 🔄 Reset des votes
* 📊 Calcul possible de moyenne / médiane (extension)
* ⚡ Communication temps réel via WebSocket

---

## 🧱 Architecture

Le projet est découpé en deux parties:

```
Poker-Planning
│
├── client/        # Frontend Vue 3
│   ├── components
│   ├── composables
│   ├── pages
│   └── stores
│
└── server/        # Backend Node.js WebSocket
    └── index.ts
```

---

## 🖥️ Frontend

### Stack technique

* Vue 3 (Composition API)
* TypeScript
* Vite
* WebSocket natif

### Responsabilités

* Interface utilisateur
* Gestion des cartes et animations
* Synchronisation avec l’état serveur

### État côté client

* `votes` : votes de tous les utilisateurs
* `myVote` : vote local de l’utilisateur
* `revealed` : état de révélation

Le frontend ne décide jamais de l’état final : le serveur reste la source de vérité.

---

## 🧠 Backend

### Stack technique

* Node.js
* TypeScript
* ws (WebSocket)
* UUID

### Responsabilités

* Gestion des rooms
* Gestion des utilisateurs connectés
* Stockage des votes en mémoire
* Broadcast de l’état complet de la room

### Structure serveur

```ts
Room {
  id: string
  users: User[]
  votes: Record<userId, number>
  revealed: boolean
}
```

Le serveur envoie systématiquement un message `room_state` après chaque action.

---

## 🔌 WebSocket – Types de messages

### Client → Serveur

* `join_room`
* `vote`
* `reveal_votes`
* `reset_votes`
* `leave_room`

### Serveur → Client

* `welcome`
* `room_state`

---

## 🌍 Déploiement

### Frontend

* Vercel

### Backend

* Render
* Le port est fourni automatiquement via `process.env.PORT`

```ts
const PORT = process.env.PORT || 8080
```

### Connexion Front ↔ Server

```ts
const ws = new WebSocket('wss://poker-planning-bsd3.onrender.com')
```

---

## 🛠️ Installation locale

### 1️⃣ Backend

```bash
cd server
npm install
npm run dev
```

### 2️⃣ Frontend

```bash
cd client
npm install
npm run dev
```
