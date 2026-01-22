import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";

import { Button } from "./components/ui/button";

function Nav() {
    const baseLink =
        "rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
                <div className="font-bold tracking-tight text-foreground">
                    IT Service Studio
                </div>

                <nav className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `${baseLink} ${isActive ? "pointer-events-none opacity-100" : ""}`
                            }
                        >
                            Home
                        </NavLink>
                    </Button>

                    <Button asChild variant="outline" size="sm">
                        <NavLink
                            to="/services"
                            className={({ isActive }) =>
                                `${baseLink} ${isActive ? "pointer-events-none opacity-100" : ""}`
                            }
                        >
                            Services
                        </NavLink>
                    </Button>

                    <Button asChild variant="outline" size="sm">
                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `${baseLink} ${isActive ? "pointer-events-none opacity-100" : ""}`
                            }
                        >
                            Contact
                        </NavLink>
                    </Button>
                </nav>
            </div>
        </header>
    );
}

export default function App() {
    return (
        <div className="min-h-screen bg-muted/30 text-foreground">
            <Nav />

            <main className="mx-auto max-w-5xl px-4 py-10">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>

            <footer className="border-t bg-background">
                <div className="mx-auto max-w-5xl px-4 py-5 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} IT Service Studio · Splunk / Observability
                    / Logging Support
                </div>
            </footer>
        </div>
    );
}
