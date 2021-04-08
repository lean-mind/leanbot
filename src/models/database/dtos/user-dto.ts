import { User } from "../user";
import { JsonData } from "../../json-data";

export class UserDto {
  private constructor (
    private userId: string,
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