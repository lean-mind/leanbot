import { InteractiveProps } from "../../../../actions/interactive"
import { removeDuplicates, ThanksConfirmationProps } from "../../../../actions/thanks/thanks-confirmation"
import { SlackBody } from "../../../../models/slack/body"
import { Id } from "../../../../models/slack/id"

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
      getProps: getThanksConfirmationProps,
      accept: body.payload.type === "view_submission"
    }
  }
  const actionId = body.payload?.view?.external_id
  const action = mapper[actionId]

  if (action.getProps && action.accept) {
    return {
      nextStep: actionId,
      accept: action.accept,
      data: action.getProps(body) ?? {}
    }
  }
}

const getThanksConfirmationProps = (body: SlackBody): ThanksConfirmationProps => ({
  team: new Id(body.payload.team.id),
  from: new Id(body.payload.user.id),
  recipients: body.payload.view.state.values.recipients.action.selected_conversations.filter(removeDuplicates<string>()).map((toId: string) => new Id(toId)),
  reason: body.payload.view.state.values.reason.action.value.split("\n").join("\n>"),
  anonymous: body.payload.view.state.values.options.action.selected_options.some(({ value }) => value === "anonymous"),
  where: new Id(body.payload.view.state.values.where.action.selected_conversation),
})