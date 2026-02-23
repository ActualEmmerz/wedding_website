# Mémoire 📸

> **A beautiful, no-account-needed event photo sharing platform.**
> 
> Guests scan a QR code → upload photos, videos, and guestbook messages directly in their browser → everything appears instantly in a real-time gallery. Perfect for weddings, birthdays, and any event where you want shared memories without the friction.

---

## ✨ Features

| Feature | Details |
|---|---|
| **QR code generation** | Each event gets a unique scannable code |
| **No guest accounts** | Upload directly from any browser |
| **Real-time gallery** | New photos appear live via WebSockets |
| **Slideshow mode** | Full-screen display for projectors/TVs |
| **Original resolution downloads** | Admin ZIP download of all files |
| **Guestbook messages** | Text messages alongside photos |
| **Admin moderation** | Hide/approve individual items |
| **Rate limiting** | Protects upload endpoints from spam |
| **Privacy** | `noindex` headers, high-entropy tokens |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Framer Motion, Lucide |
| **Backend** | Node.js 18, Express 4 |
| **Realtime** | Socket.io |
| **Database** | PostgreSQL 16 |
| **Storage** | AWS S3 (or MinIO locally) |
| **Images** | Sharp (thumbnail generation) |

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Node.js 18+
- Docker + Docker Compose

### 1 — Clone and install

```bash
git clone https://github.com/your-username/memoire-app.git
cd memoire-app

# Install all workspaces
npm install
cd backend  && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2 — Start backing services

```bash
# Starts PostgreSQL + MinIO
docker-compose up -d
```

MinIO console → http://localhost:9001  
Login: `minioadmin` / `minioadmin123`  
**Create a bucket named `memoire-uploads` and set it to public read.**

### 3 — Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` for MinIO:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
APP_URL=http://localhost:3000

DATABASE_URL=postgresql://memoire_user:memoire_pass@localhost:5432/memoire_db

JWT_SECRET=replace_with_a_long_random_string

# MinIO (local S3)
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
AWS_REGION=us-east-1
AWS_S3_BUCKET=memoire-uploads
MINIO_ENDPOINT=http://localhost:9000
MINIO_USE_PATH_STYLE=true
```

### 4 — Run database migrations

```bash
npm run migrate
```

### 5 — Start development servers

```bash
# Starts backend (port 5000) + frontend (port 3000) together
npm run dev
```

Open → **http://localhost:3000/admin**

---

## 📱 User Flows

### Admin (Event Organiser)
1. Go to `/admin` → register an account
2. Click **New Event** — fill in title, dates, settings
3. Copy the **QR code** or share link → send to guests or print at venue
4. Watch photos appear live in the gallery
5. Download all originals as a ZIP with one click

### Guest
1. Scan QR code or open event link
2. Enter name (optional based on settings)
3. Drag & drop photos/videos or tap to browse
4. Optionally leave a guestbook message
5. Upload — done! Photos appear instantly for everyone

### Slideshow
- Open `/e/{token}/slideshow` on any display
- Photos cycle every 6 seconds
- New uploads appear automatically

---

## 📁 Project Structure

```
memoire-app/
├── backend/
│   ├── src/
│   │   ├── server.js              # Express + Socket.io bootstrap
│   │   ├── routes/
│   │   │   ├── auth.js            # Register / login / /me
│   │   │   ├── events.js          # Admin CRUD + ZIP download
│   │   │   └── public.js          # Guest upload + gallery API
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT verify
│   │   │   └── upload.js          # Multer config (memory storage)
│   │   └── utils/
│   │       ├── db.js              # pg Pool
│   │       ├── storage.js         # S3 / MinIO helpers
│   │       ├── qr.js              # QR code generation
│   │       └── migrate.js         # One-time schema setup
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── App.js                 # React Router setup
│       ├── index.js / index.css   # Entry + design tokens
│       ├── pages/
│       │   ├── AdminLogin.js      # Sign in / sign up
│       │   ├── AdminDashboard.js  # Event list
│       │   ├── AdminEventPage.js  # Per-event management
│       │   ├── GuestUpload.js     # 3-step guest flow
│       │   ├── GalleryPage.js     # Infinite scroll + lightbox
│       │   └── SlideshowPage.js   # Venue display
│       ├── components/
│       │   ├── UI.js              # Button, Input, Modal, Card, etc.
│       │   └── ProtectedRoute.js
│       ├── contexts/
│       │   ├── AuthContext.js
│       │   └── ToastContext.js
│       ├── hooks/
│       │   └── useSocket.js       # Socket.io realtime hook
│       └── utils/
│           └── api.js             # Axios instance + interceptors
│
├── docker-compose.yml             # PostgreSQL + MinIO for local dev
├── .gitignore
└── README.md
```

---

## 🌐 API Reference

### Auth (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create admin account |
| POST | `/login` | Sign in → JWT |
| GET | `/me` | Current admin info |

### Events — Admin (`/api/events`) — requires Bearer JWT
| Method | Path | Description |
|---|---|---|
| POST | `/` | Create event |
| GET | `/` | List my events |
| GET | `/:id` | Event + stats + QR |
| PUT | `/:id` | Update settings |
| DELETE | `/:id` | Delete event + media |
| GET | `/:id/media` | All media items |
| PATCH | `/:id/media/:mid` | Approve/hide item |
| DELETE | `/:id/media/:mid` | Delete item |
| POST | `/:id/download` | Stream ZIP of originals |
| GET | `/:id/qr` | Regenerate QR code |

### Public — Guest (`/api/public`) — no auth
| Method | Path | Description |
|---|---|---|
| GET | `/events/:token` | Event info for upload page |
| GET | `/events/:token/gallery` | Paginated media (cursor-based) |
| POST | `/events/:token/media` | Upload files + message |

---

## 🚢 Deployment

### Option A — Single server (backend serves React build)

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Set NODE_ENV=production in backend/.env, then:
npm start
```

Backend serves the React SPA at `/` and the API at `/api`.

### Option B — Split deployment

| Part | Host |
|---|---|
| Backend | Railway, Render, Heroku, Fly.io |
| Frontend | Vercel, Netlify |
| Database | Supabase, Neon, Railway |
| Storage | AWS S3 (real account) |

When splitting, set `REACT_APP_API_URL` in the frontend to your backend URL.

### Production checklist

- [ ] Set a strong random `JWT_SECRET`
- [ ] Use a real AWS S3 bucket (or R2/GCS)
- [ ] Set `FRONTEND_URL` and `APP_URL` to production domains
- [ ] Enable HTTPS (handled by host or reverse proxy)
- [ ] Set `NODE_ENV=production`
- [ ] Consider adding a CDN (CloudFront) in front of S3

---

## 🔒 Security Notes

- Event URLs use 32-character hex tokens (128-bit entropy)
- Upload endpoints are rate-limited per IP
- Public pages send `X-Robots-Tag: noindex` to prevent indexing
- JWTs expire after 7 days
- Passwords hashed with bcrypt (cost factor 12)

---

## 📄 License

MIT — free to use, modify, and deploy for any event.

---

*Made with ♡ — enjoy your wedding!* 💍
