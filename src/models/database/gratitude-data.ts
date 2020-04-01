export interface GratitudeData {
  toGive: number,
  total: number,
  totalMonth: number,
  totalWeek: number,
  historical: GratitudeHistory[]
}

export interface GratitudeHistory {
  month: number,
  year: number,
  points: number | null,
}

export interface GratitudeUpdate {
  toGive?: number,
  totalMonth?: number,
  totalWeek?: number,
  newHistorical?: Partial<GratitudeHistory>,
}

export const mixGratitudePoints = (
  gratitude: GratitudeData, 
  gratitudeToUpdate: GratitudeUpdate
): GratitudeData => {
  const historical = gratitude.historical || [];
  
  if (gratitudeToUpdate.newHistorical) {
    const record: GratitudeHistory = {
      month: gratitudeToUpdate.newHistorical.month || 0,
      year: gratitudeToUpdate.newHistorical.year || 1990,
      points: gratitude.totalMonth,
    }
    historical.push(record);
  }

  const gratitudeUpdated: GratitudeData = {
    total: gratitude.total,
    totalWeek: mixPoints(gratitudeToUpdate.totalWeek, gratitude.totalWeek),
    totalMonth: mixPoints(gratitudeToUpdate.totalMonth, gratitude.totalMonth),
    toGive: mixPoints(gratitudeToUpdate.toGive, gratitude.toGive),
    historical,
  }
  
  return gratitudeUpdated;
}

const mixPoints = (toUpdatePoints: number | undefined, currentPoints: number) => toUpdatePoints != undefined ? toUpdatePoints : currentPoints;