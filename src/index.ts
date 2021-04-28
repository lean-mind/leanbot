import { httpsApp } from './services/api/api'
import { scheduler } from './scheduler'
import { config } from "./config";
import { Logger } from "./services/logger/logger";

const port: number = parseInt(config.apiPort)
httpsApp.listen(port, () => Logger.onApiStart(port))

scheduler()

