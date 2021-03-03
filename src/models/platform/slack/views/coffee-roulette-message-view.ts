import { SlackInteractiveBlock } from './views';
import { CoffeeRouletteProps } from '../../../../actions/coffee-roulette/coffee-roulette';
import { I18n } from '../../../../services/i18n/i18n';

export const CoffeeRouletteMessageView = async (data: CoffeeRouletteProps): Promise<SlackInteractiveBlock> => {
  const i18n = await I18n.getInstance()
  const blocks = [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": data.text ? 
          i18n.translate("coffeeRoulette.recipientMessageWithText") :
          i18n.translate("coffeeRoulette.recipientMessage"),
				"emoji": true
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": i18n.translate("button.accept"),
					},
					//"value": "click_me_123",
					"action_id": "accept"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": i18n.translate("button.reject"),
					},
					//"value": "click_me_123",
					"action_id": "reject"
				}
			]
		}
	]

  return new SlackInteractiveBlock(blocks)
}