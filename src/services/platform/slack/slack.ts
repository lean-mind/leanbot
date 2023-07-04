import axios, { AxiosInstance } from "axios"
import { config } from "../../../config"
import { Message, ViewTypes } from "../../../models/platform/message"
import { SlackBody } from "../../../models/platform/slack/body"
import { Platform } from "../platform"
import { getConversationMembers, getTeamMembers, getUserInfo } from "./methods"
import { getSlackCoffeeRouletteProps } from "./props/coffee-roulette-props"
import { getSlackInteractiveProps } from "./props/interactive-props"
import { getSlackThanksProps } from "./props/thanks-props"
import { CoffeeRouletteMessage, TryAgainCoffeeMessage } from "./views/coffee-roulette-views"
import { GratitudeSummaryView } from "./views/view-gratitude-summary"
import { GratitudeMessageInteractiveView } from "./views/view-gratitude-message"
import { Community } from "../../../models/database/community"
import { SlackPlainTextMessage } from "../../../models/platform/slack/views"
import { getSlackTodoProps } from "./props/todo-props"
import { ToDoListView } from "./views/todo-views"
import { getSlackStatsProps } from "./props/stats-props"

export type Request = AxiosInstance

export class Slack extends Platform {
  private static instance: Slack

  static getInstance = (api?: any): Slack => {
    if (!Slack.instance || api) {
      Slack.instance = new Slack(api)
    }
    return Slack.instance
  }

  static headers = {
    bot: {
      Authorization: `Bearer ${config.platform.slack.token}`,
    },
    user: {
      Authorization: `Bearer ${config.platform.slack.userToken}`,
    },
  }

  private constructor(
    private api = axios.create({
      baseURL: "https://slack.com/api",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    })
  ) {
    super()
  }

  static getBody = (data: any): SlackBody => {
    const payload = data.body.payload ? JSON.parse(data.body.payload) : {}
    return { ...data.body, payload } as SlackBody
  }

  static getToken = (data: any): string | undefined => {
    const body = Slack.getBody(data)
    return body.token ?? body.payload?.token
  }

  getCommunity = (body: SlackBody): Community => {
    return { id: body.team_id, platform: "slack" }
  }

  getView = async (view: ViewTypes, options: any | undefined): Promise<Message> => {
    const mapper = {
      gratitudeMessage: GratitudeMessageInteractiveView,
      gratitudeSummary: GratitudeSummaryView,
      coffeeRouletteMessage: CoffeeRouletteMessage,
      tryAgainCoffeeMessage: TryAgainCoffeeMessage,
      toDoList: ToDoListView,
    }
    const viewFunc = mapper[view]
    // TODO: refactor
    if (viewFunc) {
      return viewFunc(options)
    }
    throw Error("Unknown view error")
  }

  sendMessage = async (channelId: string, message: Message | string): Promise<void> => {
    if (typeof message === "string") {
      message = new SlackPlainTextMessage(message)
    }
    await message.send(channelId)(this.api, Slack.headers.bot)
  }

  updateMessage = async (messageId: string, message: Message | string): Promise<void> => {
    if (typeof message === "string") {
      message = new SlackPlainTextMessage(message)
    }
    await message.update(messageId)
  }

  getCommunityMembers = getTeamMembers(this.api, Slack.headers.bot)
  getMembersByChannelId = getConversationMembers(this.api, Slack.headers.bot)
  getUserInfo = getUserInfo(this.api, Slack.headers.bot)

  getThanksProps = getSlackThanksProps
  getInteractiveProps = getSlackInteractiveProps
  getCoffeeRouletteProps = getSlackCoffeeRouletteProps
  getTodoProps = getSlackTodoProps
  getStatsProps = getSlackStatsProps
}

Platform.dictionary["slack"] = Slack.getInstance()
