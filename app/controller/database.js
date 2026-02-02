import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv"
dotenv.config()

const pools = new Pool({
    database: "debt_collector",
    idleTimeoutMillis: 500
})

const prisma = new PrismaClient({
    adapter: new PrismaPg(pools)
})

export const coreDB = pools

export const prismaDB = prisma