import admin from 'firebase-admin';
import { UserData } from '../../models/database/user-data';
import { GratitudeData } from '../../models/database/gratitude-data';

export class Database {

  constructor(
    private database: admin.database.Database = admin.database()
  ) { }

  async getUserData(userId: string): Promise<UserData> {
    let userData: UserData | null = null;
    await this.database.ref(`users/${userId}`).once("value").then((snapshot) => {
      userData = snapshot?.val();
    })

    if (userData === null) {
      userData = await this.createUserWithDefaultData(userId);
    }
    return userData;
  }

  private async createUserWithDefaultData(userId: string): Promise<UserData> {
    const userDataDefault = await this.getDefaultValues('users');
    this.database.ref(`users/${userId}`).set(userDataDefault);
    return userDataDefault;
  }

  async updateGratitudePoints(userId: string, gratitude: GratitudeData) {
    await this.database.ref(`users/${userId}`).update({ gratitude })
  }

  private async getDefaultValues(field: string) {
    let defaultValues;
    await this.database.ref(`default/${field}`).once("value").then((snapshot) => {
      defaultValues = snapshot?.val();
    })
    return defaultValues;
  }
}