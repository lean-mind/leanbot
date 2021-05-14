import { CoffeeBreak } from "./../../../models/database/coffee-break"
import { Id } from "../../../models/platform/slack/id"

export const CoffeeBreakBuilder = ({
  communityId = "irrelevant-community-id",
  sender = new Id("irrelevant-sender-id"),
  recipient = new Id("irrelevant-recipient-id"),
  createdAt = new Date(),
}: Partial<CoffeeBreak>): CoffeeBreak => new CoffeeBreak(
  communityId, 
  sender, 
  recipient, 
  createdAt
)