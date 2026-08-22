import { createFileRoute } from "@tanstack/react-router";
import { SimBay } from "@/components/sim-bay";

export const Route = createFileRoute("/simulator")({ component: SimBay });
