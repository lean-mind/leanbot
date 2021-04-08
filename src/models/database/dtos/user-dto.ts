import { JsonData } from './../../json-data';
import { Id } from '../../platform/slack/id';
import { User } from "../user";

export class UserDto {
  private constructor (
    private userId: Id,
    private userName: string,
  ) { }

  static fromJson(data: JsonData): UserDto {
    return new UserDto(
      data.userId,
      data.userName
    )
  }

  toJson(): JsonData {
    return {
      userId: this.userId,
      userName: this.userName
    }
  }

  static fromModel(model: User): UserDto {
    return new UserDto(
      model.userId,
      model.userName
    )
  }
}