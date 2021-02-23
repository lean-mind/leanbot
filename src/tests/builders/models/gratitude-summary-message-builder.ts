import { GratitudeSummary, GratitudeSummaryMessage } from "../../../models/database/gratitude-message";

export const GratitudeSummaryMessageBuilder = ({
  users = [],
  text = "irrelevant-text",
  isAnonymous = false,
  createdAt = new Date()
}: Partial<GratitudeSummaryMessage>): GratitudeSummaryMessage => ({
  users,
  text,
  isAnonymous,
  createdAt
})