import { Logger } from "../services/logger/logger"
import { Bot } from "../services/bot/bot";

export const onRetrievePoints = async (bot: Bot, userId: string): Promise<String> => {
  const databaseUser = await bot.getUser(userId);
  const gratitude = databaseUser.gratitude;
  const message = `Te quedan *${gratitude.toGive} puntos* y has recibido *${gratitude.totalWeek} puntos* esta semana`

  Logger.onRetrievePoints()
  return message
}