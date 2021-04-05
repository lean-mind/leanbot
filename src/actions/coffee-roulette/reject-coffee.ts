import { I18n } from './../../services/i18n/i18n';
import { ButtonActionProps } from '../../services/platform/slack/props/button-props';
import { Platform } from './../../services/platform/platform';
import { SlackInteractiveBlock } from '../../models/platform/slack/views/views';

export const rejectCoffee = async (platform: Platform, data: ButtonActionProps): Promise<void> => {
  const i18n = await I18n.getInstance()

  const senderId = data.value
  await platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.recipientRejectedOffer", { sender: `<@${senderId}>`}) )
  await platform.sendMessage(senderId, await SlackInteractiveBlock.tryAgainCoffeeMessage())
}