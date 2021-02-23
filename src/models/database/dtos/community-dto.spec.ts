import { PlatformName } from "../../../services/platform/platform"
import { Community } from "../community"
import { CommunityDto } from "./community-dto"

describe('DTO Community', () => {
  it('should transform data to JSON', () => {
    const model = new Community("communityId", "slack", new Date(2020, 3, 14))

    const jsonExpected = {
      id: model.id,
      platform: model.platform,
      deletedAtTime: model.deletedAt?.getTime()
    }

    expect(CommunityDto.fromModel(model).toJson()).toStrictEqual(jsonExpected)
  })

  it('should transform data to model', () => {
    const json = {
      id: "communityId",
      platform: "slack" as PlatformName,
      deletedAtTime: new Date(2020, 3, 14).getTime()
    }

    const modelExpected = new Community(json.id, json.platform, new Date(json.deletedAtTime))

    expect(CommunityDto.fromJson(json).toModel()).toStrictEqual(modelExpected)
  })
})