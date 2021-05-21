import { Id } from "../platform/slack/id"

export class ToDo {
  constructor(
    public user: Id,
    public text: string,
    public assignee: Id = user,
    public id: string = "",
    public completed: boolean = false,
  ) {}
}
