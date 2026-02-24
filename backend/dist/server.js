"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const zod_1 = require("zod");
const prisma_1 = require("./prisma");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
const FORCE_ADMIN_RESET = process.env.ADMIN_FORCE_RESET === "true";
const IS_PROD = process.env.NODE_ENV === "production";
app.set("trust proxy", 1);
app.use((0, cors_1.default)({ origin: CORS_ORIGIN, credentials: true }));
app.use(express_1.default.json({ limit: "1mb" }));
app.use((0, cookie_parser_1.default)());
const SESS_COOKIE = "admin_session";
const sessions = new Map();
async function ensureDefaultAdmin() {
    const username = DEFAULT_ADMIN_USERNAME;
    const password = DEFAULT_ADMIN_PASSWORD;
    const existing = await prisma_1.prisma.adminUser.findUnique({ where: { username } }).catch(() => null);
    if (!existing) {
        const hash = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.adminUser.create({
            data: { username, passwordHash: hash },
        });
        return;
    }
    if (FORCE_ADMIN_RESET) {
        const hash = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.prisma.adminUser.update({
            where: { username },
            data: { passwordHash: hash },
        });
    }
}
function getSession(req) {
    const token = req.cookies?.[SESS_COOKIE];
    if (!token)
        return null;
    return sessions.get(token) ?? null;
}
function requireAdmin(req, res) {
    const sess = getSession(req);
    if (!sess) {
        res.status(401).json({ ok: false, error: "Unauthorized" });
        return null;
    }
    return sess;
}
app.get("/api/health", async (_req, res) => {
    // quick DB check
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        res.json({ ok: true, db: "ok", time: new Date().toISOString() });
    }
    catch (e) {
        res.status(500).json({ ok: false, db: "fail", time: new Date().toISOString() });
    }
});
const LoginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1).max(50),
    password: zod_1.z.string().min(1).max(200),
});
app.post("/api/admin/login", async (req, res) => {
    try {
        const { username, password } = LoginSchema.parse(req.body);
        let user = await prisma_1.prisma.adminUser.findUnique({ where: { username } });
        if (!user) {
            if (username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
                const hash = await bcryptjs_1.default.hash(password, 10);
                user = await prisma_1.prisma.adminUser.create({
                    data: { username, passwordHash: hash },
                });
            }
            else {
                return res.status(401).json({ ok: false, error: "Invalid credentials" });
            }
        }
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ ok: false, error: "Invalid credentials" });
        const token = crypto_1.default.randomBytes(32).toString("hex");
        sessions.set(token, { userId: user.id, username: user.username, createdAt: Date.now() });
        res.cookie(SESS_COOKIE, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: IS_PROD,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ ok: true, username: user.username });
    }
    catch (err) {
        if (err?.name === "ZodError") {
            return res.status(400).json({ ok: false, error: "Invalid input" });
        }
        console.error("POST /api/admin/login error:", err);
        return res.status(500).json({ ok: false, error: "Server error" });
    }
});
app.get("/api/admin/me", async (req, res) => {
    const sess = getSession(req);
    if (!sess)
        return res.status(401).json({ ok: false });
    res.json({ ok: true, username: sess.username });
});
app.post("/api/admin/logout", async (req, res) => {
    const token = req.cookies?.[SESS_COOKIE];
    if (token)
        sessions.delete(token);
    res.clearCookie(SESS_COOKIE, { httpOnly: true, sameSite: "lax", secure: IS_PROD });
    res.json({ ok: true });
});
const ContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80),
    email: zod_1.z.string().email().max(120),
    company: zod_1.z.string().max(120).optional().or(zod_1.z.literal("")),
    message: zod_1.z.string().min(10).max(4000),
    source: zod_1.z.string().max(40).optional(),
});
app.post("/api/contact", async (req, res) => {
    try {
        const parsed = ContactSchema.parse(req.body);
        const lead = await prisma_1.prisma.lead.create({
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
    }
    catch (err) {
        if (err?.name === "ZodError") {
            return res.status(400).json({ ok: false, error: "Invalid input", details: err.errors });
        }
        console.error("POST /api/contact error:", err);
        return res.status(500).json({ ok: false, error: "Server error" });
    }
});
app.get("/api/leads", async (req, res) => {
    const sess = requireAdmin(req, res);
    if (!sess)
        return;
    try {
        const page = Math.max(1, Number(req.query.page || "1"));
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || "20")));
        const skip = (page - 1) * pageSize;
        const [items, total] = await Promise.all([
            prisma_1.prisma.lead.findMany({
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
            prisma_1.prisma.lead.count(),
        ]);
        res.json({ ok: true, items, total, page, pageSize });
    }
    catch (err) {
        console.error("GET /api/leads error:", err);
        res.status(500).json({ ok: false, error: "Server error" });
    }
});
app.listen(PORT, async () => {
    await ensureDefaultAdmin().catch((err) => console.error("ensureDefaultAdmin error:", err));
    console.log(`Backend listening on http://localhost:${PORT}`);
});
