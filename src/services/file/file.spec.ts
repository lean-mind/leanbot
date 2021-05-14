import { join } from "path"
import { File } from "./file"

jest.mock("fs")

describe("Service File: ", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("fs")

  it("should write in file if exists", () => {
    const message = "irrelevant-message"
    const file = "irrelevant-file.log"
    const fileExpected = join("logs", file)

    fs.existsSync = jest.fn(() => true)

    File.write(message, file)

    expect(fs.appendFileSync).toBeCalledWith(fileExpected, `\n${message}`)
  })

  it("should create and write in file if not exists", () => {
    const message = "irrelevant-message"
    const file = "irrelevant-file.log"
    const fileExpected = join("logs", file)

    fs.existsSync = jest.fn(() => false)

    File.write(message, file)

    expect(fs.writeFileSync).toBeCalledWith(fileExpected, message)
  })

  it("should read file if exists", () => {
    const message1 = "irrelevant-message-1"
    const message2 = "irrelevant-message-2"
    const file = "irrelevant-file.log"
    const fileExpected = join("logs", file)

    fs.existsSync = jest.fn(() => true)
    fs.readFileSync = jest.fn(() => message1 + "\n" + message2)

    const response = File.read(file)

    expect(fs.readFileSync).toBeCalledWith(fileExpected, { encoding: "UTF-8" })
    expect(response).toStrictEqual([message1, message2])
  })
})
