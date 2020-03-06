import { UserProfile } from "./user-profile";

export interface User {
  id: string,
  name: string,
  team_id: string,
  deleted: boolean,
  color: string,
  real_name: string,
  tz: string,
  tz_label: string,
  tz_offset: number,
  profile: UserProfile,
  is_admin: boolean,
  is_owner: boolean,
  is_primary_owner: boolean,
  is_restricted: boolean,
  is_ultra_restricted: boolean,
  is_bot: boolean,
  is_app_user: boolean,
  updated: any,
  presence: string,
}