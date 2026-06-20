import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readJSON, DATA_DIR } from './Uppertech-assistant/middlewares/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

export function createServer() {

  // File statis
  app.use(express.static(path.join(__dirname, 'public')));

  // API status
  app.get('/api/status', (req, res) => {
    try {
      const users = readJSON('users.json');
      const orders = readJSON('orders.json');
      const uptime = Math.floor(process.uptime());
      res.json({
        online: true,
        uptime,
        totalUsers: users.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        confirmedOrders: orders.filter(o => o.status === 'confirmed').length,
        serverTime: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Halaman utama
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  return app;
}

export default app;