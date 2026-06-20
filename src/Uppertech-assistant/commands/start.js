import { addUser } from '../middlewares/database.js';
import { getWIBTime } from '../utils/helpers.js';

export function setupStart(bot) {
  bot.start(async (ctx) => {
    const user = ctx.from;
    addUser({ id: user.id, first_name: user.first_name, username: user.username || '', joined: getWIBTime() });
    // Notifikasi admin
    const adminId = parseInt(process.env.ADMIN_CHAT_ID);
    if (adminId) {
      bot.telegram.sendMessage(adminId, `👤 User baru: ${user.first_name} (@${user.username || '-'})`).catch(()=>{});
    }
    ctx.reply(`Halo ${user.first_name}! 👋\nSaya *Uppertech Assistant*, bot jasa website profesional.\nKetik /menu untuk mulai.`, { parse_mode: 'Markdown' });
  });
}