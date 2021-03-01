import { I18n } from './../../services/i18n/i18n';
import { Platform } from "../../services/platform/platform";

export interface CoffeeRouletteProps {
  channelId: string,
  communityId: string,
  userId: string,
  text?: string
}

export const coffeeRoulette = (communityMembers: string[] = []) => async (platform: Platform, data: CoffeeRouletteProps) => {
  const i18n = await I18n.getInstance()
  if (communityMembers.length === 0){
    communityMembers = await platform.getCommunityMembers(data.communityId)
  }
  const randomUserId = communityMembers[Math.floor(Math.random() * communityMembers.length)] 
  const randomUserInfo = await platform.getUserInfo(randomUserId)
  if (randomUserInfo?.isBot || randomUserId === data.userId) {
    communityMembers.splice(communityMembers.indexOf(randomUserId), 1)
    return coffeeRoulette(communityMembers)(platform, data)
  }
  platform.sendMessage(randomUserId, i18n.translate("coffeeRoulette.recipientMessage", { sender: `<@${data.userId}>` }))
}