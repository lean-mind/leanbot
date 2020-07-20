import { Logger } from "../services/logger/logger"
import { Bot } from "../services/bot/bot";

export const onRetrievePoints = async (bot: Bot, userId: string): Promise<String> => {
  const user = bot.getSlackUser(userId);
  const { gratitude } = await bot.getUser(userId);
  const message = `Te quedan *${gratitude.toGive} puntos* y has recibido *${gratitude.totalWeek} puntos* esta semana`

  Logger.onRetrievePoints(user?.name ?? "any")
  return message
}