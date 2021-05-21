import { TodoProps } from "../../../actions/todo/todo"

export const TodoPropsBuilder = ({
  userId = "irrelevant-user-id",
  text = "irrelevant-text",
}: Partial<TodoProps>): TodoProps => ({
  userId,
  text,
})
