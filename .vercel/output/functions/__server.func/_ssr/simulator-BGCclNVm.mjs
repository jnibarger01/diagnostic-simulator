import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as formatHours } from "./parse-BCv98ZRn.mjs";
import { t as Button } from "./button-CGaT4Hgu.mjs";
import { c as vehicleLine, i as engineLine, n as CASES, s as useGame, t as ACHIEVEMENTS } from "./game-store-Da8KsFNn.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
import { n as Led } from "./format-BXzwJihA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simulator-BGCclNVm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SimBay() {
	const navigate = useNavigate();
	const profile = useGame((s) => s.profile);
	const startCase = useGame((s) => s.startCase);
	const startDaily = useGame((s) => s.startDaily);
	const hydrate = useGame((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	const generated = profile.generatedCases;
	const open = (id) => {
		startCase(id);
		navigate({ to: "/lab" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		badge: "Simulator",
		title: "Hidden-fault cases",
		sub: "Same reasoning engine. The root cause is never injected into the differential.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_18rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-micro uppercase tracking-[0.14em] text-muted",
					children: "Repair orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => void navigate({ to: "/creator" }),
						children: "Case creator"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "primary",
						onClick: () => {
							startDaily();
							navigate({ to: "/lab" });
						},
						children: "Daily challenge"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [CASES.map((c) => {
					const best = profile.bestByCase[c.id];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => open(c.id),
						className: "rounded-lg bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-colors duration-150 hover:bg-elevated",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-micro text-subtle",
										children: ["RO #", c.roNumber]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-lg font-medium",
										children: [
											vehicleLine(c),
											" · ",
											c.title
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted",
										children: engineLine(c)
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, { on: best != null }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-micro uppercase tracking-wider text-muted",
										children: c.difficulty
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 line-clamp-2 text-sm text-muted",
								children: c.concern
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex gap-3 text-micro text-subtle",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.category }),
									best != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-data",
										children: ["Best ", best]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unattempted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Expert ",
										c.expertPathHours.toFixed(1),
										" hr"
									] })
								]
							})
						]
					}, c.id);
				}), generated.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => open(c.id),
					className: "rounded-lg bg-surface p-4 text-left shadow-[var(--shadow-border)] hover:bg-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-micro uppercase tracking-wider text-subtle",
							children: ["Generated · RO #", c.roNumber]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-medium",
							children: vehicleLine(c)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-muted",
							children: c.concern
						})
					]
				}, c.id))]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-micro uppercase tracking-[0.14em] text-muted",
							children: "How this mode works"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "A hidden causal fault drives every PID, DTC, waveform, and inspection. The diagnostic engine only sees what a technician could obtain — never the fault model."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-micro uppercase tracking-[0.14em] text-muted",
							children: "Marks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: ACHIEVEMENTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, { on: profile.achievements.includes(a.id) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: profile.achievements.includes(a.id) ? "text-fg" : "text-muted",
									children: a.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-micro text-subtle",
									children: a.desc
								})] })]
							}, a.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-micro text-subtle",
						children: ["Avg case time ", profile.scores.length ? formatHours(profile.scores.reduce((a, b) => a + b.hours, 0) / profile.scores.length) : "—"]
					})
				]
			})]
		})
	});
}
var SplitComponent = SimBay;
//#endregion
export { SplitComponent as component };
