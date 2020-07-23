import { Bot } from "../services/bot/bot";
import { Body } from "../services/api/api-body";
import { onRetrievePoints } from "../actions/on-retrieve-points";

export const points = async (body: Body, response: any, bot: Bot) => {
  const message = await onRetrievePoints(bot, body.user_id);
  response.send(message);
}