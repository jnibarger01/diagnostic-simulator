import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { useDx } from "@/lib/store/dx-store";

const TUNDRA = {
  year: "2011",
  make: "Toyota",
  model: "Tundra",
  engine: "5.7L 3UR-FE",
  mileage: "186440",
  vin: "",
  concern:
    "Occasionally stalls while driving. Sometimes starts and immediately dies several times, then later runs normally. No warning lights.",
  lights: "None",
  dtcs: "",
  repairs: "",
  history: "",
  notes: "",
};

const SIENNA = {
  year: "2024",
  make: "Toyota",
  model: "Sienna",
  engine: "2.5L A25A-FXS",
  mileage: "18420",
  vin: "",
  concern: "BSM warning remains on. Rear blind-spot sensor already replaced.",
  lights: "BSM / blind-spot indicator",
  dtcs: "",
  repairs: "Rear BSM sensor replaced — warning still on. Initialization not documented.",
  history: "",
  notes: "",
};

type Form = typeof TUNDRA;

export function IntakeForm() {
  const navigate = useNavigate();
  const start = useDx((s) => s.start);
  const [form, setForm] = useState<Form>({
    year: "",
    make: "Toyota",
    model: "",
    engine: "",
    mileage: "",
    vin: "",
    concern: "",
    lights: "",
    dtcs: "",
    repairs: "",
    history: "",
    notes: "",
  });
  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const begin = () => {
    if (!form.concern.trim()) return;
    const s = start({
      vehicle: {
        year: form.year ? Number(form.year) : undefined,
        make: form.make || undefined,
        model: form.model || undefined,
        engine: form.engine || undefined,
        mileage: form.mileage ? Number(form.mileage.replace(/,/g, "")) : undefined,
        vin: form.vin || undefined,
      },
      concern: form.concern,
      warningLights: form.lights,
      dtcsRaw: form.dtcs,
      recentRepairs: form.repairs,
      serviceHistory: form.history,
      techNotes: form.notes,
      mode: "assistant",
    });
    void navigate({ to: "/session/$id", params: { id: s.id } });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-micro uppercase tracking-[0.18em] text-subtle">Diagnostic assistant</div>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">New diagnosis</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Enter the vehicle and the customer concern. The engine builds a ranked differential and asks the highest-value next question — it will not jump to a part.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => setForm(TUNDRA)}>
            Load stall example
          </Button>
          <Button size="sm" onClick={() => setForm(SIENNA)}>
            Load BSM example
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Year">
          <Input inputMode="numeric" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2011" />
        </Field>
        <Field label="Make">
          <Input value={form.make} onChange={(e) => set("make", e.target.value)} placeholder="Toyota" />
        </Field>
        <Field label="Model">
          <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="Tundra" />
        </Field>
        <Field label="Engine">
          <Input value={form.engine} onChange={(e) => set("engine", e.target.value)} placeholder="5.7L 3UR-FE" />
        </Field>
        <Field label="Mileage">
          <Input inputMode="numeric" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} placeholder="186440" />
        </Field>
        <Field label="VIN" hint="Optional">
          <Input value={form.vin} onChange={(e) => set("vin", e.target.value)} placeholder="" autoComplete="off" />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Customer concern">
          <Textarea
            value={form.concern}
            onChange={(e) => set("concern", e.target.value)}
            placeholder="Occasionally stalls while driving. Sometimes starts and immediately dies…"
          />
        </Field>
      </div>

      <details className="mt-4 rounded-md bg-surface p-3 shadow-[var(--shadow-border)]">
        <summary className="cursor-pointer text-sm text-muted">Optional — lamps, DTCs, history, notes</summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Warning lights">
            <Input value={form.lights} onChange={(e) => set("lights", e.target.value)} placeholder="None / CEL / BSM" />
          </Field>
          <Field label="DTCs if already pulled">
            <Input value={form.dtcs} onChange={(e) => set("dtcs", e.target.value)} placeholder="P0335 P0171" />
          </Field>
          <Field label="Recent repairs">
            <Textarea className="min-h-20" value={form.repairs} onChange={(e) => set("repairs", e.target.value)} />
          </Field>
          <Field label="Service history">
            <Textarea className="min-h-20" value={form.history} onChange={(e) => set("history", e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Technician observations">
              <Textarea className="min-h-20" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Anything already seen on the vehicle" />
            </Field>
          </div>
        </div>
      </details>

      <div className="sticky bottom-3 mt-6 flex justify-end">
        <Button variant="primary" size="lg" disabled={!form.concern.trim()} onClick={begin}>
          Begin diagnosis
        </Button>
      </div>
    </div>
  );
}
