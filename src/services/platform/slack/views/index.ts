import { InteractiveView, View } from '../../../../models/platform/message'

export { GratitudeMessageInteractiveView } from './view-gratitude-message'
export { GratitudeSummaryView } from './view-gratitude-summary'

export class SlackView extends View {
  constructor(
    public blocks: any[]
  ) 
  { 
    super()
  }
}

export class SlackInteractiveView extends InteractiveView {
  public type: string
  public external_id: string
  public title: any
  public submit: any
  public close: any
  public blocks: any[]

  constructor({
    type = "",
    externalId = "",
    title = {},
    submit = {},
    close = {},
    blocks = [] as any[],
  }) { 
    super()
    this.type = type
    this.external_id = externalId
    this.title = title
    this.submit = submit
    this.close = close
    this.blocks = blocks
  }

  // TODO: add gratitudeMessageInteractiveView as method
}