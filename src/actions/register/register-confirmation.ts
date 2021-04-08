import { Platform } from "../../services/platform/platform";
import { Database } from "../../services/database/database";
import { I18n } from "../../services/i18n/i18n";
import { Logger } from "../../services/logger/logger";
import { RegisterProps } from "./register";

export const registerConfirmation = async (
  platform: Platform,
  { userId, userName}: RegisterProps,
  db: Database = Database.make()
): Promise<void> => {
  const i18n: I18n = await I18n.getInstance()
  const senderId = userId
  console.log("Entro por aqui")
  try {
    await db.saveUser({userId: userId, userName: userName })
    await platform.sendMessage(senderId, i18n.translate("coffeeRoulette.acceptedOffer", {user: `<@${userId}>`}))
  } catch (e) {
    await platform.sendMessage(senderId, i18n.translate("coffeeRoulette.error"))
    Logger.onError(`Accept-coffee error:  ${e}`)
  }
}