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

export const mixGratitudePoints = (
  gratitude: GratitudeData, 
  gratitudeToUpdate: GratitudeUpdate
): GratitudeData => {
  if (gratitudeToUpdate.newMonthHistorical !== undefined) {
    gratitude.historical = gratitude.historical || [];
    gratitude.historical.push({
      month: gratitudeToUpdate.newMonthHistorical,
      points: gratitude.totalMonth,
    });
  }

  return {
    total: gratitude.total,
    totalWeek: gratitudeToUpdate.totalWeek || gratitude.totalWeek,
    totalMonth: gratitudeToUpdate.totalMonth || gratitude.totalMonth,
    toGive: gratitudeToUpdate.toGive || gratitude.toGive,
    historical: gratitude.historical
  }
}