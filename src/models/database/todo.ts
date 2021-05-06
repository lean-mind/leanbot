import { Id } from "../platform/slack/id";

export class ToDo {
  constructor(
    public user: Id,
    public text: string
  ) { }
}