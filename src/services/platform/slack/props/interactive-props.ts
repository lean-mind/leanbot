import { InteractiveProps } from "../../../../actions/interactive"
import { SlackBody } from "../../../../models/platform/slack/body"
import { getSlackButtonAction } from "./button-props"
import { getSlackThanksConfirmationProps } from "./thanks-props"

interface Action {
  getProps: (body: SlackBody) => any
  accept: boolean
}

interface Dictionary<T> {
  [key: string]: T
}

export const getSlackInteractiveProps = async (body: SlackBody): Promise<InteractiveProps> => {
  const mapper: Dictionary<Action> = { // TODO: Pendiente refactor 
    ["thanks-confirmation"]: {
      getProps: getSlackThanksConfirmationProps,
      accept: body.payload.type === "view_submission"
    },
    ["accept-coffee"]: {
      getProps: getSlackButtonAction,
      accept: true
    },
    ["reject-coffee"]: {
      getProps: getSlackButtonAction,
      accept: true
    },
    ["try-again-coffee"]: {
      getProps: getSlackButtonAction,
      accept: true
    },
    ["stop-coffee"]: {
      getProps: getSlackButtonAction,
      accept: true
    }
  }
  
  let actionId = ""
  if (body.payload?.view) {
    actionId = body.payload.view.external_id
  } else if (body.payload?.actions) {
    actionId = body.payload.actions[0].action_id
  }
  const action = mapper[actionId]
  
  return {
    nextStep: actionId,
    accept: action?.accept ?? false,
    data: action?.accept ? action.getProps(body) : {}
  }
}