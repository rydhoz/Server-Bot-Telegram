import { Markup } from 'telegraf';
import { getSession, clearSession } from '../middlewares/session.js';
import { addOrder, getOrders } from '../middlewares/database.js';
import { getWIBTime } from '../utils/helpers.js';

export function setupOrder(bot) {
  bot.command('order', ctx => {
    const sess = getSession(ctx.from.id);
    sess.step = 'pilih_paket';
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('Landing Page (Rp500k)', 'paket_landing')],
      [Markup.button.callback('Company Profile (Rp1,5jt)', 'paket_company')],
      [Markup.button.callback('Toko Online (Rp3jt)', 'paket_toko')],
      [Markup.button.callback('❌ Batal', 'batal_order')]
    ]);
    ctx.reply('Pilih paket:', keyboard);
  });

  bot.command('status', ctx => {
    const orders = getOrders().filter(o => o.userId === ctx.from.id && o.status !== 'cancelled');
    if (!orders.length) return ctx.reply('Belum ada pesanan aktif. /order');
    const o = orders[0];
    ctx.reply(`📦 *Status #${o.id}*\nPaket: ${o.paket}\nStatus: ${o.status}\nWaktu: ${o.createdAt}`, { parse_mode: 'Markdown' });
  });

  bot.action(/paket_(landing|company|toko)/, async ctx => {
    await ctx.answerCbQuery();
    const sess = getSession(ctx.from.id);
    sess.data.paket = { landing: 'Landing Page', company: 'Company Profile', toko: 'Toko Online' }[ctx.match[1]];
    sess.step = 'input_nama';
    ctx.reply('Masukkan *nama lengkap*:', { parse_mode: 'Markdown' });
  });

  bot.action('batal_order', ctx => {
    clearSession(ctx.from.id);
    ctx.answerCbQuery();
    ctx.reply('Dibatalkan.');
  });

  bot.on('text', (ctx, next) => {
    const sess = getSession(ctx.from.id);
    if (!sess.step) return next();
    const text = ctx.message.text.trim();
    if (sess.step === 'input_nama') {
      if (text.length < 3) return ctx.reply('Minimal 3 karakter.');
      sess.data.nama = text;
      sess.step = 'input_username';
      ctx.reply('Masukkan *username Telegram* (@username):', { parse_mode: 'Markdown' });
    } else if (sess.step === 'input_username') {
      if (!text.startsWith('@') || text.length < 3) return ctx.reply('Harus diawali @.');
      sess.data.username = text;
      const order = addOrder({ userId: ctx.from.id, nama: sess.data.nama, username: text, paket: sess.data.paket, status: 'pending', createdAt: getWIBTime() });
      ctx.reply(`✅ *Pesanan #${order.id} diterima!*\n${order.paket}\n${order.nama} (${order.username})\nTunggu konfirmasi admin.`, { parse_mode: 'Markdown' });
      // Notifikasi admin
      const adminId = parseInt(process.env.ADMIN_CHAT_ID);
      if (adminId) bot.telegram.sendMessage(adminId, `📢 Pesanan #${order.id}\n${order.nama} (@${order.username})\n${order.paket}\n/confirm ${order.id}`).catch(()=>{});
      clearSession(ctx.from.id);
    }
  });
}