import { CoffeeRouletteProps } from "../../../../actions/coffee-roulette/coffee-roulette"
import { I18n } from "../../../i18n/i18n"
import { SlackInteractiveBlock } from "../../../../models/platform/slack/views"

export const CoffeeRouletteMessage = async (data: CoffeeRouletteProps): Promise<SlackInteractiveBlock> => {
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

export const TryAgainCoffeeMessage = async (): Promise<SlackInteractiveBlock> => {
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