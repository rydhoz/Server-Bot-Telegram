export function setupOrder(bot) {
  bot.command('order', (ctx) => {
    ctx.replyWithHTML(
      `🛒 <b>Proses Pemesanan UpperTech</b>\n\n` +
      `Silakan pilih jenis layanan yang kamu inginkan:`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 Website', callback_data: 'order_website' }],
            [{ text: '🤖 Bot Telegram', callback_data: 'order_bot' }],
            [{ text: '📱 Aplikasi Mobile', callback_data: 'order_app' }],
            [{ text: '🔧 Custom / Lainnya', callback_data: 'order_custom' }]
          ]
        }
      }
    );
  });
}