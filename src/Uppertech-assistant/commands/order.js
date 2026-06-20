export function setupOrder(bot) {
  bot.command('order', (ctx) => {
    ctx.replyWithHTML(
      `🛒 <b>Proses Pemesanan</b>\n\n` +
      `Silakan pilih jenis layanan yang kamu butuhkan:`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌐 Website', callback_data: 'order_website' }],
            [{ text: '🤖 Bot Telegram', callback_data: 'order_bot' }],
            [{ text: '📱 Aplikasi Mobile', callback_data: 'order_app' }],
            [{ text: '🔧 Lainnya (Custom)', callback_data: 'order_custom' }]
          ]
        }
      }
    );
  });

  // TODO: Tambahkan logic lanjutan nanti (step by step order)
}