import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function Nav() {
    const cls = ({ isActive }: { isActive: boolean }) =>
        `btn ${isActive ? "btn-primary" : "btn-outline"}`;

    return (
        <header className="border-b">
            <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px" }}>
                <div style={{ fontWeight: 700 }}>IT Service Studio</div>
                <nav style={{ display: "flex", gap: 8 }}>
                    <NavLink to="/" className={cls} end>Home</NavLink>
                    <NavLink to="/services" className={cls}>Services</NavLink>
                    <NavLink to="/contact" className={cls}>Contact</NavLink>
                </nav>
            </div>
        </header>
    );
}

export default function App() {
    return (
        <div style={{ minHeight: "100vh" }}>
            <Nav />
            <main className="container" style={{ padding: "40px 16px" }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>

            <footer className="border-t">
                <div className="container muted" style={{ padding: "20px 16px", fontSize: 13 }}>
                    © {new Date().getFullYear()} IT Service Studio · Splunk / Observability / Logging Support
                </div>
            </footer>
        </div>
    );
}
