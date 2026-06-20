export function setupHelp(bot) {
  bot.command('help', (ctx) => {
    ctx.replyWithHTML(
      `❓ <b>Bantuan UpperTech Bot</b>\n\n` +
      `Daftar Command:\n` +
      `/start - Mulai bot\n` +
      `/menu - Tampilkan menu utama\n` +
      `/order - Mulai pemesanan\n` +
      `/status - Cek status bot\n` +
      `/about - Tentang kami\n` +
      `/cancel - Batalkan sesi\n\n` +
      `Ada yang bisa dibantu?`
    );
  });
}