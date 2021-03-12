import { I18n } from "../../services/i18n/i18n"
import { Platform } from "../../services/platform/platform"
import { ButtonActionProps } from "../../services/platform/slack/props/button-props"
import { coffeeRoulette, CoffeeRouletteProps } from "./coffee-roulette"

export const tryAgainCoffee = async (platform: Platform, data: ButtonActionProps): Promise<void> => {
  const i18n = await I18n.getInstance()

  await platform.updateMessage(data.responseUrl, i18n.translate("coffeeRoulette.tryAgain"))

  const text = platform.getTempUserData(data.userId.id, "coffeeText")
  const coffeeProps: CoffeeRouletteProps = {
    communityId: data.communityId,
    userId: data.userId.id,
    text: text ? text[0] : undefined
  }

  return coffeeRoulette(platform, coffeeProps)
}