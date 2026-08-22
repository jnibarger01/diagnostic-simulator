import { Link, useRouterState } from "@tanstack/react-router";
import { APP_NAME } from "@/lib/app";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Diagnose" },
  { to: "/sessions", label: "Sessions" },
  { to: "/simulator", label: "Simulator" },
  { to: "/tools", label: "Tools" },
  { to: "/eval", label: "Engine" },
  { to: "/profile", label: "Performance" },
] as const;

export function Shell({
  children,
  badge,
  title,
  sub,
}: {
  children: ReactNode;
  badge?: string;
  title?: string;
  sub?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-20 border-b border-border bg-bg/95 px-3 py-2 backdrop-blur-sm sm:px-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link to="/" className="text-micro uppercase tracking-[0.18em] text-muted hover:text-fg">
                {APP_NAME}
              </Link>
              {badge ? (
                <span className="rounded-sm bg-elevated px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider text-data">
                  {badge}
                </span>
              ) : null}
            </div>
            {title ? <div className="truncate font-medium">{title}</div> : null}
            {sub ? <div className="truncate text-micro text-subtle">{sub}</div> : null}
          </div>
          <nav className="flex w-full gap-1 overflow-x-auto overscroll-x-contain pb-0.5 sm:w-auto">
            {NAV.map((n) => {
              const on = n.to === "/" ? pathname === "/" : pathname === n.to || pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center rounded-sm px-3 text-xs",
                    on ? "bg-elevated text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
