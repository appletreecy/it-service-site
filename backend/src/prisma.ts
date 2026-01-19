import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

function maskDbUrl(url: string) {
    return url.replace(/:\/\/(.*?):(.*?)@/, "://$1:***@");
}

const url = process.env.DATABASE_URL || "";
if (!url) {
    console.error("❌ DATABASE_URL is empty. Check backend/.env");
} else {
    console.log("✅ DATABASE_URL loaded:", maskDbUrl(url));
}

// Prisma v7 requires adapter or accelerateUrl. :contentReference[oaicite:4]{index=4}
const adapter = new PrismaMariaDb(url);

export const prisma =
    global.__prisma ??
    new PrismaClient({
        adapter,
        log: ["error", "warn"],
    });

if (process.env.NODE_ENV !== "production") global.__prisma = prisma;
