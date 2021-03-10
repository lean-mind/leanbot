import { I18n } from "../../../../services/i18n/i18n"
import { SlackInteractiveBlock } from "./views"

export const CoffeeRouletteTryAgainView = async (): Promise<SlackInteractiveBlock> => {
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