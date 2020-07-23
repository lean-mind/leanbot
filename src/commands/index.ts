import { points } from "./points";
import { Body } from "../services/api/api-body";
import { Bot } from "../services/bot/bot";
import { help } from "./help";
import { logs } from "./logs";

type Action = (body: Body, response: any, bot: Bot) => void;

export interface Command {
  name: string;
  function: Action;
}

interface Dictionary<T> {
  [name: string]: T
}

export const Commands: Dictionary<Command> = {
  help: {
    name: "/help",
    function: help
  },
  logs: {
    name: "/logs",
    function: logs
  },
  points: {
    name: "/points",
    function: points
  }
}