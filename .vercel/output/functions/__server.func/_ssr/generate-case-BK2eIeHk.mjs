import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { t as generateLocalCase } from "./generate-BM58LRf6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-case-BK2eIeHk.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateCaseStory_createServerFn_handler = createServerRpc({
	id: "9d2d31d487faf53935025e95c96db8f301f15d1cd75e42d67c88e676dd67696b",
	name: "generateCaseStory",
	filename: "src/lib/ai/generate-case.ts"
}, (opts) => generateCaseStory.__executeServer(opts));
var generateCaseStory = createServerFn({ method: "POST" }).validator((input) => input).handler(generateCaseStory_createServerFn_handler, async ({ data }) => {
	const fallback = generateLocalCase(data.prompt, data.difficulty);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		source: "local",
		concern: fallback.concern
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 280,
				messages: [{
					role: "system",
					content: "You write Toyota/Lexus customer concerns for a diagnostic simulator. Return 2-4 sentences in the customer's voice. Do not name the failed part. Do not diagnose. No markdown."
				}, {
					role: "user",
					content: data.prompt.slice(0, 600)
				}]
			})
		});
		if (!res.ok) return {
			ok: true,
			source: "local",
			concern: fallback.concern
		};
		return {
			ok: true,
			source: "ai",
			concern: ((await res.json()).choices[0]?.message.content ?? "").trim() || fallback.concern
		};
	} catch {
		return {
			ok: true,
			source: "local",
			concern: fallback.concern
		};
	}
});
//#endregion
export { generateCaseStory_createServerFn_handler };
