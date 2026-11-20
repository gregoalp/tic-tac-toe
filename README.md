# Tic-Tac-Toe

A two-player Tic-Tac-Toe game built with **Next.js (App Router)**, **React 19**, **TypeScript** and **Tailwind CSS v4**.

## Features
- Two players alternate on a 3x3 board
- Detects wins (winning line highlighted) and draws
- **New Game** button; the starting player alternates each round
- Scoreboard for X wins, O wins and draws, with **Reset scores**
- Three themes: Classic (hand-drawn SVG marks), Pets, Snacks
- Keyboard accessible, labelled squares, live status announcements, reduced-motion support

## Run locally
```bash
npm install
npm run dev
```

## Deploy
```bash
npm run build
npx vercel
vercel --prod
```

Game logic lives in `lib/game.ts`; UI and state are in `components/Game.tsx`.
