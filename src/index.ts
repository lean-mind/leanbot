import admin from 'firebase-admin';
import { config } from './config/config-data';
import { Bot } from './services/bot/bot';
import { onStart } from './actions/on-start';
import { onMessage } from './actions/on-message';
import { onError } from './actions/on-error';

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
  databaseURL: `https://${config.firebase.projectId}.firebaseio.com`,
})

const bot = new Bot();

bot.onStart(() => onStart(bot))
bot.onMessage((data) => onMessage(bot, data))
bot.onError((data) => onError(data))