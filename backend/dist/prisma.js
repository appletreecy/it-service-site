"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
const host = process.env.DB_HOST ?? "127.0.0.1";
const port = Number(process.env.DB_PORT ?? "3309");
const user = process.env.DB_USER ?? "it_user";
const password = process.env.DB_PASSWORD ?? "strongpassword";
const database = process.env.DB_NAME ?? "it_service";
const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT ?? "5");
const url = `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
console.log(`✅ DB runtime config: ${user}@${host}:${port}/${database} (limit=${connectionLimit})`);
process.env.DATABASE_URL = process.env.DATABASE_URL || url;
const adapter = new adapter_mariadb_1.PrismaMariaDb({
    host,
    port,
    user,
    password,
    database,
    connectionLimit,
});
exports.prisma = global.__prisma ??
    new client_1.PrismaClient({
        adapter,
        log: ["error", "warn"],
    });
if (process.env.NODE_ENV !== "production")
    global.__prisma = exports.prisma;
