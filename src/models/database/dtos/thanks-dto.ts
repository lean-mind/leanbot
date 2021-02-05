import { JsonData } from "../../json-data"
import { Id } from "../../slack/id"
import { Thanks } from "../thanks"

export class ThanksDto {
  private constructor (
    private teamId: string,
    private fromId: string,
    private toId: string,
    private whereId: string,
    private reason: string,
    private anonymous: boolean,
    private createdAtTime: number
  ) {}

  static fromJson(data: JsonData): ThanksDto {
    return new ThanksDto(
      data.teamId,
      data.fromId,
      data.toId,
      data.whereId,
      data.reason,
      data.anonymous,
      data.createdAtTime
    )
  }

  toJson(): JsonData {
    return {
      teamId: this.teamId,
      fromId: this.fromId,
      toId: this.toId,
      whereId: this.whereId,
      reason: this.reason,
      anonymous: this.anonymous,
      createdAtTime: this.createdAtTime
    }
  }

  static fromModel(model: Thanks): ThanksDto {
    return new ThanksDto(
      model.team.id,
      model.from.id,
      model.to.id,
      model.where.id,
      model.reason.toString(),
      model.anonymous.valueOf(),
      model.createdAt.getTime()
    )
  }

  toModel(): Thanks {
    return new Thanks(
      new Id(this.teamId),
      new Id(this.fromId),
      new Id(this.toId),
      new Id(this.whereId),
      this.reason,
      this.anonymous,
      new Date(this.createdAtTime),
    )
  }
}