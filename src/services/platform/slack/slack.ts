import axios, { AxiosInstance } from "axios"
import { config } from "../../../config"
import { SlackBody } from "../../../models/slack/body"
import { Platform } from "../platform"
import { conversationsMembers, chatPostMessage, viewsOpen } from "./methods"
import { getSlackInteractiveProps } from "./props/interactive-props"
import { getSlackThanksProps } from "./props/thanks-props"

export type Request = AxiosInstance

export class Slack implements Platform {
  constructor(
    private api = axios.create({
      baseURL: "https://slack.com/api",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${config.slack.token}`
      }
    })
  ) { }

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

  getMembersId = async (channelId: string) => {
    return await conversationsMembers(this.api)(channelId)
  }

  openInteractive = async (channelId: string, view: any) => { 
    await viewsOpen(this.api)(view, channelId)
  }

  getThanksProps = getSlackThanksProps
  getInteractiveProps = getSlackInteractiveProps
}