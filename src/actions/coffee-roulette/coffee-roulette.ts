import { I18n } from './../../services/i18n/i18n';
import { Platform } from "../../services/platform/platform";
import { CoffeeRouletteMessageView } from '../../models/platform/slack/views/coffee-roulette-message-view';

export interface CoffeeRouletteProps {
  channelId: string,
  communityId: string,
  userId: string,
  text?: string
}

export const coffeeRoulette = async (platform: Platform, data: CoffeeRouletteProps): Promise<void> => {
  const communityMembers = await platform.getCommunityMembers(data.communityId)
  await coffeeRouletteRec(communityMembers)(platform, data)
}

// TODO: rename
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
  
  platform.sendMessage(data.userId, i18n.translate("coffeeRoulette.searching"))
  platform.sendMessage(randomUserId, await CoffeeRouletteMessageView(data))
}