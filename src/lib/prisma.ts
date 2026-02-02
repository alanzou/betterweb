import { PrismaClient } from '../../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Parse connection string without sslmode to let us configure SSL properly
const baseUrl = process.env.DATABASE_URL?.split('?')[0]

const pool = new Pool({ 
  connectionString: baseUrl,
  ssl: {
    rejectUnauthorized: false  // Accept self-signed certificates (TimescaleDB)
  }
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter } as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
