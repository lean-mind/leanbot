import { InteractiveView, View } from "../../message"
import { GratitudeMessageInteractiveView } from "./view-gratitude-message"
import { GratitudeSummaryView } from "./view-gratitude-summary"
import { CoffeeRouletteProps } from "../../../../actions/coffee-roulette/coffee-roulette"
import { I18n } from "../../../../services/i18n/i18n"

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

  static coffeeRouletteMessage = async (data: CoffeeRouletteProps): Promise<SlackInteractiveBlock> => {
    const i18n = await I18n.getInstance()
    const options = { sender: `<@${data.userId}>`, text: data.text }
    const blocks = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": data.text ? 
            i18n.translate("coffeeRoulette.recipientMessageWithText", options ) :
            i18n.translate("coffeeRoulette.recipientMessage", options),
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": i18n.translate("button.accept"),
            },
            "value": data.userId,
            "action_id": "accept-coffee"
          },
          {
            "type": "button",
            "style": "danger",
            "text": {
              "type": "plain_text",
              "text": i18n.translate("button.reject"),
            },
            "value": data.userId,
            "action_id": "reject-coffee"
          }
        ]
      }
    ]
  
    return new SlackInteractiveBlock(blocks)
  }

  static tryAgainCoffeeMessage = async (): Promise<SlackInteractiveBlock> => {
    const i18n = await I18n.getInstance()
    
    const blocks = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": i18n.translate("coffeeRoulette.rejectedOffer")
        }
      },
      {
        "type": "actions",
        "elements": [
          {
            "type": "button",
            "style": "primary",
            "text": {
              "type": "plain_text",
              "text": i18n.translate("button.yes")
            },
            "action_id": "try-again-coffee"
          },
          {
            "type": "button",
            "style": "danger",
            "text": {
              "type": "plain_text",
              "text": i18n.translate("button.no")
            },
            "action_id": "stop-coffee"
          }
        ]
      }
    ]
  
    return new SlackInteractiveBlock(blocks)
  }

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
