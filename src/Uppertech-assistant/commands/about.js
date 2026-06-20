export function setupAbout(bot) {
  bot.command('about', ctx => ctx.reply('🤖 *Uppertech Assistant v1.0* - Bot profesional jasa website.', { parse_mode: 'Markdown' }));
}