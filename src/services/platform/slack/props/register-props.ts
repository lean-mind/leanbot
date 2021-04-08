import { SlackBody } from "../../../../models/platform/slack/body";
import {RegisterProps} from "../../../../actions/register/register";
import { Id } from "../../../../models/platform/slack/id";

export const getSlackRegisterProps = async (body: SlackBody): Promise<RegisterProps> => ({
  userId: new Id(body.user_id),
  userName: body.user_name,
  channelId: body.channel_id
})