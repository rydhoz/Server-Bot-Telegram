import { Telegraf } from 'telegraf';
import { setupStart } from './commands/start.js';
import { setupHelp } from './commands/help.js';
import { setupMenu } from './commands/menu.js';
import { setupOrder } from './commands/order.js';
import { setupAdmin } from './commands/admin.js';
import { setupAbout } from './commands/about.js';
import { setupStatus } from './commands/status.js';
import { setupMenuActions } from './actions/menuActions.js';

export function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN_UPPERTECH_ASSISTANT);

  setupStart(bot);
  setupHelp(bot);
  setupMenu(bot);
  setupOrder(bot);
  setupAdmin(bot);
  setupAbout(bot);
  setupStatus(bot);
  setupMenuActions(bot);

  bot.command('cancel', (ctx) => {
    ctx.reply('✅ Sesi dibatalkan.');
  });

  bot.catch((err, ctx) => {
    console.error('Error:', err);
    ctx.reply('⚠️ Terjadi kesalahan. Silakan coba lagi atau ketik /cancel');
  });

  bot.launch()
    .then(() => console.log('🤖 UpperTech Bot is running...'))
    .catch(console.error);

  return bot;
}