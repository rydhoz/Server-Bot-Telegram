export function setupStart(bot) {
  bot.start((ctx) => {
    const name = ctx.from.first_name || 'Teman';
    ctx.replyWithHTML(
      `👋 <b>Halo ${name}!</b>\n\n` +
      `Selamat datang di <b>UpperTech Assistant</b> 🤖\n\n` +
      `Saya siap membantu kamu untuk:\n` +
      `• Melihat harga & layanan\n` +
      `• Membuat pesanan\n` +
      `• Informasi portofolio\n\n` +
      `Ketik /menu untuk melihat semua fitur.`,
      { reply_markup: { inline_keyboard: [[{ text: '📋 Buka Menu', callback_data: 'main_menu' }]] }}
    );
  });
}