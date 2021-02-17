import { ThanksConfirmationProps } from "../../../actions/thanks/thanks-confirmation";
import { Id } from "../../../models/slack/id";

export const ThanksConfirmationPropsBuilder = ({
  communityId = "irrelevant-community-id",
  sender = "irrelevant-sender-id",
  recipients = ["irrelevant-recipient-id"],
  text = "irrelevant-text",
  isAnonymous = false,
  channel = "irrelevant-channel-id",
}): ThanksConfirmationProps => ({
  communityId,
  sender: new Id(sender),
  recipients: recipients.map((recipient) => new Id(recipient)),
  text,
  isAnonymous,
  channel: new Id(channel),
})