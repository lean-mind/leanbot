import dotenv from 'dotenv';
import serviceAccount from './service-account-key.json';

dotenv.config();

interface Config {
  slack: SlackConfig;
  firebase: FirebaseConfig;
}

interface SlackConfig {
  readonly token: string;
  readonly name: string;
  readonly disconnect: boolean;
}

interface FirebaseConfig {
  readonly privateKey: string;
  readonly projectId: string;
  readonly clientEmail: string;
}

export const config: Config = {
  slack: {
    token: process.env.BOT_TOKEN || "xoxb-unknown",
    name: process.env.BOT_NAME || "unknown",
    disconnect: process.env.BOT_DISCONNECT === "true" || false,
  },
  firebase: {
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
  }
};