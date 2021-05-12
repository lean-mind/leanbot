import { JsonData } from "../../json-data"
import { Id } from "../../platform/slack/id"
import { ToDo } from "../todo"

export class ToDoDto {
  private constructor(
    private userId: string,
    private text: string,
    private assigneeId: string,
    private id: string,
    private completed: boolean
  ) {}

  static fromJson(data: JsonData): ToDoDto {
    return new ToDoDto(data.userId, data.text, data.assigneeId, data._id, data.completed)
  }

  toJson(): JsonData {
    return {
      userId: this.userId,
      text: this.text,
      assigneeId: this.assigneeId,
      completed: this.completed,
    }
  }

  static fromModel(model: ToDo): ToDoDto {
    return new ToDoDto(model.user.id, model.text, model.assignee.id, model.id, model.completed)
  }

  toModel(): ToDo {
    return new ToDo(new Id(this.userId), this.text, new Id(this.assigneeId), this.id, this.completed)
  }
}
