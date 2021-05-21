import { Id } from "../../../models/platform/slack/id";
import { ToDo } from "../../../models/database/todo";

export const ToDoBuilder = ({
  user = new Id("irrelevant-user-id"),
  text = "irrelevant-todo-text",
}: Partial<ToDo>): ToDo => new ToDo(
  user,
  text
)