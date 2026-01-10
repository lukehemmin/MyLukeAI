import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // @ts-ignore
    url: process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL,
    // @ts-ignore
    directUrl: process.env.POSTGRES_URL_NON_POOLING,
  },
})
