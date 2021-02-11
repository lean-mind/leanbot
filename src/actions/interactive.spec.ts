import { Platform } from "../services/platform/platform"
import { Slack } from "../services/platform/slack/slack"
import { InteractivePropsBuilder } from "../tests/builders/actions/interactive-props-builder"
import { interactive, InteractiveProps } from "./interactive"
import { thanksConfirmation } from "./thanks"

jest.mock('./thanks')
jest.mock('../services/platform/slack/slack')

describe('Actions Interactive', () => {
  const platform: Platform = new Slack()

  it('without matching', () => {
    const props: InteractiveProps = InteractivePropsBuilder({})

    interactive(platform, props)

    expect(thanksConfirmation).not.toBeCalled()
  })

  it('matching with thanks confirmation', () => {
    const props: InteractiveProps = InteractivePropsBuilder({
      nextStep: "thanks-confirmation"
    })

    interactive(platform, props)

    expect(thanksConfirmation).toBeCalledWith(platform, props.data)
  })
})