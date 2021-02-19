import { SlackPayload } from "../../../../models/platform/slack/payload";

export const SlackPayloadBuilder = ({
  teamId = "irrelevant-team-id",
  userId = "irrelevant-user-id",
  view = {},
  type = "irrelevant-type"
}): SlackPayload => ({
  type,
  token: "",
  action_ts: "",
  team: {
    id: teamId,
    domain: "",
  },
  user: {
    id: userId,
    name: "",
  },
  channel: {
    id: "",
    name: "",
  },
  is_enterprise_install: "",
  enterprise: "",
  submission: {},
  view,
  callback_id: "",
  response_url: "",
  state: "",
})