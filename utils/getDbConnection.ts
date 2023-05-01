import { connect, Connection } from '@planetscale/database'

const globalForDb = global as unknown as {
  db: Connection | undefined
}

export const getDbConnection = async () => {
  if (globalForDb.db) return globalForDb.db
  const config = {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  }
  globalForDb.db = await connect(config)
  return globalForDb.db
}
