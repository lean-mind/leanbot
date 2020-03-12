import { Database } from "./database"
import { UserData } from "../../models/database/user-data";
import { buildGratitudeData, buildGratitudeUpdate } from "../../tests/builders/build-gratitude-data";
import { buildFirebaseAdmin } from "../../tests/builders/build-firebase-admin";
import { GratitudeData, mixGratitudePoints, GratitudeUpdate } from "../../models/database/gratitude-data";
import { buildUserData } from "../../tests/builders/build-user-data";
import { Firebase } from "../firebase/firebase";

jest.mock('../firebase/firebase');

describe('Database', () => {
  let firebase: Firebase;
  let database: Database;

  beforeEach(() => {
    firebase = new Firebase();
    database = new Database(firebase);
  });

  it('return all users', async () => {
    const userId1 = "irrelevantUserId1"
    const userId2 = "irrelevantUserId2";
    const users = [
      buildUserData({ id: userId1 }),
      buildUserData({ id: userId2 }),
    ];
    
    firebase.getUsers = jest.fn(async (): Promise<UserData[]> => users);
    const response: UserData[] = await database.getUsers();

    expect(response[0].id).toEqual(userId1);
    expect(response[1].id).toEqual(userId2);
    expect(response[2]).toBeUndefined();
  });

  it('return a user', async () => {
    const userId = "irrelevantUserId";
    const user: UserData = buildUserData({ id: userId });

    firebase.getUser = jest.fn(async (): Promise<UserData | null> => user);
    
    const response: UserData = await database.getUser(userId);

    expect(response.id).toEqual(user.id);
  });

  it('return a created user with default data', async () => {
    const userId = "irrelevantUserId"
    const userDefault: UserData = buildUserData({ id: userId })
    
    firebase.getUser = jest.fn(async (): Promise<UserData | null> => null);
    firebase.getUserDefaultWithId = jest.fn(async (): Promise<UserData> => userDefault);
    
    const response: UserData = await database.getUser(userId);

    expect(response.id).toEqual(userDefault.id)
    expect(response.gratitude).toEqual(userDefault.gratitude)
  });

  it('update a gratitude points for a user', async () => {
    const userId = "irrelevantUserId";
    const gratitude: GratitudeData = buildGratitudeData({});

    await database.updateGratitudePoints(userId, gratitude);

    expect(firebase.updateGratitudePoints).toHaveBeenCalledWith(userId, gratitude);
  });

  it('update a gratitude points for all users', async () => {
    const gratitude = buildGratitudeData({ toGive: 10 });
    const gratitudeUpdate = buildGratitudeUpdate({ toGive: 15 })
    const users = [buildUserData({ gratitude }), buildUserData({ gratitude })];

    firebase.getUsers = jest.fn(async (): Promise<UserData[]> => users);
    await database.updateGratitudePointsForAllUsers(gratitudeUpdate);

    const usersExpected = users.map((user: UserData) => buildUserData({
      id: user.id,
      gratitude: mixGratitudePoints(user.gratitude, gratitudeUpdate),
    }));

    expect(firebase.setUsers).toHaveBeenCalledWith(usersExpected);
  });
}); 