import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CGaT4Hgu.mjs";
import { o as useDx } from "./dx-store-DrlVr6vQ.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-C_dNiOsd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-eh4sk_fp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TUNDRA = {
	year: "2011",
	make: "Toyota",
	model: "Tundra",
	engine: "5.7L 3UR-FE",
	mileage: "186440",
	vin: "",
	concern: "Occasionally stalls while driving. Sometimes starts and immediately dies several times, then later runs normally. No warning lights.",
	lights: "None",
	dtcs: "",
	repairs: "",
	history: "",
	notes: ""
};
var SIENNA = {
	year: "2024",
	make: "Toyota",
	model: "Sienna",
	engine: "2.5L A25A-FXS",
	mileage: "18420",
	vin: "",
	concern: "BSM warning remains on. Rear blind-spot sensor already replaced.",
	lights: "BSM / blind-spot indicator",
	dtcs: "",
	repairs: "Rear BSM sensor replaced — warning still on. Initialization not documented.",
	history: "",
	notes: ""
};
function IntakeForm() {
	const navigate = useNavigate();
	const start = useDx((s) => s.start);
	const [form, setForm] = (0, import_react.useState)({
		year: "",
		make: "Toyota",
		model: "",
		engine: "",
		mileage: "",
		vin: "",
		concern: "",
		lights: "",
		dtcs: "",
		repairs: "",
		history: "",
		notes: ""
	});
	const set = (k, v) => setForm((f) => ({
		...f,
		[k]: v
	}));
	const begin = () => {
		if (!form.concern.trim()) return;
		const s = start({
			vehicle: {
				year: form.year ? Number(form.year) : void 0,
				make: form.make || void 0,
				model: form.model || void 0,
				engine: form.engine || void 0,
				mileage: form.mileage ? Number(form.mileage.replace(/,/g, "")) : void 0,
				vin: form.vin || void 0
			},
			concern: form.concern,
			warningLights: form.lights,
			dtcsRaw: form.dtcs,
			recentRepairs: form.repairs,
			serviceHistory: form.history,
			techNotes: form.notes,
			mode: "assistant"
		});
		navigate({
			to: "/session/$id",
			params: { id: s.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-4 py-6 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-micro uppercase tracking-[0.18em] text-subtle",
						children: "Diagnostic assistant"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-medium tracking-tight",
						children: "New diagnosis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-xl text-sm text-muted",
						children: "Enter the vehicle and the customer concern. The engine builds a ranked differential and asks the highest-value next question — it will not jump to a part."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setForm(TUNDRA),
						children: "Load stall example"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setForm(SIENNA),
						children: "Load BSM example"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Year",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: form.year,
							onChange: (e) => set("year", e.target.value),
							placeholder: "2011"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Make",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.make,
							onChange: (e) => set("make", e.target.value),
							placeholder: "Toyota"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Model",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.model,
							onChange: (e) => set("model", e.target.value),
							placeholder: "Tundra"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Engine",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.engine,
							onChange: (e) => set("engine", e.target.value),
							placeholder: "5.7L 3UR-FE"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Mileage",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							value: form.mileage,
							onChange: (e) => set("mileage", e.target.value),
							placeholder: "186440"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "VIN",
						hint: "Optional",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.vin,
							onChange: (e) => set("vin", e.target.value),
							placeholder: "",
							autoComplete: "off"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Customer concern",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: form.concern,
						onChange: (e) => set("concern", e.target.value),
						placeholder: "Occasionally stalls while driving. Sometimes starts and immediately dies…"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "mt-4 rounded-md bg-surface p-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "cursor-pointer text-sm text-muted",
					children: "Optional — lamps, DTCs, history, notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Warning lights",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.lights,
								onChange: (e) => set("lights", e.target.value),
								placeholder: "None / CEL / BSM"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "DTCs if already pulled",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.dtcs,
								onChange: (e) => set("dtcs", e.target.value),
								placeholder: "P0335 P0171"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Recent repairs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "min-h-20",
								value: form.repairs,
								onChange: (e) => set("repairs", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Service history",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "min-h-20",
								value: form.history,
								onChange: (e) => set("history", e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Technician observations",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "min-h-20",
									value: form.notes,
									onChange: (e) => set("notes", e.target.value),
									placeholder: "Anything already seen on the vehicle"
								})
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky bottom-3 mt-6 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					size: "lg",
					disabled: !form.concern.trim(),
					onClick: begin,
					children: "Begin diagnosis"
				})
			})
		]
	});
}
function Home() {
	const hydrate = useDx((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		badge: "Assistant",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntakeForm, {})
	});
}
//#endregion
export { Home as component };
