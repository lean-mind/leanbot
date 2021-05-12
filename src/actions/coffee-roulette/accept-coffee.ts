import { Logger } from './../../services/logger/logger';
import { I18n } from './../../services/i18n/i18n';
import { ButtonActionProps } from '../../services/platform/slack/props/button-props';
import { Platform } from './../../services/platform/platform';
import { Database } from '../../services/database/database';
import { CoffeeBreak } from '../../models/database/coffee-break';
import { Id } from '../../models/platform/slack/id';
import { Factory } from "../../services/infrastructure/factory";

export const acceptCoffee = async (
  platform: Platform, 
  data: ButtonActionProps, 
  db: Database = Factory.createRepository()
): Promise<void> => {
  const i18n: I18n = await I18n.getInstance()
  const createdAt = new Date()

  const senderId = new Id(data.value)
  const coffeeBreak: CoffeeBreak = new CoffeeBreak(data.communityId, senderId, data.userId, createdAt)
  try {
    await db.saveCoffeeBreak(coffeeBreak)

    platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.recipientAcceptedOffer", { sender: `<@${senderId.id}>` }))
    platform.sendMessage(senderId.id, i18n.translate("coffeeRoulette.acceptedOffer", { user: `<@${data.userId.id}>` })) 

    platform.deleteTempUserData(senderId.id, "coffeeMembers")
    platform.deleteTempUserData(senderId.id, "coffeeText")
  } catch (e) {
    platform.sendMessage(senderId.id, i18n.translate("coffeeRoulette.error"))
    platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.error"))
    Logger.onError(`Accept-coffee error:  ${e}`)
  }
}