import React, { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

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
            <p className="text-sm leading-7 text-muted-foreground">
                Describe your issue (Splunk ingestion/search/dashboard/etc.) and your
                expected timeline.
            </p>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Send a request</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit} className="grid gap-4">
                        <Field label="Name">
                            <Input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                required
                                minLength={2}
                                placeholder="Your name"
                            />
                        </Field>

                        <Field label="Email">
                            <Input
                                name="email"
                                value={form.email}
                                onChange={onChange}
                                required
                                type="email"
                                placeholder="you@company.com"
                            />
                        </Field>

                        <Field label="Company (optional)">
                            <Input
                                name="company"
                                value={form.company}
                                onChange={onChange}
                                placeholder="Company"
                            />
                        </Field>

                        <Field label="Message">
                            <Textarea
                                name="message"
                                value={form.message}
                                onChange={onChange}
                                required
                                minLength={10}
                                rows={6}
                                placeholder="What’s broken? What have you tried? Timeline?"
                            />
                        </Field>

                        <Button disabled={status.state === "sending"} type="submit">
                            {status.state === "sending" ? "Submitting..." : "Submit"}
                        </Button>

                        {status.state === "ok" && (
                            <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
                                <AlertTitle>Submitted</AlertTitle>
                                <AlertDescription>{status.msg}</AlertDescription>
                            </Alert>
                        )}

                        {status.state === "error" && (
                            <Alert className="border-red-200 bg-red-50 text-red-900">
                                <AlertTitle>Submission failed</AlertTitle>
                                <AlertDescription>{status.msg}</AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function Field({
                   label,
                   children,
               }: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-1.5">
            <label className="text-xs font-semibold text-foreground/80">
                {label}
            </label>
            {children}
        </div>
    );
}
