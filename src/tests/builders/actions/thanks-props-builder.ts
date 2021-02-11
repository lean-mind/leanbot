import { ThanksProps } from "../../../actions/thanks/thanks";

export const ThanksPropsBuilder = ({
  channelId = "irrelevant-channel-id",
  block = {}
}): ThanksProps => ({
  channelId,
  block,
})