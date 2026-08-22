import { i as __toESM } from "../_runtime.mjs";
import { V as require_react, v as Link, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as QUESTIONS, n as DTC_KB, o as TESTS, u as cn } from "./parse-BCv98ZRn.mjs";
import { t as Button } from "./button-CGaT4Hgu.mjs";
import { o as useDx, t as LIKELIHOOD_LABEL } from "./dx-store-DrlVr6vQ.mjs";
import { n as Route } from "./router-rwpmLnSa.mjs";
import { t as Shell } from "./shell-Gz2dex7O.mjs";
import { r as Panel } from "./format-BXzwJihA.mjs";
import { n as vehicleSub, r as vehicleTitle, t as LikelihoodMark } from "./common-CLtd-aQn.mjs";
import { n as Input, r as Textarea, t as Field } from "./input-C_dNiOsd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session._id-DrCp8bks.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	"Overview",
	"Differential",
	"Evidence",
	"Questions",
	"Tests",
	"DTCs",
	"Live data",
	"Notes",
	"Verification"
];
function DxWorkspace({ id }) {
	const hydrate = useDx((s) => s.hydrate);
	const sessions = useDx((s) => s.sessions);
	const open = useDx((s) => s.open);
	const session = sessions.find((s) => s.id === id);
	const [tab, setTab] = (0, import_react.useState)("Overview");
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		hydrate();
		open(id);
		setReady(true);
	}, [
		hydrate,
		open,
		id
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6 text-sm text-muted",
		children: "Loading session…"
	}) });
	if (!session) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Session not found."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-3 inline-block text-sm text-data",
			children: "New diagnosis"
		})]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		badge: session.mode === "simulator" ? "Simulator" : "Real diagnosis",
		title: `${vehicleTitle(session.vehicle)}`,
		sub: vehicleSub(session.vehicle),
		children: [
			session.safetyFlags.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-elevated px-4 py-2 text-sm text-warn",
				children: session.safetyFlags.join(" ")
			}) : null,
			session.lastMovement.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MovementBanner, { session }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-1 overflow-x-auto border-b border-border px-2 py-1",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t),
					className: cn("h-10 shrink-0 rounded-sm px-3 text-xs", tab === t ? "bg-elevated text-fg" : "text-muted hover:text-fg"),
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-auto p-3 sm:p-4",
				children: [
					tab === "Overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {
						session,
						go: setTab
					}) : null,
					tab === "Differential" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiffPanel, { session }) : null,
					tab === "Evidence" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EvidencePanel, { session }) : null,
					tab === "Questions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionPanel, { session }) : null,
					tab === "Tests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestPanel, { session }) : null,
					tab === "DTCs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DtcPanel, { session }) : null,
					tab === "Live data" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PidPanel, { session }) : null,
					tab === "Notes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesPanel, { session }) : null,
					tab === "Verification" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VerifyPanel, { session }) : null
				]
			})
		]
	});
}
function MovementBanner({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border bg-surface px-4 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-micro uppercase tracking-[0.14em] text-muted",
			children: "Differential updated"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 space-y-1 text-sm",
			children: session.lastMovement.slice(0, 4).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: m.label
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-subtle",
					children: [
						LIKELIHOOD_LABEL[m.from],
						" → ",
						LIKELIHOOD_LABEL[m.to]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-micro text-muted",
					children: m.reason
				})
			] }, m.id))
		})]
	});
}
function Overview({ session, go }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Concern",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed",
						children: session.concern
					}),
					session.symptoms.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-micro text-subtle",
						children: ["Symptoms: ", session.symptoms.join(" · ")]
					}) : null,
					session.operatingConditions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-micro text-subtle",
						children: ["Conditions: ", session.operatingConditions.join(" · ")]
					}) : null,
					session.recentRepairs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-warn",
						children: ["Recent repairs: ", session.recentRepairs]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Current differential",
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-micro text-data",
					onClick: () => go("Differential"),
					children: "Full"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiffList, {
					session,
					compact: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Next best action",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextBlock, { session })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Evidence",
				right: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-micro text-data",
					onClick: () => go("Evidence"),
					children: "Ledger"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm",
					children: session.evidence.slice(-8).reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-data",
							children: "+"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: e.observation
						})]
					}, e.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Reasoning tree",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tree, { session })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Data entry",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickEntry, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => go("Questions"),
							children: "Questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => go("Tests"),
							children: "Enter test"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => go("DTCs"),
							children: "DTCs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => go("Live data"),
							children: "PIDs"
						})
					]
				})]
			})
		]
	});
}
function DiffList({ session, compact }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-2",
		children: session.hypotheses.slice(0, compact ? 5 : 10).map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-md bg-elevated px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-2 font-mono text-micro text-subtle",
						children: i + 1
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium",
						children: h.component
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-micro text-muted",
						children: h.failureMode
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikelihoodMark, { value: h.likelihood })]
			}), !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HypDetail, { h }) : null]
		}, h.id))
	});
}
function HypDetail({ h }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
		className: "mt-2 grid gap-1 text-micro sm:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-subtle",
				children: "Evidence confidence"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "uppercase text-muted",
				children: h.evidenceConfidence
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-subtle",
				children: "Status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "uppercase text-muted",
				children: h.status.replace("_", " ")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "Supporting",
				items: h.supporting,
				pos: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "Contradicting",
				items: h.contradicting
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "Missing",
				items: h.missing
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "More likely when",
				items: h.moreLikelyWhen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
				k: "Less likely when",
				items: h.lessLikelyWhen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-subtle",
					children: "Confirm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: h.confirmTest })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sm:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-subtle",
					children: "Refute"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: h.refuteTest })]
			}),
			h.safety ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sm:col-span-2 text-warn",
				children: h.safety
			}) : null
		]
	});
}
function Row({ k, items, pos }) {
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "sm:col-span-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: pos ? "text-ok" : "text-muted",
			children: [pos ? "+ " : "– ", x]
		}, x)) })]
	});
}
function DiffPanel({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-[1fr_16rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiffList, { session }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "History",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-3 text-micro",
				children: session.history.slice().reverse().map((snap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "uppercase tracking-wider text-subtle",
					children: snap.trigger
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-1 space-y-0.5",
					children: snap.ranked.slice(0, 4).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							i + 1,
							". ",
							r.label
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikelihoodMark, { value: r.likelihood })]
					}, r.id))
				})] }, snap.at))
			})
		})]
	});
}
function EvidencePanel({ session }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: session.evidence.slice().reverse().map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "rounded-md bg-surface px-3 py-2 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-micro uppercase tracking-wider text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.source.replace("_", " ") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.type }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: e.reliability })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm",
					children: e.observation
				}),
				e.operatingCondition ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-micro text-muted",
					children: ["Condition: ", e.operatingCondition]
				}) : null,
				e.supports.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-micro text-ok",
					children: ["Supports ", e.supports.join(", ")]
				}) : null,
				e.contradicts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-micro text-fault",
					children: ["Contradicts ", e.contradicts.join(", ")]
				}) : null
			]
		}, e.id))
	});
}
function NextBlock({ session }) {
	const a = session.nextAction;
	const answer = useDx((s) => s.answer);
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "No action yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-micro uppercase tracking-wider text-subtle",
			children: a.kind
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mt-1 text-base font-medium",
			children: a.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: a.why
		}),
		a.expectedOutcomes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 list-disc pl-4 text-micro text-subtle",
			children: a.expectedOutcomes.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: o }, o))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 font-mono text-micro text-data",
			children: [
				"Time ~",
				a.timeHr,
				" hr · Cost ",
				a.cost,
				" · Discrimination ",
				a.discrimination
			]
		}),
		a.safety ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-warn",
			children: a.safety
		}) : null,
		a.question ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid gap-2",
			children: a.question.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "h-auto min-h-11 justify-start whitespace-normal py-2 text-left",
				onClick: () => answer(a.question.id, o.id),
				children: o.label
			}, o.id))
		}) : null,
		a.alternatives.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-micro uppercase tracking-wider text-subtle",
				children: "Other useful tests"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-1 space-y-1 text-sm text-muted",
				children: a.alternatives.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					i + 2,
					". ",
					x.title,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-micro text-subtle",
						children: x.why
					})
				] }, x.title))
			})]
		}) : null
	] });
}
function QuestionPanel({ session }) {
	const answer = useDx((s) => s.answer);
	const pending = QUESTIONS.filter((q) => q.families.includes(session.family) && !session.askedQuestionIds.includes(q.id));
	const q = session.nextAction?.question ?? pending[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-[1fr_16rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Adaptive interview",
			children: session.nextAction?.kind === "question" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextBlock, { session }) : q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: q.rationale
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-medium",
					children: q.prompt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2",
					children: q.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "h-auto min-h-11 justify-start whitespace-normal py-2 text-left",
						onClick: () => answer(q.id, o.id),
						children: o.label
					}, o.id))
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Highest-value customer questions are exhausted. Technician tests will discriminate more than another interview question."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Asked",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-micro",
				children: session.answered.map((a) => {
					const qq = QUESTIONS.find((x) => x.id === a.questionId);
					const opt = qq?.options.find((o) => o.id === a.optionId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-subtle",
						children: qq?.prompt
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: opt?.label })] }, a.at);
				})
			})
		})]
	});
}
function TestPanel({ session }) {
	const enterTest = useDx((s) => s.enterTest);
	const observe = useDx((s) => s.observe);
	const [testId, setTestId] = (0, import_react.useState)(session.nextAction?.testId ?? TESTS[0].id);
	const [result, setResult] = (0, import_react.useState)("");
	const [cond, setCond] = (0, import_react.useState)("");
	const [nl, setNl] = (0, import_react.useState)("");
	const t = TESTS.find((x) => x.id === testId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Recommended test",
			children: session.nextAction?.kind === "test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextBlock, { session }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Select a test and enter the actual result from the vehicle."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Enter result",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Test",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-11 w-full rounded-md bg-elevated px-3 text-sm ring-1 ring-border",
						value: testId,
						onChange: (e) => setTestId(e.target.value),
						children: TESTS.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: x.id,
							children: x.name
						}, x.id))
					})
				}),
				t ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-micro text-muted",
					children: t.why
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Result",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-20",
							value: result,
							onChange: (e) => setResult(e.target.value),
							placeholder: "47 psi · signal disappears during stall · 1.8 A key-off"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Operating condition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: cond,
							onChange: (e) => setCond(e.target.value),
							placeholder: "Idle, fully warm · coolant 209°F"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					variant: "primary",
					disabled: !result.trim(),
					onClick: () => {
						enterTest(testId, result, cond);
						setResult("");
					},
					children: "File result"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Or paste a natural-language observation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-20",
							value: nl,
							onChange: (e) => setNl(e.target.value),
							placeholder: "Fuel pressure stayed at 48 psi when it died."
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						disabled: !nl.trim(),
						onClick: () => {
							observe(nl, cond);
							setNl("");
						},
						children: "Add observation"
					})]
				})
			]
		})]
	});
}
function DtcPanel({ session }) {
	const enterDtcs = useDx((s) => s.enterDtcs);
	const [raw, setRaw] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("current");
	const [ff, setFf] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Enter DTCs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "A code alters the differential as evidence. It is not a diagnosis."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Codes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: raw,
						onChange: (e) => setRaw(e.target.value),
						placeholder: "P0335 P0171 U0100"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-2 gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-11 w-full rounded-md bg-elevated px-3 text-sm ring-1 ring-border",
							value: status,
							onChange: (e) => setStatus(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "current" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "pending" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "permanent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "history" })
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Freeze-frame paste",
						hint: "Optional PID dump",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-20",
							value: ff,
							onChange: (e) => setFf(e.target.value),
							placeholder: "RPM 712\nECT 205F\nSTFT +19%"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3",
					variant: "primary",
					disabled: !raw.trim(),
					onClick: () => {
						enterDtcs(raw, status, ff);
						setRaw("");
					},
					children: "Add codes"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Library (not a diagnosis)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2 text-sm",
				children: DTC_KB.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-mono text-data",
					children: [
						d.code,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-sans text-fg",
							children: d.title
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-micro text-muted",
					children: d.notADiagnosis
				})] }, d.code))
			}), session.dtcsRaw ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-micro text-subtle",
				children: ["Entered at intake: ", session.dtcsRaw]
			}) : null]
		})]
	});
}
function PidPanel({ session }) {
	const enterPids = useDx((s) => s.enterPids);
	const [text, setText] = (0, import_react.useState)("");
	const [cond, setCond] = (0, import_react.useState)(session.operatingConditions[0] ?? "idle, fully warm");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "Live data / freeze-frame interpreter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Paste scan-tool PIDs. Patterns are interpreted; numbers are not treated as OEM specifications."
			}),
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
					label: "Paste",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "RPM 712\nECT 205F\nSTFT +19%\nLTFT +17%\nMAF 2.1 g/s\nFuel pressure 47 psi"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				variant: "primary",
				disabled: !text.trim(),
				onClick: () => {
					enterPids(text, cond);
					setText("");
				},
				children: "Interpret"
			})
		]
	});
}
function NotesPanel({ session }) {
	const observe = useDx((s) => s.observe);
	const [n, setN] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "Technician notes",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: n,
				onChange: (e) => setN(e.target.value),
				placeholder: "Inspection notes, customer quotes, anything factual"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				disabled: !n.trim(),
				onClick: () => {
					observe(n, void 0, "notes");
					setN("");
				},
				children: "Add to ledger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: session.reasoningSummary
			})
		]
	});
}
function VerifyPanel({ session }) {
	const finish = useDx((s) => s.finish);
	const r = session.repair;
	const v = session.verification;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Supported direction",
				children: r ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: r.action
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-micro uppercase tracking-wider",
						children: ["Evidence strength ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikelihoodMark, { value: r.evidenceStrength })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: r.status
					}),
					r.inspectFirst ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-warn",
						children: r.inspectFirst
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-2 space-y-1 text-sm",
						children: [r.supporting.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-ok",
							children: ["+ ", s]
						}, s)), r.missing.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-subtle",
							children: ["– Missing: ", s]
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-micro text-subtle",
						children: "You may still proceed. This is not an OEM repair authorization."
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No cause is strongly supported yet. Keep discriminating; do not parts-cannon."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Verification plan",
				children: v ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-micro uppercase tracking-wider text-subtle",
						children: "Original conditions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 list-disc pl-4 text-sm",
						children: v.originalConditions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c }, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-micro uppercase tracking-wider text-subtle",
						children: "Steps"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-1 list-decimal pl-4 text-sm",
						children: v.steps.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c }, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-micro text-warn",
						children: v.mustNotMarkCompleteUntil.join(" · ")
					})
				] }) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Diagnostic summary",
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Report, { session }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					variant: "primary",
					onClick: finish,
					children: "Save and close session"
				})]
			})
		]
	});
}
function Report({ session }) {
	const top = session.hypotheses[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "space-y-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-subtle",
					children: "Vehicle. "
				}),
				vehicleTitle(session.vehicle),
				" ",
				vehicleSub(session.vehicle)
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: "Concern. "
			}), session.concern] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: "Most supported cause. "
			}), top ? `${top.component} — ${top.failureMode}` : "Inconclusive"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-subtle",
					children: "Confidence. "
				}),
				top ? LIKELIHOOD_LABEL[top.likelihood] : "—",
				" · evidence ",
				top?.evidenceConfidence ?? "none",
				" · ",
				top?.status.replace("_", " ")
			] }),
			top?.supporting.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: "Key evidence. "
			}), top.supporting.join(" · ")] }) : null,
			top?.contradicting.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: "Contradicting. "
			}), top.contradicting.join(" · ")] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: "Recommended next action. "
			}), session.nextAction?.title] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-micro text-subtle",
				children: session.reasoningSummary
			})
		]
	});
}
function Tree({ session }) {
	const by = /* @__PURE__ */ new Map();
	for (const h of session.hypotheses) {
		const arr = by.get(h.systemLabel) ?? [];
		arr.push(h);
		by.set(h.systemLabel, arr);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "space-y-1 font-mono text-micro",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "uppercase tracking-wider text-subtle",
			children: session.family.replace("_", " ")
		}), [...by.entries()].map(([sys, hs]) => {
			const top = hs[0];
			const mark = top.status === "ruled_out" ? "×" : top.likelihood === "very_low" ? "·" : top.likelihood === "very_high" || top.likelihood === "high" ? "!" : "–";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "pl-2",
				children: [
					mark,
					" ",
					sys,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LikelihoodMark, { value: top.likelihood }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "pl-3 text-muted",
						children: hs.slice(0, 2).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: h.component }, h.id))
					})
				]
			}, sys);
		})]
	});
}
function QuickEntry() {
	const observe = useDx((s) => s.observe);
	const [t, setT] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
		className: "min-h-16",
		value: t,
		onChange: (e) => setT(e.target.value),
		placeholder: "Fuel pressure stayed at 48 psi when it died."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "sm",
		className: "mt-2",
		disabled: !t.trim(),
		onClick: () => {
			observe(t);
			setT("");
		},
		children: "Add evidence"
	})] });
}
function SessionPage() {
	const { id } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DxWorkspace, { id });
}
//#endregion
export { SessionPage as component };
