import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, x as require_jsx_runtime, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as generateLocalCase } from "./generate-BM58LRf6.mjs";
import { t as Button } from "./button-CGaT4Hgu.mjs";
import { s as useGame } from "./game-store-Da8KsFNn.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/creator-O2Yyr37a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateCaseStory = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("9d2d31d487faf53935025e95c96db8f301f15d1cd75e42d67c88e676dd67696b"));
function Creator() {
	const navigate = useNavigate();
	const saveGenerated = useGame((s) => s.saveGenerated);
	const startCase = useGame((s) => s.startCase);
	const [prompt, setPrompt] = (0, import_react.useState)("2011 Toyota Tundra. Intermittent stall. Sometimes dies while driving. Starts and dies several times. Later runs perfectly. No warning lights.");
	const [difficulty, setDifficulty] = (0, import_react.useState)("technician");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const run = async () => {
		setBusy(true);
		setError(null);
		try {
			let concern = prompt;
			try {
				const r = await generateCaseStory({ data: {
					prompt,
					difficulty
				} });
				if (r.ok && r.concern) concern = r.concern;
			} catch {}
			const c = generateLocalCase(concern, difficulty);
			c.concern = concern;
			saveGenerated(c);
			startCase(c.id, c);
			navigate({ to: "/lab" });
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not build the case.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Case creator",
		badge: "Simulator",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl px-4 py-8 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-medium",
					children: "Case creator"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Describe a vehicle and a customer complaint. The lab maps it onto a hidden causal fault. The diagnosis is not shown until you close or surrender the ticket."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-6 block text-xs text-muted",
					children: ["Complaint", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						suppressHydrationWarning: true,
						value: prompt,
						onChange: (e) => setPrompt(e.target.value),
						rows: 6,
						className: "mt-1 w-full rounded-md border border-border bg-elevated p-3 text-sm"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 block text-xs text-muted",
					children: ["Difficulty", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: difficulty,
						onChange: (e) => setDifficulty(e.target.value),
						className: "mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "beginner",
								children: "Beginner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "technician",
								children: "Technician"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "master",
								children: "Master Tech"
							})
						]
					})]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-fault",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					variant: "primary",
					disabled: busy || prompt.trim().length < 8,
					onClick: () => void run(),
					children: busy ? "Building fault model…" : "Generate and clock in"
				})
			]
		})
	});
}
//#endregion
export { Creator as component };
