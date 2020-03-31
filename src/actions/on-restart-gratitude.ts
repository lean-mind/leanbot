import { Bot } from "../services/bot/bot";
import { User } from "../models/slack/user";
import { Emojis } from "../models/emojis";

export const onRestartGratitude = async (bot: Bot) => {
  const message: string = `¡Buenos días! Se han restablecido los puntos semanales.\nSi agradecer tú quieres, *usar con sabiduría tú debes* ${Emojis.Yoda}.`;
  const users: User[] = bot.getUsers();

  await bot.restartGratitudePoints();

  users.forEach((user: User) => {
    bot.writeMessageToUser(user.id, message);
  });
}