import { Team } from "./team";
import { Channel } from "./channel";
import { Group } from "./group";
import { User } from "./user";
import { Direct } from "./direct";
import { UserBot } from "./user_bot";

export interface Response {
  ok: boolean,
  url: string;
  self: any,
  team: Team,
  channels: Channel[],
  groups: Group[],
  ims: Direct[],
  users: User[],
  bots: UserBot[],

  accept_tos_url: string,
  latest_event_ts: string,
  cache_ts: any;
  read_only_channels: any[];
  non_threadable_channels: any[];
  thread_only_channels: any[];
  can_manage_shared_channels: boolean;
  subteams: any;
  dnd: any,
  cache_version: string,
  cache_ts_version: string,
  is_europe: boolean;

  error: any
}