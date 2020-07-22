import { Bot } from "../services/bot/bot";
import { ApiBody } from "../services/api/api-body";
import { onRetrievePoints } from "../actions/on-retrieve-points";

export const points = async (body: ApiBody, response: any, bot: Bot) => {
  const message = await onRetrievePoints(bot, body.user_id);
  response.send(message);
}