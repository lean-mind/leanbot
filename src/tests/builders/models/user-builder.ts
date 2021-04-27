import { User } from "../../../models/database/user";

export const UserBuilder = ({
  userId= "irrelevant-user-id",
  userName = "irrelevant-user-name"
}: User): User => new User(
  userId,
  userName
)