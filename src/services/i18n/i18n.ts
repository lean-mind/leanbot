import i18next from "i18next";
import { i18n, InitOptions, StringMap } from "i18next";
const esCan = require("./translations/es.can.json")
const es = require("./translations/es.json")
const en = require("./translations/en.json")

// TODO: create coffee roulette texts 
export class I18n {
  private static instance: i18n = i18next
  private static options: InitOptions = {
    debug: true,
    lng: "es-can",
    resources: {
      "es-can": esCan,
      es,
      en
    },
    interpolation: {
      prefix: "${",
      suffix: "}" 
    }
  }

  private constructor() {} 

  static getInstance = async (): Promise<I18n> => {
    if (!I18n.instance.isInitialized) {
      await I18n.instance.init(I18n.options)
    }
    return new I18n()
  }

  translate = (key: string, values: StringMap = {}): string => I18n.instance.t(key, values)
}