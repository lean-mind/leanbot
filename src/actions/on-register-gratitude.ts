import { Bot } from "../services/bot/bot";
import { Logger } from "../services/logger/logger";

export const onRegisterGratitude = (bot: Bot) => {
  bot.registerGratitudePointsOfMonth();
  Logger.onRegisterGratitude();
}