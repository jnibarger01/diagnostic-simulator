import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { sampleSignal } from "@/lib/sim/waveforms";
import { useGame } from "@/lib/store/game-store";
import type { SignalKind } from "@/lib/sim/types";

export function Oscilloscope() {
  const def = useGame((s) => s.def)!;
  const vehicle = useGame((s) => s.vehicle)!;
  const scope = useGame((s) => s.scope);
  const setScope = useGame((s) => s.setScope);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef(0);
  const vehicleRef = useRef(vehicle);
  const scopeRef = useRef(scope);
  const defRef = useRef(def);
  vehicleRef.current = vehicle;
  scopeRef.current = scope;
  defRef.current = def;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (!scopeRef.current.paused) tRef.current += dt;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#08090b";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(142,201,192,0.12)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo((w / 10) * i, 0);
        ctx.lineTo((w / 10) * i, h);
        ctx.stroke();
      }
      for (let i = 0; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (h / 8) * i);
        ctx.lineTo(w, (h / 8) * i);
        ctx.stroke();
      }
      const sc = scopeRef.current;
      const d = defRef.current;
      const veh = vehicleRef.current;
      const windowSec = sc.tDiv * 10;
      const n = Math.max(120, Math.floor(w));
      const dtS = windowSec / n;
      const t0 = tRef.current;
      const n1 = d.wiring.nodes.find((x) => x.id === sc.ch1);
      const n2 = d.wiring.nodes.find((x) => x.id === sc.ch2);
      const draw = (kind: SignalKind | undefined, color: string) => {
        if (!kind || kind === "none") return;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.4;
        for (let i = 0; i < n; i++) {
          const v = sampleSignal(kind, t0 + i * dtS, veh, d);
          const y = h / 2 - (v / (sc.vDiv * 8)) * h;
          if (i === 0) ctx.moveTo((i / n) * w, y);
          else ctx.lineTo((i / n) * w, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      };
      draw(n1?.signal, "#8ec9c0");
      draw(n2?.signal, "#c9a36a");
      ctx.fillStyle = "#8b929a";
      ctx.font = "11px IBM Plex Mono, monospace";
      ctx.fillText(`${(sc.tDiv * 1000).toFixed(1)} ms/div   ${sc.vDiv} V/div`, 8, 16);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const tScales = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1];
  const vScales = [0.5, 1, 2, 5, 10, 20];

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-micro text-muted">
          CH1
          <select
            className="ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg"
            value={scope.ch1}
            onChange={(e) => setScope({ ch1: e.target.value })}
          >
            {def.wiring.nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-micro text-muted">
          CH2
          <select
            className="ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg"
            value={scope.ch2}
            onChange={(e) => setScope({ ch2: e.target.value })}
          >
            {def.wiring.nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-micro text-muted">
          Time
          <select
            className="ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg"
            value={scope.tDiv}
            onChange={(e) => setScope({ tDiv: Number(e.target.value) })}
          >
            {tScales.map((t) => (
              <option key={t} value={t}>
                {(t * 1000).toFixed(0)} ms/div
              </option>
            ))}
          </select>
        </label>
        <label className="text-micro text-muted">
          Volt
          <select
            className="ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg"
            value={scope.vDiv}
            onChange={(e) => setScope({ vDiv: Number(e.target.value) })}
          >
            {vScales.map((t) => (
              <option key={t} value={t}>
                {t} V/div
              </option>
            ))}
          </select>
        </label>
        <Button size="sm" onClick={() => setScope({ paused: !scope.paused })}>
          {scope.paused ? "Run" : "Pause"}
        </Button>
      </div>
      <canvas ref={canvasRef} className="min-h-48 w-full flex-1 rounded-md bg-bg" />
      <p className="text-micro text-muted">
        Faults change the trace. A dead CKP is a flat line. A hot failure drops pulses only after the sensor is up to temperature.
        Pick the right node — the scope will not auto-find the circuit for you.
      </p>
    </div>
  );
}
