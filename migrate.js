{
  "name": "memoire-wedding-app",
  "version": "1.0.0",
  "description": "Beautiful event photo sharing — QR code uploads, real-time gallery, slideshow",
  "private": true,
  "scripts": {
    "dev": "concurrently -n BACK,FRONT -c cyan,magenta \"npm run dev --workspace=backend\" \"npm run dev --workspace=frontend\"",
    "build": "npm run build --workspace=frontend",
    "start": "npm run start --workspace=backend",
    "migrate": "npm run migrate --workspace=backend",
    "install:all": "npm install && npm install --workspace=backend && npm install --workspace=frontend"
  },
  "workspaces": ["backend", "frontend"],
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
