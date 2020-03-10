export interface GratitudeData {
  toGive: number,
  total: number,
  totalMonth: number,
  totalWeek: number,
  historical: GratitudeHistory[]
}

export interface GratitudeHistory {
  month: string,
  points: number | null,
}

export interface GratitudeUpdate {
  toGive?: number,
  totalMonth?: number,
  totalWeek?: number,
  newMonthHistorical?: string,
}