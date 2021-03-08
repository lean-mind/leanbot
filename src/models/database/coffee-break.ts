import { Id } from './../platform/slack/id';

export class CoffeeBreak {
  constructor(
    public communityId: string,
    public sender: Id,
    public recipient: Id,
    public createdAt: Date,
  ) { }
}
