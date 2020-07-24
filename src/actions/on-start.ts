import { Bot } from "../services/bot/bot";
import { Logger } from "../services/logger/logger";

export const onStart = async (bot: Bot) => {
  Logger.onBotStart();
}