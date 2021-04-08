import { SlackBody } from "../../../../models/platform/slack/body";
import {RegisterProps} from "../../../../actions/register/register";

export const getSlackRegisterProps = async (body: SlackBody): Promise<RegisterProps> => ({
  userId: body.user_id,
  userName: body.user_name,
})