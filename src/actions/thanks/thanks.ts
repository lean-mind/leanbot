import { Platform } from "../../services/platform/platform";

export interface ThanksProps {
  channelId: string,
  block,
}

export const thanks = (platform: Platform, { channelId, block }: ThanksProps): void => {
  platform.sendMessage(channelId, block)
}
