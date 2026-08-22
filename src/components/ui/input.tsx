import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-micro uppercase tracking-[0.14em] text-muted">{label}</span>
      <div className="mt-1">{children}</div>
      {hint ? <span className="mt-1 block text-micro text-subtle">{hint}</span> : null}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg outline-none ring-1 ring-border placeholder:text-subtle focus:ring-data",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-md bg-elevated px-3 py-2 text-sm leading-relaxed text-fg outline-none ring-1 ring-border placeholder:text-subtle focus:ring-data",
        className,
      )}
      {...props}
    />
  );
}
