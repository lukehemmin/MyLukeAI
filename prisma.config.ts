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
        console.warn('⚠️  DATABASE_URL is missing. Using placeholder to allow build to proceed.')
        return 'postgresql://dummy:dummy@localhost:5432/dummy'
      }
      return url
    })(),
    // @ts-ignore
    directUrl: process.env.POSTGRES_URL_NON_POOLING,
  },
})
