import { Emojis } from "../models/emojis";
import { Bot } from "../services/bot/bot";
import { Channel } from "../models/slack/channel";
import { MessageParams } from "../models/slack/params/message-params";
import { scheduler } from "../scheduler";

export const onStart = (bot: Bot) => {
  scheduler(bot);

  const params: MessageParams = {
    icon_emoji: Emojis.MonkeyMouth
  };

  const channel: Channel | null = bot.getGeneralChannel()
  if (channel !== null) {
    bot.writeMessageToChannel(
      channel.id,
      '¡Hola! Soy vuestro nuevo bot',
      params
    );
  }
}