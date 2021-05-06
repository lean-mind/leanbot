import { JsonData } from "../../json-data";
import { Id } from "../../platform/slack/id";
import { ToDo } from "../todo";

export class ToDoDto {
  private constructor (
    private userId: string,
    private text: string,
  ) { }

  static fromJson(data: JsonData): ToDoDto {
    return new ToDoDto(
      data.userId,
      data.text,
    )
  }

  toJson(): JsonData {
    return {
      userId: this.userId,
      text: this.text,
    }
  }

  static fromModel(model: ToDo): ToDoDto {
    return new ToDoDto(
      model.user.id,
      model.text,
    )
  }

  toModel(): ToDo {
    return new ToDo(
      new Id(this.userId),
      this.text,
    )
  }
}