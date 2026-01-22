import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Home() {
    const cards = [
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
    ];

    return (
        <div className="grid gap-8">
            <section className="grid gap-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Fast help for Splunk &amp; IT issues
                </h1>

                <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                    I help teams unblock production problems: Splunk ingestion, parsing
                    (props/transforms), search performance, dashboards, alerts, and general
                    logging pipeline issues.
                </p>

                <div className="flex flex-wrap gap-3">
                    <Button asChild>
                        <Link to="/contact">Book a help request</Link>
                    </Button>

                    <Button asChild variant="outline">
                        <Link to="/services">See services</Link>
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((c) => (
                    <Card key={c.title} className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">{c.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-6 text-muted-foreground">
                            {c.desc}
                        </CardContent>
                    </Card>
                ))}
            </section>
        </div>
    );
}
