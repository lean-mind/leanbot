import { Id } from "../platform/slack/id";

export class User {
  constructor(
    public userName: string,
    public userId: Id,
  ) { }
}