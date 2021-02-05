import { Payload } from "../../../models/api";

export const PayloadBuilder = ({
  type = "irrelevant-type",
  token = "irrelevant-token",
  action_ts = "irrelevant-action_ts",
  team = {
    id: "irrelevant-team-id",
    domain: "irrelevant-team-domain",
  },
  user = {
    id: "irrelevant-user-id",
    name: "irrelevant-user-name",
  },
  channel = {
    id: "irrelevant-channel-id",
    name: "irrelevant-channel-name",
  },
  is_enterprise_install = "irrelevant-is_enterprise_install",
  enterprise = "irrelevant-enterprise",
  submission = {},
  view = {},
  callback_id = "irrelevant-callback_id",
  response_url = "irrelevant-response_url",
  state = "irrelevant-state",
}: Partial<Payload>): Payload => ({
  type,
  token,
  action_ts,
  team,
  user,
  channel,
  is_enterprise_install,
  enterprise,
  submission,
  view,
  callback_id,
  response_url,
  state,
})