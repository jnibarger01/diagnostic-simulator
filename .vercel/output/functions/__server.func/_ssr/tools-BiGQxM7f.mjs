import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as parsePidPaste, b as interpretObservation, n as DTC_KB, w as parseDtcCodes } from "./parse-BCv98ZRn.mjs";
import { t as Button } from "./button-CGaT4Hgu.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
import { r as Panel } from "./format-BXzwJihA.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-C_dNiOsd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tools-BiGQxM7f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Tools() {
	const [q, setQ] = (0, import_react.useState)("");
	const [paste, setPaste] = (0, import_react.useState)("");
	const [cond, setCond] = (0, import_react.useState)("idle, fully warm");
	const codes = parseDtcCodes(q);
	const pids = parsePidPaste(paste);
	const obs = interpretObservation(paste, cond);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Tools",
		sub: "DTC reference and data interpreter — evidence, not a parts list.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-5xl gap-3 p-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "DTC reference",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Look up",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "P0171 P0335"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3 text-sm",
					children: (codes.length ? DTC_KB.filter((d) => codes.some((c) => c.code === d.code)) : DTC_KB).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-data",
							children: d.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: d.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: d.meaning
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-micro text-warn",
							children: d.notADiagnosis
						})
					] }, d.code))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Data interpreter",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Condition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cond,
							onChange: (e) => setCond(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Paste PIDs or an observation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: paste,
								onChange: (e) => setPaste(e.target.value),
								placeholder: "RPM 0\nECT 209F\nFuel pressure 48 psi"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						size: "sm",
						onClick: () => setPaste(paste),
						children: "Parse"
					}),
					pids.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 font-mono text-sm",
						children: pids.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: p.key
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-data",
								children: [
									p.value,
									" ",
									p.units ?? ""
								]
							})]
						}, p.raw))
					}) : null,
					obs.tags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-micro text-muted",
						children: ["Interpreted tags: ", obs.tags.join(", ")]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-micro text-subtle",
						children: "No pattern yet. This tool does not invent OEM specifications."
					})
				]
			})]
		})
	});
}
//#endregion
export { Tools as component };
