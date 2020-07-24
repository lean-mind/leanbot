import admin from 'firebase-admin';
import { config } from './config/config-data';
import { Bot } from './services/bot/bot';
import { onStart } from './actions/on-start';
import { onMessage } from './actions/on-message';
import { onError } from './actions/on-error';
import { API } from './services/api/api';
import { onClose } from './actions/on-close';
import { scheduler } from './scheduler';

admin.initializeApp({
  credential: admin.credential.cert(config.firebase),
  databaseURL: `https://${config.firebase.projectId}.firebaseio.com`,
})

const bot = new Bot();
new API(bot);
scheduler(bot);

bot.onStart(() => onStart(bot))
bot.onMessage((data) => onMessage(bot, data))
bot.onClose((_) => onClose(bot))
bot.onError((data) => onError(bot, data))