import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // @ts-ignore
    url: (() => {
      const url = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL
      if (!url) {
        throw new Error('❌ DATABASE_URL or POSTGRES_PRISMA_URL is missing. Please add it to your Environment Variables.')
      }
      return url
    })(),
    // @ts-ignore
    directUrl: process.env.POSTGRES_URL_NON_POOLING,
  },
})
