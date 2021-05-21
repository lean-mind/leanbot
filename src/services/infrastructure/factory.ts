import { Database } from "../database/database";
import { LoggedDatabase } from "../database/mongo/logged-mongo";
import { MongoDB } from "../database/mongo/mongo";
import { Logger } from "../logger/logger";

export class Factory {
  static createRepository = (): Database => new LoggedDatabase(new MongoDB(), new Logger())
}