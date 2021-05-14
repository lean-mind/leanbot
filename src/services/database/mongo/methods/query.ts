export interface QueryOptions {
  communityId?: string,
  days?: number,
  userId?: string,
  startDate?: string,
  endDate?: string
}

const queryDays = (query: any, days: number): any => {
  const nowTime = (new Date()).getTime()
  const queryTime = days * 24 * 60 * 60 * 1000
  query["createdAtTime"] = {
    $gte: nowTime - queryTime,
    $lt: nowTime,
  }
  return query
}

export const makeQuery = (options: QueryOptions): any => {
  const query = {}

  if (options.communityId) {
    query["communityId"] = options.communityId
  }

  if (options.days) {
    queryDays(query, options.days)
  } else if (options.startDate || options.endDate) {
    query["createdAtTime"] = {}
    if (options.startDate) {
      query["createdAtTime"]["$gte"] = (new Date(options.startDate)).getTime() 
    }
    if (options.endDate) {
      query["createdAtTime"]["$lt"] = (new Date(options.endDate)).getTime()
    }
  }

  if (options.userId) {
    query["$or"] = [
      { senderId: options.userId },
      { recipientId: options.userId }
    ]
  }
  return query
}