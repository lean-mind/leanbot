interface Submission {
  [key: string]: string
}

export interface View {
  [key: string]: any,
}

export interface SlackPayload {
  type: string,
  token: string,
  action_ts: string,
  team: {
    id: string,
    domain: string,
  },
  user: {
    id: string,
    name: string,
  },
  channel: {
    id: string,
    name: string,
  },
  is_enterprise_install: string,
  enterprise: string,
  submission: Submission,
  view?: View,
  container?: any,
  callback_id: string,
  response_url: string,
  state: string,
  actions: SlackAction[]
}

interface SlackAction {
  type: string,
  action_id: string,
  value: string
}