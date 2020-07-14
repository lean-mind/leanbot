import { Bot } from "../services/bot/bot";
import { scheduler } from "../scheduler";
import { Logger } from "../services/logger/logger";
import { API } from "../services/api/api";

export const onStart = async (bot: Bot) => {
  new API(bot);
  scheduler(bot);
  Logger.onStart();
}