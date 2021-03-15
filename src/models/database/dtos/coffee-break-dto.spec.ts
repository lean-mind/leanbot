import { CoffeeBreak } from '../coffee-break';
import { Id } from "../../platform/slack/id";
import { CoffeeBreakDto } from './coffee-break-dto';

describe('DTO CoffeeBreak', () => {
  it('should transform to json', () => {
    const model = new CoffeeBreak(
      "communityId",
      new Id("senderId"),
      new Id("recipientId"),
      new Date(),
    )
    const jsonExpected = {
      communityId: model.communityId,
      senderId: model.sender.id,
      recipientId: model.recipient.id,
      createdAtTime: model.createdAt.getTime()
    }

    expect(CoffeeBreakDto.fromModel(model).toJson()).toStrictEqual(jsonExpected)
  })

  it('should transform to model', () => {
    const json = {
      communityId: "communityId",
      senderId: "senderId",
      recipientId: "recipientId",
      createdAtTime: Date.now()
    }
    const modelExpected = new CoffeeBreak(
      json.communityId,
      new Id(json.senderId),
      new Id(json.recipientId),
      new Date(json.createdAtTime),
    );

    expect(CoffeeBreakDto.fromJson(json).toModel()).toStrictEqual(modelExpected)
  })
})