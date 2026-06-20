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

  // Order Start
  bot.action('order_start', async (ctx) => {
    await ctx.answerCbQuery('🛒 Memulai proses pemesanan...');
    await ctx.reply('Silakan ketik /order untuk memulai pemesanan.');
  });

  // === ORDER FLOW ===
  bot.action('order_website', async (ctx) => {
    await ctx.answerCbQuery('🌐 Website dipilih');
    await ctx.replyWithHTML(
      `✅ <b>Pesanan Website</b>\n\n` +
      `Silakan jawab pertanyaan berikut:\n\n` +
      `1. Nama proyek / website apa yang diinginkan?\n` +
      `(contoh: Toko Online Zuppa Soup)`
    );
  });

  bot.action('order_bot', async (ctx) => {
    await ctx.answerCbQuery('🤖 Bot Telegram dipilih');
    await ctx.replyWithHTML(
      `✅ <b>Pesanan Bot Telegram</b>\n\n` +
      `Silakan ceritakan fitur apa yang kamu inginkan untuk bot ini?`
    );
  });

  bot.action('order_app', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('📱 Fitur Aplikasi Mobile sedang dalam pengembangan. Silakan pilih yang lain atau hubungi admin.');
  });

  bot.action('order_custom', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(
      `🔧 <b>Custom Project</b>\n\n` +
      `Silakan jelaskan kebutuhan proyek kamu secara detail. Kami akan hubungi secepatnya.`
    );
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