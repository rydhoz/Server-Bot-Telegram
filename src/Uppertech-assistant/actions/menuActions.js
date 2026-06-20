import { clearSession } from '../middlewares/session.js';

export function setupMenuActions(bot) {
  // Main menu
  bot.action('main_menu', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('📋 Pilih menu yang diinginkan:', {
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

  // Order
  bot.action('order_start', async (ctx) => {
    await ctx.answerCbQuery('🛒 Memulai proses pemesanan...');
    await ctx.reply('Silakan ketik /order untuk memulai pemesanan.');
  });

  // Pricing
  bot.action('pricing', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      '📊 <b>Daftar Harga Layanan UpperTech</b>\n\n' +
      '• Website Landing Page : Rp 500.000\n' +
      '• Website Company Profile : Rp 1.500.000\n' +
      '• Bot Telegram : Rp 750.000\n' +
      '• Custom Project : Hubungi admin',
      { parse_mode: 'HTML' }
    );
  });

  // Portfolio
  bot.action('portfolio', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('💼 Portofolio kami sedang di-update. Silakan hubungi admin untuk info lengkap.');
  });

  // About
  bot.action('about', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'ℹ️ <b>Tentang UpperTech</b>\n\nKami spesialis pembuatan website, bot telegram, dan solusi digital berkualitas.',
      { parse_mode: 'HTML' }
    );
  });

  // Fallback
  bot.on('callback_query', async (ctx) => {
    if (!ctx.callbackQuery.data) return;
    await ctx.answerCbQuery('✅ Diproses');
  });
}