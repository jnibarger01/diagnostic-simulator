import { createFileRoute } from "@tanstack/react-router";
import { IntakeForm } from "@/components/dx/intake-form";
import { Shell } from "@/components/shell";
import { useDx } from "@/lib/store/dx-store";
import { useEffect } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const hydrate = useDx((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return (
    <Shell badge="Assistant">
      <IntakeForm />
    </Shell>
  );
}
