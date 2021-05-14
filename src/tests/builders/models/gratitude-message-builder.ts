import { GratitudeMessage } from "../../../models/database/gratitude-message"
import { Id } from "../../../models/platform/slack/id"

export const GratitudeMessageBuilder = ({
  communityId = "irrelevant-community-id",
  sender = new Id("irrelevant-sender-id"),
  recipient = new Id("irrelevant-recipient-id"),
  channel = new Id("irrelevant-channel-id"),
  text = "irrelevant-text",
  isAnonymous = false,
  createdAt = new Date(),
}: Partial<GratitudeMessage>): GratitudeMessage => new GratitudeMessage(
  communityId, 
  sender, 
  recipient, 
  channel, 
  text, 
  isAnonymous, 
  createdAt
)