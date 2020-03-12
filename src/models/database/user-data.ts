import { GratitudeData } from "./gratitude-data";

export interface UserData {
  id: string,
  gratitude: GratitudeData,
}

export interface FirebaseUser {
  [userId: string]: {
    gratitude: GratitudeData;
  }
}

export const toUserData = (firebaseUser: FirebaseUser): UserData => {
  const userId = Object.keys(firebaseUser)[0] 

  return {
  id: userId,
  gratitude: firebaseUser[userId].gratitude
}};

export const toFirebaseUser = (user: UserData): FirebaseUser => ({
  [user.id]: {
    gratitude: user.gratitude
  }
});