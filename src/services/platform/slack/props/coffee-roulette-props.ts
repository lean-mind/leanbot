import { CoffeeRouletteProps } from "../../../../actions/coffee-roulette/coffee-roulette";
import { SlackBody } from "../../../../models/slack/body";

export const getSlackCoffeeRouletteProps = (body: SlackBody): CoffeeRouletteProps => {
  return {
    channelId: body.trigger_id,
    communityId: body.team_id,
    userId: body.user_id,
    text: body.text
  }
}