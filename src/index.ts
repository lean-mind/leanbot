import dotenv from 'dotenv';
import { Bot } from './services/bot/bot';
import { onStart } from './actions/on_start';
import { onMessage } from './actions/on_message';
import { onError } from './actions/on_error';

dotenv.config();

const bot = new Bot();

bot.onStart(() => onStart(bot))
bot.onMessage((data) => onMessage(bot, data))
bot.onError((data) => onError(bot, data))