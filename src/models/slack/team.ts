export interface Team {
  id: string;
  name: string;
  email_domain: string;
  domain: string;
  msg_edit_window_mins: number;
  prefers: any;
  icon: any;
  over_storage_limit: boolean;
  messages_count: number;
  plan: string;
  onboarding_channel_id: string;
  date_create: any;
  limit_ts: number;
  avatar_base_url: string;
}

export class TeamNull implements Team {
  id: string = "";
  name: string = "";
  email_domain: string = "";
  domain: string = "";
  msg_edit_window_mins: number = 0;
  prefers: any = "";
  icon: any = "";
  over_storage_limit: boolean = false;
  messages_count: number = 0;
  plan: string = "";
  onboarding_channel_id: string = "";
  date_create: any = "";
  limit_ts: number = 0;
  avatar_base_url: string = "";
}