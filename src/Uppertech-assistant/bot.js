import { Telegraf } from 'telegraf';
import { setupStart } from './commands/start.js';
import { setupHelp } from './commands/help.js';
import { setupMenu } from './commands/menu.js';
import { setupOrder } from './commands/order.js';
import { setupAdmin } from './commands/admin.js';
import { setupAbout } from './commands/about.js';
import { setupMenuActions } from './actions/menuActions.js';
import { clearSession } from './middlewares/session.js';

// Global error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export function startBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN_UPPERTECH_ASSISTANT);

  // Setup semua command
  setupStart(bot);
  setupHelp(bot);
  setupMenu(bot);
  setupOrder(bot);
  setupAdmin(bot);
  setupAbout(bot);
  setupMenuActions(bot);

  // Cancel command
  bot.command('cancel', (ctx) => {
    clearSession(ctx.from.id);
    ctx.reply('✅ Sesi telah dibatalkan.');
  });

  // Set commands di Telegram
  bot.telegram.setMyCommands([
    { command: 'start', description: '🚀 Mulai Bot' },
    { command: 'menu', description: '📋 Tampilkan Menu' },
    { command: 'order', description: '🛒 Buat Pesanan' },
    { command: 'status', description: '📊 Status Bot' },
    { command: 'about', description: 'ℹ️ Tentang Kami' },
    { command: 'help', description: '❓ Bantuan' },
    { command: 'cancel', description: '❌ Batal Sesi' }
  ]);

  // Error handling Telegraf
  bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('⚠️ Maaf, terjadi kesalahan. Silakan coba lagi atau ketik /cancel');
  });

  bot.launch()
    .then(() => console.log('🤖 UpperTech Assistant Bot berjalan dengan baik!'))
    .catch(err => console.error('❌ Bot launch error:', err));

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
}