import { randomQuote } from '../utils/quotes.js';

export function setupQuote(bot) {
  bot.command('quote', ctx => ctx.reply(randomQuote()));
}