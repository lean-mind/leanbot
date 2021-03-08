import { Id } from "../../../models/platform/slack/id";
import { CoffeeButtonActionProps } from "../../../services/platform/slack/props/button-props";

export const CoffeeButtonActionPropsBuilder = ({
  communityId = "irrelevant-community-id",
  userId = "irrelevant-user-id",
  sender = "irrelevant-sender-id",
  action = "irrelevant-action",
  responseUrl = "irrelevant-response-url",
}): CoffeeButtonActionProps => ({
  communityId,
  userId: new Id(userId),
  sender: new Id(sender),
  action,
  responseUrl
})