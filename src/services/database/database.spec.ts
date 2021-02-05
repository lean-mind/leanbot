import { Thanks } from "../../models/database/thanks"
import { ThanksBuilder } from "../../tests/builders/models/thanks-builder"
import { MongoDB } from "./mongo/mongo"
import { Database, DatabaseInstance } from "./database"

jest.mock('./mongo/mongo')

describe('Service Database:', () => {
  const instance: DatabaseInstance = new MongoDB()
  const database = new Database(instance)

  it('saveThanks method should called from the instance', async () => {
    const thanksList: Thanks[] = [ThanksBuilder({})]

    await database.saveThanks(thanksList)

    expect(instance.saveThanks).toBeCalledWith(thanksList)
  })

  it('getThanksFromLastWeek method should called from the instance', async () => {
    const thanksList: Thanks[] = [ThanksBuilder({})]
    instance.getThanksFromLastWeek = jest.fn(async () => thanksList)

    const response = await database.getThanksFromLastWeek()

    expect(instance.getThanksFromLastWeek).toBeCalled()
    expect(response).toBe(thanksList)
  })
})