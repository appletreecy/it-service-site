import React, { useState } from "react";
import type { FormEvent } from "react";


// In production, use same-origin (/api/...) to avoid PNA + CORS issues.
// In dev, you can set VITE_API_BASE_URL="http://localhost:4000" (or leave empty if you proxy in Vite).
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

type ContactForm = {
    name: string;
    email: string;
    company: string;
    message: string;
};

type Status =
    | { state: "idle"; msg: string }
    | { state: "sending"; msg: string }
    | { state: "ok"; msg: string }
    | { state: "error"; msg: string };

export default function Contact() {
    const [form, setForm] = useState<ContactForm>({ name: "", email: "", company: "", message: "" });
    const [status, setStatus] = useState<Status>({ state: "idle", msg: "" });

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    }

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setStatus({ state: "sending", msg: "" });

        try {
            const resp = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, source: "website" }),
            });

            const data = await resp.json();

            if (!resp.ok) {
                setStatus({ state: "error", msg: data?.error || "Submit failed" });
                return;
            }

            setStatus({ state: "ok", msg: `Submitted. LeadId: ${data.leadId || data.id}` });
            setForm({ name: "", email: "", company: "", message: "" });
        } catch {
            setStatus({ state: "error", msg: "Network error" });
        }
    }

    return (
        <div style={{ maxWidth: 560, display: "grid", gap: 12 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Contact</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                Describe your issue (Splunk ingestion/search/dashboard/etc.) and your expected timeline.
            </p>

            <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: 10 }}>
                <Field label="Name">
                    <input className="input" name="name" value={form.name} onChange={onChange} required minLength={2} />
                </Field>

                <Field label="Email">
                    <input className="input" name="email" value={form.email} onChange={onChange} required type="email" />
                </Field>

                <Field label="Company (optional)">
                    <input className="input" name="company" value={form.company} onChange={onChange} />
                </Field>

                <Field label="Message">
                    <textarea className="input" name="message" value={form.message} onChange={onChange} required minLength={10} rows={6} />
                </Field>

                <button className="btn btn-primary" disabled={status.state === "sending"} style={{ border: 0, cursor: "pointer", opacity: status.state === "sending" ? 0.7 : 1 }}>
                    {status.state === "sending" ? "Submitting..." : "Submit"}
                </button>

                {status.state === "ok" && <div style={{ fontSize: 13, color: "#047857" }}>✅ {status.msg}</div>}
                {status.state === "error" && <div style={{ fontSize: 13, color: "#b91c1c" }}>❌ {status.msg}</div>}
            </form>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
            {children}
        </div>
    );
}
