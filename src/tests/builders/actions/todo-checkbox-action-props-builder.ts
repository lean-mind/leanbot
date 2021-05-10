import { Id } from "../../../models/platform/slack/id"
import { CheckboxActionProps } from "../../../services/platform/slack/props/checkbox-action-props"

export const CheckboxActionPropsBuilder = ({
  userId = "irrelevant-user-id",
  value = "irrelevant-value",
  responseUrl = "irrelevant-response-url",
}): CheckboxActionProps => ({
  userId: new Id(userId),
  value,
  responseUrl,
})
