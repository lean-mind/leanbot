import { Message } from "../models/message"
import { Bot } from "../services/bot/bot";

export const onGratitude = async (bot: Bot, message: Message) => {
  const userMentionedId = message.usersMentionId[0];
  if (message.userId === userMentionedId) return;
  if (message.gratitudePoints === null) return;

  const points = await bot.giveGratitudePoints(message.userId, userMentionedId, message.gratitudePoints);

  if (points > 0) {
    const text = `*¡<@${message.userId}> te ha dado ${points} punto/s de gratitud!*`
    bot.writeMessageToUser(userMentionedId, text);
  }
}