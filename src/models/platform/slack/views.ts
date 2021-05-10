import { Message } from "../message"
import { Request } from "../../../services/platform/slack/slack"
import { chatPostMessage, viewsOpen } from "../../../services/platform/slack/methods"

export class SlackPlainTextMessage implements Message {
  constructor(public text: string) {}

  send = (recipient: string) => async (request: Request, headers: any) => {
    await chatPostMessage(request, headers)(recipient, { text: this.text })
  }
}
// TODO: maybe add tests
export interface SlackBlock {
  blocks: any[]
}

export class SlackView implements SlackBlock, Message {
  constructor(public blocks: any[]) {}

  send = (recipient: string) => async (request: Request, headers: any) => {
    await chatPostMessage(request, headers)(recipient, { blocks: this.blocks })
  }
}

export class SlackInteractiveBlock implements SlackBlock, Message {
  constructor(public blocks: any[]) {}

  send = (recipient: string) => async (request: Request, headers: any) => {
    await chatPostMessage(request, headers)(recipient, { blocks: this.blocks })
  }
}

export class SlackModal implements SlackBlock, Message {
  public type: string
  public external_id: string
  public title: any
  public submit: any
  public close: any
  public blocks: any[]

  constructor({
    type = "",
    external_id = "",
    title = {},
    submit = {},
    close = {},
    blocks = [] as any[],
  }: Partial<SlackModal>) {
    this.type = type
    this.external_id = external_id
    this.title = title
    this.submit = submit
    this.close = close
    this.blocks = blocks
  }

  send = (recipient: string) => async (request: Request, headers: any) => {
    await viewsOpen(request, headers)(this, recipient)
  }
}
