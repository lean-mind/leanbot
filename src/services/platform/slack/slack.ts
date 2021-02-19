import axios, { AxiosInstance } from "axios"
import { config } from "../../../config"
import { Message, View, InteractiveView } from "../../../models/platform/message"
import { SlackBody } from "../../../models/platform/slack/body"
import { Platform } from "../platform"
import { getConversationMembers, chatPostMessage, viewsOpen, getTeamMembers, getUserInfo } from "./methods"
import { getSlackCoffeeRouletteProps } from "./props/coffee-roulette-props"
import { getSlackInteractiveProps } from "./props/interactive-props"
import { getSlackThanksProps } from "./props/thanks-props"

export type Request = AxiosInstance

export interface SlackView extends View {
  blocks: any[]
}

export interface SlackInteractiveView extends InteractiveView {
  type: string,
  blocks: any[]
}

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

  sendMessage = async (channelId: string, message: Message) => {
    if (typeof message === "string") {
      await chatPostMessage(this.api, Slack.headers.bot)(channelId, { text: message })
    } else if (message instanceof View) {
      await chatPostMessage(this.api, Slack.headers.bot)(channelId, { blocks: (message as SlackView).blocks })
    } else if (message instanceof InteractiveView) {
      await viewsOpen(this.api, Slack.headers.bot)(message as SlackInteractiveView, channelId)
    } else {
      console.log("NO ENTRO EN NINGUN LADO :(")
    }
    console.log("--> message is string? ", typeof message === "string")
    console.log("--> message is View? ", message instanceof View)
    console.log("--> message is InteractiveView? ", message instanceof InteractiveView)
  }

  getCommunityMembers = getTeamMembers(this.api, Slack.headers.bot)
  getMembersByChannelId = getConversationMembers(this.api, Slack.headers.bot)
  getUserInfo = getUserInfo(this.api, Slack.headers.bot)

  getThanksProps = getSlackThanksProps
  getInteractiveProps = getSlackInteractiveProps
  getCoffeeRouletteProps = getSlackCoffeeRouletteProps
}

Platform.dictionary["slack"] = Slack.getInstance()