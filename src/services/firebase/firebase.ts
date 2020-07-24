import admin from "firebase-admin";
import { UserData, toUserData, FirebaseUser, toFirebaseUser } from "../../models/database/user-data";
import { GratitudeData } from "../../models/database/gratitude-data";

export enum Table {
  users = "users",
  default = "default",
  defaultUsers = "default/users",
}

export class Firebase {
  constructor(
    private firebase: admin.database.Database = admin.database()
  ) { }

  private database(table: Table, id?: string) {
    const endpoint = id ? `${table}/${id}` : table;
    const ref = this.firebase.ref(endpoint);

    return {
      get: () => ref.once("value"),
      set: (data) => ref.set(data),
      update: (data) => ref.update(data),
    };
  }

  async getUser(userId: string): Promise<UserData | null> {
    const response = await this.database(Table.users, userId).get();
    const value = response.val();
    const firebaseUser: FirebaseUser = { [userId]: value };

    return value ? toUserData(firebaseUser) : null;
  }

  async getUsers(): Promise<UserData[]> {
    const response = await this.database(Table.users).get();
    const values = response.val();
    if (values) {
      const usersId: string[] = Object.keys(values);
      const firebaseUsers: FirebaseUser[] = usersId.map((userId: string) => ({ [userId]: values[userId] }));

      return firebaseUsers.map((user: FirebaseUser) => toUserData(user));
    }
    return [];
  }

  async getUserDefaultWithId(userId: string): Promise<UserData> {
    const response = await this.database(Table.defaultUsers).get();
    const value: FirebaseUser = { [userId]: response.val() };

    return toUserData(value);
  }

  async setUser(userId: string, user: UserData): Promise<void> {
    const value: FirebaseUser = toFirebaseUser(user);
    await this.database(Table.users, userId).set(value[userId]);
  }

  async setUsers(users: UserData[]): Promise<void> {
    let usersUpdated = {};
    if (users.length == 0) return;
    users.forEach((user: UserData) => {
      usersUpdated = {
        ...usersUpdated,
        ...toFirebaseUser(user),
      }
    });
    await this.database(Table.users).set(usersUpdated);
  }

  async getAllGratitudePoints(): Promise<number> {
    const users = await this.getUsers();
    return users.reduce((total, userB) => total + userB.gratitude.total, 0);
  }

  async updateGratitudePoints(userId: string, gratitude: GratitudeData): Promise<void> {
    await this.database(Table.users, userId).update({ gratitude })
  }
}