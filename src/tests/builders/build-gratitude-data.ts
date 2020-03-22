import { GratitudeData, GratitudeHistory, GratitudeUpdate } from "../../models/database/gratitude-data";

export const buildGratitudeData = ({
  toGive = 15,
  total = 0,
  totalMonth = 0,
  totalWeek = 0,
  historical = [buildGratitudeHistory({})],
}: Partial<GratitudeData>): GratitudeData => ({
  toGive,
  total,
  totalMonth,
  totalWeek,
  historical,
});

export const buildGratitudeUpdate = ({
  toGive,
  totalMonth,
  totalWeek,
  newHistorical,
}: Partial<GratitudeUpdate>): GratitudeUpdate => ({
  toGive,
  totalMonth,
  totalWeek,
  newHistorical,
});

export const buildGratitudeHistory = ({
  month = 10,
  year = 2018,
  points = 0,
}: Partial<GratitudeHistory>): GratitudeHistory => ({
  month,
  year,
  points,
});