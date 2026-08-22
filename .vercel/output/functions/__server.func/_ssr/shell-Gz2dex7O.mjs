import { d as useRouterState, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as cn } from "./parse-BCv98ZRn.mjs";
import { r as APP_NAME } from "./router-rwpmLnSa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-Gz2dex7O.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Diagnose"
	},
	{
		to: "/sessions",
		label: "Sessions"
	},
	{
		to: "/simulator",
		label: "Simulator"
	},
	{
		to: "/tools",
		label: "Tools"
	},
	{
		to: "/eval",
		label: "Engine"
	},
	{
		to: "/profile",
		label: "Performance"
	}
];
function Shell({ children, badge, title, sub }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-20 border-b border-border bg-bg/95 px-3 py-2 backdrop-blur-sm sm:px-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "text-micro uppercase tracking-[0.18em] text-muted hover:text-fg",
								children: APP_NAME
							}), badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-sm bg-elevated px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider text-data",
								children: badge
							}) : null]
						}),
						title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate font-medium",
							children: title
						}) : null,
						sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-micro text-subtle",
							children: sub
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex w-full gap-1 overflow-x-auto overscroll-x-contain pb-0.5 sm:w-auto",
					children: NAV.map((n) => {
						const on = n.to === "/" ? pathname === "/" : pathname === n.to || pathname.startsWith(n.to + "/");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: n.to,
							className: cn("inline-flex h-10 shrink-0 items-center rounded-sm px-3 text-xs", on ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
							children: n.label
						}, n.to);
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1",
			children
		})]
	});
}
//#endregion
export { Shell as t };
