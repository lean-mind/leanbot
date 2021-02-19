import { InteractiveProps } from "../../../../actions/interactive"
import { SlackBody } from "../../../../models/platform/slack/body"
import { getSlackThanksConfirmationProps } from "./thanks-props"

interface Action {
  getProps: (body: SlackBody) => any
  accept: boolean
}

interface Dictionary<T> {
  [key: string]: T
}

export const getSlackInteractiveProps = (body: SlackBody): InteractiveProps | undefined => {
  const mapper: Dictionary<Action> = {
    ["thanks-confirmation"]: {
      getProps: getSlackThanksConfirmationProps,
      accept: body.payload.type === "view_submission"
    }
  }
  const actionId = body.payload?.view?.external_id
  const action = mapper[actionId]

  if (action?.getProps && action.accept) {
    return {
      nextStep: actionId,
      accept: action.accept,
      data: action.getProps(body) ?? {}
    }
  }
}