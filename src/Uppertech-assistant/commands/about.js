export function setupAbout(bot) {
  bot.command('about', (ctx) => {
    ctx.replyWithHTML(
      `ℹ️ <b>Tentang UpperTech</b>\n\n` +
      `Kami menyediakan jasa pembuatan website, bot telegram, dan solusi digital lainnya.\n\n` +
      `💡 Fast response\n` +
      `🔧 Custom development\n` +
      `📈 Kualitas terjamin\n\n` +
      `Mau mulai proyek? Ketik /order`
    );
  });
}