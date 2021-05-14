import { Id } from "../platform/slack/id"

export class GratitudeMessage {
  constructor(
    public communityId: string,
    public sender: Id,
    public recipient: Id,
    public channel: Id,
    public text: string,
    public isAnonymous: boolean,
    public createdAt: Date,
  ) { }
}

export interface GratitudeSummaryMessage {
  users: Id[],
  text: string,
  isAnonymous: boolean,
  createdAt: Date,
}

export interface GratitudeSummary {
  communityId: string,
  user: Id,
  sent: GratitudeSummaryMessage[],
  received: GratitudeSummaryMessage[],
}