import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as formatHours, u as cn, v as formatMoney, y as formatPid } from "./parse-BCv98ZRn.mjs";
import { t as Button } from "./button-CGaT4Hgu.mjs";
import { o as useDx } from "./dx-store-DrlVr6vQ.mjs";
import { a as runHealthCheck, c as vehicleLine, i as engineLine, o as sampleSignal, r as INSPECTION_AREAS, s as useGame } from "./game-store-Da8KsFNn.mjs";
import { n as Led, r as Panel, t as Kpi } from "./format-BXzwJihA.mjs";
import { t as LikelihoodMark } from "./common-CLtd-aQn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab-BUN9d077.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SimTicker() {
	const step = useGame((s) => s.step);
	(0, import_react.useEffect)(() => {
		let id = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .1);
			last = now;
			step(dt);
			id = requestAnimationFrame(loop);
		};
		id = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(id);
	}, [step]);
	return null;
}
var PID_META = [
	{
		id: "rpm",
		label: "Engine RPM",
		unit: "rpm",
		group: "Engine",
		basic: true
	},
	{
		id: "vss",
		label: "Vehicle Speed",
		unit: "mph",
		group: "Engine",
		basic: true
	},
	{
		id: "coolantF",
		label: "Coolant Temp",
		unit: "°F",
		group: "Engine",
		basic: true
	},
	{
		id: "iatF",
		label: "Intake Air Temp",
		unit: "°F",
		group: "Engine",
		basic: true
	},
	{
		id: "batteryV",
		label: "Battery Voltage",
		unit: "V",
		group: "Electrical",
		basic: true
	},
	{
		id: "tps",
		label: "Throttle Position",
		unit: "%",
		group: "Engine",
		basic: true
	},
	{
		id: "accel",
		label: "Accelerator",
		unit: "%",
		group: "Engine",
		basic: true
	},
	{
		id: "maf",
		label: "MAF",
		unit: "g/s",
		group: "Fuel",
		basic: true
	},
	{
		id: "map",
		label: "MAP",
		unit: "kPa",
		group: "Fuel",
		basic: true
	},
	{
		id: "load",
		label: "Calc. Load",
		unit: "%",
		group: "Engine",
		basic: true
	},
	{
		id: "stft",
		label: "STFT B1",
		unit: "%",
		group: "Fuel",
		basic: true
	},
	{
		id: "ltft",
		label: "LTFT B1",
		unit: "%",
		group: "Fuel",
		basic: true
	},
	{
		id: "afr",
		label: "A/F Sensor B1S1",
		unit: "λ",
		group: "Fuel",
		basic: false
	},
	{
		id: "o2dn",
		label: "O2 B1S2",
		unit: "V",
		group: "Fuel",
		basic: false
	},
	{
		id: "fuelPsi",
		label: "Fuel Pressure",
		unit: "psi",
		group: "Fuel",
		basic: false
	},
	{
		id: "ignTiming",
		label: "Ignition Timing",
		unit: "°",
		group: "Ignition",
		basic: false
	},
	{
		id: "altV",
		label: "Alternator",
		unit: "V",
		group: "Electrical",
		basic: false
	},
	{
		id: "componentF",
		label: "Component Temp*",
		unit: "°F",
		group: "Engine",
		basic: false
	}
];
function pidValue(state, id) {
	return {
		rpm: state.rpm,
		vss: state.vss,
		coolantF: state.coolantF,
		iatF: state.iatF,
		batteryV: state.batteryV,
		tps: state.tps,
		accel: state.accel,
		maf: state.maf,
		map: state.map,
		load: state.load,
		stft: state.stft,
		ltft: state.ltft,
		afr: state.afr,
		o2dn: state.o2dn,
		fuelPsi: state.fuelPsi,
		ignTiming: state.ignTiming,
		altV: state.altV,
		componentF: state.componentF
	}[id] ?? 0;
}
var TABS = [
	"Health",
	"DTCs",
	"Data",
	"Graph",
	"Utility"
];
function ScanTool() {
	const def = useGame((s) => s.def);
	const vehicle = useGame((s) => s.vehicle);
	const pinned = useGame((s) => s.pinned);
	const pinPid = useGame((s) => s.pinPid);
	const history = useGame((s) => s.pidHistory);
	const scanVehicle = useGame((s) => s.scanVehicle);
	const clearDtcs = useGame((s) => s.clearDtcs);
	const [tab, setTab] = (0, import_react.useState)("Health");
	const health = (0, import_react.useMemo)(() => runHealthCheck(vehicle, def), [vehicle, def]);
	const pids = PID_META.filter((p) => def.pidSet === "full" || p.basic);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 border-b border-border bg-elevated px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-xs tracking-wider text-data",
					children: "TECHSTREAM · GTS+"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-micro text-muted",
					children: [
						def.vehicle.vin,
						" · ",
						def.vehicle.engine,
						" · cal ",
						def.roNumber,
						"A"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, {
						fault: vehicle.mil,
						on: !vehicle.mil
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-micro uppercase tracking-wider text-muted",
						children: vehicle.mil ? "MIL" : "READY"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 border-b border-border px-2 py-1",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setTab(t);
						if (t === "Health" || t === "DTCs") scanVehicle();
					},
					className: cn("rounded-sm px-2.5 py-1.5 text-xs transition-colors duration-150", tab === t ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-auto p-3",
				children: [
					tab === "Health" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-micro uppercase tracking-wider text-subtle",
							children: "Modules"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: health.comms.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-sm bg-elevated px-2 py-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: m.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("font-mono", m.online ? "text-ok" : "text-fault"),
									children: m.online ? "ONLINE" : "NO COMM"
								})]
							}, m.id))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mb-2 text-micro uppercase tracking-wider text-subtle",
								children: "Readiness"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: Object.entries(health.ready).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between rounded-sm bg-elevated px-2 py-1.5 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: k
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("font-mono", v ? "text-ok" : "text-warn"),
										children: v ? "COMPLETE" : "NOT READY"
									})]
								}, k))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-micro text-muted",
								children: [
									"Confirmed DTCs ",
									health.confirmed,
									" · Pending ",
									health.pending
								]
							})
						] })]
					}),
					tab === "DTCs" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: vehicle.dtcs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "No codes stored."
						}) : vehicle.dtcs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-md bg-elevated p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-sm text-fault",
										children: d.code
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-micro uppercase tracking-wider text-muted",
										children: [
											d.status,
											" · ",
											d.module.toUpperCase(),
											d.mil ? " · MIL" : ""
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm",
									children: d.description
								}),
								d.freezeFrame ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-2 grid grid-cols-3 gap-2 text-micro font-mono text-data sm:grid-cols-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["RPM ", d.freezeFrame.rpm] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["VSS ", d.freezeFrame.vss] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"ECT ",
											d.freezeFrame.ect,
											"°F"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"STFT ",
											d.freezeFrame.stft,
											"%"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"LTFT ",
											d.freezeFrame.ltft,
											"%"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["MAF ", d.freezeFrame.maf] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["MAP ", d.freezeFrame.map] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"IAT ",
											d.freezeFrame.iat,
											"°F"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"VPWR ",
											d.freezeFrame.vpwr,
											"V"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"LOAD ",
											d.freezeFrame.load,
											"%"
										] })
									]
								}) : null
							]
						}, d.code + d.setSimTime))
					}),
					tab === "Data" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-1 sm:grid-cols-2",
						children: pids.map((p) => {
							const v = pidValue(vehicle, p.id);
							const on = pinned.includes(p.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => pinPid(p.id),
								className: cn("flex items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs", on ? "bg-elevated" : "hover:bg-elevated/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: p.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono tabular-nums text-data",
									children: [
										formatPid(p.id, v),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-subtle",
											children: p.unit
										}),
										on ? " · PIN" : ""
									]
								})]
							}, p.id);
						})
					}),
					tab === "Graph" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PidGraph, {
						ids: pinned,
						history
					}),
					tab === "Utility" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Clearing codes does not repair the vehicle. Recreate the condition to see if they return."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: clearDtcs,
							children: "Clear DTCs"
						})]
					})
				]
			})
		]
	});
}
function PidGraph({ ids, history }) {
	if (ids.length === 0 || history.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "Pin PIDs in Data, then graph them here or during a test drive."
	});
	const w = 640;
	const h = 220;
	const t0 = history[0].t;
	const t1 = history[history.length - 1].t;
	const span = Math.max(1, t1 - t0);
	const colors = [
		"#8ec9c0",
		"#c5cdd6",
		"#c9a36a",
		"#d16b6b",
		"#6fbf9a",
		"#9aa8b8"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: "w-full rounded-md bg-bg",
		role: "img",
		children: [[
			.25,
			.5,
			.75
		].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: 0,
			x2: w,
			y1: h * y,
			y2: h * y,
			stroke: "#2a2e34",
			strokeWidth: 1
		}, y)), ids.map((id, i) => {
			const vals = history.map((s) => Number(s[id] ?? 0));
			const min = Math.min(...vals);
			const rng = Math.max(...vals) - min || 1;
			const d = history.map((s, idx) => {
				const x = (s.t - t0) / span * w;
				const y = h - (Number(s[id] ?? 0) - min) / rng * 212 - 4;
				return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
			}).join(" ");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d,
				fill: "none",
				stroke: colors[i % colors.length],
				strokeWidth: 1.5
			}, id);
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-3 text-micro",
		children: ids.map((id, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono",
			style: { color: colors[i % colors.length] },
			children: id
		}, id))
	})] });
}
function Oscilloscope() {
	const def = useGame((s) => s.def);
	const vehicle = useGame((s) => s.vehicle);
	const scope = useGame((s) => s.scope);
	const setScope = useGame((s) => s.setScope);
	const canvasRef = (0, import_react.useRef)(null);
	const tRef = (0, import_react.useRef)(0);
	const vehicleRef = (0, import_react.useRef)(vehicle);
	const scopeRef = (0, import_react.useRef)(scope);
	const defRef = (0, import_react.useRef)(def);
	vehicleRef.current = vehicle;
	scopeRef.current = scope;
	defRef.current = def;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min((now - last) / 1e3, .1);
			last = now;
			if (!scopeRef.current.paused) tRef.current += dt;
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const w = canvas.clientWidth;
			const h = canvas.clientHeight;
			if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
				canvas.width = Math.floor(w * dpr);
				canvas.height = Math.floor(h * dpr);
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.fillStyle = "#08090b";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "rgba(142,201,192,0.12)";
			ctx.lineWidth = 1;
			for (let i = 0; i <= 10; i++) {
				ctx.beginPath();
				ctx.moveTo(w / 10 * i, 0);
				ctx.lineTo(w / 10 * i, h);
				ctx.stroke();
			}
			for (let i = 0; i <= 8; i++) {
				ctx.beginPath();
				ctx.moveTo(0, h / 8 * i);
				ctx.lineTo(w, h / 8 * i);
				ctx.stroke();
			}
			const sc = scopeRef.current;
			const d = defRef.current;
			const veh = vehicleRef.current;
			const windowSec = sc.tDiv * 10;
			const n = Math.max(120, Math.floor(w));
			const dtS = windowSec / n;
			const t0 = tRef.current;
			const n1 = d.wiring.nodes.find((x) => x.id === sc.ch1);
			const n2 = d.wiring.nodes.find((x) => x.id === sc.ch2);
			const draw = (kind, color) => {
				if (!kind || kind === "none") return;
				ctx.beginPath();
				ctx.strokeStyle = color;
				ctx.shadowColor = color;
				ctx.shadowBlur = 8;
				ctx.lineWidth = 1.4;
				for (let i = 0; i < n; i++) {
					const v = sampleSignal(kind, t0 + i * dtS, veh, d);
					const y = h / 2 - v / (sc.vDiv * 8) * h;
					if (i === 0) ctx.moveTo(i / n * w, y);
					else ctx.lineTo(i / n * w, y);
				}
				ctx.stroke();
				ctx.shadowBlur = 0;
			};
			draw(n1?.signal, "#8ec9c0");
			draw(n2?.signal, "#c9a36a");
			ctx.fillStyle = "#8b929a";
			ctx.font = "11px IBM Plex Mono, monospace";
			ctx.fillText(`${(sc.tDiv * 1e3).toFixed(1)} ms/div   ${sc.vDiv} V/div`, 8, 16);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-micro text-muted",
						children: ["CH1", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg",
							value: scope.ch1,
							onChange: (e) => setScope({ ch1: e.target.value }),
							children: def.wiring.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n.id,
								children: n.label
							}, n.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-micro text-muted",
						children: ["CH2", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg",
							value: scope.ch2,
							onChange: (e) => setScope({ ch2: e.target.value }),
							children: def.wiring.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: n.id,
								children: n.label
							}, n.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-micro text-muted",
						children: ["Time", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg",
							value: scope.tDiv,
							onChange: (e) => setScope({ tDiv: Number(e.target.value) }),
							children: [
								.001,
								.002,
								.005,
								.01,
								.02,
								.05,
								.1
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: t,
								children: [(t * 1e3).toFixed(0), " ms/div"]
							}, t))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-micro text-muted",
						children: ["Volt", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "ml-1 rounded-sm border border-border bg-elevated px-2 py-1 text-xs text-fg",
							value: scope.vDiv,
							onChange: (e) => setScope({ vDiv: Number(e.target.value) }),
							children: [
								.5,
								1,
								2,
								5,
								10,
								20
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: t,
								children: [t, " V/div"]
							}, t))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setScope({ paused: !scope.paused }),
						children: scope.paused ? "Run" : "Pause"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "min-h-48 w-full flex-1 rounded-md bg-bg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-micro text-muted",
				children: "Faults change the trace. A dead CKP is a flat line. A hot failure drops pulses only after the sensor is up to temperature. Pick the right node — the scope will not auto-find the circuit for you."
			})
		]
	});
}
var MODES = [
	{
		id: "dcv",
		label: "DC V"
	},
	{
		id: "acv",
		label: "AC V"
	},
	{
		id: "ohm",
		label: "Ω"
	},
	{
		id: "continuity",
		label: "CONT"
	},
	{
		id: "vdrop",
		label: "V DROP"
	}
];
function Dvom() {
	const def = useGame((s) => s.def);
	const dvom = useGame((s) => s.dvom);
	const setDvom = useGame((s) => s.setDvom);
	const measure = useGame((s) => s.measure);
	const vehicle = useGame((s) => s.vehicle);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[18rem_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg bg-elevated p-4 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-micro uppercase tracking-wider text-subtle",
					children: "Fluke-style meter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-sm bg-bg px-3 py-4 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-4xl tabular-nums tracking-tight text-data",
						children: dvom.last?.display ?? "0.00"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted",
						children: dvom.last?.unit || MODES.find((m) => m.id === dvom.mode)?.label
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-5 gap-1",
					children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDvom({
							mode: m.id,
							last: null
						}),
						className: cn("rounded-sm py-2 text-micro", dvom.mode === m.id ? "bg-accent text-accent-fg" : "bg-surface text-muted"),
						children: m.label
					}, m.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					variant: "data",
					onClick: measure,
					children: "Measure"
				}),
				dvom.last?.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-warn",
					children: dvom.last.note
				}) : null,
				dvom.last && !dvom.last.valid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-fault",
					children: "Setup invalid — reading is not trustworthy."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-micro text-muted",
					children: [
						"Key is ",
						vehicle.key.toUpperCase(),
						". Resistance with power applied is invalid."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 text-micro uppercase tracking-wider text-subtle",
				children: "Probe points"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Red", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "mt-1 w-full rounded-sm border border-border bg-elevated px-2 py-2 text-sm text-fg",
						value: dvom.red,
						onChange: (e) => setDvom({ red: e.target.value }),
						children: def.wiring.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: n.id,
							children: n.label
						}, n.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-xs text-muted",
					children: ["Black", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "mt-1 w-full rounded-sm border border-border bg-elevated px-2 py-2 text-sm text-fg",
						value: dvom.black,
						onChange: (e) => setDvom({ black: e.target.value }),
						children: def.wiring.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: n.id,
							children: n.label
						}, n.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "Points come from the case wiring. The meter will not highlight the correct circuit. Wrong mode on a VR sensor, or ohms across a live feed, returns a misleading number — just like the bench."
			})
		] })]
	});
}
var DRIVES = [
	{
		id: "idle",
		label: "Idle",
		note: "Park, fully warm or cold idle"
	},
	{
		id: "city",
		label: "City",
		note: "20–35 mph, light load"
	},
	{
		id: "highway",
		label: "Highway",
		note: "Cruise, heat the engine"
	},
	{
		id: "accel",
		label: "WOT / accel",
		note: "Load the fuel and ignition"
	},
	{
		id: "decel",
		label: "Decel",
		note: "Closed throttle, DFCO"
	},
	{
		id: "stop_go",
		label: "Stop-and-go",
		note: "Vibration, idle-to-off-idle"
	},
	{
		id: "hill",
		label: "Hill / load",
		note: "High load, high temp"
	},
	{
		id: "hot_soak",
		label: "Hot soak",
		note: "Key off after a heat run"
	}
];
function DriveTool() {
	const vehicle = useGame((s) => s.vehicle);
	const setDriveMode = useGame((s) => s.setDriveMode);
	const overnight = useGame((s) => s.overnight);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-2 sm:grid-cols-2",
		children: [DRIVES.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setDriveMode(d.id),
			className: cn("rounded-md px-3 py-3 text-left transition-colors duration-150", vehicle.mode === d.id ? "bg-elevated shadow-[var(--shadow-border)]" : "bg-surface hover:bg-elevated"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: d.label
				}), vehicle.mode === d.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, { on: true }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, {})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-micro text-muted",
				children: d.note
			})]
		}, d.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: overnight,
			className: "rounded-md bg-surface px-3 py-3 text-left hover:bg-elevated sm:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium",
				children: "Park overnight (12 h key-off)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-micro text-muted",
				children: "Advances parasitic draw and battery SOC. Use on no-crank-after-sit complaints."
			})]
		})]
	});
}
function InspectTool() {
	const inspect = useGame((s) => s.inspect);
	const doWiggle = useGame((s) => s.doWiggle);
	const results = useGame((s) => s.testResults.filter((t) => t.id.startsWith("inspect") || t.id === "wiggle"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-2",
			children: [INSPECTION_AREAS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				className: "h-auto min-h-11 whitespace-normal py-2 text-left",
				onClick: () => inspect(a.id),
				children: a.label
			}, a.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "data",
				className: "col-span-2",
				onClick: () => {
					doWiggle();
					inspect("harness", true);
				},
				children: "Wiggle test (loaded harness)"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Pick an area. Some faults only show in the right place."
			}) : null, results.slice(0, 6).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-md bg-elevated p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-medium",
						children: r.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: r.narrative
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1",
						children: r.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-2 text-micro",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: l.k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: l.flag === "fault" ? "text-fault" : l.flag === "warn" ? "text-warn" : "text-data",
								children: l.v
							})]
						}, l.k))
					})
				]
			}, r.id + r.title))]
		})]
	});
}
function BenchTests({ kind }) {
	const runTest = useGame((s) => s.runTest);
	const show = useGame((s) => s.testResults).filter((r) => kind === "electrical" ? r.id === "parasitic" || r.id === "charging" : r.id === kind);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			kind === "smoke" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => runTest("smoke"),
				children: "Run smoke test"
			}),
			kind === "fuel" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => runTest("fuel"),
				children: "Gauge fuel pressure"
			}),
			kind === "electrical" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => runTest("parasitic"),
					children: "Parasitic draw"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => runTest("charging"),
					children: "Charging system"
				})]
			}),
			show.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-md bg-elevated p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: r.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: r.narrative
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-2 space-y-1",
						children: r.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-subtle",
								children: l.k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: l.flag === "fault" ? "text-fault font-mono" : "font-mono text-data",
								children: l.v
							})]
						}, l.k))
					})
				]
			}, r.id))
		]
	});
}
function WiringTool() {
	const def = useGame((s) => s.def);
	const setDvom = useGame((s) => s.setDvom);
	const setScope = useGame((s) => s.setScope);
	const setTool = useGame((s) => s.setTool);
	const [sel, setSel] = (0, import_react.useState)(null);
	const d = def.wiring;
	const node = (id) => d.nodes.find((n) => n.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 text-micro uppercase tracking-wider text-subtle",
				children: [d.title, " — click a node to probe"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 100 100",
				className: "min-h-56 w-full flex-1 rounded-md bg-bg",
				children: [d.wires.map((w, i) => {
					const a = node(w.from);
					const b = node(w.to);
					if (!a || !b) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: a.x,
						y1: a.y,
						x2: b.x,
						y2: b.y,
						stroke: {
							blk: "#8b929a",
							wht: "#e6e8ea",
							red: "#d16b6b",
							grn: "#6fbf9a",
							yel: "#c9a36a",
							blu: "#8ec9c0",
							brn: "#a07858",
							org: "#d4a06a",
							ppl: "#a8a0b8",
							gry: "#6b7280"
						}[w.color] ?? "#8b929a",
						strokeWidth: .7
					}, i);
				}), d.nodes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
					onClick: () => setSel(n.id),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: n.x,
						cy: n.y,
						r: 2.4,
						fill: sel === n.id ? "#8ec9c0" : "#171a1e",
						stroke: "#c5cdd6",
						strokeWidth: .4
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
						x: n.x + 3,
						y: n.y + 1,
						fontSize: 2.6,
						fill: "#8b929a",
						children: n.label
					})]
				}, n.id))]
			}),
			sel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-center gap-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: d.nodes.find((n) => n.id === sel)?.label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => {
							setDvom({ red: sel });
							setTool("dvom");
						},
						children: "Probe with DVOM"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => {
							setScope({ ch1: sel });
							setTool("scope");
						},
						children: "Scope this node"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-micro text-muted",
				children: "The full circuit is not auto-highlighted. You choose the points."
			})
		]
	});
}
function PartsTool() {
	const def = useGame((s) => s.def);
	const offerReplace = useGame((s) => s.offerReplace);
	const replaced = useGame((s) => s.partsReplaced);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "You may replace anything. Wrong parts stay on the ticket and the vehicle stays broken. Evidence is scored."
		}), def.components.map((c) => {
			const done = replaced.some((r) => r.id === c.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 rounded-md bg-elevated px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-micro text-muted",
					children: [
						"$",
						c.partCost,
						" · ",
						c.laborHours.toFixed(1),
						" hr · ",
						c.group
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: done ? "ghost" : "primary",
					disabled: done,
					onClick: () => offerReplace(c.id),
					children: done ? "Installed" : "Replace"
				})]
			}, c.id);
		})]
	});
}
function InterviewTool() {
	const def = useGame((s) => s.def);
	const log = useGame((s) => s.interviewLog);
	const ask = useGame((s) => s.askCustomer);
	const [q, setQ] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: def.interview.greeting
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 min-h-0 flex-1 space-y-2 overflow-auto",
				children: log.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-subtle",
						children: "You"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm",
						children: t.q
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-subtle",
						children: "Customer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-data",
						children: t.a
					})
				] }, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-1",
				children: [
					"When did this start?",
					"Does it happen hot or cold?",
					"Any warning lights?",
					"Any recent repairs?",
					"Does restarting fix it?",
					"Does it happen after refueling?"
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => ask(c),
					className: "rounded-sm bg-elevated px-2 py-1 text-micro text-muted hover:text-fg",
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-2 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					ask(q);
					setQ("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Ask in plain language",
					className: "h-10 min-w-0 flex-1 rounded-md border border-border bg-elevated px-3 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "primary",
					children: "Ask"
				})]
			})
		]
	});
}
var STATUSES = [
	"possible",
	"likely",
	"unlikely",
	"ruled_out",
	"confirmed"
];
function HypothesisTool() {
	const list = useGame((s) => s.hypotheses);
	const add = useGame((s) => s.addHypothesis);
	const setHypothesis = useGame((s) => s.setHypothesis);
	const addEvidence = useGame((s) => s.addEvidence);
	const [text, setText] = (0, import_react.useState)("");
	const [ev, setEv] = (0, import_react.useState)({});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					add(text);
					setText("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "e.g. CKP failing hot",
					className: "h-10 min-w-0 flex-1 rounded-md border border-border bg-elevated px-3 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "primary",
					children: "Add"
				})]
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Name what you think is wrong. Attach evidence. Guessing without tests will show on the scorecard."
			}) : null,
			list.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-md bg-elevated p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: h.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: h.status,
							onChange: (e) => setHypothesis(h.id, e.target.value),
							className: "rounded-sm border border-border bg-surface px-2 py-1 text-micro",
							children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s.replace("_", " ")
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-xs",
						children: [h.evidence.plus.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-ok",
							children: ["+ ", e]
						}, i)), h.evidence.minus.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-fault",
							children: ["− ", e]
						}, i))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: ev[h.id] ?? "",
								onChange: (e) => setEv({
									...ev,
									[h.id]: e.target.value
								}),
								placeholder: "Evidence note",
								className: "h-8 min-w-0 flex-1 rounded-sm border border-border bg-surface px-2 text-xs"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => {
									addEvidence(h.id, "plus", ev[h.id] ?? "");
									setEv({
										...ev,
										[h.id]: ""
									});
								},
								children: "+"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => {
									addEvidence(h.id, "minus", ev[h.id] ?? "");
									setEv({
										...ev,
										[h.id]: ""
									});
								},
								children: "−"
							})
						]
					})
				]
			}, h.id))
		]
	});
}
function TreeTool() {
	const log = useGame((s) => s.log);
	const vehicle = useGame((s) => s.vehicle);
	const def = useGame((s) => s.def);
	const tested = (id) => log.some((l) => (l.testId ?? l.kind).includes(id) || l.kind === id);
	const mark = (id, ok) => {
		if (ok) return "✓";
		if (tested(id)) return vehicle.faultCleared ? "✓" : "?";
		return "·";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "font-mono text-xs leading-relaxed text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-fg",
				children: def.concern.slice(0, 48).toUpperCase()
			}),
			[
				{
					name: "Fuel",
					items: ["fuel", "purge"]
				},
				{
					name: "Ignition",
					items: ["scope"]
				},
				{
					name: "Engine position",
					items: [
						"ckp",
						"scope",
						"dvom"
					]
				},
				{
					name: "Air",
					items: ["smoke", "vacuum"]
				},
				{
					name: "Electrical / network",
					items: [
						"parasitic",
						"charging",
						"can"
					]
				}
			].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2",
				children: [
					"├── ",
					b.name,
					b.items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pl-6",
						children: [
							i === b.items.length - 1 ? "└──" : "├──",
							" ",
							it,
							" ",
							mark(it)
						]
					}, it))
				]
			}, b.name)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-sans text-micro text-subtle",
				children: "The tree records your path. It does not reveal the correct one."
			})
		]
	});
}
function NotesTool() {
	const notes = useGame((s) => s.notes);
	const setNotes = useGame((s) => s.setNotes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		value: notes,
		onChange: (e) => setNotes(e.target.value),
		className: "h-full min-h-48 w-full rounded-md border border-border bg-elevated p-3 text-sm",
		placeholder: "Tech notes — timestamps, known-good comparisons, things you still need to prove."
	});
}
function ConcernPanel() {
	const def = useGame((s) => s.def);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-base leading-relaxed",
				children: def.concern
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: def.concernDetail
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-2 text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Ambient"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-data",
						children: [def.ambientF, "°F"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Fuel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-data",
						children: [Math.round(def.fuelLevel * 8), "/8"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "VIN"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-data",
						children: def.vehicle.vin
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-subtle",
						children: "Allowance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
						className: "font-mono text-data",
						children: [
							def.allowanceHours.toFixed(1),
							" hr / $",
							def.allowanceUsd
						]
					})] })
				]
			}),
			def.difficulty === "beginner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-micro text-warn",
				children: "Beginner mode — Tech Assist is available in the header. Using it costs score."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-micro text-subtle",
				children: "No procedure will tell you the next button. The vehicle will."
			})
		]
	});
}
function HistoryPanel() {
	const def = useGame((s) => s.def);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: def.serviceHistory.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-md bg-elevated p-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-micro text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h.date }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono",
						children: [h.mileage.toLocaleString(), " mi"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-sm",
					children: h.work
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-micro text-subtle",
					children: h.shop
				})
			]
		}, i))
	});
}
var TOOL_META = [
	{
		id: "concern",
		label: "RO"
	},
	{
		id: "interview",
		label: "Interview"
	},
	{
		id: "history",
		label: "History"
	},
	{
		id: "scan",
		label: "Scan"
	},
	{
		id: "dvom",
		label: "DVOM"
	},
	{
		id: "scope",
		label: "Scope"
	},
	{
		id: "smoke",
		label: "Smoke"
	},
	{
		id: "fuel",
		label: "Fuel"
	},
	{
		id: "inspect",
		label: "Inspect"
	},
	{
		id: "drive",
		label: "Drive"
	},
	{
		id: "wiring",
		label: "Wiring"
	},
	{
		id: "parts",
		label: "Parts"
	},
	{
		id: "hypotheses",
		label: "Hypotheses"
	},
	{
		id: "tree",
		label: "Tree"
	},
	{
		id: "notes",
		label: "Notes"
	}
];
function Workspace({ tool }) {
	switch (tool) {
		case "concern": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConcernPanel, {});
		case "interview": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InterviewTool, {});
		case "history": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryPanel, {});
		case "scan": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanTool, {});
		case "dvom": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dvom, {});
		case "scope": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Oscilloscope, {});
		case "smoke": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenchTests, { kind: "smoke" });
		case "fuel": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenchTests, { kind: "fuel" });
		case "inspect": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InspectTool, {});
		case "drive": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DriveTool, {});
		case "wiring": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WiringTool, {});
		case "parts": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartsTool, {});
		case "hypotheses": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HypothesisTool, {});
		case "tree": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeTool, {});
		case "notes": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesTool, {});
		default: return null;
	}
}
function clock(sec) {
	const s = Math.floor(sec);
	return [
		Math.floor(s / 3600),
		Math.floor(s % 3600 / 60),
		s % 60
	].map((n) => String(n).padStart(2, "0")).join(":");
}
function Workstation() {
	const def = useGame((s) => s.def);
	const vehicle = useGame((s) => s.vehicle);
	const tool = useGame((s) => s.tool);
	const setTool = useGame((s) => s.setTool);
	const laborHours = useGame((s) => s.laborHours);
	const partsCost = useGame((s) => s.partsCost);
	const laborCost = useGame((s) => s.laborCost);
	const setKeyPos = useGame((s) => s.setKeyPos);
	const holdStart = useGame((s) => s.holdStart);
	const offer = useGame((s) => s.replaceOffer);
	const confirmReplace = useGame((s) => s.confirmReplace);
	const cancelReplace = useGame((s) => s.cancelReplace);
	const closeRO = useGame((s) => s.closeRO);
	const surrender = useGame((s) => s.surrender);
	const scorecard = useGame((s) => s.scorecard);
	const hintOpen = useGame((s) => s.hintOpen);
	const useHint = useGame((s) => s.useHint);
	const simSpeed = useGame((s) => s.simSpeed);
	const paused = useGame((s) => s.paused);
	const dx = useDx((s) => s.sessions.find((x) => x.id === s.currentId) ?? s.sessions.find((x) => x.simCaseId === def?.id));
	const ingestLive = useDx((s) => s.ingestSimLive);
	const recordEval = useDx((s) => s.recordEval);
	if (!def || !vehicle) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "No repair order loaded."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/simulator",
				className: "mt-3 inline-block text-sm text-data underline",
				children: "Back to simulator"
			})]
		})
	});
	const spend = partsCost + laborCost;
	const over = laborHours > def.allowanceHours || spend > def.allowanceUsd;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg lg:h-dvh lg:overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimTicker, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, {
								on: vehicle.engineRunning,
								fault: vehicle.mil,
								warn: vehicle.stalledEvent
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/simulator",
								className: "text-micro uppercase tracking-[0.18em] text-muted hover:text-fg",
								children: "Diagnostic Decision Lab"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-sm bg-elevated px-1.5 py-0.5 font-mono text-micro uppercase tracking-wider text-data",
								children: "Simulator"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate font-medium",
						children: [
							vehicleLine(def),
							" · ",
							engineLine(def),
							" · RO #",
							def.roNumber
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-data",
							children: clock(vehicle.simTime)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: def.difficulty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [simSpeed, "×"]
						}),
						def.difficulty === "beginner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: useHint,
							children: "Tech Assist"
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-[9.5rem_minmax(0,1fr)_17rem] lg:overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex min-w-0 w-full flex-row flex-nowrap gap-1 overflow-x-auto overscroll-x-contain border-b border-border p-2 lg:h-full lg:w-auto lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:border-b-0 lg:border-r",
						children: TOOL_META.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setTool(t.id),
							className: cn("h-10 shrink-0 whitespace-nowrap rounded-sm px-2.5 text-left text-xs lg:h-9 lg:w-full lg:whitespace-normal", tool === t.id ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
							children: t.label
						}, t.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2 border-b border-border px-3 py-2 lg:hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "RPM",
								value: formatPid("rpm", vehicle.rpm),
								flag: vehicle.rpm === 0 && vehicle.cranking ? "fault" : "data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "ECT",
								value: Math.round(vehicle.coolantF),
								unit: "°F"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "Batt",
								value: vehicle.batteryV.toFixed(1),
								unit: "V",
								flag: vehicle.batteryV < 12.2 ? "warn" : "data"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
								label: "CKP",
								value: vehicle.crankOk ? "SYNC" : "LOSS",
								flag: vehicle.crankOk ? "ok" : "fault"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-4 flex flex-wrap gap-1",
								children: [
									["off", "on"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: vehicle.key === k ? "primary" : "secondary",
										onClick: () => setKeyPos(k),
										children: k.toUpperCase()
									}, `m-${k}`)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "data",
										onClick: holdStart,
										children: "START"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "self-center text-micro text-muted",
										children: vehicle.engineRunning ? "RUNNING" : vehicle.cranking ? "CRANKING" : "STOPPED"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-h-[22rem] min-w-0 overflow-hidden border-b border-border lg:border-b-0 lg:border-r",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full min-h-0 flex-col",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-border px-3 py-1.5 text-micro uppercase tracking-[0.14em] text-subtle",
								children: [TOOL_META.find((t) => t.id === tool)?.label, " workspace"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-h-0 flex-1 overflow-auto p-3",
								children: [hintOpen && def.hints.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3 rounded-md bg-elevated p-3 text-sm text-warn",
									children: [def.hints[Math.min(def.hints.length - 1, 0)], def.hints.slice(1).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1",
										children: h
									}, h))]
								}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, { tool })]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "hidden min-h-0 grid-rows-[auto_auto_1fr] gap-0 overflow-y-auto lg:grid",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								title: "Live vehicle",
								className: "rounded-none shadow-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "RPM",
												value: formatPid("rpm", vehicle.rpm),
												flag: vehicle.rpm === 0 && vehicle.cranking ? "fault" : "data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "ECT",
												value: Math.round(vehicle.coolantF),
												unit: "°F"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "Batt",
												value: vehicle.batteryV.toFixed(1),
												unit: "V",
												flag: vehicle.batteryV < 12.2 ? "warn" : "data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "STFT",
												value: `${vehicle.stft >= 0 ? "+" : ""}${vehicle.stft.toFixed(1)}`,
												unit: "%",
												flag: vehicle.stft > 15 ? "warn" : "data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "LTFT",
												value: `${vehicle.ltft >= 0 ? "+" : ""}${vehicle.ltft.toFixed(1)}`,
												unit: "%",
												flag: vehicle.ltft > 15 ? "warn" : "data"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "MAF",
												value: vehicle.maf.toFixed(1),
												unit: "g/s"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "VSS",
												value: Math.round(vehicle.vss),
												unit: "mph"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "Load",
												value: Math.round(vehicle.load),
												unit: "%"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
												label: "CKP",
												value: vehicle.crankOk ? "SYNC" : "LOSS",
												flag: vehicle.crankOk ? "ok" : "fault"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-1",
										children: [
											["off", "on"].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: vehicle.key === k ? "primary" : "secondary",
												onClick: () => setKeyPos(k),
												children: k.toUpperCase()
											}, k)),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "data",
												onClick: holdStart,
												children: "START"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												onClick: () => {
													ingestLive(vehicle);
													recordEval(def, "live");
												},
												children: "Feed PIDs"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-center gap-2 text-micro text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Led, {
												on: vehicle.engineRunning,
												fault: !vehicle.engineRunning && vehicle.stalledEvent
											}),
											vehicle.engineRunning ? "RUNNING" : vehicle.cranking ? "CRANKING" : "STOPPED",
											vehicle.mil ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-fault",
												children: "MIL"
											}) : null
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								title: "Customer concern",
								className: "rounded-none shadow-none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed",
									children: def.concern
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-micro text-subtle",
									children: [
										"Weather ",
										def.ambientF,
										"°F · Fuel ",
										Math.round(def.fuelLevel * 8),
										"/8"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
								title: "Engine differential",
								className: "rounded-none shadow-none",
								children: [
									!dx?.hypotheses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "The reasoning engine only sees evidence you collect. Scan, interview, and measure — it does not know the hidden fault."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
										className: "space-y-1 text-xs",
										children: dx.hypotheses.slice(0, 5).map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "truncate",
												children: [
													i + 1,
													". ",
													h.component
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikelihoodMark, { value: h.likelihood })]
										}, h.id))
									}),
									dx?.nextAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-micro text-data",
										children: dx.nextAction.title
									}) : null,
									dx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/session/$id",
										params: { id: dx.id },
										className: "mt-2 inline-block text-micro text-muted underline",
										children: "Open full session"
									}) : null
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-4 font-mono tabular-nums",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"TIME ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: over ? "text-warn" : "text-data",
								children: formatHours(laborHours)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [
									" / ",
									def.allowanceHours.toFixed(1),
									" hr"
								]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"SPEND ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: over ? "text-warn" : "text-data",
								children: formatMoney(spend)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [" / ", formatMoney(def.allowanceUsd)]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								"Parts ",
								formatMoney(partsCost),
								" · Labor ",
								formatMoney(laborCost),
								" @",
								185
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: surrender,
						children: "Surrender"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "primary",
						onClick: closeRO,
						children: "Close RO"
					})]
				})]
			}),
			offer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-bg/70 p-4 sm:items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-base font-medium",
							children: ["Replace ", offer.name]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								"Part ",
								formatMoney(offer.cost),
								" · Labor ",
								offer.labor.toFixed(1),
								" hr"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs uppercase tracking-wider text-subtle",
							children: ["Evidence supporting repair: ", offer.evidence]
						}),
						offer.warning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-warn",
							children: offer.warning
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted",
							children: "You can proceed anyway. If this is not the cause, the vehicle stays broken."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: cancelReplace,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "primary",
								onClick: confirmReplace,
								children: "Install anyway"
							})]
						})
					]
				})
			}) : null,
			scorecard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreOverlay, {}) : null,
			paused && !scorecard ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none hidden" }) : null
		]
	});
}
function ScoreOverlay() {
	const score = useGame((s) => s.scorecard);
	const def = useGame((s) => s.def);
	const surrendered = useGame((s) => s.surrendered);
	const lastEval = useDx((s) => s.evals).find((e) => e.caseId === def.id);
	const rows = [
		["Root cause", score.rootCause],
		["Evidence quality", score.evidence],
		["Test efficiency", score.efficiency],
		["Diagnostic time", score.time],
		["Repair verification", score.verification]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 overflow-auto bg-bg/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-lg rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-micro uppercase tracking-[0.18em] text-muted",
					children: "Diagnostic score"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 font-mono text-5xl tabular-nums text-data",
					children: score.total
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted",
					children: ["/ 100 ", surrendered ? "· surrendered" : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-1 text-sm",
					children: rows.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between font-mono tabular-nums",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-muted",
							children: k
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							v.got,
							"/",
							v.max
						] })]
					}, k))
				}),
				lastEval ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-data",
					children: [
						"Engine: true-cause rank ",
						lastEval.initialRank ?? "—",
						" → ",
						lastEval.finalRank ?? "—",
						lastEval.reachedVeryHigh ? " · reached Very High" : "",
						" · ",
						lastEval.steps,
						" steps"
					]
				}) : null,
				score.unnecessaryTests.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-xs text-warn",
					children: ["Unnecessary tests: ", score.unnecessaryTests.join("; ")]
				}) : null,
				score.unnecessaryParts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-fault",
					children: ["Unnecessary parts: ", score.unnecessaryParts.join("; ")]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-ok",
					children: "Unnecessary parts: none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "Root cause. "
					}), score.rootCauseText]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-subtle",
						children: "Best evidence. "
					}), score.bestEvidence]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-xs text-muted",
					children: [
						"Time ",
						score.diagnosticHours.toFixed(1),
						" hr · Expert path ",
						score.expertHours.toFixed(1),
						" hr · ",
						vehicleLine(def)
					]
				}),
				score.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: n
				}, n)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/simulator",
					className: "mt-5 inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-fg",
					children: "Return to simulator"
				})
			]
		})
	});
}
var SplitComponent = Workstation;
//#endregion
export { SplitComponent as component };
