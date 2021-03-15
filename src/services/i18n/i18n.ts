/* eslint-disable @typescript-eslint/no-var-requires */
import { i18n, InitOptions, StringMap } from "i18next";

const i18next = require('i18next')
const en = require("./translations/en.json")
const es = require("./translations/es.json")
const esCan = require("./translations/es.can.json")

export class I18n {
  private static namespace = "leanbot"
  private static instance: i18n = i18next
  private static options: InitOptions = {
    lng: "es-CAN",
    defaultNS: I18n.namespace,
    resources: {
      "en-US": {
        [I18n.namespace]: en
      },
      "es": {
        [I18n.namespace]: es
      },
      "es-CAN": {
        [I18n.namespace]: esCan
      },
    },
    interpolation: {
      prefix: "${",
      suffix: "}",
      escapeValue: false
    }
  }

  private constructor() {} 

  static getInstance = async (): Promise<I18n> => {
    if (!I18n.instance.isInitialized) {
      await I18n.instance.init(I18n.options)
    }
    return new I18n()
  }

  changeLanguage = async (languageCode: string, translations?: any): Promise<void> => {
    if (translations) {
      I18n.instance.addResourceBundle(languageCode, I18n.namespace, translations)
    }
    await I18n.instance.changeLanguage(languageCode)
  }

  translate = (key: string, values: StringMap = {}): string => I18n.instance.t(key, values)
}