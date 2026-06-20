Uppertech Assistant Bot
Bot Telegram pemesanan jasa website (polling + dashboard).

Cara Menjalankan
bash
git clone https://github.com/rydhoz/Server-Bot-Telegram.git
cd Server-Bot-Telegram
npm install
Salin .env.example ke .env, isi token bot dan admin ID:

text
BOT_TOKEN_UPPERTECH_ASSISTANT=token_kamu
ADMIN_CHAT_ID=id_telegram_kamu
Jalankan bot:

bash
node index.js
Dashboard tersedia di http://localhost:3000.

Perintah Bot
User: /start, /menu, /order, /status, /quote, /help
Admin: /listorder, /confirm <id>, /broadcast <teks>, /stats

Data tersimpan otomatis di folder data/.

