import { v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as formatHours } from "./parse-BCv98ZRn.mjs";
import { c as vehicleLine, n as CASES, s as useGame, t as ACHIEVEMENTS } from "./game-store-Da8KsFNn.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
import { n as Led } from "./format-BXzwJihA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-NghdQcGp.js
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const p = useGame((s) => s.profile);
	const avg = p.scores.length ? Math.round(p.scores.reduce((a, b) => a + b.score, 0) / p.scores.length) : 0;
	const byCat = {
		electrical: avgCat("electrical"),
		driveability: avgCat("driveability"),
		network: avgCat("network"),
		"no-start": avgCat("no-start")
	};
	function avgCat(cat) {
		const ids = CASES.filter((c) => c.category === cat).map((c) => c.id);
		const hits = p.scores.filter((s) => ids.includes(s.caseId));
		if (!hits.length) return 0;
		return Math.round(hits.reduce((a, b) => a + b.score, 0) / hits.length);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Tech file",
		sub: `Local to this browser. Level ${p.level}.`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-6 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3",
					children: [
						["Closed", p.casesCompleted],
						["Average", avg],
						["First-time", p.casesCompleted ? `${Math.round(p.firstTimeHits / p.casesCompleted * 100)}%` : "—"],
						["Cannon hits", p.unnecessaryParts],
						["Driveability", `${byCat.driveability}`],
						["Electrical", `${byCat.electrical}`],
						["Network", `${byCat.network}`],
						["No-start", `${byCat["no-start"]}`]
					].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-micro uppercase tracking-wider text-subtle",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xl tabular-nums text-data",
							children: v
						})]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 text-micro uppercase tracking-[0.14em] text-muted",
					children: "History"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-2 space-y-2",
					children: [p.scores.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "No closed tickets yet."
					}) : null, p.scores.map((s, i) => {
						const c = CASES.find((x) => x.id === s.caseId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between rounded-md bg-surface px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c ? vehicleLine(c) : s.caseId }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-data",
								children: [
									s.score,
									" · ",
									formatHours(s.hours)
								]
							})]
						}, i);
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 text-micro uppercase tracking-[0.14em] text-muted",
					children: "Marks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: ACHIEVEMENTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, { on: p.achievements.includes(a.id) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: p.achievements.includes(a.id) ? "" : "text-muted",
							children: [
								a.label,
								" — ",
								a.desc
							]
						})]
					}, a.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/eval",
					className: "mt-6 inline-block text-sm text-data",
					children: "Engine evaluation"
				})
			]
		})
	});
}
//#endregion
export { Profile as component };
