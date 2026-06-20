export function setupMenu(bot) {
  bot.command('menu', (ctx) => {
    ctx.reply('📋 Pilih menu yang diinginkan:', {
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
}