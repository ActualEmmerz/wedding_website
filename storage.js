version: '3.9'

services:
  # ── PostgreSQL ────────────────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB:       memoire_db
      POSTGRES_USER:     memoire_user
      POSTGRES_PASSWORD: memoire_pass
    ports:
      - '5432:5432'
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U memoire_user -d memoire_db']
      interval: 10s
      timeout: 5s
      retries: 5

  # ── MinIO (local S3-compatible storage) ───────────────────────────────────
  minio:
    image: minio/minio:latest
    restart: unless-stopped
    command: server /data --console-address ':9001'
    environment:
      MINIO_ROOT_USER:     minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - '9000:9000'   # S3 API
      - '9001:9001'   # Web console → http://localhost:9001
    volumes:
      - minio_data:/data
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  pg_data:
  minio_data:
