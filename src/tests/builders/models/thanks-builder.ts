import { Thanks } from "../../../models/database/thanks";
import { Id } from "../../../models/slack/id";

export const ThanksBuilder = ({
  anonymous = false,
  createdAt = new Date(),
  from = new Id("irrelevant-from-id"),
  to = new Id("irrelevant-to-id"),
  reason = "irrelevant-reason",
  team = new Id("irrelevant-team-id"),
  where = new Id("irrelevant-where-id"),
}: Partial<Thanks>): Thanks => new Thanks(
  team, 
  from, 
  to, 
  where, 
  reason, 
  anonymous, 
  createdAt
)