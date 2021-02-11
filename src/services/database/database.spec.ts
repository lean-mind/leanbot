import { Thanks } from "../../models/database/thanks"
import { ThanksBuilder } from "../../tests/builders/models/thanks-builder"
import { MongoDB } from "./mongo/mongo"
import { Database } from "./database"

jest.mock('./mongo/mongo')

describe('Service Database:', () => {
  const database: Database = new MongoDB()

  it('saveThanks method should called from the database', async () => {
    const thanksList: Thanks[] = [ThanksBuilder({})]

    await database.saveThanks(thanksList)

    expect(database.saveThanks).toBeCalledWith(thanksList)
  })

  it('getThanksFromLastWeek method should called from the database', async () => {
    const thanksList: Thanks[] = [ThanksBuilder({})]
    database.getThanksFromLastWeek = jest.fn(async () => thanksList)

    const response = await database.getThanksFromLastWeek()

    expect(database.getThanksFromLastWeek).toBeCalled()
    expect(response).toBe(thanksList)
  })
})