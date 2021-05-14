import { Platform } from "../../services/platform/platform";
import { Database } from "../../services/database/database";
import { I18n } from "../../services/i18n/i18n";
import { Logger } from "../../services/logger/logger";
import { RegisterProps } from "./register";

export const registerConfirmation = async (
  platform: Platform,
  { userId, userName }: RegisterProps,
  db: Database = Database.make()
): Promise<void> => {
  const i18n: I18n = await I18n.getInstance()
  const senderId = userId
  const savedUser = await db.saveUser({ userId: userId, userName: userName })
  if (savedUser) {
    await platform.sendMessage(senderId, i18n.translate("register.success"))
    Logger.log(`Registered user: { userId: ${savedUser.userId}, userName: ${savedUser.userName}`)
  } else {
    await platform.sendMessage(senderId, i18n.translate("register.failure"))
  }
}