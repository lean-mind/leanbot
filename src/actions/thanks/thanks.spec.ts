import { Platform } from "../../services/platform/platform";
import { Slack } from "../../services/platform/slack/slack";
import { ThanksPropsBuilder } from "../../tests/builders/actions/thanks-props-builder";
import { thanks, ThanksProps } from "./thanks";

describe('Actions Thanks', () => {
  const platform: Platform = Slack.getInstance()
    
  it('should open interactive in platform', () => {
    const props: ThanksProps = ThanksPropsBuilder({})
    platform.sendMessage = jest.fn() 

    thanks(platform, props)

    expect(platform.sendMessage).toBeCalledWith(props.channelId, props.block)
  })
})