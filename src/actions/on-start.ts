import { Bot } from "../services/bot/bot";
import { scheduler } from "../scheduler";

export const onStart = async (bot: Bot) => {
  scheduler(bot);
}