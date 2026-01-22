import { Link } from "react-router-dom";

export default function Services() {
    return (
        <div className="grid gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Services</h1>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="font-semibold">Splunk Support (On-demand)</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-slate-600">
                    <li>Forwarder / HEC ingestion issues</li>
                    <li>props.conf / transforms.conf parsing and sourcetype fixes</li>
                    <li>Index sizing, retention, hot/warm/cold strategy</li>
                    <li>Search optimization and dashboard performance</li>
                </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="font-semibold">Logging Pipeline Consulting</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-slate-600">
                    <li>syslog-ng routing + normalization</li>
                    <li>Sensitive data filtering / masking guidance</li>
                    <li>Kubernetes logging patterns</li>
                </ul>
            </div>

            <Link
                to="/contact"
                className="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
                Contact me
            </Link>
        </div>
    );
}
