import axios, { AxiosInstance } from "axios"
import { config } from "../../../config"
import { SlackBody } from "../../../models/slack/body"
import { Platform } from "../platform"
import { getConversationMembers, chatPostMessage, viewsOpen, getTeamMembers } from "./methods"
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

  private constructor(
    private api = axios.create({
      baseURL: "https://slack.com/api",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${config.platform.slack.token}`
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
    await chatPostMessage(this.api)(channelId, { text: message })
  }

  postBlocks = async (channelId: string, blocks: any[]) => {
    await chatPostMessage(this.api)(channelId, { blocks })
  }

  getCommunityMembers = async (communityId: string) => {
    return getTeamMembers(this.api)(communityId)
  }

  getMembersByChannelId = (channelId: string) => {
    return getConversationMembers(this.api)(channelId)
  }

  openInteractive = async (channelId: string, view: any) => { 
    await viewsOpen(this.api)(view, channelId)
  }

  getThanksProps = getSlackThanksProps
  getInteractiveProps = getSlackInteractiveProps
  getCoffeeRouletteProps = getSlackCoffeeRouletteProps
}

Platform.dictionary["slack"] = Slack.getInstance()