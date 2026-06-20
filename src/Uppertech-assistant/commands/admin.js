import { getOrders, updateOrder, getUsers } from '../middlewares/database.js';

export function setupAdmin(bot) {
  const adminId = parseInt(process.env.ADMIN_CHAT_ID);
  if (!adminId) return;

  bot.command('listorder', ctx => {
    if (ctx.from.id !== adminId) return;
    const orders = getOrders();
    if (!orders.length) return ctx.reply('Belum ada pesanan.');
    let msg = '*Daftar Pesanan:*\n';
    orders.forEach(o => msg += `#${o.id} ${o.nama} - ${o.paket} - ${o.status}\n`);
    ctx.reply(msg, { parse_mode: 'Markdown' });
  });

  bot.command('confirm', ctx => {
    if (ctx.from.id !== adminId) return;
    const id = parseInt(ctx.message.text.split(' ')[1]);
    if (!id) return ctx.reply('/confirm <id>');
    const order = updateOrder(id, { status: 'confirmed' });
    if (!order) return ctx.reply('Tidak ditemukan.');
    ctx.reply(`Pesanan #${id} dikonfirmasi.`);
    bot.telegram.sendMessage(order.userId, `✅ Pesanan #${order.id} dikonfirmasi!`).catch(()=>{});
  });

  bot.command('broadcast', ctx => {
    if (ctx.from.id !== adminId) return;
    const text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!text) return ctx.reply('/broadcast <teks>');
    const users = getUsers();
    users.forEach(u => bot.telegram.sendMessage(u.id, `📢 ${text}`).catch(()=>{}));
    ctx.reply('Broadcast dimulai.');
  });

  bot.command('stats', ctx => {
    if (ctx.from.id !== adminId) return;
    const users = getUsers();
    const orders = getOrders();
    ctx.reply(`📊 *Statistik*\n👥 User: ${users.length}\n📦 Pesanan: ${orders.length}\n⏳ Pending: ${orders.filter(o=>o.status==='pending').length}\n✅ Confirmed: ${orders.filter(o=>o.status==='confirmed').length}`, { parse_mode: 'Markdown' });
  });
}