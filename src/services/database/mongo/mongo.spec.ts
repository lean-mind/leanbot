import { MongoClient } from "mongodb"
import { config } from "../../../config"
import { MongoDB } from "./mongo"

jest.mock('mongodb')
jest.mock("../../../config")

describe('Service MongoDB: ', () => {
  const database = "test"
  const instance = new MongoClient(`mongodb://localhost`)
  const mongodb = new MongoDB(instance)

  beforeEach(() => {
    config.mongodb = {
      database, 
      username: "irrelevant-username",
      password: "irrelevant-password",
      port: "irrelevant-port",
    }

    instance.isConnected = jest.fn(() => true)
  })

  it.todo('should save thanks')
  it.todo('should get a list of thanks from last week')
}) 