import { CoffeeRouletteProps } from "../../../actions/coffee-roulette/coffee-roulette"

export const CoffeeRoulettePropsBuilder = ({
  channelId = "irrelevant-channel-id",
  communityId = "irrelevant-community-id",
  userId = "irrelevant-user-id",
  text = "irrelevant-text"
}: Partial<CoffeeRouletteProps>): CoffeeRouletteProps => ({
  channelId,
  communityId,
  userId,
  text
})