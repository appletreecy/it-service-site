import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function Services() {
    return (
        <div className="grid gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Services</h1>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Splunk Support (On-demand)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
                        <li>Forwarder / HEC ingestion issues</li>
                        <li>props.conf / transforms.conf parsing and sourcetype fixes</li>
                        <li>Index sizing, retention, hot/warm/cold strategy</li>
                        <li>Search optimization and dashboard performance</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Logging Pipeline Consulting</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
                        <li>syslog-ng routing + normalization</li>
                        <li>Sensitive data filtering / masking guidance</li>
                        <li>Kubernetes logging patterns</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Network Architecture & Consulting</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
                        <li>LAN / WAN design & VLAN segmentation</li>
                        <li>Firewall policy review & secure configuration</li>
                        <li>VPN setup (site-to-site & remote access)</li>
                        <li>Network performance troubleshooting & optimization</li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base">Linux Server Setup & Hardening</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-7 text-muted-foreground">
                        <li>Ubuntu / RHEL server installation & configuration</li>
                        <li>SSH hardening, firewall (UFW / iptables)</li>
                        <li>User access control & privilege management</li>
                        <li>Security baseline & best practice implementation</li>
                    </ul>
                </CardContent>
            </Card>

            <Button asChild className="w-fit">
                <Link to="/contact">Contact me</Link>
            </Button>
        </div>
    );
}
