import { SlackBody } from "../../../../models/platform/slack/body";

export interface CoffeeButtonActionProps {
  userId: string, 
  responseUrl: string,
  action: string,
  sender: string
}

export const getSlackButtonAction = (body: SlackBody): CoffeeButtonActionProps => ({
  userId: body.payload.user.id,
  responseUrl: body.payload.response_url,
  action: body.payload.actions[0].action_id,
  sender: body.payload.actions[0].value,
})