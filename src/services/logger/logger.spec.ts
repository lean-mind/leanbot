import { File } from "../file/file"
import { getDateFormatted, LogFiles, Logger } from "./logger"

jest.mock("../file/file")

describe('Service Logger: ', () => {
  let info: any
  let error: any
  let now: any
  const date = new Date(1990, 12, 31)

  beforeEach(() => {
    info = jest.spyOn(console, "info").mockImplementation(() => undefined)
    error = jest.spyOn(console, "error").mockImplementation(() => undefined)
    now = jest.spyOn(Date, "now").mockImplementation(() => date.getTime())
  })

  afterEach(() => {
    info.mockReset()
    error.mockReset()
    now.mockReset()
  })

  describe('should print info in console and save in file', () => {
    it('log', () => {
      const message = "irrelevant"
      const messageExpected = `${getDateFormatted(date)} ${message}`
      Logger.log(message)
  
      expect(info).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.log)
    })

    it('onApiStart', () => {
      const port = 80
      const messageExpected = `${getDateFormatted(date)} API started in port ${port}`
      Logger.onApiStart(port)
  
      expect(info).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.log)
    })

    it('onScheduleStart', () => {
      const messageExpected = `${getDateFormatted(date)} Scheduler started`
      Logger.onScheduleStart()
  
      expect(info).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.log)
    })
  })

  describe('should print error in console and save in file', () => {
    const errorToTest = Error("Irrelevant error")
    
    it('onError', () => {
      const messageExpected = `${getDateFormatted(date)} Oops! There was an error: ` + JSON.stringify(errorToTest)
      Logger.onError(errorToTest)
  
      expect(error).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.error)
    })
    
    it('onDbError', () => {
      const messageExpected = `${getDateFormatted(date)} Oops! There was an error writing or reading database: ` + JSON.stringify(errorToTest)
      Logger.onDBError(errorToTest)
  
      expect(error).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.error)
    })
    
    it('onFileReadError', () => {
      const file = "irrelevant-file.log"
      const messageExpected = `${getDateFormatted(date)} Oops! There was an error reading ${file} file: ` + JSON.stringify(errorToTest)
      Logger.onFileReadError(file, errorToTest)
  
      expect(error).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.error)
    })
    
    it('onFileWriteError', () => {
      const file = "irrelevant-file.log"
      const messageExpected = `${getDateFormatted(date)} Oops! There was an error writing ${file} file: ` + JSON.stringify(errorToTest)
      Logger.onFileWriteError(file, errorToTest)
  
      expect(error).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.error)
    })
    
    it('onMissingTranslation', () => {
      const file = "irrelevant-file.log"
      const type = "irrelevant-type"
      const key = "irrelevant-key"
      const messageExpected = `${getDateFormatted(date)} Oops! There was an error in ${file} file: { "${type}": { "${key}": "MISSING TRANSLATION" } }`
      Logger.onMissingTranslation(file, type, key)
  
      expect(error).toBeCalledWith(messageExpected)
      expect(File.write).toBeCalledWith(messageExpected, LogFiles.error)
    })
  })
}) 