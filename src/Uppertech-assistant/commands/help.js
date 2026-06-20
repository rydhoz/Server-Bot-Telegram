export function setupHelp(bot) {
  bot.help(ctx => ctx.reply(`📋 *Daftar Perintah*\n/start - Mulai\n/menu - Menu utama\n/order - Pesan\n/status - Cek status\n/quote - Kutipan\n/about - Tentang\n\n*Admin:* /listorder, /confirm <id>, /broadcast <teks>, /stats`, { parse_mode: 'Markdown' }));
}