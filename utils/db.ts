import { connect } from '@planetscale/database'
import { fetch } from 'undici'

export const db = connect({
  fetch,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
})
