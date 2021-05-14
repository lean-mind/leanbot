import { CoffeeRouletteProps } from "../../actions/coffee-roulette/coffee-roulette"
import { InteractiveProps } from "../../actions/interactive"
import { ThanksProps } from "../../actions/thanks/thanks"
import { Message, ViewTypes } from "../../models/platform/message"
import { Logger } from "../logger/logger"
import { UserInfo } from "./slack/methods/get-user-info"
import { SlackBody } from "../../models/platform/slack/body";
import { Community } from "../../models/database/community";
import { RegisterProps } from "../../actions/register/register";

export type PlatformName = "slack"

export abstract class Platform {
  static dictionary = {}

  private tempUserData = {}

  static getInstance = (platformName: PlatformName): Platform => {
    const platform = Platform.dictionary[platformName]
    if (platform) return platform

    const errorMessage = `The ${platformName} platform is not implemented`
    Logger.onError(errorMessage)
    throw Error(errorMessage)
  }

  getPlatformProps = async (data, getProps) => {
    return await getProps(this, data)
  }

  getTempUserData = (userId: string, key: string): string[] | undefined => {
    return this.tempUserData[userId] ? this.tempUserData[userId][key] : undefined
  }

  updateTempUserData = (userId: string, key: string, value: string[]): void => {
    const noUserTempData = !this.tempUserData[userId]
    if (noUserTempData) {
      this.tempUserData[userId] = {}
    }
    this.tempUserData[userId][key] = value
  }

  deleteTempUserData = (userId: string, key: string): void => {
    const tempUserData = this.tempUserData[userId]
    if (tempUserData) {
      delete this.tempUserData[userId][key]
    }
  }

  abstract getCommunity: (body: SlackBody) => Community
  abstract getView: (view: ViewTypes, options: any | undefined) => Promise<Message>

  abstract sendMessage: (channelId: string, message: Message) => Promise<void>
  abstract updateMessage: (messageId: any, message: Message) => Promise<void>

  abstract getCommunityMembers: (communityId: string) => Promise<string[]>
  abstract getMembersByChannelId: (channelId: string) => Promise<string[]>
  abstract getUserInfo: (userId: string) => Promise<UserInfo | undefined>

  abstract getThanksProps: (data: any) => Promise<ThanksProps>
  abstract getInteractiveProps: (data: any) => Promise<InteractiveProps | undefined>
  abstract getCoffeeRouletteProps: (data: any) => Promise<CoffeeRouletteProps>

  abstract getRegisterProps: (data: any) => Promise<RegisterProps>
}