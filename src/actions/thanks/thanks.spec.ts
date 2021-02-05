import { Slack } from "../../services/slack/slack";
import { ViewThanks } from "../../services/slack/views";
import { BodyBuilder } from "../../tests/builders/api/body-builder";
import { thanks } from "./thanks";

describe('Actions Thanks', () => {
  const slack = new Slack()
  const view = ViewThanks();
  
  it('should open the view in slack', () => {
    const body = BodyBuilder({ trigger_id: "irrelevant-trigger-id" })
    slack.viewsOpen = jest.fn()

    thanks(body, slack)

    expect(slack.viewsOpen).toBeCalledWith(view, body.trigger_id)
  })
})