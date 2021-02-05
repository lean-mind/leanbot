import { Id } from "../slack/id";

export class Thanks {
  constructor(
    public team: Id,
    public from: Id,
    public to: Id,
    public where: Id,
    public reason: String,
    public anonymous: Boolean,
    public createdAt: Date,
  ) { }
}

export interface SimpleThanks {
  users: Id[],
  reason: String,
  anonymous: Boolean,
  date: Date,
}

export interface ThanksSummary {
  user: Id,
  given: SimpleThanks[],
  received: SimpleThanks[],
}