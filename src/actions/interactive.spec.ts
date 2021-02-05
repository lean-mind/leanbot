import { Body } from "../models/api"
import { BodyBuilder } from "../tests/builders/api/body-builder"
import { PayloadBuilder } from "../tests/builders/api/payload-builder"
import { interactive } from "./interactive"
import { thanksConfirmation } from "./thanks"

jest.mock('./thanks')

describe('Actions Interactive', () => {
  it('without matching', () => {
    const body: Body = BodyBuilder({})

    interactive(body)

    expect(thanksConfirmation).not.toBeCalled()
  })

  it('matching with thanks confirmation', () => {
    const body: Body = BodyBuilder({
      payload: PayloadBuilder({
        type: "view_submission",
        view: {
          external_id: "thanks-confirmation"
        }
      })
    })

    interactive(body)

    expect(thanksConfirmation).toBeCalledWith(body.payload)
  })
})