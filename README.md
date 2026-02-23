# Mémoire 📸 — Event Photo Sharing App

Mémoire is a **QR-code-based photo/video sharing web app** for events (weddings, birthdays, parties, school events, etc.).

**How it works:**
- An organizer (admin) creates an event.
- The app generates a **share link + QR code**.
- Guests scan the QR code and **upload photos/videos + optional guestbook messages** (no guest accounts).
- Everyone can view a **live-updating gallery** and a **slideshow mode** for a TV/projector.

---

## What’s in this repo?

This is a **monorepo** with two apps:

- `frontend/` — React + Tailwind (the website UI)
- `backend/` — Node/Express + PostgreSQL + S3-compatible storage (the API)

**Realtime updates** are done with **Socket.io** (new uploads appear instantly).

---

## Features (in plain English)

-  **Create events** (admin dashboard)
-  **QR codes** for easy guest access
-  **Guest uploads** (photos + videos + messages)
-  **Live gallery** (updates instantly)
-  **Slideshow mode** for venue screens
-  **Admin moderation** (approve/hide/delete uploads)
-  **Download everything** as a ZIP (original quality)
-  **Spam protection** (rate limiting)
-  **Privacy-friendly defaults** (`noindex`, hard-to-guess event tokens)

---

## Tech stack

- **Frontend:** React 18, Tailwind CSS, Framer Motion
- **Backend:** Node.js 18, Express
- **Database:** PostgreSQL 16
- **Storage:** AWS S3 (or **MinIO** locally)
- **Realtime:** Socket.io
- **Image processing:** Sharp (thumbnails)

---

## Quick start (local dev)

### Prereqs
- Node.js **18+**
- Docker + Docker Compose

### 1) Install dependencies
From the project root:

```bash
npm run install:all
