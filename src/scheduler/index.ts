import { Bot } from "../services/bot/bot";
import { Schedule } from "../services/schedule/schedule";
import { onRestartGratitude } from "../actions/on-restart-gratitude";
import { onRegisterGratitude } from "../actions/on-register-gratitude";

export const scheduler = (bot: Bot) => {
  const schedule = new Schedule();

  schedule.everyMonday(async () => await onRestartGratitude(bot));
  schedule.everyFirstDayOfMonth(() => onRegisterGratitude(bot));
}