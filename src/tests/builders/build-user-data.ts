import { UserData } from "../../models/database/user-data";
import { buildGratitudeData } from "./build-gratitude-data";

export const buildUserData = ({
  id = "irrelevant",
  gratitude = buildGratitudeData({}),
}: Partial<UserData>): UserData => ({
  id,
  gratitude,
});