import { CoffeeRouletteProps } from "../../../../actions/coffee-roulette/coffee-roulette"
import { SlackBody } from "../../../../models/platform/slack/body"

export const getSlackCoffeeRouletteProps = async (
  body: SlackBody
): Promise<CoffeeRouletteProps> => ({
  channelId: body.trigger_id,
  communityId: body.team_id,
  userId: body.user_id,
  text: body.text,
})
