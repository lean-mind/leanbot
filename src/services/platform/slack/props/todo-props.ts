import { SlackBody } from "../../../../models/platform/slack/body";
import { TodoProps } from "../../../../actions/todo/todo";

export const getSlackTodoProps = async (body: SlackBody): Promise<TodoProps> => ({
  userId: body.user_id,
  text: body.text
})