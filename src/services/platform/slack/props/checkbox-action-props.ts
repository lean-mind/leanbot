import { Id } from "../../../../models/platform/slack/id"
import { SlackBody } from "../../../../models/platform/slack/body"

export interface CheckboxActionProps {
  userId: Id,
  responseUrl: string,
  value: string
}

export const getSlackCheckboxAction = (body: SlackBody): CheckboxActionProps => ({
  userId: new Id(body.payload.user.id),
  responseUrl: body.payload.response_url,
  value: body.payload.actions[0].selected_options[0].value,
})