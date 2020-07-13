import { Bot } from "../services/bot/bot";

export const onSocketExpired = async (bot: Bot) => {
  bot.restart();
}