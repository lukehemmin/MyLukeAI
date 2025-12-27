/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const count = await prisma.tokenUsage.count()
    console.log(`TokenUsage count: ${count}`)

    const models = await prisma.model.findMany()
    console.log(`Models configured: ${models.length}`)
    models.forEach(m => console.log(`- ${m.id} (Streaming: ${m.supportsStreaming})`))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
