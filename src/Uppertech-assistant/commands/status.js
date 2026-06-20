export function setupStatus(bot) {
  bot.command('status', (ctx) => {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    ctx.replyWithHTML(
      `📊 <b>Status Bot</b>\n\n` +
      `✅ Bot aktif\n` +
      `⏱ Uptime: ${hours} jam ${minutes} menit\n` +
      `🕒 Waktu server: ${new Date().toLocaleString('id-ID')}\n\n` +
      `Semua sistem berjalan normal.`
    );
  });
}