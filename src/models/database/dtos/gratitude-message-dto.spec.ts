import { Id } from "../../platform/slack/id";
import { GratitudeMessage } from "../gratitude-message"
import { GratitudeMessageDto } from "./gratitude-message-dto"

describe('DTO GratitudeMessage', () => {
  it('should transform to json', () => {
    const model = new GratitudeMessage(
      "communityId",
      new Id("senderId"),
      new Id("recipientId"),
      new Id("channelId"),
      "text",
      false,
      new Date(),
    )
    const jsonExpected = {
      communityId: model.communityId,
      senderId: model.sender.id,
      recipientId: model.recipient.id,
      channelId: model.channel.id,
      text: model.text,
      isAnonymous: model.isAnonymous,
      createdAtTime: model.createdAt.getTime()
    }

    expect(GratitudeMessageDto.fromModel(model).toJson()).toStrictEqual(jsonExpected)
  })

  it('should transform to model', () => {
    const json = {
      communityId: "communityId",
      senderId: "senderId",
      recipientId: "recipientId",
      channelId: "channelId",
      text: "text",
      isAnonymous: false,
      createdAtTime: Date.now()
    }
    const modelExpected = new GratitudeMessage(
      json.communityId,
      new Id(json.senderId),
      new Id(json.recipientId),
      new Id(json.channelId),
      json.text,
      json.isAnonymous,
      new Date(json.createdAtTime),
    );

    expect(GratitudeMessageDto.fromJson(json).toModel()).toStrictEqual(modelExpected)
  })
})