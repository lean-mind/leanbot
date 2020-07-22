import { Bot } from "../services/bot/bot";
import { scheduler } from "../scheduler";
import { Logger } from "../services/logger/logger";

export const onStart = async (bot: Bot) => {
  scheduler(bot);
  Logger.onBotStart();
}