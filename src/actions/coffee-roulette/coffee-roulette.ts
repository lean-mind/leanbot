import { I18n } from './../../services/i18n/i18n';
import { Platform } from "../../services/platform/platform";

export interface CoffeeRouletteProps {
  channelId: string,
  communityId: string,
  userId: string,
  text?: string
}

export const coffeeRoulette = async (platform: Platform, data: CoffeeRouletteProps) => {
  const communityMembers = await platform.getCommunityMembers(data.communityId)
  await coffeeRouletteRec(communityMembers)(platform, data)
}

const coffeeRouletteRec = (communityMembers: string[]) => async (platform: Platform, data: CoffeeRouletteProps) => {
  const i18n = await I18n.getInstance()
  if (communityMembers.length === 0) {
    platform.sendMessage(data.userId, i18n.translate("coffeeRoulette.noOneAvailable"))
  }
  const randomUserId = communityMembers[Math.floor(Math.random() * communityMembers.length)] 
  const randomUserInfo = await platform.getUserInfo(randomUserId)
  if (randomUserInfo?.isBot || randomUserId === data.userId) {
    communityMembers.splice(communityMembers.indexOf(randomUserId), 1)
    return coffeeRouletteRec(communityMembers)(platform, data)
  }

  let messageOptions = { sender: `<@${data.userId}>` }
  let translation = "coffeeRoulette.recipientMessage"
  if (data.text) {
    messageOptions["text"] = data.text
    translation = "coffeeRoulette.recipientMessageWithText"
  }
  platform.sendMessage(randomUserId, i18n.translate(translation, messageOptions))
}