import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateCaseStory } from "@/lib/ai/generate-case";
import { generateLocalCase } from "@/lib/cases/generate";
import type { Difficulty } from "@/lib/sim/types";
import { useGame } from "@/lib/store/game-store";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/creator")({ component: Creator });

function Creator() {
  const navigate = useNavigate();
  const saveGenerated = useGame((s) => s.saveGenerated);
  const startCase = useGame((s) => s.startCase);
  const [prompt, setPrompt] = useState(
    "2011 Toyota Tundra. Intermittent stall. Sometimes dies while driving. Starts and dies several times. Later runs perfectly. No warning lights.",
  );
  const [difficulty, setDifficulty] = useState<Difficulty>("technician");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      let concern = prompt;
      try {
        const r = await generateCaseStory({ data: { prompt, difficulty } });
        if (r.ok && r.concern) concern = r.concern;
      } catch {
        /* local fallback */
      }
      const c = generateLocalCase(concern, difficulty);
      c.concern = concern;
      saveGenerated(c);
      startCase(c.id, c);
      void navigate({ to: "/lab" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not build the case.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell title="Case creator" badge="Simulator">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-8">
        <h1 className="mt-2 text-2xl font-medium">Case creator</h1>
        <p className="mt-2 text-sm text-muted">
          Describe a vehicle and a customer complaint. The lab maps it onto a hidden causal fault. The diagnosis is not shown
          until you close or surrender the ticket.
        </p>
        <label className="mt-6 block text-xs text-muted">
          Complaint
          <textarea
            suppressHydrationWarning
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-md border border-border bg-elevated p-3 text-sm"
          />
        </label>
        <label className="mt-3 block text-xs text-muted">
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="technician">Technician</option>
            <option value="master">Master Tech</option>
          </select>
        </label>
        {error ? <p className="mt-3 text-sm text-fault">{error}</p> : null}
        <Button className="mt-4" variant="primary" disabled={busy || prompt.trim().length < 8} onClick={() => void run()}>
          {busy ? "Building fault model…" : "Generate and clock in"}
        </Button>
      </div>
    </Shell>
  );
}
