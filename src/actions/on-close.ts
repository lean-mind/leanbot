import { Bot } from "../services/bot/bot";
import { Logger } from "../services/logger/logger";

export const onClose = async (bot: Bot) => {
  bot.restart();
  Logger.onClose();
}