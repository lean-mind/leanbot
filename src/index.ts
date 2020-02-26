import SlackBot from 'slackbots';
import dotenv from 'dotenv';
import { onStart } from './actions/on_start';
import { onError } from './actions/on_error';
import { onMessage } from './actions/on_message';

dotenv.config();

const bot = new SlackBot({
  token: process.env.BOT_TOKEN,
  name: process.env.BOT_NAME,
  disconnect: false,
});

bot.on("start", () => onStart(bot));
bot.on("error", (error) => onError(bot, error));
bot.on("message", (data) => onMessage(bot, data));