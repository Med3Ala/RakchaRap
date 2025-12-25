# 🎤 RakchaRap: The Ultimate Rap Community Platform

> **Where talent meets data.** RakchaRap is a next-generation social platform designed specifically for the rap community to discover, rate, and elevate emerging artists through a sophisticated, data-driven evaluation system.

---

## 🌟 The Concept (For Everyone)

**RakchaRap** isn't just a music list; it's a digital arena. 

In most platforms, "likes" are the only currency. Here, we use **Spectator Evaluations**. Fans don't just "like" a song—they analyze it across five critical dimensions: **Lyrics, Beat, Flow, Style, and Visuals (Videoclip).**

### Why it's special:
- **For Artists:** Get a clear visual breakdown of your strengths and areas for improvement. Every song you post contributes to your "Global Skill Spectrum."
- **For Spectators:** Your opinion actually matters. Your ratings help calculate an artist's community rank and help others find the highest-quality music.
- **The Radar Graph:** Every artist has a unique "Hexagon" shape that represents their skill set. A "Lyrics" heavy rapper will look different from a "Melodic/Style" focused one!

---

## 🛠 Project Components (For Contributors)

This project is built using a modern, reactive tech stack (**React 19**, **Convex**, and **Vite**). Here is a brief look at the core building blocks:

### 1. The Skill Spectrum (`RadarChart.tsx`)
A custom-built visualization using `Chart.js`. It transforms raw rating numbers into a beautiful hexagonal radar graph. It supports both a "Mini Mode" for cards and a "Full Interactive Mode" for profiles.

### 2. High-Visibility Evaluation (`RatingModal.tsx`)
A standalone, immersive portal for spectators to submit ratings. It uses **React Portals** to escape parent containers, ensuring it’s always front-and-center. It automatically remembers your previous ratings for each song!

### 3. Artist Portfolios (`ProfilePage.tsx`)
A dynamic profile system that adapts based on the viewer. Singers can edit their bios and social links, while visitors can see the artist's full tracklist and overall performance statistics.

### 4. Performance Detail (`SongDetailPage.tsx`)
The deep-dive view for every track. It features YouTube integration, formatted lyrics, and a category-by-category breakdown of how the community has rated that specific performance.

### 5. Automated Skill Sync (`convex/songs.ts`)
A backend system that ensures data integrity. Every time a song is rated, the system automatically triggers a recalculation of the artist's global average, keeping the entire platform in sync in real-time.

---

## 🚀 Technical Setup

### Backend (Convex)
This project uses [Convex](https://convex.dev) as a real-time database and serverless backend.
- **Auth:** Managed via `@convex-dev/auth`.
- **Functions:** Located in the `/convex` directory (queries and mutations).

### Frontend (React + Vite)
- **Styling:** Vanilla Tailwind CSS with custom animations.
- **Routing:** `react-router-dom` for seamless page transitions.
- **Main Entry:** `src/main.tsx` and `src/App.tsx`.

### Running Locally
1. `npm install`
2. `npx convex dev` (to sync your backend)
3. `npm run dev` (to start the preview)

---

Built with ❤️ by the RakchaRap Team.
