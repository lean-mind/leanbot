import { Logger } from './../../services/logger/logger';
import { I18n } from './../../services/i18n/i18n';
import { Platform } from "../../services/platform/platform";
import { CoffeeRouletteMessageView } from '../../models/platform/slack/views/coffee-roulette-message-view';

export interface CoffeeRouletteProps {
  channelId?: string,
  communityId: string,
  userId: string,
  text?: string
}

export const coffeeRoulette = async (platform: Platform, data: CoffeeRouletteProps): Promise<void> => {
  let communityMembers = platform.getTempUserData(data.userId, "coffeeMembers") 
  if (!communityMembers) {
    communityMembers = await platform.getCommunityMembers(data.communityId)
  }
  await coffeeRouletteRec(communityMembers)(platform, data)
}

// TODO: rename
export const coffeeRouletteRec = (communityMembers: string[]) => async (platform: Platform, data: CoffeeRouletteProps): Promise<void> => {
  const i18n = await I18n.getInstance()
  if (communityMembers.length === 0) {
    platform.sendMessage(data.userId, i18n.translate("coffeeRoulette.noOneAvailable"))
    return 
  }
  const randomUserId = communityMembers[Math.floor(Math.random() * communityMembers.length)] 
  communityMembers.splice(communityMembers.indexOf(randomUserId), 1)
  const randomUserInfo = await platform.getUserInfo(randomUserId)
  if (randomUserInfo?.isBot || randomUserId === data.userId) {
    return coffeeRouletteRec(communityMembers)(platform, data)
  }

  platform.updateTempUserData(data.userId, "coffeeMembers", communityMembers)
  Logger.log(`/coffee-roulette: { user: ${data.userId}, invitedUser: ${randomUserId} } `)

  platform.sendMessage(data.userId, i18n.translate("coffeeRoulette.searching"))
  platform.sendMessage(randomUserId, await CoffeeRouletteMessageView(data))
}