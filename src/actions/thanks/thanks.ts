import { Platform } from "../../services/platform/platform"

export interface ThanksProps {
  channelId: string
  block
}

export const thanks = async (platform: Platform, { channelId, block }: ThanksProps): Promise<void> => {
  await platform.sendMessage(channelId, block)
}
