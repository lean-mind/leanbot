import { Body } from "../../models/api/body";
import { Slack } from "../../services/slack/slack";
import { ViewThanks } from "../../services/slack/views";

export const thanks = ({ trigger_id }: Body, slack: Slack = new Slack()) => {
  const view = ViewThanks();

  slack.viewsOpen(view, trigger_id)
}
