import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div style={{ display: "grid", gap: 24 }}>
            <section style={{ display: "grid", gap: 12 }}>
                <h1 style={{ fontSize: 32, margin: 0 }}>Fast help for Splunk & IT issues</h1>
                <p style={{ color: "#374151", lineHeight: 1.6, margin: 0 }}>
                    I help teams unblock production problems: Splunk ingestion, parsing (props/transforms),
                    search performance, dashboards, alerts, and general logging pipeline issues.
                </p>

                <div style={{ display: "flex", gap: 12 }}>
                    <Link to="/contact" className="btn btn-primary">Book a help request</Link>
                    <Link to="/services" className="btn btn-outline">See services</Link>
                </div>
            </section>

            <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {[
                    { title: "Splunk Troubleshooting", desc: "Forwarders, HEC, parsing, indexing, licensing." },
                    { title: "Dashboards & Alerts", desc: "Build actionable dashboards and reduce noise." },
                    { title: "Logging Pipeline", desc: "Syslog-ng, agents, routing, retention, performance." },
                ].map((c) => (
                    <div key={c.title} className="card">
                        <div style={{ fontWeight: 700 }}>{c.title}</div>
                        <div style={{ fontSize: 13, color: "#374151", marginTop: 8 }}>{c.desc}</div>
                    </div>
                ))}
            </section>
        </div>
    );
}
