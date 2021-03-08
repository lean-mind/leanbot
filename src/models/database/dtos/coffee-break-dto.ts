import { CoffeeBreak } from './../coffee-break';
import { JsonData } from './../../json-data';
import { Id } from '../../platform/slack/id';

export class CoffeeBreakDto {
  private constructor (
    private communityId: string,
    private senderId: string,
    private recipientId: string,
    private createdAtTime: number,
  ) { }

  static fromJson(data: JsonData): CoffeeBreakDto {
    return new CoffeeBreakDto(
      data.communityId,
      data.senderId,
      data.recipientId,
      data.createdAtTime,
    )
  }

  toJson(): JsonData {
    return {
      communityId: this.communityId,
      senderId: this.senderId,
      recipientId: this.recipientId,
      createdAtTime: this.createdAtTime,
    }
  }

  static fromModel(model: CoffeeBreak): CoffeeBreakDto {
    return new CoffeeBreakDto(
      model.communityId,
      model.sender.id,
      model.recipient.id,
      model.createdAt.getTime()
    )
  }

  toModel(): CoffeeBreak {
    return new CoffeeBreak(
      this.communityId,
      new Id(this.senderId),
      new Id(this.recipientId),
      new Date(this.createdAtTime)
    )
  }
}