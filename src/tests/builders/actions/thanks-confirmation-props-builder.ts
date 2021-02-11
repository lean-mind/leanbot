import { ThanksConfirmationProps } from "../../../actions/thanks/thanks-confirmation";
import { Id } from "../../../models/slack/id";

export const ThanksConfirmationPropsBuilder = ({
  team = "irrelevant-team-id",
  from = "irrelevant-from-id",
  recipients = ["irrelevant-recipient-id"],
  reason = "irrelevant-reason",
  anonymous = false,
  where = "irrelevant-where-id",
}): ThanksConfirmationProps => ({
  team: new Id(team),
  from: new Id(from),
  recipients: recipients.map((recipient) => new Id(recipient)),
  reason,
  anonymous,
  where: new Id(where),
})