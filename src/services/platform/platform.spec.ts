import { Platform, PlatformName } from "./platform"
import { Slack } from "./slack/slack"

describe("Service Platform:", () => {
  it("should provide a Slack platform", () => {
    const platform = Platform.getInstance("slack")
    expect(platform).toBeInstanceOf(Slack)
  })

  it("should not accept other platform names", () => {
    const getInstance = () =>
      Platform.getInstance("another-platform" as PlatformName)
    expect(getInstance).toThrow(Error)
  })
})
