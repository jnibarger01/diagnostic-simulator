import { D as unique, E as tagsFromPids, S as makeId, T as parsePidPaste, a as TAG_WEIGHTS, b as interpretObservation, d as detectFamily, f as evidenceShell, g as extractTags, h as extractSymptoms, i as QUESTIONS, m as extractSafety, n as DTC_KB, o as TESTS, p as extractConditions, r as FAULTS, s as TRUE_CAUSE_MAP, t as DTC_CODE_WEIGHTS, w as parseDtcCodes } from "./parse-BCv98ZRn.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dx-store-DrlVr6vQ.js
var KEY = "ddl.profile.v1";
var SESS_KEY = "ddl.sessions.v1";
var EVAL_KEY = "ddl.eval.v1";
var SAVE_VERSION = 1;
var defaults = {
	version: SAVE_VERSION,
	casesCompleted: 0,
	scores: [],
	bestByCase: {},
	unnecessaryParts: 0,
	firstTimeHits: 0,
	generatedCases: [],
	achievements: [],
	notesByCase: {},
	lastDaily: null,
	level: 1
};
function migrate(raw) {
	return {
		...defaults,
		...raw,
		version: SAVE_VERSION
	};
}
function loadProfile() {
	try {
		const s = localStorage.getItem(KEY);
		if (!s) return { ...defaults };
		return migrate(JSON.parse(s));
	} catch {
		return { ...defaults };
	}
}
function saveProfile(p) {
	try {
		localStorage.setItem(KEY, JSON.stringify(p));
	} catch {}
}
function upsertGenerated(p, c) {
	const rest = p.generatedCases.filter((x) => x.id !== c.id);
	return {
		...p,
		generatedCases: [c, ...rest].slice(0, 24)
	};
}
function levelFrom(p) {
	const avg = p.scores.length ? p.scores.reduce((a, b) => a + b.score, 0) / p.scores.length : 0;
	const xp = p.casesCompleted * 12 + Math.round(avg);
	return Math.max(1, Math.min(10, 1 + Math.floor(xp / 40)));
}
function loadSessions() {
	try {
		if (typeof localStorage === "undefined") return [];
		const s = localStorage.getItem(SESS_KEY);
		if (!s) return [];
		return JSON.parse(s);
	} catch {
		return [];
	}
}
function saveSessions(list) {
	try {
		localStorage.setItem(SESS_KEY, JSON.stringify(list.slice(0, 40)));
	} catch {}
}
function loadEvals() {
	try {
		if (typeof localStorage === "undefined") return [];
		const s = localStorage.getItem(EVAL_KEY);
		if (!s) return [];
		return JSON.parse(s);
	} catch {
		return [];
	}
}
function saveEvals(list) {
	try {
		localStorage.setItem(EVAL_KEY, JSON.stringify(list.slice(0, 40)));
	} catch {}
}
var LIKELIHOOD_LABEL = {
	very_high: "Very High",
	high: "High",
	moderate: "Moderate",
	low: "Low",
	very_low: "Very Low"
};
var LIKELIHOOD_ORDER = [
	"very_high",
	"high",
	"moderate",
	"low",
	"very_low"
];
function likelihoodRank(l) {
	return LIKELIHOOD_ORDER.indexOf(l);
}
function band(score) {
	if (score >= 8) return "very_high";
	if (score >= 4.5) return "high";
	if (score >= 1.5) return "moderate";
	if (score >= -.5) return "low";
	return "very_low";
}
function confidence(h, evidence) {
	const tech = evidence.filter((e) => e.supports.includes(h.id) && e.source !== "customer" && e.source !== "service_history" && e.source !== "previous_repair");
	const cust = evidence.filter((e) => e.supports.includes(h.id));
	if (tech.length >= 2) return "high";
	if (tech.length === 1) return "medium";
	if (cust.length >= 2) return "low";
	return "none";
}
function applyWeights(scores, weights, scale = 1) {
	if (!weights) return;
	for (const [id, d] of Object.entries(weights)) scores[id] = (scores[id] ?? 0) + d * scale;
}
function scoreSession(session) {
	const scores = {};
	for (const f of FAULTS) if (f.families.includes(session.family) || session.family === "generic") scores[f.id] = 1;
	else scores[f.id] = -1;
	for (const tag of session.tags) applyWeights(scores, TAG_WEIGHTS[tag]);
	for (const ev of session.evidence) {
		const scale = ev.reliability === "high" ? 1 : ev.reliability === "medium" ? .7 : .4;
		for (const tag of ev.tags) applyWeights(scores, TAG_WEIGHTS[tag], scale);
		if (ev.type === "dtc" && ev.structuredValue && typeof ev.structuredValue.value === "string") applyWeights(scores, DTC_CODE_WEIGHTS[ev.structuredValue.value], scale);
	}
	return scores;
}
function buildHypothesis(t, score, evidence) {
	const supporting = [];
	const contradicting = [];
	for (const ev of evidence) {
		let s = 0;
		let c = 0;
		for (const tag of ev.tags) {
			const w = TAG_WEIGHTS[tag]?.[t.id] ?? 0;
			if (w > 0) s += w;
			if (w < 0) c += -w;
		}
		if (ev.type === "dtc" && ev.structuredValue && typeof ev.structuredValue.value === "string") {
			const w = DTC_CODE_WEIGHTS[ev.structuredValue.value]?.[t.id] ?? 0;
			if (w > 0) s += w;
			if (w < 0) c += -w;
		}
		if (s > c && s > 0) supporting.push(ev.observation);
		else if (c > s && c > 0) contradicting.push(ev.observation);
	}
	const likelihood = band(score);
	let status = "active";
	if (likelihood === "very_low" && contradicting.length) status = "ruled_out";
	const hyp = {
		id: t.id,
		systemId: t.systemId,
		systemLabel: t.systemLabel,
		component: t.component,
		failureMode: t.failureMode,
		likelihood,
		score: Math.round(score * 10) / 10,
		evidenceConfidence: "none",
		supporting: unique(supporting).slice(0, 8),
		contradicting: unique(contradicting).slice(0, 8),
		missing: [...t.missing],
		moreLikelyWhen: t.moreLikelyWhen,
		lessLikelyWhen: t.lessLikelyWhen,
		confirmTest: t.confirmTest,
		refuteTest: t.refuteTest,
		testable: true,
		testCostUsd: t.testCostUsd,
		testHours: t.testHours,
		safety: t.safety,
		status
	};
	hyp.evidenceConfidence = confidence(hyp, evidence);
	if (hyp.likelihood === "very_high" && hyp.evidenceConfidence === "high" && !hyp.contradicting.length) hyp.status = "confirmed";
	return hyp;
}
function relevantFaults(session) {
	const primary = FAULTS.filter((f) => f.families.includes(session.family));
	const extra = FAULTS.filter((f) => session.tags.some((t) => (TAG_WEIGHTS[t]?.[f.id] ?? 0) >= 2));
	const map = /* @__PURE__ */ new Map();
	for (const f of [...primary, ...extra]) map.set(f.id, f);
	if (map.size < 4) for (const f of FAULTS) {
		if (map.size >= 6) break;
		map.set(f.id, f);
	}
	return [...map.values()];
}
function linkEvidence(evidence, hyps) {
	return evidence.map((ev) => {
		const supports = [];
		const contradicts = [];
		const neutralTo = [];
		for (const h of hyps) {
			let s = 0;
			for (const tag of ev.tags) s += TAG_WEIGHTS[tag]?.[h.id] ?? 0;
			if (ev.type === "dtc" && ev.structuredValue && typeof ev.structuredValue.value === "string") s += DTC_CODE_WEIGHTS[ev.structuredValue.value]?.[h.id] ?? 0;
			if (s > .8) supports.push(h.id);
			else if (s < -.8) contradicts.push(h.id);
			else neutralTo.push(h.id);
		}
		return {
			...ev,
			supports,
			contradicts,
			neutralTo
		};
	});
}
function questionAsked(session, id) {
	return session.askedQuestionIds.includes(id);
}
function tagsAlreadyKnown(session, tags) {
	if (!tags.length) return true;
	const have = new Set(session.tags);
	for (const ev of session.evidence) ev.tags.forEach((t) => have.add(t));
	return tags.every((t) => have.has(t));
}
function questionValue(q, session, hyps) {
	if (questionAsked(session, q.id)) return -1;
	if (!q.families.includes(session.family) && session.family !== "generic") return 0;
	const top = hyps.filter((h) => h.status === "active").slice(0, 5);
	if (!top.length) return 0;
	let value = 0;
	for (const opt of q.options) {
		if (!opt.tags.length || tagsAlreadyKnown(session, opt.tags)) continue;
		const deltas = top.map((h) => opt.tags.reduce((a, t) => a + (TAG_WEIGHTS[t]?.[h.id] ?? 0), 0));
		const spread = Math.max(...deltas) - Math.min(...deltas);
		value += spread;
	}
	if (q.audience === "customer") {
		if (session.evidence.some((e) => e.source !== "customer" && e.source !== "service_history" && e.type !== "symptom")) value *= .45;
		if (session.answered.filter((a) => QUESTIONS.find((x) => x.id === a.questionId)?.audience === "customer").length >= 4) value *= .3;
	}
	return value;
}
function testValue(t, session, hyps) {
	if (session.testsRun.some((x) => x.testId === t.id)) return -1;
	if (!t.families.includes(session.family) && session.family !== "generic") return .2;
	const top = hyps.filter((h) => h.status === "active").slice(0, 5);
	let value = t.discriminates.filter((id) => top.some((h) => h.id === id)).length * 3;
	const close = top.slice(0, 2);
	if (close.length === 2 && t.discriminates.includes(close[0].id) && t.discriminates.includes(close[1].id)) value += 4;
	value += 1.5 / Math.max(.15, t.timeHr);
	if (t.invasiveness === "high") value -= 2;
	if (t.safety) value -= .5;
	return value;
}
function pickNext(session, hyps) {
	const confirmed = hyps.find((h) => h.status === "confirmed");
	if (confirmed) return {
		kind: "repair",
		title: `Evidence supports: ${confirmed.component}`,
		why: confirmed.failureMode,
		expectedOutcomes: ["Inspect circuit/connector before replacement when applicable", "Verify at original failure conditions"],
		timeHr: confirmed.testHours,
		cost: "see recommendation",
		discrimination: "high",
		invasiveness: "moderate",
		alternatives: []
	};
	const qScores = QUESTIONS.map((q) => ({
		q,
		v: questionValue(q, session, hyps)
	})).filter((x) => x.v > 1.5).sort((a, b) => b.v - a.v);
	const tScores = TESTS.map((t) => ({
		t,
		v: testValue(t, session, hyps)
	})).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
	const bestQ = qScores[0];
	const bestT = tScores[0];
	const customerBudget = session.answered.filter((a) => QUESTIONS.find((x) => x.id === a.questionId)?.audience === "customer").length;
	const preferQuestion = bestQ && (customerBudget < 3 || bestQ.v > (bestT?.v ?? 0) + 1);
	const alts = [];
	for (const x of qScores.slice(preferQuestion ? 1 : 0, 3)) alts.push({
		title: x.q.prompt,
		why: x.q.rationale,
		timeHr: .05,
		questionId: x.q.id
	});
	for (const x of tScores.slice(preferQuestion ? 0 : 1, 4)) alts.push({
		title: x.t.name,
		why: x.t.why,
		timeHr: x.t.timeHr,
		testId: x.t.id
	});
	if (preferQuestion && bestQ) return {
		kind: "question",
		title: bestQ.q.prompt,
		why: bestQ.q.rationale,
		expectedOutcomes: bestQ.q.options.filter((o) => o.id !== "unknown").map((o) => o.label),
		timeHr: .05,
		cost: "none",
		discrimination: bestQ.v >= 6 ? "high" : "moderate",
		invasiveness: "none",
		question: bestQ.q,
		alternatives: alts.slice(0, 4)
	};
	if (bestT) return {
		kind: "test",
		title: bestT.t.name,
		why: bestT.t.why,
		expectedOutcomes: bestT.t.expectedOutcomes,
		timeHr: bestT.t.timeHr,
		cost: bestT.t.cost,
		discrimination: bestT.v >= 6 ? "high" : bestT.v >= 3 ? "moderate" : "low",
		invasiveness: bestT.t.invasiveness,
		safety: bestT.t.safety,
		testId: bestT.t.id,
		alternatives: alts.filter((a) => a.testId !== bestT.t.id).slice(0, 4)
	};
	return {
		kind: "inconclusive",
		title: "Evidence remains inconclusive",
		why: "Competing hypotheses are still open. Capture the failure with RPM, fuel pressure, and a CKP waveform rather than replacing parts.",
		expectedOutcomes: [],
		timeHr: .4,
		cost: "minimal",
		discrimination: "moderate",
		invasiveness: "low",
		alternatives: alts.slice(0, 3)
	};
}
function verificationPlan(session, top) {
	const conds = unique([...session.operatingConditions, ...session.evidence.map((e) => e.operatingCondition).filter((x) => !!x)]);
	const steps = [];
	const tags = session.tags;
	if (tags.includes("hot") || tags.includes("hot_only")) {
		steps.push("Reach full operating temperature.");
		steps.push("Continue operating beyond the previous failure threshold (time/temp).");
	}
	if (tags.includes("vibration")) steps.push("Reproduce rough-road / harness movement conditions.");
	if (tags.includes("sit_overnight")) steps.push("Key-off soak comparable to the original sit; confirm resting voltage and draw.");
	if (tags.includes("stall") || tags.includes("no_start")) steps.push("Monitor RPM synchronization (and CKP if that was the supported cause) through the original condition.");
	if (tags.includes("lean") || tags.includes("rough_idle")) steps.push("Confirm fuel trims return toward a typical range at idle and cruise. OEM specification required for pass/fail.");
	if (tags.includes("network")) steps.push("Drive over the original disturbance (bumps) and confirm modules remain online with no U-code return.");
	if (tags.includes("bsm")) steps.push("Verify BSM operation and that related DTCs do not return after OEM initialization/aiming.");
	if (!steps.length) steps.push("Reproduce the original customer operating conditions as closely as possible.");
	steps.push("Confirm relevant DTCs do not return.");
	if (top) steps.push(`Confirm the original concern does not recur after addressing ${top.component}.`);
	return {
		originalConditions: conds.length ? conds : ["Original customer operating conditions"],
		steps,
		mustNotMarkCompleteUntil: [
			"Original failure condition has been recreated or reasonably attempted",
			"Concern does not recur",
			"Supporting DTCs remain clear if they were part of the evidence"
		]
	};
}
function repairRec(hyps) {
	const top = hyps[0];
	if (!top || likelihoodRank(top.likelihood) > likelihoodRank("high")) return void 0;
	const inspectFirst = top.id === "ckp_sync" || top.id === "ckp_connector" ? "Inspect CKP connector and circuit integrity before component replacement." : top.id.startsWith("bsm") ? "Do not replace another sensor until communication, initialization, and mounting are documented." : top.id.startsWith("parasitic") ? "Do not replace the battery until the draw is isolated." : void 0;
	const status = top.status === "confirmed" ? "Confirmed by evidence. Circuit inspection still recommended when the fault can be a connector." : top.evidenceConfidence === "high" ? "Strongly supported. Remaining missing checks should be completed if cheap." : "Supported but not confirmed. Additional discriminating tests remain.";
	return {
		action: top.id === "ckp_connector" ? "Repair/replace CKP connector and restore circuit integrity" : `Address ${top.component}`,
		hypothesisId: top.id,
		evidenceStrength: top.likelihood,
		supporting: top.supporting,
		missing: top.missing.filter((m) => !top.supporting.some((s) => s.toLowerCase().includes(m.slice(0, 8).toLowerCase()))),
		status,
		inspectFirst
	};
}
function summary(session, hyps) {
	const names = hyps.slice(0, 3).map((h) => `${h.component} (${LIKELIHOOD_LABEL[h.likelihood]})`).join("; ");
	return `${session.family.replace("_", " ")} complaint. Leading explanations: ${names}. Next: ${session.nextAction?.title ?? "collect more evidence"}. Speculation is labeled; nothing here is a confirmed OEM diagnosis without matching evidence.`;
}
function snapshot(hyps, trigger) {
	return {
		at: Date.now(),
		trigger,
		ranked: hyps.slice(0, 8).map((h) => ({
			id: h.id,
			label: h.component,
			likelihood: h.likelihood,
			score: h.score
		}))
	};
}
function movement(prev, next, latest) {
	if (!prev?.length) return [];
	const out = [];
	for (const h of next) {
		const p = prev.find((x) => x.id === h.id);
		if (!p || p.likelihood === h.likelihood) continue;
		const reason = latest?.observation ?? (likelihoodRank(h.likelihood) < likelihoodRank(p.likelihood) ? h.supporting[0] ?? "New supporting evidence." : h.contradicting[0] ?? "New contradicting evidence.");
		out.push({
			id: h.id,
			label: h.component,
			from: p.likelihood,
			to: h.likelihood,
			reason
		});
	}
	return out;
}
function seedEvidence(input, tags) {
	const ev = [];
	if (input.concern.trim()) ev.push(evidenceShell({
		source: "customer",
		type: "symptom",
		observation: input.concern.trim(),
		reliability: "medium",
		tags: extractTags(input.concern)
	}));
	if (input.warningLights?.trim()) ev.push(evidenceShell({
		source: "customer",
		type: "statement",
		observation: `Warning lamps: ${input.warningLights.trim()}`,
		reliability: "medium",
		tags: extractTags(input.warningLights)
	}));
	if (input.recentRepairs?.trim()) ev.push(evidenceShell({
		source: "previous_repair",
		type: "history",
		observation: `Recent repairs: ${input.recentRepairs.trim()}`,
		reliability: "medium",
		tags: extractTags(input.recentRepairs),
		notes: "Prior work influences the differential; it does not prove causality."
	}));
	if (input.serviceHistory?.trim()) ev.push(evidenceShell({
		source: "service_history",
		type: "history",
		observation: `Service history: ${input.serviceHistory.trim()}`,
		reliability: "medium",
		tags: extractTags(input.serviceHistory)
	}));
	if (input.techNotes?.trim()) {
		const parsed = interpretObservation(input.techNotes);
		ev.push(evidenceShell({
			source: parsed.source,
			type: "statement",
			observation: input.techNotes.trim(),
			reliability: "medium",
			tags: parsed.tags
		}));
	}
	for (const d of parseDtcCodes(input.dtcsRaw ?? "")) {
		const kb = DTC_KB.find((x) => x.code === d.code);
		ev.push(evidenceShell({
			source: "dtc",
			type: "dtc",
			observation: `${d.code} ${d.title}. ${kb?.notADiagnosis ?? "A code is evidence, not a diagnosis."}`,
			structuredValue: {
				key: "dtc",
				value: d.code
			},
			reliability: "high",
			tags: unique(["mil_on", ...kb?.tags ?? []])
		}));
	}
	return ev;
}
function analyze(session, trigger = "reanalyze") {
	const scores = scoreSession(session);
	let hyps = relevantFaults(session).map((t) => buildHypothesis(t, scores[t.id] ?? 0, session.evidence)).sort((a, b) => b.score - a.score || likelihoodRank(a.likelihood) - likelihoodRank(b.likelihood));
	hyps = hyps.filter((h, i) => i < 8 || h.likelihood !== "very_low" || h.supporting.length);
	hyps = hyps.slice(0, 10);
	const evidence = linkEvidence(session.evidence, hyps);
	const next = {
		...session,
		evidence,
		hypotheses: hyps,
		updatedAt: Date.now(),
		nextAction: null,
		lastMovement: movement(session.hypotheses, hyps, evidence[evidence.length - 1]),
		status: session.status === "intake" ? "active" : session.status
	};
	next.nextAction = pickNext(next, hyps);
	next.repair = repairRec(hyps);
	next.verification = verificationPlan(next, hyps[0]);
	if (hyps[0]?.status === "confirmed") next.status = "supported";
	next.reasoningSummary = summary(next, hyps);
	const lastSnap = session.history[session.history.length - 1];
	next.history = !lastSnap || lastSnap.ranked.map((r) => r.id + r.likelihood).join() !== hyps.slice(0, 5).map((h) => h.id + h.likelihood).join() ? [...session.history, snapshot(hyps, trigger)].slice(-24) : session.history;
	return next;
}
function createSession(input) {
	const concernTags = extractTags(input.concern, input.warningLights ?? "", input.dtcsRaw ?? "", input.recentRepairs ?? "", input.serviceHistory ?? "", input.techNotes ?? "");
	const family = detectFamily(concernTags);
	const evidence = seedEvidence(input, concernTags);
	return analyze({
		id: makeId("dx"),
		mode: input.mode ?? "assistant",
		createdAt: Date.now(),
		updatedAt: Date.now(),
		vehicle: input.vehicle,
		concern: input.concern.trim(),
		warningLights: input.warningLights?.trim() ?? "",
		dtcsRaw: input.dtcsRaw?.trim() ?? "",
		recentRepairs: input.recentRepairs?.trim() ?? "",
		serviceHistory: input.serviceHistory?.trim() ?? "",
		techNotes: input.techNotes?.trim() ?? "",
		family,
		tags: concernTags,
		symptoms: extractSymptoms(concernTags),
		operatingConditions: extractConditions(concernTags),
		evidence,
		hypotheses: [],
		history: [],
		askedQuestionIds: [],
		answered: [],
		testsRun: [],
		nextAction: null,
		lastMovement: [],
		status: "intake",
		simCaseId: input.simCaseId,
		evalLog: [],
		safetyFlags: extractSafety([input.concern, input.techNotes ?? ""].join(" ")),
		reasoningSummary: ""
	}, "intake");
}
function answerQuestion(session, questionId, optionId) {
	const q = QUESTIONS.find((x) => x.id === questionId) ?? session.nextAction?.question;
	if (!q) return session;
	const opt = q.options.find((o) => o.id === optionId);
	if (!opt) return session;
	const ev = evidenceShell({
		source: q.audience === "customer" ? "customer" : "technician",
		type: "statement",
		observation: `${q.prompt} → ${opt.label}`,
		reliability: q.audience === "customer" ? "medium" : "high",
		tags: opt.tags,
		notes: opt.narrative
	});
	return analyze({
		...session,
		tags: unique([...session.tags, ...opt.tags]),
		symptoms: extractSymptoms(unique([...session.tags, ...opt.tags])),
		operatingConditions: extractConditions(unique([...session.tags, ...opt.tags])),
		evidence: [...session.evidence, ev],
		askedQuestionIds: unique([...session.askedQuestionIds, questionId]),
		answered: [...session.answered, {
			questionId,
			optionId,
			at: Date.now()
		}]
	}, `question:${questionId}`);
}
function addEvidence(session, ev) {
	const next = {
		...session,
		tags: unique([...session.tags, ...ev.tags]),
		symptoms: extractSymptoms(unique([...session.tags, ...ev.tags])),
		operatingConditions: unique([...session.operatingConditions, ...extractConditions(ev.tags)]),
		evidence: [...session.evidence, ev]
	};
	if (ev.operatingCondition) next.operatingConditions = unique([...next.operatingConditions, ev.operatingCondition]);
	return analyze(next, `evidence:${ev.type}`);
}
function addObservation(session, text, condition, source) {
	const parsed = interpretObservation(text, condition);
	const pids = parsed.pids.length ? parsed.pids : parsePidPaste(text);
	const extraTags = tagsFromPids(pids, condition);
	return addEvidence(session, evidenceShell({
		source: source ?? parsed.source,
		type: pids.length ? "measurement" : "statement",
		observation: text.trim(),
		operatingCondition: condition,
		reliability: source === "customer" ? "medium" : "high",
		tags: unique([...parsed.tags, ...extraTags]),
		structuredValue: pids[0] ? {
			key: pids[0].key,
			value: pids[0].value,
			units: pids[0].units
		} : void 0
	}));
}
function addDtcs(session, raw, status, freezeFrame) {
	let s = session;
	for (const d of parseDtcCodes(raw)) {
		const kb = DTC_KB.find((x) => x.code === d.code);
		s = addEvidence(s, evidenceShell({
			source: "dtc",
			type: "dtc",
			observation: `${d.code} ${d.title}${status ? ` (${status})` : ""}. ${kb?.notADiagnosis ?? "A code is evidence, not a diagnosis."}`,
			structuredValue: {
				key: "dtc",
				value: d.code
			},
			reliability: "high",
			tags: unique(["mil_on", ...kb?.tags ?? []]),
			notes: freezeFrame ? `Freeze-frame: ${freezeFrame}` : void 0
		}));
	}
	if (freezeFrame?.trim()) s = addObservation(s, freezeFrame, "freeze-frame", "freeze_frame");
	return s;
}
function addPidPaste(session, text, condition) {
	return addObservation(session, text, condition ?? "live data", "live_pid");
}
function recordTest(session, testId, result, condition) {
	const t = TESTS.find((x) => x.id === testId);
	return addObservation({
		...session,
		testsRun: [...session.testsRun, {
			testId,
			result,
			at: Date.now()
		}]
	}, t ? `${t.name}: ${result}` : result, condition, "scan_test");
}
function closeSession(session) {
	return {
		...session,
		status: "closed",
		updatedAt: Date.now()
	};
}
function trueHypothesisId(def) {
	return TRUE_CAUSE_MAP[def.fault.id] ?? null;
}
function ingestInterview(session, question, answer) {
	return addEvidence(session, evidenceShell({
		source: "customer",
		type: "statement",
		observation: `Customer: ${answer}`,
		reliability: "medium",
		tags: extractTags(question, answer),
		notes: question
	}));
}
function ingestScan(session, vehicle) {
	if (!vehicle.dtcs.length) return addEvidence(session, evidenceShell({
		source: "dtc",
		type: "dtc",
		observation: `Scan complete. MIL ${vehicle.mil ? "ON" : "OFF"}. No DTCs stored at this time.`,
		reliability: "high",
		tags: vehicle.mil ? ["mil_on"] : ["no_mil"]
	}));
	let s = session;
	for (const d of vehicle.dtcs) {
		s = addEvidence(s, evidenceShell({
			source: "simulator",
			type: "dtc",
			observation: `${d.code} ${d.description} (${d.status}${d.mil ? ", MIL" : ""}). A code is evidence, not a diagnosis.`,
			structuredValue: {
				key: "dtc",
				value: d.code
			},
			reliability: "high",
			tags: extractTags(d.code, d.description)
		}));
		if (d.freezeFrame) {
			const ff = d.freezeFrame;
			s = addObservation(s, `Freeze-frame ${d.code}: RPM ${Math.round(ff.rpm)} · VSS ${Math.round(ff.vss)} · ECT ${Math.round(ff.ect)}°F · STFT ${ff.stft.toFixed(1)}% · LTFT ${ff.ltft.toFixed(1)}% · MAF ${ff.maf.toFixed(1)} g/s · VPWR ${ff.vpwr.toFixed(1)} V`, "freeze-frame", "freeze_frame");
		}
	}
	return s;
}
function ingestTest(session, result, source = "scan_test") {
	const flags = result.lines.filter((l) => l.flag === "fault" || l.flag === "warn").map((l) => `${l.k}: ${l.v}`);
	return addObservation(session, `${result.title}. ${result.narrative}${flags.length ? ` Findings: ${flags.join("; ")}` : ""}`, void 0, source);
}
function ingestDvom(session, label, display, note) {
	return addObservation(session, `DVOM ${label}: ${display}${note ? ` — ${note}` : ""}`, void 0, "dvom");
}
function ingestScope(session, ch, vehicle) {
	if (/ckp|crank/i.test(ch)) return addObservation(session, !vehicle.crankOk ? `Oscilloscope on ${ch}: CKP waveform missing or dropped out at the current operating condition (RPM PID ${Math.round(vehicle.rpm)}).` : `Oscilloscope on ${ch}: CKP waveform present at the current operating condition.`, vehicle.engineRunning ? "engine running" : vehicle.cranking ? "cranking" : "KOEO", "oscilloscope");
	if (/can/i.test(ch)) return addObservation(session, Object.values(vehicle.moduleOnline).every(Boolean) ? `Oscilloscope on ${ch}: bus activity present; modules currently online.` : `Oscilloscope on ${ch}: bus activity disturbed; one or more modules offline.`, void 0, "oscilloscope");
	return addObservation(session, `Oscilloscope connected to ${ch}.`, void 0, "oscilloscope");
}
function ingestLiveSnapshot(session, vehicle) {
	const cond = vehicle.engineRunning ? "running" : vehicle.cranking ? "cranking" : "key on";
	return addObservation(session, [
		`RPM ${Math.round(vehicle.rpm)}`,
		`ECT ${Math.round(vehicle.coolantF)}F`,
		`STFT ${vehicle.stft.toFixed(1)}%`,
		`LTFT ${vehicle.ltft.toFixed(1)}%`,
		`MAF ${vehicle.maf.toFixed(1)} g/s`,
		`MAP ${Math.round(vehicle.map)} kPa`,
		`Fuel pressure ${vehicle.fuelPsi.toFixed(0)} psi`,
		`VPWR ${vehicle.batteryV.toFixed(1)} V`,
		vehicle.cranking && vehicle.rpm === 0 ? "RPM 0 while cranking" : ""
	].filter(Boolean).join("\n"), cond, "live_pid");
}
function rankOf(session, hid) {
	if (!hid) return {
		rank: null,
		likelihood: null
	};
	const i = session.hypotheses.findIndex((h) => h.id === hid);
	if (i < 0) return {
		rank: null,
		likelihood: null
	};
	return {
		rank: i + 1,
		likelihood: session.hypotheses[i].likelihood
	};
}
function evalStep(session, def, trigger, extra) {
	const { rank, likelihood } = rankOf(session, def ? trueHypothesisId(def) : null);
	return {
		at: Date.now(),
		trigger,
		trueCauseRank: rank,
		trueCauseLikelihood: likelihood,
		topId: session.hypotheses[0]?.id ?? "",
		...extra
	};
}
function summarizeEval(session, def) {
	const hid = trueHypothesisId(def);
	const log = session.evalLog;
	const first = log[0];
	const last = log[log.length - 1];
	const { rank } = rankOf(session, hid);
	const hyp = session.hypotheses.find((h) => h.id === hid);
	const tests = session.testsRun.map((t) => t.testId);
	const valuable = new Set(def.valuableTests);
	const unnecessary = tests.filter((t) => ![...valuable].some((v) => t.includes(v) || v.includes(t)));
	const falseKept = session.hypotheses.filter((h) => h.id !== hid && (h.likelihood === "high" || h.likelihood === "very_high")).map((h) => h.component);
	return {
		sessionId: session.id,
		caseId: def.id,
		trueCause: def.fault.rootCause,
		trueHypothesisId: hid,
		initialRank: first?.trueCauseRank ?? rank,
		finalRank: last?.trueCauseRank ?? rank,
		reachedVeryHigh: hyp?.likelihood === "very_high" || log.some((s) => s.trueCauseLikelihood === "very_high"),
		confirmed: hyp?.status === "confirmed",
		steps: log.length,
		questionsAsked: session.answered.length,
		testsRecommended: tests,
		unnecessaryTests: unnecessary,
		falseHypothesesRetained: falseKept,
		log,
		at: Date.now()
	};
}
function persist(sessions, evals) {
	saveSessions(sessions);
	if (evals) saveEvals(evals);
}
var useDx = create((set, get) => ({
	sessions: typeof localStorage === "undefined" ? [] : loadSessions(),
	currentId: null,
	evals: typeof localStorage === "undefined" ? [] : loadEvals(),
	hydrate: () => {
		set({
			sessions: loadSessions(),
			evals: loadEvals()
		});
	},
	current: () => {
		const { sessions, currentId } = get();
		return sessions.find((s) => s.id === currentId) ?? null;
	},
	start: (input) => {
		const s = createSession(input);
		const sessions = [s, ...get().sessions.filter((x) => x.id !== s.id)].slice(0, 40);
		persist(sessions);
		set({
			sessions,
			currentId: s.id
		});
		return s;
	},
	startFromSimulator: (def) => {
		const history = def.serviceHistory.map((h) => `${h.date} · ${h.mileage.toLocaleString()} mi · ${h.work} (${h.shop})`).join("\n");
		const s = createSession({
			mode: "simulator",
			simCaseId: def.id,
			vehicle: { ...def.vehicle },
			concern: def.concern,
			warningLights: "",
			dtcsRaw: "",
			recentRepairs: def.serviceHistory.filter((h) => h.misleading).map((h) => h.work).join("; "),
			serviceHistory: history,
			techNotes: ""
		});
		s.evalLog = [evalStep(s, def, "intake")];
		const sessions = [s, ...get().sessions.filter((x) => x.simCaseId !== def.id)].slice(0, 40);
		persist(sessions);
		set({
			sessions,
			currentId: s.id
		});
		return s;
	},
	open: (id) => set({ currentId: id }),
	patch: (s) => {
		const sessions = get().sessions.map((x) => x.id === s.id ? s : x);
		if (!sessions.some((x) => x.id === s.id)) sessions.unshift(s);
		persist(sessions);
		set({
			sessions,
			currentId: s.id
		});
	},
	answer: (questionId, optionId) => {
		const cur = get().current();
		if (!cur) return;
		get().patch(answerQuestion(cur, questionId, optionId));
	},
	observe: (text, condition, source) => {
		const cur = get().current();
		if (!cur || !text.trim()) return;
		get().patch(addObservation(cur, text, condition, source));
	},
	enterDtcs: (raw, status, freeze) => {
		const cur = get().current();
		if (!cur) return;
		get().patch(addDtcs(cur, raw, status, freeze));
	},
	enterPids: (text, condition) => {
		const cur = get().current();
		if (!cur) return;
		get().patch(addPidPaste(cur, text, condition));
	},
	enterTest: (testId, result, condition) => {
		const cur = get().current();
		if (!cur) return;
		get().patch(recordTest(cur, testId, result, condition));
	},
	finish: () => {
		const cur = get().current();
		if (!cur) return;
		get().patch(closeSession(cur));
	},
	ingestSimInterview: (q, a) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		get().patch(ingestInterview(cur, q, a));
	},
	ingestSimScan: (v) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		get().patch(ingestScan(cur, v));
	},
	ingestSimTest: (r) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		get().patch(ingestTest(cur, r));
	},
	ingestSimDvom: (label, display, note) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		get().patch(ingestDvom(cur, label, display, note));
	},
	ingestSimScope: (ch, v) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		get().patch(ingestScope(cur, ch, v));
	},
	ingestSimLive: (v) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		get().patch(ingestLiveSnapshot(cur, v));
	},
	recordEval: (def, trigger) => {
		const cur = get().current();
		if (!cur || cur.mode !== "simulator") return;
		const step = evalStep(cur, def, trigger);
		get().patch({
			...cur,
			evalLog: [...cur.evalLog, step].slice(-40)
		});
	},
	closeEval: (def) => {
		const cur = get().current();
		if (!cur) return null;
		const ev = summarizeEval(cur, def);
		const evals = [ev, ...get().evals.filter((x) => x.sessionId !== ev.sessionId)].slice(0, 40);
		persist(get().sessions, evals);
		set({ evals });
		return ev;
	}
}));
//#endregion
export { upsertGenerated as a, saveProfile as i, levelFrom as n, useDx as o, loadProfile as r, LIKELIHOOD_LABEL as t };
