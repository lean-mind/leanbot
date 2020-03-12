import { Firebase } from "./firebase";
import { buildFirebaseAdmin } from "../../tests/builders/build-firebase-admin";
import admin from "firebase-admin";
import { buildUserData } from "../../tests/builders/build-user-data";
import { buildGratitudeData } from "../../tests/builders/build-gratitude-data";

jest.mock('firebase-admin');

describe('Firebase', () => {
  let firebase: Firebase;
  let database: admin.database.Database;

  it('getUser is called', async () => {
    const userId = "irrelevantUserId";
    const user = buildUserData({ id: userId })

    database = buildFirebaseAdmin({ response: user }).database();
    firebase = new Firebase(database);
    
    await firebase.getUser(userId);

    expect(database.ref).toHaveBeenLastCalledWith(`users/${userId}`);
  });
  
  it('getUsers is called', async () => {
    const users = [ buildUserData({}), buildUserData({}) ];
    
    database = buildFirebaseAdmin({ response: users }).database();
    firebase = new Firebase(database);
    
    await firebase.getUsers();
    
    expect(database.ref).toHaveBeenLastCalledWith("users");
  });
  
  it('getUserDefaultWithId is called', async () => {
    const userId = "irrelevantUserId";
    const userDefault = buildUserData({ id: undefined });
    const userExpected = buildUserData({ id: userId });
    
    database = buildFirebaseAdmin({ response: userDefault }).database();
    firebase = new Firebase(database);
    
    const response = await firebase.getUserDefaultWithId(userId);
    
    expect(response).toEqual(userExpected);
    expect(database.ref).toHaveBeenLastCalledWith("default/users");
  });

  it('setUser is called', async () => {
    const userId = "irrelevantUserId";
    const user = buildUserData({ });
    
    database = buildFirebaseAdmin({ }).database();
    firebase = new Firebase(database);
    
    await firebase.setUser(userId, user);
    
    expect(database.ref).toHaveBeenLastCalledWith(`users/${userId}`);
  });
  
  it('setUsers is called', async () => {
    const users = [buildUserData({ })];
    
    database = buildFirebaseAdmin({ }).database();
    firebase = new Firebase(database);
    
    await firebase.setUsers(users);
    
    expect(database.ref).toHaveBeenLastCalledWith("users");
  });
  
  it('updateGratitudePoints is called', async () => {
    const userId = "irrelevantUserId";
    const gratitude = buildGratitudeData({});

    database = buildFirebaseAdmin({ }).database();
    firebase = new Firebase(database);
    
    await firebase.updateGratitudePoints(userId, gratitude);
    
    expect(database.ref).toHaveBeenLastCalledWith(`users/${userId}`);
  });
});