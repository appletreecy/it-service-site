import { Link } from "react-router-dom";

export default function Services() {
    return (
        <div style={{ display: "grid", gap: 16 }}>
            <h1 style={{ fontSize: 26, margin: 0 }}>Services</h1>

            <div className="card">
                <div style={{ fontWeight: 700 }}>Splunk Support (On-demand)</div>
                <ul style={{ color: "#374151", fontSize: 13, lineHeight: 1.7 }}>
                    <li>Forwarder / HEC ingestion issues</li>
                    <li>props.conf / transforms.conf parsing and sourcetype fixes</li>
                    <li>Index sizing, retention, hot/warm/cold strategy</li>
                    <li>Search optimization and dashboard performance</li>
                </ul>
            </div>

            <div className="card">
                <div style={{ fontWeight: 700 }}>Logging Pipeline Consulting</div>
                <ul style={{ color: "#374151", fontSize: 13, lineHeight: 1.7 }}>
                    <li>syslog-ng routing + normalization</li>
                    <li>Sensitive data filtering / masking guidance</li>
                    <li>Kubernetes logging patterns</li>
                </ul>
            </div>

            <Link to="/contact" className="btn btn-primary" style={{ width: "fit-content" }}>
                Contact me
            </Link>
        </div>
    );
}
