import { Platform } from "../../services/platform/platform";

export interface ThanksProps {
  channelId: string,
  block: any,
}

export const thanks = (platform: Platform, { channelId, block }: ThanksProps) => {
  platform.sendMessage(channelId, block)
}
