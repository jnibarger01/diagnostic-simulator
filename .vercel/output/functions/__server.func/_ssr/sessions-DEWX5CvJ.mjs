import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as useDx } from "./dx-store-DrlVr6vQ.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
import { r as vehicleTitle, t as LikelihoodMark } from "./common-CLtd-aQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sessions-DEWX5CvJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Sessions() {
	const hydrate = useDx((s) => s.hydrate);
	const sessions = useDx((s) => s.sessions);
	const open = useDx((s) => s.open);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	const active = sessions.filter((s) => s.status !== "closed");
	const closed = sessions.filter((s) => s.status === "closed");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Sessions",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-micro uppercase tracking-[0.14em] text-muted",
					children: "Active"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
					items: active,
					empty: "No active sessions.",
					onOpen: (id) => {
						open(id);
						navigate({
							to: "/session/$id",
							params: { id }
						});
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 text-micro uppercase tracking-[0.14em] text-muted",
					children: "History"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
					items: closed,
					empty: "No closed sessions yet.",
					onOpen: (id) => {
						open(id);
						navigate({
							to: "/session/$id",
							params: { id }
						});
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-block text-sm text-data",
					children: "New diagnosis"
				})
			]
		})
	});
}
function List({ items, empty, onOpen }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 space-y-2",
		children: items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onOpen(s.id),
			className: "w-full rounded-lg bg-surface p-3 text-left shadow-[var(--shadow-border)] hover:bg-elevated",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: vehicleTitle(s.vehicle)
					}), s.hypotheses[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikelihoodMark, { value: s.hypotheses[0].likelihood }) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-sm text-muted",
					children: s.concern
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-micro uppercase tracking-wider text-subtle",
					children: [
						s.mode,
						" · ",
						s.status
					]
				})
			]
		}) }, s.id))
	});
}
//#endregion
export { Sessions as component };
