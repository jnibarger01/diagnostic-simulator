import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/format";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { DTC_KB } from "@/lib/dx/knowledge";
import { interpretObservation, parseDtcCodes, parsePidPaste } from "@/lib/dx/parse";

export const Route = createFileRoute("/tools")({ component: Tools });

function Tools() {
  const [q, setQ] = useState("");
  const [paste, setPaste] = useState("");
  const [cond, setCond] = useState("idle, fully warm");
  const codes = parseDtcCodes(q);
  const pids = parsePidPaste(paste);
  const obs = interpretObservation(paste, cond);
  return (
    <Shell title="Tools" sub="DTC reference and data interpreter — evidence, not a parts list.">
      <div className="mx-auto grid max-w-5xl gap-3 p-4 lg:grid-cols-2">
        <Panel title="DTC reference">
          <Field label="Look up">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="P0171 P0335" />
          </Field>
          <ul className="mt-3 space-y-3 text-sm">
            {(codes.length ? DTC_KB.filter((d) => codes.some((c) => c.code === d.code)) : DTC_KB).map((d) => (
              <li key={d.code}>
                <div className="font-mono text-data">{d.code}</div>
                <div className="font-medium">{d.title}</div>
                <p className="text-muted">{d.meaning}</p>
                <p className="mt-1 text-micro text-warn">{d.notADiagnosis}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Data interpreter">
          <Field label="Condition">
            <Input value={cond} onChange={(e) => setCond(e.target.value)} />
          </Field>
          <div className="mt-3">
            <Field label="Paste PIDs or an observation">
              <Textarea value={paste} onChange={(e) => setPaste(e.target.value)} placeholder={"RPM 0\nECT 209F\nFuel pressure 48 psi"} />
            </Field>
          </div>
          <Button className="mt-2" size="sm" onClick={() => setPaste(paste)}>
            Parse
          </Button>
          {pids.length ? (
            <ul className="mt-3 space-y-1 font-mono text-sm">
              {pids.map((p) => (
                <li key={p.raw} className="flex justify-between">
                  <span className="text-muted">{p.key}</span>
                  <span className="text-data">
                    {p.value} {p.units ?? ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {obs.tags.length ? (
            <p className="mt-3 text-micro text-muted">Interpreted tags: {obs.tags.join(", ")}</p>
          ) : (
            <p className="mt-3 text-micro text-subtle">No pattern yet. This tool does not invent OEM specifications.</p>
          )}
        </Panel>
      </div>
    </Shell>
  );
}
