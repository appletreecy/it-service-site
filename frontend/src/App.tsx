import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

function Nav() {
    const linkBase =
        "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2";

    const cls = ({ isActive }: { isActive: boolean }) =>
        isActive
            ? `${linkBase} bg-blue-600 text-white hover:bg-blue-700`
            : `${linkBase} border border-slate-300 bg-white text-slate-900 hover:bg-slate-50`;

    return (
        <header className="border-b bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                <div className="font-bold tracking-tight text-slate-900">
                    IT Service Studio
                </div>

                <nav className="flex gap-2">
                    <NavLink to="/" className={cls} end>
                        Home
                    </NavLink>
                    <NavLink to="/services" className={cls}>
                        Services
                    </NavLink>
                    <NavLink to="/contact" className={cls}>
                        Contact
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default function App() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Nav />

            <main className="mx-auto max-w-5xl px-4 py-10">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-5xl px-4 py-5 text-xs text-slate-500">
                    © {new Date().getFullYear()} IT Service Studio · Splunk / Observability
                    / Logging Support
                </div>
            </footer>
        </div>
    );
}
