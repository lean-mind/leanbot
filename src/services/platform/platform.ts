import { CoffeeRouletteProps } from "../../actions/coffee-roulette/coffee-roulette"
import { InteractiveProps } from "../../actions/interactive"
import { ThanksProps } from "../../actions/thanks/thanks"
import { Logger } from "../logger/logger"
import { UserInfo } from "./slack/methods/get-user-info"

export type PlatformName = "slack"

export abstract class Platform {
  static dictionary = {}

  static getInstance = (platformName: PlatformName): Platform => {
    const platform = Platform.dictionary[platformName]
    if (platform) return platform
    
    const errorMessage = `The ${platformName} platform is not implemented`
    Logger.onError(errorMessage)
    throw Error(errorMessage)
  }

  abstract postMessage: (channelId: string, message: string) => Promise<void>
  abstract postBlocks: (channelId: string, blocks: any[]) => Promise<void>
  abstract getCommunityMembers: (communityId: string) => Promise<string[]>
  abstract getMembersByChannelId: (channelId: string) => Promise<string[]>
  abstract openInteractive: (channelId: string, view: any) => Promise<void>
  abstract getUserInfo: (userId: string) => Promise<UserInfo | undefined>

  abstract getThanksProps: (data: any) => ThanksProps
  abstract getInteractiveProps: (data: any) => InteractiveProps | undefined
  abstract getCoffeeRouletteProps: (data: any) => CoffeeRouletteProps
}