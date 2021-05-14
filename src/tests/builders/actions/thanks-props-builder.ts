import { ThanksProps } from "../../../actions/thanks/thanks";

export const ThanksPropsBuilder = ({
  channelId = "irrelevant-channel-id",
  block = {}
}: Partial<ThanksProps>): ThanksProps => ({
  channelId,
  block,
})