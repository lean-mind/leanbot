import { Bot } from "../services/bot/bot";
import { Body } from "../services/api/api-body";
import { Logger } from "../services/logger/logger";

export const points = async (body: Body, response: any, bot: Bot) => {
  const user = bot.getSlackUser(body.user_id);
  const { gratitude } = await bot.getUser(body.user_id);
  const message = `Te quedan *${gratitude.toGive} puntos* y has recibido *${gratitude.totalWeek} puntos* esta semana`

  response.send(message);
  Logger.onRetrievePoints(user?.real_name ?? "Someone")
}