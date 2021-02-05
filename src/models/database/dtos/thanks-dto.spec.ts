import { Id } from "../../slack/id";
import { Thanks } from "../thanks"
import { ThanksDto } from "./thanks-dto"

describe('DTO Thanks', () => {
  it('should transform to json', () => {
    const model = new Thanks(
      new Id("teamId"),
      new Id("fromId"),
      new Id("toId"),
      new Id("whereId"),
      "reason",
      false,
      new Date(),
    );
    const jsonExpected = {
      teamId: model.team.id,
      fromId: model.from.id,
      toId: model.to.id,
      whereId: model.where.id,
      reason: model.reason,
      anonymous: model.anonymous,
      createdAtTime: model.createdAt.getTime()
    }

    expect(ThanksDto.fromModel(model).toJson()).toStrictEqual(jsonExpected)
  })

  it('should transform to model', () => {
    const json = {
      teamId: "teamId",
      fromId: "fromId",
      toId: "toId",
      whereId: "whereId",
      reason: "reason",
      anonymous: false,
      createdAtTime: Date.now()
    }
    const modelExpected = new Thanks(
      new Id(json.teamId),
      new Id(json.fromId),
      new Id(json.toId),
      new Id(json.whereId),
      json.reason,
      json.anonymous,
      new Date(json.createdAtTime),
    );

    expect(ThanksDto.fromJson(json).toModel()).toStrictEqual(modelExpected)
  })
})