import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { u as cn } from "./parse-BCv98ZRn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-CGaT4Hgu.js
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-1.5 font-medium tracking-tight transition-[opacity,transform,background-color,border-color,color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none select-none", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			secondary: "bg-elevated text-fg border border-border hover:border-muted",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-fault text-fg hover:opacity-90",
			data: "bg-data text-accent-fg hover:opacity-90"
		},
		size: {
			sm: "h-8 px-2.5 text-xs rounded-sm",
			md: "h-10 px-3.5 text-sm rounded-md",
			lg: "h-11 px-4 text-sm rounded-md",
			icon: "size-10 rounded-md",
			rail: "h-9 px-2 text-micro rounded-sm w-full justify-start"
		}
	},
	defaultVariants: {
		variant: "secondary",
		size: "md"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { Button as t };
