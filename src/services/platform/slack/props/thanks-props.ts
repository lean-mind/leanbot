import { ThanksProps } from "../../../../actions/thanks/thanks";
import { removeDuplicates, ThanksConfirmationProps } from "../../../../actions/thanks/thanks-confirmation";
import { SlackBody } from "../../../../models/platform/slack/body";
import { Id } from "../../../../models/platform/slack/id";
import { ViewGratitudeMessage } from "../views";

export const getSlackThanksProps = async (body: SlackBody): Promise<ThanksProps> => {
  const view = await ViewGratitudeMessage()
  const channelId = body.trigger_id

  return {
    channelId,
    block: view, 
  }
}

export const getSlackThanksConfirmationProps = (body: SlackBody): ThanksConfirmationProps => ({
  communityId: body.payload.team.id,
  sender: new Id(body.payload.user.id),
  recipients: body.payload.view.state.values.recipients.action.selected_conversations.filter(removeDuplicates<string>()).map((toId: string) => new Id(toId)),
  channel: new Id(body.payload.view.state.values.channel.action.selected_conversation),
  text: body.payload.view.state.values.text.action.value.split("\n").join("\n>"),
  isAnonymous: body.payload.view.state.values.options.action.selected_options.some(({ value }) => value === "anonymous"),
})