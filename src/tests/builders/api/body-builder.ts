import { Body } from "../../../models/api";
import { PayloadBuilder } from "./payload-builder";

export const BodyBuilder = ({
  token = "irrelevant-token",
  team_id = "irrelevant-team_id",
  team_domain = "irrelevant-team_domain",
  enterprise_id = "irrelevant-enterprise_id",
  enterprise_name = "irrelevant-enterprise_name",
  channel_id = "irrelevant-channel_id",
  channel_name = "irrelevant-channel_name",
  user_id = "irrelevant-user_id",
  user_name = "irrelevant-user_name",
  command = "irrelevant-command",
  text = "irrelevant-text",
  response_url = "irrelevant-response_url",
  trigger_id = "irrelevant-trigger_id",
  payload = PayloadBuilder({})
}: Partial<Body>): Body => ({
  token,
  team_id,
  team_domain,
  enterprise_id,
  enterprise_name,
  channel_id,
  channel_name,
  user_id,
  user_name,
  command,
  text,
  response_url,
  trigger_id,
  payload,
})