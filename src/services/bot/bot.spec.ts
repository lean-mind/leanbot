import { Bot } from "./bot";
import { Events } from "../slack/events";
import { Database } from "../database/database";
import { Slack } from "../slack/slack";
import { Channel } from "../../models/slack/channel";
import { buildChannel } from "../../tests/builders/build-channel";
import { UserData } from "../../models/database/user-data";
import { buildUserData } from "../../tests/builders/build-user-data";
import { buildGratitudeData, buildGratitudeUpdate } from "../../tests/builders/build-gratitude-data";
import { User } from "../../models/slack/user";
import { buildUser } from "../../tests/builders/build-user";

jest.mock('../slack/slack');
jest.mock('../database/database');

describe('Bot', () => {
  let apiMock: Slack;
  let databaseMock: Database;
  let bot: Bot;

  beforeEach(() => {
    apiMock = new Slack(jest.fn());
    databaseMock = new Database();
    bot = new Bot(apiMock, databaseMock);
  });

  describe('events', () => {
    test('onStart', () => {
      const aListener = () => { };
      bot.onStart(aListener);

      expect(apiMock.on).toHaveBeenCalledWith(Events.start, aListener);
    });

    test('onMessage', () => {
      const aListener = () => { };
      bot.onMessage(aListener);

      expect(apiMock.on).toHaveBeenCalledWith(Events.message, aListener);
    });

    test('onError', () => {
      const aListener = () => { };
      bot.onError(aListener);

      expect(apiMock.on).toHaveBeenCalledWith(Events.error, aListener);
    });

    test('writeMessageToUser', () => {
      const userId = "irrelevantUserId";
      const text = "irrelevantText";
      const params = {};

      bot.writeMessageToUser(userId, text, params);

      expect(apiMock.postMessageToUser).toHaveBeenCalledWith(userId, text, params);
    });

    test('writeMessage', () => {
      const channelId = "irrelevantChannelId";
      const text = "irrelevantText";
      const params = {};

      bot.writeMessage(channelId, text, params);

      expect(apiMock.postMessage).toHaveBeenCalledWith(channelId, text, params);
    });
  });

  describe('actions', () => {
    const general: Channel = buildChannel({ is_general: true })
    const secundary: Channel = buildChannel({ is_general: true })
    const music: Channel = buildChannel({ is_general: false })
    const food: Channel = buildChannel({ is_general: false })
    const random: Channel = buildChannel({ is_general: false })

    it('returns all slack users', () => {
      const given: User[] = [buildUser({})];
      apiMock.getUsers = jest.fn(() => given);
      const users: User[] = bot.getSlackUsers();

      expect(users).toEqual(given);
    });

    it('returns all slack channels', () => {
      const given: Channel[] = [buildChannel({})];
      apiMock.getChannels = jest.fn(() => given);
      const channels: Channel[] = bot.getChannels();

      expect(channels).toEqual(given);
    });

    it('returns the general channel when it haves one ', () => {
      const given: Channel[] = [general, random];
      apiMock.getChannels = jest.fn(() => given);
      const channel: Channel | null = bot.getGeneralChannel();

      expect(channel).toEqual(general);
    });

    it('returns first general channel when it haves multiple ', () => {
      const given: Channel[] = [general, secundary, random];
      apiMock.getChannels = jest.fn(() => given);
      const channel: Channel | null = bot.getGeneralChannel();

      expect(channel).toEqual(general);
    });

    it('returns empty when not general channel exists ', () => {
      const given: Channel[] = [music, food, random];
      apiMock.getChannels = jest.fn(() => given);
      const channel: Channel | null = bot.getGeneralChannel();

      expect(channel).toBeNull();
    });

    let userFrom: UserData;
    let userTo: UserData;
    let anonymousUser: UserData;
    let users: UserData[];
    const initialPointsToGive = 15;

    beforeEach(() => {
      userFrom = buildUserData({ id: "irrelevantUserIdFrom" });
      userTo = buildUserData({ id: "irrevelantUserIdTo" });
      anonymousUser = buildUserData({});
      users = [userFrom, userTo];

      databaseMock.getUser = jest.fn(async (id: string) => users.find((userData) => userData.id == id) || anonymousUser);
      databaseMock.updateGratitudePoints = jest.fn();
    });

    afterEach(() => {
      Date.now = jest.fn(() => new Date().getTime());
    });

    it('returns points received when one user gives points to other user', async () => {
      const points: number = 5;
      const pointsReceived = await bot.giveGratitudePoints(userFrom.id, userTo.id, points);

      expect(pointsReceived).toEqual(points);
    });

    it('returns max points when one user gives more than max points', async () => {
      const points: number = 25;
      const pointsReceived = await bot.giveGratitudePoints(userFrom.id, userTo.id, points);

      expect(pointsReceived).not.toEqual(points);
      expect(pointsReceived).toEqual(initialPointsToGive);
    });

    it('returns 0 points when one user gives no points', async () => {
      const points: number = 0;
      const pointsReceived = await bot.giveGratitudePoints(userFrom.id, userTo.id, points);

      expect(pointsReceived).toEqual(0);
    });

    it('points to give decrease after giving points', async () => {
      const points: number = 5;

      await bot.giveGratitudePoints(userFrom.id, userTo.id, points);

      expect(userFrom.gratitude.toGive).toEqual(initialPointsToGive - points);
    });

    it('points received increase after receiving points', async () => {
      const points: number = 5;
      const initialTotal: number = 50;
      const initialTotalMonth: number = 25;
      const initialTotalWeek: number = 0;
      userTo.gratitude = buildGratitudeData({
        total: initialTotal,
        totalMonth: initialTotalMonth,
        totalWeek: initialTotalWeek,
      });

      await bot.giveGratitudePoints(userFrom.id, userTo.id, points);

      expect(userTo.gratitude.totalWeek).toEqual(initialTotalWeek + points);
      expect(userTo.gratitude.totalMonth).toEqual(initialTotalMonth + points);
      expect(userTo.gratitude.total).toEqual(initialTotal + points);
    });

    it('restartGratitudePoints', () => {
      const gratitude = buildGratitudeUpdate({
        toGive: initialPointsToGive,
        totalWeek: 0,
      });

      bot.restartGratitudePoints();

      expect(databaseMock.updateGratitudePointsForAllUsers).toHaveBeenCalledWith(gratitude);
    });

    it('registerGratitudePointsOfMonth', () => {
      const gratitude = buildGratitudeUpdate({
        newHistorical: { month: 10, year: 2019 },
        totalMonth: 0,
      });

      Date.now = jest.fn(() => new Date(2019, 10).getTime());
      bot.registerGratitudePointsOfMonth()

      expect(databaseMock.updateGratitudePointsForAllUsers).toHaveBeenCalledWith(gratitude);
    });
  });
});