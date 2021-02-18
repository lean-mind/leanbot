import { Platform } from "../../services/platform/platform";

export interface CoffeeRouletteProps {
  channelId: string,
  communityId: string,
  userId: string,
  text?: string
}

export const coffeeRoulette = (communityMembers: string[] = []) => async (platform: Platform, data: CoffeeRouletteProps) => {
  if (communityMembers.length === 0){
    communityMembers = await platform.getCommunityMembers(data.communityId)
  }
  console.log("-------->", communityMembers)

  const randomUserId = communityMembers[Math.floor(Math.random() * communityMembers.length)]

  const randomUserInfo = platform.getUserInfo(randomUserId)
  // get info del random user
  // si es bot || soy yo
  if (randomUserInfo.isBot || randomUserId === data.userId) {
    communityMembers.splice(communityMembers.indexOf(randomUserId), 1)
    return coffeeRoulette(communityMembers)(platform, data)
  }
  
  platform.postMessage(randomUserId, `<@${data.userId}> te ha invitado a tomarte un café`)
}