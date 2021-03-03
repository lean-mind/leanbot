import { InteractiveView, View } from "../../message"
import { GratitudeMessageInteractiveView } from "./view-gratitude-message"
import { GratitudeSummaryView } from "./view-gratitude-summary"

// TODO: maybe add tests

export class SlackView extends View {
  constructor(
    public blocks: any[]
    ) 
    { 
      super()
    }

  static gratitudeSummary = GratitudeSummaryView
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

  static gratitudeMessage = GratitudeMessageInteractiveView
}
