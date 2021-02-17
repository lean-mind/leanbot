import { JsonData } from "../../json-data"
import { Id } from "../../slack/id"
import { GratitudeMessage } from "../gratitude-message"

export class GratitudeMessageDto {
  private constructor (
    private communityId: string,
    private senderId: string,
    private recipientId: string,
    private channelId: string,
    private text: string,
    private isAnonymous: boolean,
    private createdAtTime: number
  ) {}

  static fromJson(data: JsonData): GratitudeMessageDto {
    return new GratitudeMessageDto(
      data.communityId,
      data.senderId,
      data.recipientId,
      data.channelId,
      data.text,
      data.isAnonymous,
      data.createdAtTime
    )
  }

  toJson(): JsonData {
    return {
      communityId: this.communityId,
      senderId: this.senderId,
      recipientId: this.recipientId,
      channelId: this.channelId,
      text: this.text,
      isAnonymous: this.isAnonymous,
      createdAtTime: this.createdAtTime
    }
  }

  static fromModel(model: GratitudeMessage): GratitudeMessageDto {
    return new GratitudeMessageDto(
      model.communityId,
      model.sender.id,
      model.recipient.id,
      model.channel.id,
      model.text.toString(),
      model.isAnonymous.valueOf(),
      model.createdAt.getTime()
    )
  }

  toModel(): GratitudeMessage {
    return new GratitudeMessage(
      this.communityId,
      new Id(this.senderId),
      new Id(this.recipientId),
      new Id(this.channelId),
      this.text,
      this.isAnonymous,
      new Date(this.createdAtTime),
    )
  }
}