import { Telegraf } from 'telegraf';
import { setupStart } from './commands/start.js';
import { setupHelp } from './commands/help.js';
import { setupMenu } from './commands/menu.js';
import { setupOrder } from './commands/order.js';
import { setupAdmin } from './commands/admin.js';
import { setupAbout } from './commands/about.js';
import { setupQuote } from './commands/quote.js';
import { setupMenuActions } from './actions/menuActions.js';
import { clearSession } from './middlewares/session.js';

export function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN_UPPERTECH_ASSISTANT);

  setupStart(bot);
  setupHelp(bot);
  setupMenu(bot);
  setupOrder(bot);
  setupAdmin(bot);
  setupAbout(bot);
  setupQuote(bot);
  setupMenuActions(bot);

  bot.command('cancel', ctx => {
    clearSession(ctx.from.id);
    ctx.reply('✅ Sesi dibatalkan.');
  });

  bot.telegram.setMyCommands([
    { command: 'start', description: 'Mulai' },
    { command: 'menu', description: 'Menu' },
    { command: 'order', description: 'Pesan' },
    { command: 'status', description: 'Status' },
    { command: 'quote', description: 'Quote' },
    { command: 'about', description: 'Tentang' },
    { command: 'help', description: 'Bantuan' },
    { command: 'cancel', description: 'Batal sesi' }
  ]);

  bot.launch().then(() => console.log('🤖 Bot berjalan (polling)'));
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
  return bot;
}