import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="grid gap-8">
            <section className="grid gap-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Fast help for Splunk &amp; IT issues
                </h1>

                <p className="max-w-2xl text-sm leading-7 text-slate-600">
                    I help teams unblock production problems: Splunk ingestion, parsing
                    (props/transforms), search performance, dashboards, alerts, and general
                    logging pipeline issues.
                </p>

                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        Book a help request
                    </Link>

                    <Link
                        to="/services"
                        className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                        See services
                    </Link>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                    {
                        title: "Splunk Troubleshooting",
                        desc: "Forwarders, HEC, parsing, indexing, licensing.",
                    },
                    {
                        title: "Dashboards & Alerts",
                        desc: "Build actionable dashboards and reduce noise.",
                    },
                    {
                        title: "Logging Pipeline",
                        desc: "Syslog-ng, agents, routing, retention, performance.",
                    },
                ].map((c) => (
                    <div
                        key={c.title}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="font-semibold">{c.title}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">
                            {c.desc}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
