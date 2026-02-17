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
        {
            title: "Splunk Architecture & Deployment",
            desc: "Design and implement standalone, clustered, or Splunk Cloud environments.",
        },
        {
            title: "Security & Splunk ES Implementation",
            desc: "Enterprise Security setup, correlation searches, risk-based alerting, SOC optimization.",
        },
        {
            title: "Performance & Cost Optimization",
            desc: "Indexer tuning, search optimization, storage planning, license usage reduction.",
        },
    ];

    const cards_network =[
        // NEW NETWORKING SERVICES
        {
            title: "Network Design & Implementation",
            desc: "LAN, WAN, VLAN, routing, firewall configuration, secure topology design.",
        },
        {
            title: "Network Monitoring & Visibility",
            desc: "SNMP, NetFlow, Syslog integration with Splunk for full network observability.",
        },
        {
            title: "Network Security Hardening",
            desc: "Firewall policies, VPN setup, segmentation, zero-trust architecture.",
        },
    ];

    const cards_linux =[
        // NEW NETWORKING SERVICES
        {
            title: "Network Design & Implementation",
            desc: "LAN, WAN, VLAN, routing, firewall configuration, secure topology design.",
        },
        {
            title: "Network Monitoring & Visibility",
            desc: "SNMP, NetFlow, Syslog integration with Splunk for full network observability.",
        },
        {
            title: "Network Security Hardening",
            desc: "Firewall policies, VPN setup, segmentation, zero-trust architecture.",
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

            <section>
                <h2 className="text-2xl font-bold tracking-tight sm:text-2xl">Splunk:</h2>
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

            <section>
                <h2 className="text-2xl font-bold tracking-tight sm:text-2xl">Networking:</h2>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards_network.map((c) => (
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

            <section>
                <h2 className="text-2xl font-bold tracking-tight sm:text-2xl">Linux:</h2>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards_linux.map((c) => (
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
