import { Logger } from "../services/logger/logger"
import { Bot } from "../services/bot/bot";

export const onRetrievePoints = async (bot: Bot, userId: string): Promise<String> => {
  const { gratitude } = await bot.getUser(userId);
  const message = `Te quedan *${gratitude.toGive} puntos* y has recibido *${gratitude.totalWeek} puntos* esta semana`

  Logger.onRetrievePoints()
  return message
}