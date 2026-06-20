import { Markup } from 'telegraf';

export function setupMenu(bot) {
  bot.command('menu', ctx => {
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.callback('📦 Lihat Paket', 'lihat_paket')],
      [Markup.button.callback('📞 Kontak Admin', 'kontak_admin')],
      [Markup.button.callback('🎲 Quote Hari Ini', 'quote_hari_ini')],
      [Markup.button.callback('ℹ️ Tentang Bot', 'about_bot')]
    ]);
    ctx.reply('🧭 *Menu Utama*', { parse_mode: 'Markdown', ...keyboard });
  });
}