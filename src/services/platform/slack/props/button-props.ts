import { SlackBody } from "../../../../models/platform/slack/body";
import { Id } from "../../../../models/platform/slack/id";

export interface ButtonActionProps {
  communityId: string,
  userId: Id, 
  responseUrl: string,
  action: string,
  value: string
}

export const getSlackButtonAction = (body: SlackBody): ButtonActionProps => ({
  communityId: body.payload.team.id,
  userId: new Id(body.payload.user.id),
  responseUrl: body.payload.response_url,
  action: body.payload.actions[0].action_id,
  value: body.payload.actions[0].value,
})