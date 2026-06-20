import dotenv from 'dotenv';
dotenv.config();

import { startBot } from './src/Uppertech-assistant/bot.js';
import { createServer } from './src/server.js';

// Mulai bot (polling)
startBot();

// Mulai server Express untuk dashboard
const app = createServer();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Dashboard tersedia di http://localhost:${PORT}`);
});