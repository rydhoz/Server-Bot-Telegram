// api/webhook.js
import express from 'express';
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

// -- (1) Middleware untuk parse JSON dari Telegram --
app.use(express.json());

// -- (2) Validasi Webhook: pastikan cuma Telegram yang bisa akses --
const WEBHOOK_PATH = `/telegram/${process.env.WEBHOOK_SECRET}`;
app.post(WEBHOOK_PATH, (req, res) => {
  // Supaya lebih aman, bisa tambah validasi secret token di header
  bot.handleUpdate(req.body, res);
  res.sendStatus(200);
});

// -- (3) Perintah /start --
bot.command('start', (ctx) => {
  const nama = ctx.from.first_name;
  ctx.reply(`Halo ${nama}! 👋\nKetik /help untuk lihat semua perintah.`);
});

// -- (4) Perintah /help --
bot.help((ctx) => {
  ctx.reply(`
📋 *Daftar Perintah:*
/start - Sapaan awal
/help - Bantuan ini
/about - Info tentang bot
/profile - Lihat profilmu
/coba - Coba tombol interaktif
  `, { parse_mode: 'Markdown' });
});

// -- (5) Perintah /about --
bot.command('about', (ctx) => {
  ctx.reply(`
🤖 *Tentang Bot Ini*
Bot ini dibuat dengan Express.js dan Telegraf.
Fungsinya sebagai asisten sederhana, tapi bisa dikembangkan lebih lanjut.

📦 *Tech Stack:*
- Backend: Node.js + Express
- Bot Framework: Telegraf
- Deployment: Vercel

Dibuat oleh: developer [Nama Kamu]
  `, { parse_mode: 'Markdown' });
});

// -- (6) Perintah /profile (dengan data sederhana) --
// Data pengguna sementara (nanti bisa pakai database)
const userData = new Map();

bot.command('profile', (ctx) => {
  const userId = ctx.from.id;
  if (!userData.has(userId)) {
    userData.set(userId, {
      name: ctx.from.first_name,
      joined: new Date().toISOString(),
      points: 0
    });
  }
  const data = userData.get(userId);
  ctx.reply(`
👤 *Profil Pengguna*
ID Telegram: ${userId}
Nama: ${data.name}
Bergabung: ${new Date(data.joined).toLocaleDateString('id-ID')}
Poin: ${data.points}
  `, { parse_mode: 'Markdown' });
});

// -- (7) Perintah /coba (Tombol Interaktif) --
bot.command('coba', (ctx) => {
  ctx.reply('Pilih salah satu tombol di bawah:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Bantuan', callback_data: 'help' }],
        [{ text: 'Tentang Bot', callback_data: 'about' }],
        [{ text: 'Profil', callback_data: 'profile' }]
      ]
    }
  });
});

// -- (8) Handler untuk tombol interaktif --
bot.action('help', (ctx) => {
  ctx.answerCbQuery(); // Supaya loading di Telegram hilang
  ctx.reply('/help untuk menampilkan bantuan.');
});
bot.action('about', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Ketik /about untuk info lebih lengkap.');
});
bot.action('profile', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('Ketik /profile untuk lihat datamu.');
});

// -- (9) Handler untuk pesan teks biasa --
bot.on('text', (ctx) => {
  const pesan = ctx.message.text.toLowerCase();
  if (pesan.includes('hai') || pesan.includes('halo')) {
    ctx.reply(`Halo juga, ${ctx.from.first_name}! Ada yang bisa dibantu?`);
  } else if (pesan.includes('makasih')) {
    ctx.reply(`Sama-sama, ${ctx.from.first_name}! Senang bisa membantu.`);
  } else {
    ctx.reply(`Kamu bilang: "${ctx.message.text}"\n\nKetik /help untuk bantuan.`);
  }
});

// -- (10) Bikin supaya file ini langsung export untuk serverless --
export default app;