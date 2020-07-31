import { Bot } from "../services/bot/bot";
import { Schedule } from "../services/schedule/schedule";
import { onRestartGratitude } from "../actions/on-restart-gratitude";
import { onRegisterGratitude } from "../actions/on-register-gratitude";
import { onReminderGratitude } from "../actions/on-reminder-gratitude";
import { Logger } from "../services/logger/logger";

export const scheduler = (bot: Bot) => {
  const schedule = new Schedule();

  schedule.everyMonday(() => onRestartGratitude(bot));
  schedule.everyFriday(() => onReminderGratitude(bot));
  schedule.everyFirstDayOfMonth(() => onRegisterGratitude(bot));

  Logger.onScheduleStart();
}