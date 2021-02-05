import { Thanks } from "../../models/database/thanks";
import { MongoDB } from "./mongo/mongo";

export interface DatabaseResponse {
  ok: boolean
  data?: any
  error?: any
}

export interface DatabaseInstance {
  saveThanks: (thanksList: Thanks[]) => Promise<void>
  getThanksFromLastWeek: () => Promise<Thanks[]>
}

export class Database {
  constructor(
    private instance: DatabaseInstance = new MongoDB()
  ) {}

  async saveThanks(thanksList: Thanks[]): Promise<void> {
    await this.instance.saveThanks(thanksList)
  }

  async getThanksFromLastWeek(): Promise<Thanks[]> {
    return await this.instance.getThanksFromLastWeek()
  }
}