import { MongoClient } from "mongodb"
import { config } from "../../../config"
import { MongoDB } from "./mongo"

jest.mock('mongodb')
jest.mock("../../../config")

describe('Service MongoDB: ', () => {
  const database = "test"
  const uri = "mongodb://localhost"
  const instance = new MongoClient(uri)
  const mongodb = new MongoDB(instance)

  beforeEach(() => {
    config.database.mongodb = {
      database, 
      uri,
    }

    instance.isConnected = jest.fn(() => true)
  })

  it.todo('should get communities')
  it.todo('should register a community')
  it.todo('should save thanks')
  it.todo('should get a list of thanks from last week')
}) 