import { Bot } from "../services/bot/bot";
import { Schedule } from "../services/schedule/schedule";
import { onRestartGratitude } from "../actions/on-restart-gratitude";

export const scheduler = (bot: Bot) => {
  const schedule = new Schedule();

  schedule.everyMonday(async () => await onRestartGratitude(bot));

  schedule.everyFirstDayOfMonth(() => {
    bot.registerGratitudePointsOfMonth();
  });
}