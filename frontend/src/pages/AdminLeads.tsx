import { useEffect, useState } from "react";
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

export default function AdminLeads() {
  const [items, setItems] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const pages = Math.max(1, Math.ceil(total / Number(pageSize)));

  useEffect(() => {
    let canceled = false;
    const run = async () => {
      setLoading(true);
      try {
        const r = await fetch(`/api/leads?page=${page}&pageSize=${pageSize}`, { cache: "no-store" });
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
  }, [page, pageSize]);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">All records</CardTitle>
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
    </div>
  );
}
