import axios, { AxiosInstance } from "axios"
import { config } from "../../../config"
import { Message } from "../../../models/platform/message"
import { SlackBody } from "../../../models/platform/slack/body"
import { SlackBlock, SlackInteractiveBlock, SlackModal, SlackView } from "../../../models/platform/slack/views/views"
import { Logger } from "../../logger/logger"
import { Platform } from "../platform"
import { getConversationMembers, chatPostMessage, viewsOpen, getTeamMembers, getUserInfo } from "./methods"
import { getSlackCoffeeRouletteProps } from "./props/coffee-roulette-props"
import { getSlackInteractiveProps } from "./props/interactive-props"
import { getSlackThanksProps } from "./props/thanks-props"
import { chatUpdateMessage } from './methods/chat-update-message';

export type Request = AxiosInstance

export class Slack extends Platform {
  private static instance: Slack

  static getInstance = (api?: any) => {
    if (!Slack.instance || api) {
      Slack.instance = new Slack(api)
    }
    return Slack.instance
  }

  static headers = {
    bot: {
      Authorization: `Bearer ${config.platform.slack.token}` 
    },
    user: {
      Authorization: `Bearer ${config.platform.slack.userToken}` 
    }
  }
  
  private constructor(
    private api = axios.create({
      baseURL: "https://slack.com/api",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      }
    })
  ) { 
    super()
  }

  static getBody = (data: any) => {
    const payload = data.body.payload ? JSON.parse(data.body.payload) : {}
    return  { ...data.body, payload } as SlackBody
  }

  static getToken = (data: any): string | undefined => {
    const body = Slack.getBody(data)
    return body.token ?? body.payload?.token
  }

  sendMessage = async (channelId: string, message: Message): Promise<void> => {
    if (typeof message === "string") {
      await chatPostMessage(this.api, Slack.headers.bot)(channelId, { text: message })
    } else if (message instanceof SlackView || message instanceof SlackInteractiveBlock) {
      await chatPostMessage(this.api, Slack.headers.bot)(channelId, { blocks: (message as SlackBlock).blocks })
    } else if (message instanceof SlackModal) {
      await viewsOpen(this.api, Slack.headers.bot)(message as SlackModal, channelId)
    } else {
      Logger.onError('Unidentifiable message type')
    }
  }

  updateMessage = async (messageId: any, message: Message): Promise<void> => {
    if (typeof message === "string") {
      await chatUpdateMessage(messageId, { text: message })
    } else if (message instanceof SlackView) {
      await chatUpdateMessage(messageId, { blocks: (message as SlackBlock).blocks })
    } else {
      Logger.onError('Unidentifiable message type')
    }
  }

  getCommunityMembers = getTeamMembers(this.api, Slack.headers.bot)
  getMembersByChannelId = getConversationMembers(this.api, Slack.headers.bot)
  getUserInfo = getUserInfo(this.api, Slack.headers.bot)

  getThanksProps = getSlackThanksProps
  getInteractiveProps = getSlackInteractiveProps
  getCoffeeRouletteProps = getSlackCoffeeRouletteProps
}

Platform.dictionary["slack"] = Slack.getInstance()