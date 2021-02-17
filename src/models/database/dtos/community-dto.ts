import { PlatformName } from "../../../services/platform/platform"
import { JsonData } from "../../json-data"
import { Community } from "../community"

export class CommunityDto {
  private constructor (
    private id: string,
    private platform: PlatformName,
    private deletedAtTime?: number,
  ) {}

  static fromJson(data: JsonData): CommunityDto {
    return new CommunityDto(
      data.id,
      data.platform,
      data.deletedAt
    )
  }

  toJson(): JsonData {
    return {
      id: this.id,
      platform: this.platform,
      deletedAtTime: this.deletedAtTime,
    }
  }

  static fromModel(model: Community): CommunityDto {
    return new CommunityDto(
      model.id,
      model.platform,
      model.deletedAt?.getTime(),
    )
  }

  toModel(): Community {
    return new Community(
      this.id,
      this.platform,
      this.deletedAtTime ? new Date(this.deletedAtTime) : undefined,
    )
  }
}