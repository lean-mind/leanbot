import { Database, DatabaseName } from "./database"
import { MongoDB } from "./mongo/mongo"

jest.mock('./mongo/mongo')

describe('Service Database:', () => {
  it('should make MongoDB by default', () => {
    const database = Database.make()
    expect(database).toBeInstanceOf(MongoDB)
  })

  it('should make MongoDB', () => {
    const database = Database.make("mongo")
    expect(database).toBeInstanceOf(MongoDB)
  })

  it('should not accept other database names', () => {
    const make = () => Database.make("anotherdb" as DatabaseName)
    expect(make).toThrow(Error)
  })
})