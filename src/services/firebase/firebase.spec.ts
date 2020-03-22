import { Firebase, Table } from "./firebase";
import { buildFirebaseAdmin } from "../../tests/builders/build-firebase-admin";
import admin from "firebase-admin";
import { buildUserData } from "../../tests/builders/build-user-data";
import { buildGratitudeData } from "../../tests/builders/build-gratitude-data";

jest.mock('firebase-admin');

describe('Firebase', () => {
  let firebase: Firebase;
  let database: admin.database.Database;

  const userId = "irrelevantUserId";
  const user = buildUserData({ id: userId })
  const users = [ buildUserData({}), buildUserData({}) ];

  it('getUser is called', async () => {
    database = buildFirebaseAdmin({ response: user }).database();
    firebase = new Firebase(database);
    
    await firebase.getUser(userId);

    expect(database.ref).toHaveBeenLastCalledWith(`users/${userId}`);
  });
  
  it('getUsers is called', async () => {
    database = buildFirebaseAdmin({ response: users }).database();
    firebase = new Firebase(database);
    
    await firebase.getUsers();
    
    expect(database.ref).toHaveBeenLastCalledWith("users");
  });
  
  it('getUserDefaultWithId is called', async () => {
    const userDefault = buildUserData({ id: undefined });
    const userExpected = buildUserData({ id: userId });
    
    database = buildFirebaseAdmin({ response: userDefault }).database();
    firebase = new Firebase(database);
    
    const response = await firebase.getUserDefaultWithId(userId);
    
    expect(response).toEqual(userExpected);
    expect(database.ref).toHaveBeenLastCalledWith(Table.defaultUsers);
  });

  it('setUser is called', async () => {    
    database = buildFirebaseAdmin({ }).database();
    firebase = new Firebase(database);
    
    await firebase.setUser(userId, user);
    
    expect(database.ref).toHaveBeenLastCalledWith(`${Table.users}/${userId}`);
  });
  
  it('setUsers is called', async () => {
    database = buildFirebaseAdmin({ }).database();
    firebase = new Firebase(database);
    
    await firebase.setUsers(users);
    
    expect(database.ref).toHaveBeenLastCalledWith(Table.users);
  });
  
  it('updateGratitudePoints is called', async () => {
    const gratitude = buildGratitudeData({});

    database = buildFirebaseAdmin({ }).database();
    firebase = new Firebase(database);
    
    await firebase.updateGratitudePoints(userId, gratitude);
    
    expect(database.ref).toHaveBeenLastCalledWith(`${Table.users}/${userId}`);
  });
});