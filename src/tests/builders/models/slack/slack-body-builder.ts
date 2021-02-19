import { SlackBody } from '../../../../models/platform/slack/body';
import { SlackPayloadBuilder } from './slack-payload-builder';

export const SlackBodyBuilder = ({
  teamId = "irrelevant-team-id",
  userId = "irrelevant-user-id",
  triggerId = "irrelevant-trigger-id",
  text = "irrelevant-text",
  externalId = "irrelevant-external-id",
  type = "irrelevant-type",
  recipientsId = ["irrelevant-recipients-id"],
  channelId = "irrelevant-channel-id",
  isAnonymous = false
}): SlackBody => ({
  token: "",
  team_id: teamId,
  team_domain: "",
  enterprise_id: "",
  enterprise_name: "",
  channel_id: "",
  channel_name: "",
  user_id: userId,
  user_name: "",
  command: "",
  text,
  response_url: "",
  trigger_id: triggerId,
  payload: SlackPayloadBuilder({
    teamId,
    userId,
    type,
    view: {
      external_id: externalId,
      state: {
        values: {
          recipients: {
            action: {
              selected_conversations: recipientsId
            }
          },
          channel: {
            action: {
              selected_conversation: channelId
            }
          },
          text: {
            action: {
              value: text
            }
          },
          options: {
            action: {
              selected_options: isAnonymous ? [
                { value: "anonymous" }
              ] : []
            }
          }
        }
      }
    }
  }),
})