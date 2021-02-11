import { Community } from "../../models/database/community";
import { Thanks } from "../../models/database/thanks";

export interface DatabaseResponse {
  ok: boolean
  data?: any
  error?: any
}

export interface Database {
  getCommunities: () => Promise<Community[]>
  saveThanks: (thanksList: Thanks[]) => Promise<void>
  getThanksFromLastWeek: () => Promise<Thanks[]>
}
