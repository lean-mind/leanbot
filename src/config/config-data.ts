import dotenv from 'dotenv';
import serviceAccount from './service-account-key.json';

dotenv.config();

interface Config {
  apiPort: string;
  slack: SlackConfig;
  firebase: FirebaseConfig;
}

interface SlackConfig {
  readonly token: string;
  readonly name: string;
  readonly disconnect: boolean;
  readonly signingSecret: string;
}

interface FirebaseConfig {
  readonly privateKey: string;
  readonly projectId: string;
  readonly clientEmail: string;
}

export const config: Config = {
  apiPort: process.env.API_PORT || "5051",
  slack: {
    token: process.env.BOT_TOKEN || "xoxb-unknown",
    name: process.env.BOT_NAME || "unknown",
    disconnect: process.env.BOT_DISCONNECT === "true" || false,
    signingSecret: process.env.SLACK_SIGNING_SECRET || "secret-unknown",
  },
  firebase: {
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
  }
};