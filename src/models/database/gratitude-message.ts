import { Id } from "../slack/id";

export class GratitudeMessage {
  constructor(
    public communityId: string,
    public sender: Id,
    public recipient: Id,
    public channel: Id,
    public text: String,
    public isAnonymous: Boolean,
    public createdAt: Date,
  ) { }
}

export interface GratitudeSummaryMessage {
  users: Id[],
  text: String,
  isAnonymous: Boolean,
  createdAt: Date,
}

export interface GratitudeSummary {
  communityId: string,
  user: Id,
  sent: GratitudeSummaryMessage[],
  received: GratitudeSummaryMessage[],
}

export interface GratitudeMessageOptions {
  days?: number
}