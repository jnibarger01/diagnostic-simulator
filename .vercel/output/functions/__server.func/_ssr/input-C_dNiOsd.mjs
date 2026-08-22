import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as cn } from "./parse-BCv98ZRn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-C_dNiOsd.js
var import_jsx_runtime = require_jsx_runtime();
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-micro uppercase tracking-[0.14em] text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1",
				children
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-micro text-subtle",
				children: hint
			}) : null
		]
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-11 w-full rounded-md bg-elevated px-3 text-sm text-fg outline-none ring-1 ring-border placeholder:text-subtle focus:ring-data", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full rounded-md bg-elevated px-3 py-2 text-sm leading-relaxed text-fg outline-none ring-1 ring-border placeholder:text-subtle focus:ring-data", className),
		...props
	});
}
//#endregion
export { Input as n, Textarea as r, Field as t };
