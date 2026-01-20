import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

const host = process.env.DB_HOST ?? "127.0.0.1";
const port = Number(process.env.DB_PORT ?? "3309");
const user = process.env.DB_USER ?? "it_user";
const password = process.env.DB_PASSWORD ?? "strongpassword";
const database = process.env.DB_NAME ?? "it_service";
const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT ?? "5");

console.log(`✅ DB runtime config: ${user}@${host}:${port}/${database} (limit=${connectionLimit})`);

const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
});

export const prisma =
    global.__prisma ??
    new PrismaClient({
        adapter,
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
