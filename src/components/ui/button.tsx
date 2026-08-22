import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 font-medium tracking-tight transition-[opacity,transform,background-color,border-color,color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none select-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:opacity-90",
        secondary: "bg-elevated text-fg border border-border hover:border-muted",
        ghost: "text-muted hover:text-fg hover:bg-elevated",
        danger: "bg-fault text-fg hover:opacity-90",
        data: "bg-data text-accent-fg hover:opacity-90",
      },
      size: {
        sm: "h-8 px-2.5 text-xs rounded-sm",
        md: "h-10 px-3.5 text-sm rounded-md",
        lg: "h-11 px-4 text-sm rounded-md",
        icon: "size-10 rounded-md",
        rail: "h-9 px-2 text-micro rounded-sm w-full justify-start",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
