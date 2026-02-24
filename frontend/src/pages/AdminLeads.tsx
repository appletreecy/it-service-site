import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  source: string | null;
  createdAt: string;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

export default function AdminLeads() {
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pages = Math.max(1, Math.ceil(total / Number(pageSize)));

  useEffect(() => {
    let canceled = false;
    const run = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/admin/me`, { credentials: "include", cache: "no-store" });
        if (canceled) return;
        setAuthed(r.ok);
      } catch {
        if (canceled) return;
        setAuthed(false);
      }
    };
    run();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    const run = async () => {
      setLoading(true);
      try {
        if (!authed) {
          setItems([]);
          setTotal(0);
          return;
        }
        const r = await fetch(`${API_BASE}/api/leads?page=${page}&pageSize=${pageSize}`, {
          cache: "no-store",
          credentials: "include",
        });
        const data = await r.json();
        if (canceled) return;
        if (r.ok && data?.ok) {
          setItems(data.items || []);
          setTotal(data.total || 0);
        } else {
          setItems([]);
          setTotal(0);
        }
      } catch {
        setItems([]);
        setTotal(0);
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    run();
    return () => {
      canceled = true;
    };
  }, [page, pageSize, authed]);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const r = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (r.ok) {
        setAuthed(true);
      } else {
        setLoginError("Invalid username or password");
      }
    } catch {
      setLoginError("Network error");
    }
  };

  const onLogout = async () => {
    await fetch(`${API_BASE}/api/admin/logout`, { method: "POST", credentials: "include" });
    setAuthed(false);
    setItems([]);
    setTotal(0);
    setPage(1);
  };

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
      {!authed ? (
        <Card className="shadow-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-base">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onLogin} className="grid gap-3">
              <input
                className="rounded border bg-background px-3 py-2"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <input
                className="rounded border bg-background px-3 py-2"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {loginError && <div className="text-sm text-red-600">{loginError}</div>}
              <div className="flex justify-end">
                <Button type="submit" disabled={!username || !password}>
                  Log in
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All records</CardTitle>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground border-b">
                  <tr>
                    <th className="py-2 pr-4">Created</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Company</th>
                    <th className="py-2 pr-4">Source</th>
                    <th className="py-2 pr-4">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((l) => (
                    <tr key={l.id} className="border-b align-top">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4">{l.name}</td>
                      <td className="py-2 pr-4">{l.email}</td>
                      <td className="py-2 pr-4">{l.company || "-"}</td>
                      <td className="py-2 pr-4">{l.source || "-"}</td>
                      <td className="py-2 pr-4 max-w-[420px]">
                        <div className="line-clamp-4 break-words">{l.message}</div>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td className="py-6 text-muted-foreground" colSpan={6}>
                        {loading ? "Loading…" : "No records"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Page {page} of {Math.max(1, pages)} · {total} total
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
