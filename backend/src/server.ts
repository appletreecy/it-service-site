import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { prisma } from "./prisma";

const app = express();

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req: Request, res: Response) => {
    // quick DB check
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true, db: "ok", time: new Date().toISOString() });
    } catch (e) {
        res.status(500).json({ ok: false, db: "fail", time: new Date().toISOString() });
    }
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

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});
