import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as useDx, t as LIKELIHOOD_LABEL } from "./dx-store-DrlVr6vQ.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eval-CMXl9xGM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EvalPage() {
	const hydrate = useDx((s) => s.hydrate);
	const evals = useDx((s) => s.evals);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Engine evaluation",
		sub: "Simulator cases scoring the same reasoning engine. Hidden faults never enter the differential.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-6",
			children: [
				!evals.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Close a simulator RO to record an evaluation. The harness compares the true hidden cause against the engine’s rank after each evidence step."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: evals.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-micro text-subtle",
								children: e.caseId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-sm",
								children: [
									"Initial rank ",
									e.initialRank ?? "—",
									" → final ",
									e.finalRank ?? "—",
									" · ",
									e.reachedVeryHigh ? "reached Very High" : "did not reach Very High",
									" · ",
									e.confirmed ? "confirmed" : "not confirmed"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-micro text-muted",
								children: [
									"Steps ",
									e.steps,
									" · Questions ",
									e.questionsAsked,
									" · Tests ",
									e.testsRecommended.length,
									e.unnecessaryTests.length ? ` · Extra tests: ${e.unnecessaryTests.join(", ")}` : ""
								]
							}),
							e.falseHypothesesRetained.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-micro text-warn",
								children: ["Still ranked high (not the cause): ", e.falseHypothesesRetained.join("; ")]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-2 space-y-0.5 font-mono text-micro text-subtle",
								children: e.log.slice(-8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									s.trigger,
									" · true #",
									s.trueCauseRank ?? "—",
									" ",
									s.trueCauseLikelihood ? LIKELIHOOD_LABEL[s.trueCauseLikelihood] : ""
								] }, s.at))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-micro text-subtle",
								children: "True cause is recorded only in this evaluation view — not shown during the case."
							})
						]
					}, e.sessionId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/simulator",
					className: "mt-6 inline-block text-sm text-data",
					children: "Open simulator"
				})
			]
		})
	});
}
//#endregion
export { EvalPage as component };
