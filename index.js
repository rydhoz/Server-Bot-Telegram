// index.js (bisa langsung di Vercel tanpa Express)
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Halo!'));
bot.help((ctx) => ctx.reply('Bantuan...'));
bot.on('text', (ctx) => ctx.reply(`Kamu bilang: ${ctx.message.text}`));

// Untuk Vercel, cukup export handler
export default async (req, res) => {
  try {
    await bot.handleUpdate(req.body, res);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(200).json({ ok: false });
  }
};