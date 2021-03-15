import { SlackPayload } from "../../../../models/platform/slack/payload";

export const SlackPayloadBuilder = ({
  teamId = "irrelevant-team-id",
  userId = "irrelevant-user-id",
  type = "irrelevant-type",
  view,
  actions
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
  view: view ? view : undefined,
  callback_id: "",
  response_url: "",
  state: "",
  actions: actions ? actions : undefined
})