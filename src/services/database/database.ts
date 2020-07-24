import { UserData } from '../../models/database/user-data';
import { GratitudeData, GratitudeUpdate, mixGratitudePoints } from '../../models/database/gratitude-data';
import { Firebase } from '../firebase/firebase';

export class Database {
  constructor(
    private firebase: Firebase = new Firebase()
  ) { }

  async getUsers(): Promise<UserData[]> {
    return await this.firebase.getUsers();
  }

  async getUser(userId: string): Promise<UserData> {
    let userData: UserData | null = await this.firebase.getUser(userId);

    if (userData === null) {
      const userDefault = await this.firebase.getUserDefaultWithId(userId);
      await this.firebase.setUser(userId, userDefault);

      return userDefault;
    }
    return userData;
  }

  async getAllGratitudePoints(): Promise<number> {
    return await this.firebase.getAllGratitudePoints();
  }

  async updateGratitudePoints(userId: string, gratitude: GratitudeData): Promise<void> {
    await this.firebase.updateGratitudePoints(userId, gratitude);
  }

  async updateGratitudePointsForAllUsers(gratitude: GratitudeUpdate): Promise<void> {
    const users: UserData[] = await this.firebase.getUsers();
    const usersUpdated = users.map((user: UserData) => ({
      ...user,
      gratitude: mixGratitudePoints(user.gratitude, gratitude)
    }));
    await this.firebase.setUsers(usersUpdated);
  }
}