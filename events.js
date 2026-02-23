# ─────────────────────────────────────────────
#  Mémoire – Backend Environment Variables
# ─────────────────────────────────────────────

# Server
PORT=5000
NODE_ENV=development

# Frontend origin (for CORS)
FRONTEND_URL=http://localhost:3000

# App base URL — used when generating QR codes
APP_URL=http://localhost:3000

# ── Database ──────────────────────────────────
DATABASE_URL=postgresql://memoire_user:memoire_pass@localhost:5432/memoire_db

# ── Auth ──────────────────────────────────────
# Generate a strong random string: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=change_me_to_a_long_random_secret
JWT_EXPIRES_IN=7d

# ── AWS S3 (or MinIO for local dev) ───────────
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=memoire-uploads

# Optional CloudFront CDN — if set, media URLs use this domain instead of S3
# AWS_CLOUDFRONT_URL=https://dxxxxxxxx.cloudfront.net

# For local MinIO — uncomment and set endpoint, comment out CloudFront
# MINIO_ENDPOINT=http://localhost:9000
# MINIO_USE_PATH_STYLE=true

# ── Upload limits ─────────────────────────────
MAX_FILE_SIZE_MB=200
MAX_FILES_PER_UPLOAD=20

# ── Rate limiting ─────────────────────────────
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
