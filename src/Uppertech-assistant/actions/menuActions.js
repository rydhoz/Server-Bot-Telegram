import { getSession, updateSession, clearSession } from '../middlewares/session.js';

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

  bot.action('order_start', async (ctx) => {
    await ctx.answerCbQuery();
    ctx.reply('Silakan ketik /order');
  });

  // Order flow
  bot.action('order_website', async (ctx) => {
    await ctx.answerCbQuery('🌐 Website dipilih');
    const userId = ctx.from.id;
    updateSession(userId, { step: 'website_name', data: { type: 'website' } });
    await ctx.replyWithHTML(`✅ <b>Pesanan Website</b>\n\n1. Nama proyek / website apa yang diinginkan?\n(contoh: Toko Online Zuppa Soup)`);
  });

  bot.action('order_bot', async (ctx) => {
    await ctx.answerCbQuery('🤖 Bot Telegram dipilih');
    const userId = ctx.from.id;
    updateSession(userId, { step: 'bot_description', data: { type: 'bot' } });
    await ctx.replyWithHTML(`✅ <b>Pesanan Bot Telegram</b>\n\nSilakan ceritakan fitur apa yang kamu inginkan untuk bot ini?`);
  });

  bot.action('order_app', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply('📱 Fitur aplikasi mobile sedang dikembangkan. Silakan pilih yang lain atau hubungi admin langsung.');
  });

  bot.action('order_custom', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(`🔧 <b>Custom Project</b>\n\nSilakan jelaskan detail kebutuhan proyek kamu.`);
  });

  // Text message handler for order steps
  bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const session = getSession(userId);

    if (session.step === 'website_name') {
      updateSession(userId, { 
        step: 'website_detail',
        data: { ...session.data, name: ctx.message.text }
      });
      await ctx.replyWithHTML(`Terima kasih! Nama proyek: <b>${ctx.message.text}</b>\n\n2. Deskripsikan fitur atau kebutuhan website secara singkat?`);
    } 
    else if (session.step === 'website_detail') {
      const data = { ...session.data, detail: ctx.message.text };
      await ctx.replyWithHTML(`✅ Pesanan Website diterima:\n\nNama: ${data.name}\nDetail: ${data.detail}\n\nKami akan hubungi kamu segera untuk konfirmasi harga dan detail lebih lanjut!`);
      clearSession(userId);
    } 
    else if (session.step === 'bot_description') {
      await ctx.replyWithHTML(`✅ Pesanan Bot Telegram diterima:\n\nDeskripsi: ${ctx.message.text}\n\nTerima kasih! Tim kami akan segera menghubungi.`);
      clearSession(userId);
    }
  });

  // Fallback
  bot.on('callback_query', async (ctx) => {
    await ctx.answerCbQuery();
  });
}