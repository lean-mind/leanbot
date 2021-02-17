import { PlatformName } from "../../services/platform/platform";

export class Community {
  constructor(
    public id: string,
    public platform: PlatformName,
    public deletedAt?: Date,
  ) { }
}