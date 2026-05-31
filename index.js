import './uppertech-assistant.js';
import './quote.js';
import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Hanya tangani request ke root "/"
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bot Telegram Status</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background: linear-gradient(135deg, #0f172a, #1e1b4b);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            padding: 1rem;
          }
          .card {
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(10px);
            border-radius: 2rem;
            padding: 2rem;
            max-width: 500px;
            width: 100%;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
            text-align: center;
          }
          .status {
            display: inline-block;
            background: #10b981;
            color: white;
            font-weight: bold;
            padding: 0.3rem 1rem;
            border-radius: 999px;
            font-size: 0.8rem;
            margin-bottom: 1rem;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.05); }
            100% { opacity: 0.7; transform: scale(1); }
          }
          h1 {
            font-size: 1.8rem;
            color: #f1f5f9;
            margin-bottom: 0.5rem;
          }
          .bot-name {
            font-size: 0.9rem;
            color: #94a3b8;
            margin-bottom: 1.5rem;
          }
          .info {
            background: rgba(0,0,0,0.3);
            border-radius: 1rem;
            padding: 1rem;
            text-align: left;
            margin-top: 1rem;
          }
          .info p {
            color: #cbd5e1;
            font-size: 0.85rem;
            margin: 0.5rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .info span {
            font-weight: bold;
            color: #38bdf8;
          }
          .footer {
            margin-top: 1.5rem;
            font-size: 0.7rem;
            color: #475569;
          }
          .badge {
            background: rgba(56,189,248,0.2);
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            font-size: 0.7rem;
            color: #7dd3fc;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status">● ONLINE</div>
          <h1>🤖 Telegram Bot</h1>
          <div class="bot-name">uppertech-assistant + quote-bot</div>
          <div class="info">
            <p>📡 <span>Status server:</span> Bot aktif dan berjalan</p>
            <p>⏱️ <span>Uptime:</span> ${Math.floor(process.uptime())} detik</p>
            <p>🕒 <span>Waktu saat ini:</span> ${new Date().toLocaleString('id-ID')}</p>
            <p>🧠 <span>Bot yang berjalan:</span> Uppertech Assistant & Quote Bot</p>
          </div>
          <div class="badge">Polling mode | Telegram Bot API</div>
          <div class="footer">
            Server menggunakan Node.js + Telegraf
          </div>
        </div>
      </body>
      </html>
    `);
  } else {
    // Halaman lain (favicon, dll) -> 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`🌐 Web status tersedia di http://localhost:${PORT}`);
  console.log(`✅ Bot Telegram sudah berjalan (polling mode)`);
});
