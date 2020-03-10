import admin from 'firebase-admin';
import { UserData } from '../../models/database/user-data';
import { GratitudeData, GratitudeUpdate } from '../../models/database/gratitude-data';

export class Database {

  constructor(
    private database: admin.database.Database = admin.database()
  ) { }

  private async getDefaultValues(field: string) {
    const snapshot = await this.database.ref(`default/${field}`).once("value");
    return snapshot?.val();
  }

  async getUsers(): Promise<UserData[]> {
    const users: UserData[] = [];
    const snapshot = await this.database.ref("users").once("value")
    const data = snapshot.val();
    Object.keys(data).forEach((key) => {
      users.push({ id: key, gratitude: data[key].gratitude })
    });

    return users;
  }

  async getUser(userId: string): Promise<UserData> {
    let userData: UserData | null = null;
    const snapshot = await this.database.ref(`users/${userId}`).once("value")
    userData = snapshot.val();

    if (userData === null) {
      userData = await this.createUserWithDefaultData(userId);
    }
    userData.id = userId;

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

  private buildGratitudeData = (
    gratitude: GratitudeUpdate, 
    userGratitude: GratitudeData
  ): GratitudeData => ({
    toGive: gratitude.toGive ?? userGratitude.toGive,
    total: userGratitude.total,
    totalWeek: gratitude.totalWeek ?? userGratitude.totalWeek,
    totalMonth: gratitude.totalMonth ?? userGratitude.totalMonth,
    historical: gratitude.newMonthHistorical !== undefined ? [
      ...userGratitude.historical ?? [],
      {
        month: gratitude.newMonthHistorical,
        points: userGratitude.totalMonth,
      }
    ] : (userGratitude.historical ?? []),
  })

  async updateGratitudePointsForAllUsers(gratitude: GratitudeUpdate): Promise<void> {
    let users = {};
    const snapshot = await this.database.ref('users').once("value")
    const data = snapshot.val();
    Object.keys(data).forEach((key) => {
      const userGratitude = data[key].gratitude;
      let gratitudeUpdated = this.buildGratitudeData(gratitude, userGratitude);
      users = { ...users, [key]: { ...data[key], gratitude: gratitudeUpdated } };
    });
    await this.database.ref('users').update(users);
  }
}