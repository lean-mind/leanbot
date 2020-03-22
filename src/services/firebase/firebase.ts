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
  ) {}

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
    const value: FirebaseUser = response.val();

    return value ? toUserData(value) : null;
  }
  
  async getUsers(): Promise<UserData[]> {
    const response = await this.database(Table.users).get();
    const values: FirebaseUser[] = response.val(); 

    return values ? values.map((value: FirebaseUser) => toUserData(value)) : []
  }

  async getUserDefaultWithId(userId: string): Promise<UserData> {
    const response = await this.database(Table.defaultUsers).get();
    const value: FirebaseUser = { [userId]: response.val() };

    return toUserData(value);
  }

  async setUser(userId: string, user: UserData): Promise<void> {
    const value: FirebaseUser = toFirebaseUser(user);
    await this.database(Table.users, userId).set(value);
  }

  async setUsers(users: UserData[]): Promise<void> {
    const values: FirebaseUser[] = users.map((user: UserData) => toFirebaseUser(user));
    await this.database(Table.users).set(values);
  }
  
  async updateGratitudePoints(userId: string, gratitude: GratitudeData): Promise<void> {
    await this.database(Table.users, userId).update({ gratitude })
  }
}