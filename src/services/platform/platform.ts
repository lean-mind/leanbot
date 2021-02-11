import { InteractiveProps } from "../../actions/interactive"
import { ThanksProps } from "../../actions/thanks/thanks"

export type PlatformName = "slack" | "discord"

export interface Platform {
  postMessage: (channelId: string, message: string) => Promise<void>
  postBlocks: (channelId: string, blocks: any[]) => Promise<void>
  getMembersId: (channelId: string) => Promise<string[]>
  openInteractive: (channelId: string, view: any) => Promise<void>

  getThanksProps: (data: any) => ThanksProps
  getInteractiveProps: (data: any) => InteractiveProps | undefined
}