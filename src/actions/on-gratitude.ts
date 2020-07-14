import { Message } from "../models/message"
import { Bot } from "../services/bot/bot";
import { Emojis } from "../models/emojis";
import { Logger } from "../services/logger/logger";

export const onGratitude = async (bot: Bot, message: Message) => {
  const userMentionedId = message.usersMentionId[0];
  if (message.userId === userMentionedId) return;
  if (message.gratitudePoints === null) return;

  const points = await bot.giveGratitudePoints(message.userId, userMentionedId, message.gratitudePoints);

  if (points > 0) {
    const messageToUserMentioned = `*<@${message.userId}>* te ha dado *${points}* punto/s de gratitud!`;
    bot.writeMessageToUser(userMentionedId, messageToUserMentioned);

    const messageToUserThatMention = `¡Has dado *${points}* puntos a *<@${userMentionedId}>*!`;
    bot.writeMessageToUser(message.userId, messageToUserThatMention);

    Logger.onGratitude();
  } else {
    const messageToUserThatMention = `¡Chacho relajate con los puntitos, que ya no te quedan! ${Emojis.MaikDontAprove}`;
    bot.writeMessageToUser(message.userId, messageToUserThatMention);
  }
}