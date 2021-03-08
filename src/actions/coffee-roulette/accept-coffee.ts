import { Logger } from './../../services/logger/logger';
import { I18n } from './../../services/i18n/i18n';
import { CoffeeButtonActionProps } from '../../services/platform/slack/props/button-props';
import { Platform } from './../../services/platform/platform';
import { Database } from '../../services/database/database';
import { CoffeeBreak } from '../../models/database/coffee-break';

export const acceptCoffee = async (
  platform: Platform, 
  data: CoffeeButtonActionProps, 
  db: Database = Database.make()
): Promise<void> => {
  const i18n: I18n = await I18n.getInstance()
  const createdAt = new Date()

  const coffeeBreak: CoffeeBreak = new CoffeeBreak(data.communityId, data.sender, data.userId, createdAt)
  try {
    await db.saveCoffeeBreak(coffeeBreak)
  
    platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.recipientAcceptedOffer", { sender: `<@${data.sender.id}>` }))
    platform.sendMessage(data.sender.id, i18n.translate("coffeeRoulette.acceptedOffer", { user: `<@${data.userId.id}>` })) 
  } catch (e) {
    platform.sendMessage(data.sender.id, i18n.translate("coffeeRoulette.error"))
    platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.error"))
    Logger.onError(e)
  }
}