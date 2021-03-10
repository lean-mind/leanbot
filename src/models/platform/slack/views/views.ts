import { InteractiveView, View } from "../../message"
import { CoffeeRouletteMessageView } from "./coffee-roulette-message-view"
import { CoffeeRouletteTryAgainView } from "./coffee-roulette-try-again"
import { GratitudeMessageInteractiveView } from "./view-gratitude-message"
import { GratitudeSummaryView } from "./view-gratitude-summary"

export { GratitudeSummaryViewProps } from "./view-gratitude-summary"
// TODO: maybe add tests

export interface SlackBlock {
  blocks: any[]
}
export class SlackView extends View implements SlackBlock {
  constructor(
    public blocks: any[]
    ) 
    { 
      super()
    }

  static gratitudeSummary = GratitudeSummaryView
}

export class SlackInteractiveBlock extends InteractiveView implements SlackBlock {
  constructor(
    public blocks: any[]
    ) 
    { 
      super()
    }

  static coffeeRouletteMessage = CoffeeRouletteMessageView
  static tryAgainCoffeeMessage = CoffeeRouletteTryAgainView

}
export class SlackModal extends InteractiveView implements SlackBlock {
  public type: string
  public externalId: string
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
  }: Partial<SlackModal>) { 
    super()
    this.type = type
    this.externalId = externalId
    this.title = title
    this.submit = submit
    this.close = close
    this.blocks = blocks
  }
  
  static gratitudeMessage = GratitudeMessageInteractiveView
}
