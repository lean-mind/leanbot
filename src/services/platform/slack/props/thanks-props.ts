import { ThanksProps } from "../../../../actions/thanks/thanks";
import { SlackBody } from "../../../../models/slack/body";
import { ViewGratitudeMessage } from "../views";

export const getSlackThanksProps = (body: SlackBody): ThanksProps => {
  const view = ViewGratitudeMessage();
  const channelId = body.trigger_id;

  return {
    channelId,
    block: view, 
  }
}