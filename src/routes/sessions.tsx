import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { LikelihoodMark, vehicleTitle } from "@/components/dx/common";
import { useDx } from "@/lib/store/dx-store";
import { useEffect } from "react";

export const Route = createFileRoute("/sessions")({ component: Sessions });

function Sessions() {
  const hydrate = useDx((s) => s.hydrate);
  const sessions = useDx((s) => s.sessions);
  const open = useDx((s) => s.open);
  const navigate = useNavigate();
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  const active = sessions.filter((s) => s.status !== "closed");
  const closed = sessions.filter((s) => s.status === "closed");
  return (
    <Shell title="Sessions">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <h2 className="text-micro uppercase tracking-[0.14em] text-muted">Active</h2>
        <List
          items={active}
          empty="No active sessions."
          onOpen={(id) => {
            open(id);
            void navigate({ to: "/session/$id", params: { id } });
          }}
        />
        <h2 className="mt-8 text-micro uppercase tracking-[0.14em] text-muted">History</h2>
        <List
          items={closed}
          empty="No closed sessions yet."
          onOpen={(id) => {
            open(id);
            void navigate({ to: "/session/$id", params: { id } });
          }}
        />
        <Link to="/" className="mt-6 inline-block text-sm text-data">
          New diagnosis
        </Link>
      </div>
    </Shell>
  );
}

function List({
  items,
  empty,
  onOpen,
}: {
  items: { id: string; concern: string; vehicle: { year?: number; make?: string; model?: string }; mode: string; hypotheses: { likelihood: "very_high" | "high" | "moderate" | "low" | "very_low" }[]; status: string }[];
  empty: string;
  onOpen: (id: string) => void;
}) {
  if (!items.length) return <p className="mt-2 text-sm text-muted">{empty}</p>;
  return (
    <ul className="mt-2 space-y-2">
      {items.map((s) => (
        <li key={s.id}>
          <button onClick={() => onOpen(s.id)} className="w-full rounded-lg bg-surface p-3 text-left shadow-[var(--shadow-border)] hover:bg-elevated">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{vehicleTitle(s.vehicle)}</span>
              {s.hypotheses[0] ? <LikelihoodMark value={s.hypotheses[0].likelihood} /> : null}
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted">{s.concern}</p>
            <p className="mt-1 text-micro uppercase tracking-wider text-subtle">
              {s.mode} · {s.status}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
