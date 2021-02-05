import { Payload } from "../../../models/api";
import { PayloadBuilder } from "../api/payload-builder";

export const ThanksPayloadBuilder = ({
  team = "T-irrelevant-team-id",
  from = "U- irrelevant-from-id",
  recipients = ["U-irrelevant-to-id-1", "C-irrelevant-to-id-2"],
  reason = "irrelevant-reason",
  anonymous = false,
  where = "",
}): Payload => PayloadBuilder({
  team: { id: team, domain: "team-domain"},
  user: { id: from, name: "user-name" },
  view: {
    state: {
      values: {
        recipients: {
          action: {
            selected_conversations: recipients
          }
        },
        reason: {
          action: {
            value: reason
          }
        },
        options: {
          action: {
            selected_options: [
              {
                value: anonymous ? "anonymous" : ""
              }
            ]
          }
        },
        where: {
          action: {
            selected_conversation: where.length === 0 ? undefined : where
          }
        }
      }
    }
  }
})