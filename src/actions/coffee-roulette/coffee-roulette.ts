import { Platform } from "../../services/platform/platform";

export interface CoffeeRouletteProps {
  channelId: string,
  communityId: string,
  userId: string,
  text?: string
}

export const coffeeRoulette = async (platform: Platform, data: CoffeeRouletteProps) => {
  // Buscar una persona
  const communityMembers: string[] = await platform.getCommunityMembers(data.communityId) 
  const randomUser = communityMembers[Math.floor(Math.random() * communityMembers.length)]
  platform.postMessage(randomUser, `${data.userId} te ha invitado a tomarte un café`)
}