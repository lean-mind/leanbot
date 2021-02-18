import axios, { AxiosInstance } from "axios"
import { config } from "../../../config"
import { SlackBody } from "../../../models/slack/body"
import { Platform } from "../platform"
import { getConversationMembers, chatPostMessage, viewsOpen, getTeamMembers, getUserInfo } from "./methods"
import { getSlackCoffeeRouletteProps } from "./props/coffee-roulette-props"
import { getSlackInteractiveProps } from "./props/interactive-props"
import { getSlackThanksProps } from "./props/thanks-props"

export type Request = AxiosInstance

export class Slack extends Platform {
  private static instance: Slack

  static getInstance = (api?: any) => {
    if (!Slack.instance || api) {
      Slack.instance = new Slack(api)
    }
    return Slack.instance
  }

  private headers = {
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

  postMessage = async (channelId: string, message: string) => {
    await chatPostMessage(this.api, this.headers.bot)(channelId, { text: message })
  }

  postBlocks = async (channelId: string, blocks: any[]) => {
    await chatPostMessage(this.api, this.headers.bot)(channelId, { blocks })
  }

  getCommunityMembers = getTeamMembers(this.api, this.headers.bot)
  getMembersByChannelId = getConversationMembers(this.api, this.headers.bot)
  openInteractive = viewsOpen(this.api, this.headers.bot)
  getUserInfo = getUserInfo(this.api, this.headers.bot)

  getThanksProps = getSlackThanksProps
  getInteractiveProps = getSlackInteractiveProps
  getCoffeeRouletteProps = getSlackCoffeeRouletteProps
}

Platform.dictionary["slack"] = Slack.getInstance()