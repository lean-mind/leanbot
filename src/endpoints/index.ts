import { points } from "./points";
import { ApiBody } from "../services/api/api-body";
import { Bot } from "../services/bot/bot";

type Action = (body: ApiBody, response: any, boy: Bot) => void;

export interface Endpoint {
  route: string;
  function: Action;
}

interface Dictionary<T> {
  [name: string]: T
}

export const Endpoints: Dictionary<Endpoint> = {
  points: {
    route: "/points",
    function: points
  }
}