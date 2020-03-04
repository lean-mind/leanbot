import { Message } from "../models/message"
import { Bot } from "../services/bot/bot";

export const onGratitude = (bot: Bot, message: Message) => {
  message.usersMentionId.map(async (usersMentionId: string) => {
    if (message.userId === usersMentionId) return;
    if (message.gratitudePoints === null) return;

    const points = await bot.giveGratitudePoints(message.userId + "-2", usersMentionId, message.gratitudePoints);

    if (points > 0) {
      const text = `*¡<@${message.userId}> te ha dado ${points} punto/s de gratitud!*`
      bot.writeMessageToUser(usersMentionId, text);
    }
  });
}