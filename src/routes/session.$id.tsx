import { createFileRoute } from "@tanstack/react-router";
import { DxWorkspace } from "@/components/dx/workspace";

export const Route = createFileRoute("/session/$id")({ component: SessionPage });

function SessionPage() {
  const { id } = Route.useParams();
  return <DxWorkspace id={id} />;
}
