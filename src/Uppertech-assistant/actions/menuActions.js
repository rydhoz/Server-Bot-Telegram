import { clearSession } from '../middlewares/session.js';

export function setupMenuActions(bot) {
  bot.action('main_menu', (ctx) => {
    ctx.editMessageText('📋 Pilih menu yang diinginkan:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🛒 Buat Pesanan', callback_data: 'order_start' }],
          [{ text: '📊 Lihat Harga', callback_data: 'pricing' }],
          [{ text: '💼 Portofolio', callback_data: 'portfolio' }],
          [{ text: 'ℹ️ Tentang UpperTech', callback_data: 'about' }]
        ]
      }
    });
  });

  bot.action('order_start', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('🛒 Silakan ketik /order untuk memulai proses pemesanan.');
  });

  bot.action('portfolio', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('💼 Portofolio UpperTech sedang dalam pengembangan. Silakan tunggu update selanjutnya!');
  });

  bot.action('pricing', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('📊 Daftar harga layanan akan ditampilkan di sini (sedang di-update).');
  });
}