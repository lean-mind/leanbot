import { MongoClient } from "mongodb"
import { config } from "../../../config"
import { MongoDB } from "./mongo"

describe('Service MongoDB: ', () => {
  const mongodbConfig = config.database.mongodb
  const database = "test"
  let db: MongoDB
  
  beforeAll(() => {
    config.database.mongodb = {
      database,
      uri: mongodbConfig.uri
    }
    db = new MongoDB()
    // poblar la bd de test
  })
  
  beforeEach(() => {
  })

  afterAll(() => {
    // vaciar la bd de test
    config.database.mongodb = mongodbConfig
  })

  it.todo('should retrieve all registered communities')
  it.todo('should register a community')
  it.todo('should save gratitude messages')
  it.todo('should retrieve all gratitude messages')
  it.todo('should retrieve gratitude messages from a given number of days')
}) 