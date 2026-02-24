import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { prisma } from "./prisma";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const app = express();

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
const FORCE_ADMIN_RESET = process.env.ADMIN_FORCE_RESET === "true";
const IS_PROD = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const SESS_COOKIE = "admin_session";
const sessions = new Map<string, { userId: string; username: string; createdAt: number }>();

async function ensureDefaultAdmin() {
    const username = DEFAULT_ADMIN_USERNAME;
    const password = DEFAULT_ADMIN_PASSWORD;
    const existing = await (prisma as any).adminUser.findUnique({ where: { username } }).catch(() => null);
    if (!existing) {
        const hash = await bcrypt.hash(password, 10);
        await (prisma as any).adminUser.create({
            data: { username, passwordHash: hash },
        });
        return;
    }
    if (FORCE_ADMIN_RESET) {
        const hash = await bcrypt.hash(password, 10);
        await (prisma as any).adminUser.update({
            where: { username },
            data: { passwordHash: hash },
        });
    }
}

function getSession(req: Request) {
    const token = req.cookies?.[SESS_COOKIE];
    if (!token) return null;
    return sessions.get(token) ?? null;
}

function requireAdmin(req: Request, res: Response) {
    const sess = getSession(req);
    if (!sess) {
        res.status(401).json({ ok: false, error: "Unauthorized" });
        return null;
    }
    return sess;
}

app.get("/api/health", async (_req: Request, res: Response) => {
    // quick DB check
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true, db: "ok", time: new Date().toISOString() });
    } catch (e) {
        res.status(500).json({ ok: false, db: "fail", time: new Date().toISOString() });
    }
});

const LoginSchema = z.object({
    username: z.string().min(1).max(50),
    password: z.string().min(1).max(200),
});

app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
        const { username, password } = LoginSchema.parse(req.body);
        let user = await (prisma as any).adminUser.findUnique({ where: { username } });
        if (!user) {
            if (username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
                const hash = await bcrypt.hash(password, 10);
                user = await (prisma as any).adminUser.create({
                    data: { username, passwordHash: hash },
                });
            } else {
                return res.status(401).json({ ok: false, error: "Invalid credentials" });
            }
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ ok: false, error: "Invalid credentials" });
        const token = crypto.randomBytes(32).toString("hex");
        sessions.set(token, { userId: user.id, username: user.username, createdAt: Date.now() });
        res.cookie(SESS_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: IS_PROD,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ ok: true, username: user.username });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return res.status(400).json({ ok: false, error: "Invalid input" });
        }
        console.error("POST /api/admin/login error:", err);
        return res.status(500).json({ ok: false, error: "Server error" });
    }
});

app.get("/api/admin/me", async (req: Request, res: Response) => {
    const sess = getSession(req);
    if (!sess) return res.status(401).json({ ok: false });
    res.json({ ok: true, username: sess.username });
});

app.post("/api/admin/logout", async (req: Request, res: Response) => {
    const token = req.cookies?.[SESS_COOKIE];
    if (token) sessions.delete(token);
    res.clearCookie(SESS_COOKIE, { httpOnly: true, sameSite: "lax", secure: IS_PROD });
    res.json({ ok: true });
});

const ContactSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email().max(120),
    company: z.string().max(120).optional().or(z.literal("")),
    message: z.string().min(10).max(4000),
    source: z.string().max(40).optional(),
});

app.post("/api/contact", async (req: Request, res: Response) => {
    try {
        const parsed = ContactSchema.parse(req.body);

        const lead = await prisma.lead.create({
            data: {
                name: parsed.name.trim(),
                email: parsed.email.trim().toLowerCase(),
                company: parsed.company?.trim() || null,
                message: parsed.message.trim(),
                source: parsed.source || "website",
            },
            select: { id: true, createdAt: true },
        });

        res.status(201).json({ ok: true, leadId: lead.id, createdAt: lead.createdAt });
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return res.status(400).json({ ok: false, error: "Invalid input", details: err.errors });
        }
        console.error("POST /api/contact error:", err);
        return res.status(500).json({ ok: false, error: "Server error" });
    }
});

app.get("/api/leads", async (req: Request, res: Response) => {
    const sess = requireAdmin(req, res);
    if (!sess) return;
    try {
        const page = Math.max(1, Number(req.query.page || "1"));
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || "20")));
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            prisma.lead.findMany({
                skip,
                take: pageSize,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    company: true,
                    message: true,
                    source: true,
                    createdAt: true,
                },
            }),
            prisma.lead.count(),
        ]);
        res.json({ ok: true, items, total, page, pageSize });
    } catch (err) {
        console.error("GET /api/leads error:", err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
});

app.listen(PORT, async () => {
    await ensureDefaultAdmin().catch((err) => console.error("ensureDefaultAdmin error:", err));
    console.log(`Backend listening on http://localhost:${PORT}`);
});
