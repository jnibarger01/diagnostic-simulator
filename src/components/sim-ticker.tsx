import { useEffect } from "react";
import { useGame } from "@/lib/store/game-store";

export function SimTicker() {
  const step = useGame((s) => s.step);
  useEffect(() => {
    let id = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      step(dt);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [step]);
  return null;
}
