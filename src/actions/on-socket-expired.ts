import { Bot } from "../services/bot/bot";
import { Logger } from "../services/logger/logger";

export const onSocketExpired = async (bot: Bot) => {
  bot.restart();
  Logger.onSocketExpired();
}