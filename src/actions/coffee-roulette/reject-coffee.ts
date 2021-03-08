import { I18n } from './../../services/i18n/i18n';
import { CoffeeButtonActionProps } from '../../services/platform/slack/props/button-props';
import { Platform } from './../../services/platform/platform';

export const rejectCoffee = async (platform: Platform, data: CoffeeButtonActionProps): Promise<void> => {
  const i18n = await I18n.getInstance()

  platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.recipientRejectedOffer", { sender: `<@${data.sender.id}>`}) )
  platform.sendMessage(data.sender.id, i18n.translate("coffeeRoulette.rejectedOffer"))
}