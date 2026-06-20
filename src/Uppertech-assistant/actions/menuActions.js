export function setupMenuActions(bot) {
  bot.action('lihat_paket', async ctx => {
    await ctx.answerCbQuery();
    ctx.reply('✨ *Paket:*\n• Landing Page: Rp500k\n• Company Profile: Rp1.5jt\n• Toko Online: Rp3jt\n/order untuk pesan.', { parse_mode: 'Markdown' });
  });
  bot.action('kontak_admin', async ctx => {
    await ctx.answerCbQuery();
    ctx.reply('📞 Hubungi @ridho_u');
  });
  bot.action('quote_hari_ini', async ctx => {
    await ctx.answerCbQuery();
    const { randomQuote } = await import('../utils/quotes.js');
    ctx.reply(randomQuote());
  });
  bot.action('about_bot', async ctx => {
    await ctx.answerCbQuery();
    ctx.reply('Bot ini dibuat oleh Uppertech.');
  });
}