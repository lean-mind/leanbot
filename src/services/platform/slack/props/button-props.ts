import { SlackBody } from "../../../../models/platform/slack/body";
import { Id } from "../../../../models/platform/slack/id";

export interface CoffeeButtonActionProps {
  communityId: string,
  userId: Id, 
  responseUrl: string,
  action: string,
  sender: Id
}

export const getSlackButtonAction = (body: SlackBody): CoffeeButtonActionProps => ({
  communityId: body.payload.team.id,
  userId: new Id(body.payload.user.id),
  responseUrl: body.payload.response_url,
  action: body.payload.actions[0].action_id,
  sender: new Id(body.payload.actions[0].value),
})