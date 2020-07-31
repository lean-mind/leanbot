import { Bot } from "../services/bot/bot";
import { Logger } from "../services/logger/logger";
import { UserData } from "../models/database/user-data";
import { Emojis } from "../models/emojis";

export const onReminderGratitude = async (bot: Bot) => {
  const users = await bot.getUsers();
  users.forEach((user: UserData) => {
    const points = user.gratitude.toGive;
    if (points > 0) {
      bot.writeMessage(user.id, `¡Hola! Te quedan *${points} puntos de gratitud* todavía... ¿has pensado en gastarlos? ${Emojis.MacacoPensativo}`)
    }
  });

  Logger.onReminderGratitude();
}