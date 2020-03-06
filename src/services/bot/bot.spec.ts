import { Bot } from "./bot";
import { Events } from "../slack/events";
import { Database } from "../database/database";
import { Slack } from "../slack/slack";
import { Channel } from "../../models/slack/channel";
import { buildChannel } from "../../tests/builders/build-channel";

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
      const aListener = () => {};
      bot.onStart(aListener);
      
      expect(apiMock.on).toHaveBeenCalledWith(Events.start, aListener);
    });
    
    test('onMessage', () => {
      const aListener = () => {};
      bot.onMessage(aListener);
      
      expect(apiMock.on).toHaveBeenCalledWith(Events.message, aListener);
    });
    
    test('onError', () => {
      const aListener = () => {};
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
    
    test('writeMessageToChannel', () => {
      const channelId = "irrelevantChannelId";
      const text = "irrelevantText";
      const params = {};
      
      bot.writeMessageToChannel(channelId, text, params);
      
      expect(apiMock.postMessageToChannel).toHaveBeenCalledWith(channelId, text, params);
    });
  });

  describe('actions', () => {  
    const general: Channel = buildChannel({is_general: true})
    const secundary: Channel = buildChannel({is_general: true})
    const music: Channel = buildChannel({is_general: false})
    const food: Channel = buildChannel({is_general: false})
    const random: Channel = buildChannel({is_general: false})

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
  });
});