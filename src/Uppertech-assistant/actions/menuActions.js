import { clearSession } from '../middlewares/session.js';

export function setupMenuActions(bot) {
  // Main menu
  bot.action('main_menu', async (ctx) => {
    try {
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
    } catch (error) {
      console.error('Error main_menu:', error);
    }
  });

  // Order Start
  bot.action('order_start', async (ctx) => {
    try {
      await ctx.answerCbQuery('🛒 Memulai proses pemesanan...');
      await ctx.reply('Silakan ketik /order untuk memulai pemesanan.');
    } catch (error) {
      console.error('Error order_start:', error);
    }
  });

  // Pricing
  bot.action('pricing', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.editMessageText(
        '📊 <b>Daftar Harga Layanan UpperTech</b>\n\n' +
        '• Website Landing Page : Rp 500.000\n' +
        '• Website Company Profile : Rp 1.500.000\n' +
        '• Bot Telegram : Rp 750.000\n' +
        '• Custom Project : Hubungi admin',
        { parse_mode: 'HTML' }
      );
    } catch (error) {
      console.error('Error pricing:', error);
    }
  });

  // Portfolio
  bot.action('portfolio', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply('💼 Portofolio kami sedang di-update. Silakan hubungi admin untuk info lengkap.');
    } catch (error) {
      console.error('Error portfolio:', error);
    }
  });

  // About
  bot.action('about', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.editMessageText(
        'ℹ️ <b>Tentang UpperTech</b>\n\nKami spesialis pembuatan website, bot telegram, dan solusi digital berkualitas.',
        { parse_mode: 'HTML' }
      );
    } catch (error) {
      console.error('Error about:', error);
    }
  });

  // Order Flow Actions
  bot.action('order_website', async (ctx) => {
    try {
      await ctx.answerCbQuery('🌐 Website dipilih');
      await ctx.replyWithHTML(
        `✅ <b>Pesanan Website</b>\n\n` +
        `Silakan jawab pertanyaan berikut:\n\n` +
        `1. Nama proyek / website apa yang diinginkan?`
      );
    } catch (error) {
      console.error('Error order_website:', error);
    }
  });

  bot.action('order_bot', async (ctx) => {
    try {
      await ctx.answerCbQuery('🤖 Bot Telegram dipilih');
      await ctx.replyWithHTML(
        `✅ <b>Pesanan Bot Telegram</b>\n\n` +
        `Silakan ceritakan fitur apa yang kamu inginkan untuk bot ini?`
      );
    } catch (error) {
      console.error('Error order_bot:', error);
    }
  });

  bot.action('order_app', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.reply('📱 Fitur Aplikasi Mobile sedang dalam pengembangan.');
    } catch (error) {
      console.error('Error order_app:', error);
    }
  });

  bot.action('order_custom', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.replyWithHTML(`🔧 <b>Custom Project</b>\n\nSilakan jelaskan kebutuhan proyek kamu.`);
    } catch (error) {
      console.error('Error order_custom:', error);
    }
  });

  // Fallback - IMPORTANT: Only answer if not already answered
  bot.on('callback_query', async (ctx) => {
    try {
      // Avoid answering if already handled by specific actions
      if (['main_menu', 'pricing', 'portfolio', 'about', 'order_start', 'order_website', 'order_bot', 'order_app', 'order_custom'].includes(ctx.callbackQuery.data)) {
        return;
      }
      await ctx.answerCbQuery('✅ Diproses');
    } catch (error) {
      // Ignore timeout errors
      if (!error.message.includes('query is too old')) {
        console.error('Fallback error:', error);
      }
    }
  });
}
