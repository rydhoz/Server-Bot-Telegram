import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN_UPPERTECH_ASSISTANT);
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID ? parseInt(process.env.ADMIN_CHAT_ID) : null;

// Session per user (step & order draft)
const session = new Map();
// Database sederhana (in-memory) untuk daftar pesanan
let orders = []; // { id, userId, nama, username, paket, status, createdAt, confirmedBy }

// Helper
function getSession(userId) {
  if (!session.has(userId)) {
    session.set(userId, { step: null, orderData: {} });
  }
  return session.get(userId);
}

function getWIBTime() {
  const now = new Date();
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wibTime.toISOString().replace('T', ' ').slice(0, 19);
}

async function notifyAdmin(orderData, userId, orderId) {
  if (!ADMIN_CHAT_ID) return;
  const waktu = getWIBTime();
  const pesan = `
📢 *PESANAN BARU!* (ID: ${orderId})
👤 Nama: ${orderData.nama}
📛 Username: ${orderData.username}
📦 Paket: ${orderData.paket}
🆔 User ID: ${userId}
⏰ Waktu: ${waktu} WIB
  `;
  const confirmButton = Markup.inlineKeyboard([
    [Markup.button.callback('✅ Konfirmasi Pesanan', `confirm_${orderId}`)]
  ]);
  try {
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, pesan, { 
      parse_mode: 'Markdown',
      reply_markup: confirmButton.reply_markup
    });
    console.log('Notifikasi admin terkirim dengan tombol konfirmasi');
  } catch (err) {
    console.error('Gagal notifikasi admin:', err.message);
  }
}

async function notifyUser(userId, pesan) {
  try {
    await bot.telegram.sendMessage(userId, pesan, { parse_mode: 'Markdown' });
  } catch (err) {
    console.error(`Gagal kirim ke user ${userId}:`, err.message);
  }
}

// ----- COMMANDS -----
bot.start((ctx) => {
  const sess = getSession(ctx.from.id);
  sess.step = null;
  ctx.reply(`Halo ${ctx.from.first_name}! 👋\nSaya *Bot Jasa Website*.\nKetik /menu untuk mulai.`, { parse_mode: 'Markdown' });
});

bot.help((ctx) => {
  ctx.reply(`
📋 *Perintah:*
/start - Mulai
/menu - Layanan
/order - Pesan website
/status - Lihat status pesanan terakhir
/cancel - Batalkan pesanan (sebelum dikonfirmasi)
/rating <1-5> - Beri rating
/about - Info bot
/clear - Hapus sesi

*Admin only:*
/listorder - Lihat semua pesanan
/confirm <id> - Konfirmasi pesanan
  `, { parse_mode: 'Markdown' });
});

bot.command('menu', async (ctx) => {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('💻 Lihat Paket', 'paket')],
    [Markup.button.callback('📞 Kontak Admin', 'kontak')],
    [Markup.button.callback('🛒 Order Sekarang', 'order_start')]
  ]);
  ctx.reply('Pilih menu:', keyboard);
});

bot.command('order', async (ctx) => {
  const userId = ctx.from.id;
  const sess = getSession(userId);
  sess.step = 'waiting_paket';
  sess.orderData = {};
  const paketKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Landing Page (Rp500k)', 'paket_landing')],
    [Markup.button.callback('Company Profile (Rp1,5jt)', 'paket_company')],
    [Markup.button.callback('Toko Online (Rp3jt)', 'paket_toko')],
    [Markup.button.callback('❌ Batal', 'batal_order')]
  ]);
  await ctx.reply('Pilih paket website:', paketKeyboard);
});

bot.command('status', async (ctx) => {
  const userId = ctx.from.id;
  const userOrder = orders.find(o => o.userId === userId && (o.status === 'pending' || o.status === 'confirmed'));
  if (!userOrder) {
    return ctx.reply('Belum ada pesanan aktif. Ketik /order untuk mulai.');
  }
  ctx.reply(`
📦 *Status Pesanan #${userOrder.id}*
- Paket: ${userOrder.paket}
- Nama: ${userOrder.nama}
- Username: ${userOrder.username}
- Status: ${userOrder.status === 'pending' ? '⏳ Menunggu konfirmasi' : '✅ Dikonfirmasi admin'}
- Dibuat: ${userOrder.createdAt} WIB
  `, { parse_mode: 'Markdown' });
});

bot.command('cancel', async (ctx) => {
  const userId = ctx.from.id;
  const index = orders.findIndex(o => o.userId === userId && o.status === 'pending');
  if (index === -1) {
    return ctx.reply('Tidak ada pesanan pending yang bisa dibatalkan.');
  }
  const cancelled = orders[index];
  orders.splice(index, 1);
  ctx.reply(`✅ Pesanan #${cancelled.id} telah dibatalkan.`);
  if (ADMIN_CHAT_ID) {
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, `❌ Pesanan #${cancelled.id} dibatalkan oleh user.`);
  }
});

bot.command('rating', async (ctx) => {
  const text = ctx.message.text;
  const match = text.match(/\/rating (\d+)/);
  if (!match || match[1] < 1 || match[1] > 5) {
    return ctx.reply('Gunakan: /rating 1 sampai 5');
  }
  const rating = match[1];
  const userId = ctx.from.id;
  const hasOrder = orders.some(o => o.userId === userId);
  if (!hasOrder) {
    return ctx.reply('Anda belum pernah memesan, tidak perlu rating.');
  }
  ctx.reply(`⭐ Terima kasih rating ${rating}/5!`);
  if (ADMIN_CHAT_ID) {
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, `⭐ Rating dari user ${userId}: ${rating}/5`);
  }
});

bot.command('about', (ctx) => ctx.reply('Bot pemesanan jasa website. Versi 2.0 dengan fitur admin dan rating.'));

bot.command('clear', (ctx) => {
  session.delete(ctx.from.id);
  ctx.reply('✅ Sesi dihapus.');
});

// ----- ADMIN ONLY COMMANDS -----
bot.command('listorder', async (ctx) => {
  if (ctx.from.id !== ADMIN_CHAT_ID) return ctx.reply('❌ Hanya admin.');
  if (orders.length === 0) return ctx.reply('Belum ada pesanan.');
  let msg = '*Daftar Pesanan:*\n';
  orders.forEach(o => {
    msg += `\n#${o.id} - ${o.nama} (@${o.username.replace('@','')}) - ${o.paket} - ${o.status === 'pending' ? '⏳ Pending' : '✅ Confirmed'}`;
  });
  ctx.reply(msg, { parse_mode: 'Markdown' });
});

bot.command('confirm', async (ctx) => {
  if (ctx.from.id !== ADMIN_CHAT_ID) return ctx.reply('❌ Hanya admin.');
  const parts = ctx.message.text.split(' ');
  if (parts.length < 2) return ctx.reply('Gunakan: /confirm <id_pesanan>');
  const orderId = parseInt(parts[1]);
  const order = orders.find(o => o.id === orderId);
  if (!order) return ctx.reply('Pesanan tidak ditemukan.');
  if (order.status !== 'pending') return ctx.reply('Pesanan sudah dikonfirmasi sebelumnya.');
  order.status = 'confirmed';
  order.confirmedAt = getWIBTime();
  // Notifikasi ke user
  await notifyUser(order.userId, `✅ *Pesanan #${order.id} telah dikonfirmasi admin!*\nTerima kasih, pesanan Anda akan diproses.`, { parse_mode: 'Markdown' });
  ctx.reply(`Pesanan #${order.id} berhasil dikonfirmasi.`);
});

// ----- CALLBACK QUERY -----
bot.action('paket', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply(`
✨ *Paket Jasa Website:*
- Landing Page: Rp500.000
- Company Profile: Rp1.500.000
- Toko Online: Rp3.000.000
Ketik /order untuk pesan.
  `, { parse_mode: 'Markdown' });
});

bot.action('kontak', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply('📞 Hubungi admin: @ridho_u (pastikan Anda sudah chat ke admin dulu)');
});

bot.action('order_start', async (ctx) => {
  await ctx.answerCbQuery();
  await bot.telegram.sendMessage(ctx.from.id, '/order');
});

bot.action(['paket_landing', 'paket_company', 'paket_toko'], async (ctx) => {
  await ctx.answerCbQuery();
  const userId = ctx.from.id;
  const sess = getSession(userId);
  let paketNama = '';
  if (ctx.match[0] === 'paket_landing') paketNama = 'Landing Page (Rp500k)';
  else if (ctx.match[0] === 'paket_company') paketNama = 'Company Profile (Rp1,5jt)';
  else paketNama = 'Toko Online (Rp3jt)';
  sess.orderData.paket = paketNama;
  sess.step = 'waiting_nama';
  await ctx.reply('Masukkan *nama lengkap* Anda:', { parse_mode: 'Markdown' });
});

bot.action('batal_order', async (ctx) => {
  await ctx.answerCbQuery();
  const sess = getSession(ctx.from.id);
  sess.step = null;
  sess.orderData = {};
  ctx.reply('Pemesanan dibatalkan.');
});

bot.action(/confirm_(\d+)/, async (ctx) => {
  // Cek apakah yang tekan adalah admin
  if (ctx.from.id !== ADMIN_CHAT_ID) {
    await ctx.answerCbQuery('❌ Hanya admin yang bisa konfirmasi.', { show_alert: true });
    return;
  }
  
  const orderId = parseInt(ctx.match[1]);
  const order = orders.find(o => o.id === orderId);
  
  if (!order) {
    await ctx.answerCbQuery('❌ Pesanan tidak ditemukan.', { show_alert: true });
    return;
  }
  
  if (order.status !== 'pending') {
    await ctx.answerCbQuery(`⚠️ Pesanan sudah ${order.status === 'confirmed' ? 'dikonfirmasi' : 'dibatalkan'}.`, { show_alert: true });
    return;
  }
  
  // Konfirmasi pesanan
  order.status = 'confirmed';
  order.confirmedAt = getWIBTime();
  
  // Kirim notifikasi ke user
  await notifyUser(order.userId, `✅ *Pesanan #${order.id} telah dikonfirmasi admin!*\nTerima kasih, pesanan Anda akan diproses.`);
  
  // Update pesan asli di admin (opsional: hapus tombol agar tidak bisa diklik dua kali)
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await ctx.answerCbQuery('✅ Pesanan berhasil dikonfirmasi!');
  
  // Kirim pesan konfirmasi ke admin chat
  await ctx.reply(`✅ Pesanan #${order.id} (${order.nama} - ${order.paket}) telah dikonfirmasi.`);
});

// ----- TEXT HANDLER -----
bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  const sess = getSession(userId);
  const text = ctx.message.text.trim();
  if (!sess.step) {
    const low = text.toLowerCase();
    if (low.includes('halo') || low.includes('hai')) return ctx.reply(`Halo ${ctx.from.first_name}! Ketik /menu`);
    return ctx.reply(`Ketik /help untuk bantuan.`);
  }
  switch (sess.step) {
    case 'waiting_nama':
      if (text.length < 3) return ctx.reply('Nama minimal 3 huruf.');
      sess.orderData.nama = text;
      sess.step = 'waiting_username';
      ctx.reply('Masukkan *username Telegram* dengan awalan @\nContoh: @ridho_u');
      break;
    case 'waiting_username':
      if (!text.startsWith('@') || text.length < 3) return ctx.reply('Username harus diawali @ dan minimal 2 karakter setelah @.');
      sess.orderData.username = text;
      // Simpan pesanan ke database
      const newOrder = {
        id: orders.length + 1,
        userId: userId,
        nama: sess.orderData.nama,
        username: sess.orderData.username,
        paket: sess.orderData.paket,
        status: 'pending',
        createdAt: getWIBTime()
      };
      orders.push(newOrder);
      // Ringkasan ke user tanpa tabel
      ctx.reply(`
✅ *Pesanan #${newOrder.id} Diterima!*
Detail pesanan:
- Paket: ${newOrder.paket}
- Nama: ${newOrder.nama}
- Username: ${newOrder.username}

Status: Menunggu konfirmasi admin.
Ketik /status untuk cek.
      `, { parse_mode: 'Markdown' });
      // Notifikasi admin
      await notifyAdmin(sess.orderData, userId, newOrder.id);
      // Reset session
      sess.step = null;
      sess.orderData = {};
      break;
    default:
      ctx.reply('Error. Ketik /clear untuk reset.');
      sess.step = null;
  }
});

// Menentukan perintah-perintah yang akan muncul di menu
await bot.telegram.setMyCommands([
  { command: 'start', description: 'Mulai bot' },
  { command: 'menu', description: 'Tampilkan menu utama' },
  { command: 'order', description: 'Pesan jasa website' },
  { command: 'status', description: 'Cek status pesanan' },
  { command: 'help', description: 'Bantuan' },
]);

bot.launch();
console.log(`✅ Bot running with new features (admin ID: ${ADMIN_CHAT_ID || 'belum diset'})`);
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));