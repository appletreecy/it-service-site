import React, { useState } from "react";
import type { FormEvent } from "react";

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

const inputCls =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 " +
    "placeholder:text-slate-400 shadow-sm outline-none transition " +
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30";

export default function Contact() {
    const [form, setForm] = useState<ContactForm>({
        name: "",
        email: "",
        company: "",
        message: "",
    });
    const [status, setStatus] = useState<Status>({ state: "idle", msg: "" });

    function onChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
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

            setStatus({
                state: "ok",
                msg: `Submitted. LeadId: ${data.leadId || data.id}`,
            });
            setForm({ name: "", email: "", company: "", message: "" });
        } catch {
            setStatus({ state: "error", msg: "Network error" });
        }
    }

    return (
        <div className="grid max-w-xl gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Contact</h1>
            <p className="text-sm leading-7 text-slate-600">
                Describe your issue (Splunk ingestion/search/dashboard/etc.) and your
                expected timeline.
            </p>

            <form
                onSubmit={onSubmit}
                className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
                <Field label="Name">
                    <input
                        className={inputCls}
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        minLength={2}
                        placeholder="Your name"
                    />
                </Field>

                <Field label="Email">
                    <input
                        className={inputCls}
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        required
                        type="email"
                        placeholder="you@company.com"
                    />
                </Field>

                <Field label="Company (optional)">
                    <input
                        className={inputCls}
                        name="company"
                        value={form.company}
                        onChange={onChange}
                        placeholder="Company"
                    />
                </Field>

                <Field label="Message">
          <textarea
              className={inputCls}
              name="message"
              value={form.message}
              onChange={onChange}
              required
              minLength={10}
              rows={6}
              placeholder="What’s broken? What have you tried? Timeline?"
          />
                </Field>

                <button
                    className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={status.state === "sending"}
                    type="submit"
                >
                    {status.state === "sending" ? "Submitting..." : "Submit"}
                </button>

                {status.state === "ok" && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                        ✅ {status.msg}
                    </div>
                )}

                {status.state === "error" && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                        ❌ {status.msg}
                    </div>
                )}
            </form>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-slate-700">{label}</label>
            {children}
        </div>
    );
}
