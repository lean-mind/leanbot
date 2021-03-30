import { InteractiveView, View } from "../message"

// TODO: maybe add tests
export interface SlackBlock {
  blocks: any[]
}
export class SlackView implements SlackBlock, View {
  constructor(
    public blocks: any[]
  ) {}
}

export class SlackInteractiveBlock implements SlackBlock, InteractiveView {
  constructor(
    public blocks: any[]
  ) {}
}

export class SlackModal implements SlackBlock, InteractiveView {
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
}
