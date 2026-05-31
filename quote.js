import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN_QUOTE); // Token berbeda
// Database sederhana (in-memory)
const subscribers = new Set();

// Kumpulan quotes
const quotes = [
  "💡 *Kutipan:* Koding itu seperti sihir, tapi kamu yang menentukan mantranya.",
  "🌱 *Kutipan:* Setiap baris error adalah pelajaran baru.",
  "🚀 *Kutipan:* Jangan takut gagal. Gagal itu cuma feedback.",
  "🧠 *Kutipan:* Otak itu seperti otot, makin dilatih makin kuat.",
  "💪 *Kutipan:* Konsistensi > intensitas.",
  "📚 *Kutipan:* Ilmu tanpa amal bagai pohon tak berbuah.",
  "🕰️ *Kutipan:* Waktu adalah uang, maka jangan dihabiskan untuk scroll medsos terus.",
  "🤝 *Kutipan:* Berbagi ilmu adalah sedekah terbaik.",
  "🐞 *Kutipan:* Bug itu bukan musuh, tapi guru yang sabar.",
  "✨ *Kutipan:* Jangan bandingkan bab pertama hidupmu dengan bab ketiga orang lain."
];

// Fungsi kirim quote ke semua subscriber
async function broadcastQuote() {
  if (subscribers.size === 0) return;
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  for (const userId of subscribers) {
    try {
      await bot.telegram.sendMessage(userId, randomQuote, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(`Gagal kirim ke ${userId}:`, err.message);
      // Hapus subscriber jika bot diblokir
      if (err.response?.error_code === 403) subscribers.delete(userId);
    }
  }
  console.log(`✅ Broadcast ke ${subscribers.size} subscriber`);
}

// Kirim quote setiap 1 jam (3600000 ms)
setInterval(broadcastQuote, 3600000);
// Opsional: kirim langsung 5 detik setelah start untuk test
setTimeout(() => broadcastQuote(), 5000);

// ----- COMMANDS -----
bot.start((ctx) => {
  ctx.reply(`📖 *Quote Bot*\nKetik /subscribe untuk dapat kutipan inspiratif setiap jam.\nKetik /unsubscribe untuk berhenti.`, { parse_mode: 'Markdown' });
});

bot.command('subscribe', (ctx) => {
  const userId = ctx.from.id;
  if (subscribers.has(userId)) {
    return ctx.reply('✅ Kamu sudah berlangganan!');
  }
  subscribers.add(userId);
  ctx.reply('✅ Berhasil berlangganan! Kamu akan mendapat kutipan setiap jam. Ketik /unsubscribe jika ingin berhenti.');
});

bot.command('unsubscribe', (ctx) => {
  const userId = ctx.from.id;
  if (!subscribers.has(userId)) {
    return ctx.reply('⚠️ Kamu belum berlangganan.');
  }
  subscribers.delete(userId);
  ctx.reply('✅ Kamu berhenti berlangganan. Ketik /subscribe jika ingin lagi.');
});

bot.command('quote', async (ctx) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  await ctx.reply(randomQuote, { parse_mode: 'Markdown' });
});

bot.help((ctx) => {
  ctx.reply(`
📋 *Perintah Quote Bot:*
/start - Intro
/subscribe - Dapat quote tiap jam
/unsubscribe - Berhenti
/quote - Dapat quote langsung
  `, { parse_mode: 'Markdown' });
});

bot.launch();
console.log('✅ Quote Bot running...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));