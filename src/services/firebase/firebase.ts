import admin from "firebase-admin";
import { UserData, toUserData, FirebaseUser, toFirebaseUser } from "../../models/database/user-data";
import { GratitudeData } from "../../models/database/gratitude-data";

export class Firebase {

  constructor(
    private database: admin.database.Database = admin.database()
  ) {}
  
  async getUser(userId: string): Promise<UserData | null> {
    const response = await this.database.ref(`users/${userId}`).once("value");
    const value: FirebaseUser = response.val();

    return value !== null ? toUserData(value) : null;
  }
  
  async getUsers(): Promise<UserData[]> {
    const response = await this.database.ref("users").once("value");
    const values: FirebaseUser[] = response.val(); 

    return values !== null ? values.map((value: FirebaseUser) => toUserData(value)) : []
  }

  async getUserDefaultWithId(userId: string): Promise<UserData> {
    const response = await this.database.ref("default/users").once("value");
    const value: FirebaseUser = { [userId]: response.val() };

    return toUserData(value);
  }

  async setUser(userId: string, user: UserData): Promise<void> {
    const value: FirebaseUser = toFirebaseUser(user);
    await this.database.ref(`users/${userId}`).set(value);
  }

  async setUsers(users: UserData[]): Promise<void> {
    const values: FirebaseUser[] = users.map((user: UserData) => toFirebaseUser(user));
    await this.database.ref("users").set(values);
  }
  
  async updateGratitudePoints(userId: string, gratitude: GratitudeData): Promise<void> {
    await this.database.ref(`users/${userId}`).update({ gratitude })
  }
}