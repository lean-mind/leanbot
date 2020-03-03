import { Emojis } from "../models/emojis";
import { Bot } from "../services/bot/bot";
import { Channel } from "../models/api/slack/channel";

export const onStart = (bot: Bot) => {
  const params = {
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