import { Bot } from "../services/bot/bot";
import { Schedule } from "../services/schedule/schedule";

export const scheduler = (bot: Bot) => {
  const schedule = new Schedule();

  schedule.everyWeek(() => {
    bot.restartGratitudePoints();
  });

  schedule.everyDay(() => {

  });
}