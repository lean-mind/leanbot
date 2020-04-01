import { Bot } from "../services/bot/bot";
import { User } from "../models/slack/user";
import { Emojis } from "../models/emojis";
import { UserData } from "../models/database/user-data";

export const onRestartGratitude = async (bot: Bot) => {
  let totalPoints: number = 0;
  let resultMessage: string = "Estos son los resultados de esta semana:\n";
  const specialMessage: string = `Se han restablecido los puntos semanales.\nSi agradecer tú quieres, *usar con sabiduría tú debes* ${Emojis.Yoda}.`;
  const slackUsers: User[] = bot.getSlackUsers();
  const firebaseUsers: UserData[] = await bot.getUsers();
  
  await bot.restartGratitudePoints();
  const sortByTotalWeek = (a: UserData, b: UserData) => b.gratitude.totalWeek - a.gratitude.totalWeek;

  firebaseUsers.sort(sortByTotalWeek).forEach((user: UserData, index: number) => {
    const points = user.gratitude.totalWeek;
    const position = index + 1;
    if (points > 0) {
      totalPoints += points;
      resultMessage += `*${position}.* <@${user.id}> con *${points} puntos* ${getEmojiForPosition(position)}\n`;
    } 
  });

  slackUsers.forEach((user: User) => {
    if (totalPoints > 0) {
      resultMessage += `\nSe han dado un total de *${totalPoints} puntos*, muchas gracias a todos por valorar a los compañeros ${Emojis.Heart}`;
      bot.writeMessageToUser(user.id, resultMessage);
    } 
    bot.writeMessageToUser(user.id, specialMessage);
  });
}

const getEmojiForPosition = (position: number): string => {
  switch (position) {
    case 1:
      return Emojis.TrophyGold;
    case 2:
      return Emojis.TrophySilver;
    case 3:
      return Emojis.TrophyBronze;
    default:
      return "";
  } 
}