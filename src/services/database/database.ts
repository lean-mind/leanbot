import * as firebase from 'firebase';

export class Database {
  private static instance: Database;
  private database;

  private constructor() {
    const apiKey = process.env.FIREBASE_API_KEY;
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const messagingSenderId = process.env.FIREBASE_SENDER_ID;
    const appId = process.env.FIREBASE_APP_ID;
    const measurementId = process.env.FIREBASE_MEASUREMENT_ID;

    const config = {
      apiKey,
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}.firebaseio.com`,
      projectId,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId,
      appId,
      measurementId,
    };

    firebase.initializeApp(config);
    this.database = firebase.database();
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}