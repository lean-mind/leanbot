import { Id } from "../../../models/platform/slack/id";
import { ButtonActionProps } from "../../../services/platform/slack/props/button-props";

export const ButtonActionPropsBuilder = ({
  communityId = "irrelevant-community-id",
  userId = "irrelevant-user-id",
  value = "irrelevant-value",
  action = "irrelevant-action",
  responseUrl = "irrelevant-response-url",
}): ButtonActionProps => ({
  communityId,
  userId: new Id(userId),
  value,
  action,
  responseUrl
})