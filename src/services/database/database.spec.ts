import { Database } from "./database"
import { UserData } from "../../models/database/user-data";
import { buildGratitudeData } from "../../tests/builders/build-gratitude-data";
import { buildFirebaseAdmin } from "../../tests/builders/build-firebase-admin";

describe('Database', () => {
  it('return all users from firebase', async () => {
    const userId1 = "irrelevantUserId1"
    const userId2 = "irrelevantUserId2"

    const users = { 
      [userId1]: { gratitude: buildGratitudeData({})},
      [userId2]: { gratitude: buildGratitudeData({})},
    };
    
    const firebaseMock = buildFirebaseAdmin({ response: users }).database();
    const database = new Database(firebaseMock);

    const response: UserData[] = await database.getUsers();

    expect(response[0].id).toEqual(Object.keys(users)[0]);
    expect(response[1].id).toEqual(Object.keys(users)[1]);
    expect(response[2]).toBeUndefined();
  });

  it('return a user from firebase', async () => {
    const userId = "irrelevantUserId"
    const user: UserData = { 
      id: userId,
      gratitude: buildGratitudeData({}),
    };
    
    const firebaseMock = buildFirebaseAdmin({ response: user }).database();
    const database = new Database(firebaseMock);

    const response: UserData = await database.getUser(userId);

    expect(response.id).toEqual(user.id)
  });
});