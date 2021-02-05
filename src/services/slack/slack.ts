import axios, { AxiosInstance } from "axios"
import { config } from "../../config"
import { conversationsMembers, chatPostMessage, viewsOpen } from "./methods"

export type Request = AxiosInstance

export class Slack {
  constructor(
    private api = axios.create({
      baseURL: "https://slack.com/api",
      headers: {
        "Content-type": "application/json; charset=utf-8",
        "Authorization": `Bearer ${config.slack.token}`
      }
    })
  ) { }
  
  chatPostMessage = chatPostMessage(this.api)
  conversationsMembers = conversationsMembers(this.api)
  viewsOpen = viewsOpen(this.api)
}