{
  "name": "memoire-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "migrate": "node src/utils/migrate.js"
  },
  "dependencies": {
    "archiver": "^6.0.1",
    "aws-sdk": "^2.1490.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "pg": "^8.11.3",
    "qrcode": "^1.5.3",
    "sharp": "^0.32.6",
    "socket.io": "^4.6.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
