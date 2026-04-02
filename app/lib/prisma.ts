import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

// 1. Create a connection pool using your Neon DATABASE_URL
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// 2. Pass the pool to the Prisma driver adapter
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 3. Pass the adapter into the PrismaClient constructor
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}