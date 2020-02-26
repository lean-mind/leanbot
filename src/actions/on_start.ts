import { Emojis } from "../models/emojis";

export const onStart = (bot) => {
  const params = {
    icon_emoji: Emojis.MonoBocaTapada
  };

  bot.postMessageToChannel(
    'general',
    '¡Hola! Soy vuestro nuevo bot',
    params
  );
}