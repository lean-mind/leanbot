import { ToDo } from "../todo";
import { ToDoDto } from "./to-do-dto";
import { Id } from "../../platform/slack/id";

describe('DTO ToDo', () => {
  it('should transform to json', () => {
    const model = new ToDo(new Id("irrelevant-user-id"), "irrelevant-todo-text")

    const jsonExpected = {
      userId: model.user.id,
      text: model.text
    }

    expect(ToDoDto.fromModel(model).toJson()).toStrictEqual(jsonExpected)
  })

  it('should transform to model', () => {
    const json = {
      userId: "irrelevant-user-id",
      text: "irrelevant-todo-text"
    }

    const modelExpected = new ToDo(new Id(json.userId), json.text)

    expect(ToDoDto.fromJson(json).toModel()).toStrictEqual(modelExpected)
  })
})