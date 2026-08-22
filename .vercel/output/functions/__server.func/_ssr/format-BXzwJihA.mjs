import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as cn } from "./parse-BCv98ZRn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-BXzwJihA.js
var import_jsx_runtime = require_jsx_runtime();
function Led({ on, warn, fault, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("led", fault ? "led-fault" : warn ? "led-warn" : on ? "led-ok" : "led-off", className),
		"aria-hidden": true
	});
}
function Kpi({ label, value, unit, flag }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-micro uppercase tracking-wider text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("font-mono text-sm tabular-nums leading-tight", flag === "fault" ? "text-fault" : flag === "warn" ? "text-warn" : flag === "ok" ? "text-ok" : "text-data"),
			children: [value, unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "ml-1 text-micro text-muted",
				children: unit
			}) : null]
		})]
	});
}
function Panel({ title, right, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("flex min-h-0 flex-col rounded-lg bg-surface shadow-[var(--shadow-border)]", className),
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between gap-2 border-b border-border px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-micro font-medium uppercase tracking-[0.14em] text-muted",
				children: title
			}), right]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-auto p-3",
			children
		})]
	});
}
//#endregion
export { Led as n, Panel as r, Kpi as t };
