import { a as ckpDiagram, i as chargingDiagram, n as STANDARD_MODULES, o as intakeDiagram, r as canDiagram, t as COMMON_PARTS } from "./wiring-DpDhFDPJ.mjs";
import { C as mulberry32, c as approach, l as clamp, x as lerp } from "./parse-BCv98ZRn.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { a as upsertGenerated, i as saveProfile, n as levelFrom, o as useDx, r as loadProfile } from "./dx-store-DrlVr6vQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game-store-Da8KsFNn.js
var extraNetwork = [
	...STANDARD_MODULES,
	{
		id: "audio",
		name: "Audio / NAV",
		address: "760",
		protocol: "CAN"
	},
	{
		id: "gateway",
		name: "Central Gateway",
		address: "701",
		protocol: "CAN"
	}
];
var CASES = [
	{
		id: "corolla-nostart",
		title: "Cranks, no start",
		difficulty: "beginner",
		stars: 1,
		category: "no-start",
		vehicle: {
			year: 2017,
			make: "Toyota",
			model: "Corolla",
			engine: "1.8L 2ZR-FE",
			vin: "2T1BURHE5HC128441",
			mileage: 118402
		},
		roNumber: "24101",
		concern: "Cranks but will not start. Happened in the grocery store lot. No warning lights before it died.",
		concernDetail: "Customer states the engine turns over strongly but never fires. It ran normally yesterday.",
		ambientF: 64,
		fuelLevel: .4,
		serviceHistory: [{
			date: "2025-11-02",
			mileage: 114200,
			work: "Oil change, cabin filter",
			shop: "Hendrick Toyota"
		}, {
			date: "2024-06-18",
			mileage: 98210,
			work: "Battery replaced",
			shop: "AutoZone"
		}],
		modules: STANDARD_MODULES,
		components: [
			COMMON_PARTS.ckp,
			COMMON_PARTS.cmp,
			COMMON_PARTS.pump,
			COMMON_PARTS.relay,
			COMMON_PARTS.coil,
			COMMON_PARTS.plugs,
			COMMON_PARTS.ecm,
			COMMON_PARTS.batt
		],
		wiring: ckpDiagram("hall"),
		fault: {
			id: "ckp-open",
			rootCause: "Crankshaft position sensor open circuit (internal failure). No CKP signal while cranking — ECM never enables spark or injection.",
			componentId: "ckp_sensor",
			failureMode: "Open circuit",
			kind: "open_circuit",
			resistanceOhms: 999999,
			dtcs: [{
				code: "P0335",
				description: "Crankshaft Position Sensor Circuit A",
				module: "ecm",
				mil: true,
				pendingSec: 2,
				confirmSec: 6,
				condition: { type: "no_ckp_while_cranking" }
			}],
			inspectionFindings: [
				{
					area: "connectors",
					label: "CKP connector",
					timeHr: .2,
					finding: "Connector is locked and dry. Terminals not backed out.",
					reveals: false
				},
				{
					area: "underhood",
					label: "Sensor body",
					timeHr: .2,
					finding: "CKP is present; no broken pigtail visible from above.",
					reveals: false
				},
				{
					area: "battery",
					label: "Battery",
					timeHr: .1,
					finding: "Terminals clean. Cranking voltage sounds healthy.",
					reveals: false
				}
			],
			correctComponentIds: ["ckp_sensor"],
			verification: {
				needDrive: false,
				needHot: false,
				needLoad: false,
				needKeyOffSoak: false,
				needScopeConfirm: true,
				needTrimConfirm: false,
				needNoCodeReturn: true
			}
		},
		interview: {
			greeting: "It just cranks. Like, it turns over fine, it just won't catch.",
			unknown: "I really don't know. I'm not a car person. It just won't start.",
			items: [
				{
					keywords: [
						"when",
						"start",
						"begin",
						"happen"
					],
					answer: "This morning in the parking lot. I shut it off, came back twenty minutes later, and it wouldn't fire.",
					useful: true
				},
				{
					keywords: [
						"hot",
						"cold",
						"temp",
						"weather"
					],
					answer: "It was a cool morning. I don't think heat had anything to do with it.",
					useful: true
				},
				{
					keywords: [
						"light",
						"mil",
						"check engine",
						"warning"
					],
					answer: "No lights before it died. Now the check engine light is on after I tried starting it a bunch.",
					useful: true
				},
				{
					keywords: [
						"fuel",
						"gas",
						"refuel"
					],
					answer: "I filled up two days ago. Gauge says a bit under half.",
					useful: false
				},
				{
					keywords: [
						"noise",
						"sound",
						"tick",
						"bang"
					],
					answer: "It sounds like it always does when it cranks. No weird noises.",
					useful: false
				},
				{
					keywords: [
						"repair",
						"recent",
						"shop",
						"battery"
					],
					answer: "Battery was replaced last year. Oil change in November. Nothing else.",
					useful: false
				},
				{
					keywords: [
						"restart",
						"die",
						"stall"
					],
					answer: "It hasn't run at all since it quit. Can't restart what won't start.",
					useful: true
				},
				{
					keywords: ["tow", "how got"],
					answer: "You guys towed it in. I didn't want to keep cranking it.",
					useful: false
				}
			]
		},
		expertPathHours: .6,
		allowanceHours: 1.2,
		allowanceUsd: 168,
		pidSet: "basic",
		hints: [
			"A cranking RPM of 0 on the scan tool with a healthy starter usually means the ECM is not seeing CKP.",
			"No spark and no injector pulse together point at engine-position sensing, not fuel.",
			"Scope or DVOM the CKP circuit before replacing a pump."
		],
		valuableTests: [
			"scan",
			"scope",
			"dvom",
			"inspect:connectors"
		]
	},
	{
		id: "rav4-trim",
		title: "CEL and rough idle",
		difficulty: "beginner",
		stars: 2,
		category: "driveability",
		vehicle: {
			year: 2020,
			make: "Toyota",
			model: "RAV4",
			engine: "2.5L A25A-FKS",
			vin: "2T3P1RFV5LC067213",
			mileage: 64211
		},
		roNumber: "24118",
		concern: "Check engine light and rough idle, especially at stoplights. Feels like it wants to die when I first start it.",
		concernDetail: "MIL on. Idle hunts. Customer topped off oil last week.",
		ambientF: 78,
		fuelLevel: .55,
		serviceHistory: [{
			date: "2026-03-12",
			mileage: 62800,
			work: "Air filter, wiper blades",
			shop: "Dealer"
		}, {
			date: "2025-09-04",
			mileage: 54102,
			work: "Inspection — passed",
			shop: "State"
		}],
		modules: STANDARD_MODULES,
		components: [
			COMMON_PARTS.maf,
			COMMON_PARTS.boot,
			COMMON_PARTS.pump,
			COMMON_PARTS.purge,
			COMMON_PARTS.pcv,
			COMMON_PARTS.tb,
			COMMON_PARTS.o2,
			COMMON_PARTS.ckp
		],
		wiring: intakeDiagram(),
		fault: {
			id: "intake-boot",
			rootCause: "Torn intake air hose downstream of the MAF. Unmetered air leans the mixture, driving high positive fuel trims and a rough idle. P0171 sets after trims exceed threshold.",
			componentId: "intake_boot",
			failureMode: "Vacuum / unmetered air leak",
			kind: "vacuum_leak",
			unmeteredAirGps: 3.1,
			leakLocation: "the intake boot just after the MAF, 6 o'clock split",
			dtcs: [{
				code: "P0171",
				description: "System Too Lean Bank 1",
				module: "ecm",
				mil: true,
				pendingSec: 8,
				confirmSec: 18,
				condition: {
					type: "lean_trims",
					ltft: 12,
					stft: 8
				}
			}],
			inspectionFindings: [
				{
					area: "vacuum",
					label: "Intake boot",
					timeHr: .2,
					finding: "Split on the underside of the intake hose, MAF-to-throttle. Edges are oil-stained.",
					reveals: true,
					visibleOnlyIfFault: true
				},
				{
					area: "underhood",
					label: "Engine bay",
					timeHr: .2,
					finding: "Oil film on the intake tube. Nothing else obvious from above.",
					reveals: false
				},
				{
					area: "connectors",
					label: "MAF connector",
					timeHr: .15,
					finding: "Locked, terminals gold and dry.",
					reveals: false
				}
			],
			correctComponentIds: ["intake_boot"],
			verification: {
				needDrive: true,
				needHot: false,
				needLoad: false,
				needKeyOffSoak: false,
				needScopeConfirm: false,
				needTrimConfirm: true,
				needNoCodeReturn: true
			}
		},
		interview: {
			greeting: "It's been running rough at lights and the light came on Tuesday.",
			unknown: "Hmm. I don't really pay attention to that.",
			items: [
				{
					keywords: [
						"when",
						"start",
						"begin"
					],
					answer: "Maybe two weeks. The light came on Tuesday after a short trip to school.",
					useful: true
				},
				{
					keywords: ["hot", "cold"],
					answer: "Worse when I first start it, but it's never smooth at idle even warm.",
					useful: true
				},
				{
					keywords: [
						"fuel",
						"gas",
						"refuel",
						"fill"
					],
					answer: "No, I didn't just fill up. It's not after refueling.",
					useful: true
				},
				{
					keywords: [
						"accel",
						"highway",
						"load"
					],
					answer: "Highway is actually fine. It's the idle that feels terrible.",
					useful: true
				},
				{
					keywords: [
						"repair",
						"recent",
						"filter"
					],
					answer: "They did the air filter in March. I also dumped a little oil in last week — it was on the low hash.",
					useful: false
				},
				{
					keywords: [
						"light",
						"cel",
						"check"
					],
					answer: "Solid check engine light. No flashing. No other warnings.",
					useful: true
				},
				{
					keywords: ["smoke", "smell"],
					answer: "I thought I smelled a little exhaust at idle with the hood up, maybe I'm imagining it.",
					useful: false
				}
			]
		},
		expertPathHours: .9,
		allowanceHours: 1.5,
		allowanceUsd: 186,
		pidSet: "full",
		hints: [
			"High positive STFT and LTFT at idle that improve off-idle is classic unmetered air.",
			"A biased MAF usually looks wrong at cruise too. Compare trims idle vs 2500 rpm.",
			"Smoke the intake before throwing a MAF at it."
		],
		valuableTests: [
			"scan",
			"smoke",
			"inspect:vacuum",
			"drive"
		]
	},
	{
		id: "tundra-stall",
		title: "Intermittent stall",
		difficulty: "technician",
		stars: 4,
		category: "driveability",
		vehicle: {
			year: 2011,
			make: "Toyota",
			model: "Tundra",
			engine: "5.7L 3UR-FE",
			vin: "5TFDW5F19BX227810",
			mileage: 186440
		},
		roNumber: "24133",
		concern: "Occasionally stalls while driving. Sometimes it starts and immediately dies several times, then later runs perfectly. No consistent warning lights.",
		concernDetail: "Cannot duplicate on a short lot test. Customer left a grocery list of 'every shop has tried something.'",
		ambientF: 82,
		fuelLevel: .6,
		serviceHistory: [
			{
				date: "2026-01-20",
				mileage: 184900,
				work: "Fuel pump replaced — customer states no change",
				shop: "Independent — Ridgeway",
				misleading: true
			},
			{
				date: "2025-08-11",
				mileage: 179200,
				work: "Ignition coils (2) replaced",
				shop: "Pep Boys",
				misleading: true
			},
			{
				date: "2024-04-02",
				mileage: 168e3,
				work: "Timing belt? ( invoiced as water pump — 3UR is chain)",
				shop: "Unknown"
			}
		],
		modules: STANDARD_MODULES,
		components: [
			COMMON_PARTS.ckp,
			COMMON_PARTS.ckp_conn,
			COMMON_PARTS.cmp,
			COMMON_PARTS.pump,
			COMMON_PARTS.coil,
			COMMON_PARTS.relay,
			COMMON_PARTS.ecm,
			COMMON_PARTS.batt
		],
		wiring: ckpDiagram("vr"),
		fault: {
			id: "ckp-corr",
			rootCause: "Corroded CKP connector. Vibration and harness movement interrupt the crank signal. The engine stalls, then often restarts after the connection settles. Codes are inconsistent because the fault is fleeting.",
			componentId: "ckp_connector",
			failureMode: "Intermittent open / high resistance at connector",
			kind: "intermittent_connection",
			minVibration: .3,
			intermittentChance: .45,
			recoverSec: 6,
			resistanceOhms: 1.6,
			dtcs: [{
				code: "P0335",
				description: "Crankshaft Position Sensor Circuit A",
				module: "ecm",
				mil: false,
				pendingSec: 1.5,
				confirmSec: 12,
				condition: { type: "ckp_intermittent" }
			}, {
				code: "P0339",
				description: "Crankshaft Position Sensor Circuit Intermittent",
				module: "ecm",
				mil: false,
				pendingSec: .8,
				confirmSec: 8,
				condition: { type: "lost_ckp_while_running" }
			}],
			inspectionFindings: [
				{
					area: "connectors",
					label: "CKP connector",
					timeHr: .2,
					finding: "Green corrosion on the signal terminal. Lock tab is cracked. Pins are a tight-but-gritty fit.",
					reveals: true,
					visibleOnlyIfFault: true
				},
				{
					area: "harness",
					label: "CKP pigtail",
					timeHr: .15,
					finding: "Wiggle at the CKP connector makes RPM drop on the scan tool when the engine is running.",
					reveals: true,
					requiresWiggle: true
				},
				{
					area: "underhood",
					label: "Bay",
					timeHr: .2,
					finding: "Road film on the back of the engine. Nothing screaming at you from a standing visual.",
					reveals: false
				}
			],
			correctComponentIds: ["ckp_connector", "ckp_sensor"],
			verification: {
				needDrive: true,
				needHot: false,
				needLoad: true,
				needKeyOffSoak: false,
				needScopeConfirm: true,
				needTrimConfirm: false,
				needNoCodeReturn: true
			}
		},
		interview: {
			greeting: "It's a ghost. Dies on the road, then it's fine for a week. Everybody's thrown parts at it.",
			unknown: "If I knew that, I'd have told the last two shops.",
			items: [
				{
					keywords: [
						"when",
						"start",
						"begin",
						"how long"
					],
					answer: "Off and on for four months. Worse on rough roads. Fine on a smooth highway sometimes.",
					useful: true
				},
				{
					keywords: ["hot", "cold"],
					answer: "Doesn't seem to care. Cold, hot, whatever.",
					useful: true
				},
				{
					keywords: [
						"restart",
						"die",
						"stall",
						"immediately"
					],
					answer: "Yeah — sometimes it starts and dies three or four times in a row, then it runs like nothing happened.",
					useful: true
				},
				{
					keywords: [
						"light",
						"cel",
						"warning"
					],
					answer: "Maybe a flash of the check engine once. Usually nothing. Traction light flicked on once when it stalled.",
					useful: true
				},
				{
					keywords: [
						"repair",
						"pump",
						"coil",
						"shop"
					],
					answer: "Ridgeway put a pump in it in January. Still does it. Pep Boys did coils last year. Waste of money.",
					useful: true
				},
				{
					keywords: ["fuel", "refuel"],
					answer: "Not tied to filling up.",
					useful: false
				},
				{
					keywords: [
						"accel",
						"stop",
						"idle"
					],
					answer: "It's died pulling away from a light and also just cruising. No pattern I can swear to.",
					useful: true
				},
				{
					keywords: [
						"wet",
						"rain",
						"wash"
					],
					answer: "Maybe worse after a car wash? I only thought about that once.",
					useful: true
				}
			]
		},
		expertPathHours: 1.4,
		allowanceHours: 2.2,
		allowanceUsd: 240,
		pidSet: "full",
		hints: [],
		valuableTests: [
			"scan",
			"scope",
			"wiggle",
			"inspect:connectors",
			"inspect:harness",
			"drive"
		]
	},
	{
		id: "highlander-battery",
		title: "Battery keeps going dead",
		difficulty: "technician",
		stars: 3,
		category: "electrical",
		vehicle: {
			year: 2018,
			make: "Toyota",
			model: "Highlander",
			engine: "3.5L 2GR-FKS",
			vin: "5TDJZRFH5JS547102",
			mileage: 97330
		},
		roNumber: "24147",
		concern: "Battery keeps going dead. Fine if I drive it every day. Sit over a weekend and it won't crank.",
		concernDetail: "Jump-started twice this month. Aftermarket USB outlets under the dash.",
		ambientF: 71,
		fuelLevel: .5,
		serviceHistory: [{
			date: "2026-07-02",
			mileage: 97110,
			work: "Battery tested — 'weak, replace'",
			shop: "Advance Auto",
			misleading: true
		}, {
			date: "2023-12-18",
			mileage: 70200,
			work: "OEM battery installed",
			shop: "Dealer"
		}],
		modules: STANDARD_MODULES,
		components: [
			COMMON_PARTS.batt,
			COMMON_PARTS.alt,
			COMMON_PARTS.glove,
			COMMON_PARTS.ecm,
			{
				id: "bcm",
				name: "Body control module",
				group: "Electrical",
				partCost: 420,
				laborHours: 1.6
			}
		],
		wiring: chargingDiagram(),
		fault: {
			id: "glove-draw",
			rootCause: "Glove box lamp switch stuck closed. The lamp stays on with the door shut, drawing ~1.8 A key-off. The battery is a victim, not the cause. Charging system is healthy.",
			componentId: "glove_box_switch",
			failureMode: "Stuck-closed lamp switch / parasitic draw",
			kind: "parasitic_draw",
			keyOffOnly: true,
			parasiticAmps: 1.82,
			dtcs: [{
				code: "P0562",
				description: "System Voltage Low",
				module: "ecm",
				mil: false,
				pendingSec: 4,
				confirmSec: 20,
				condition: { type: "system_voltage_low" }
			}],
			inspectionFindings: [
				{
					area: "interior",
					label: "Glove box lamp",
					timeHr: .2,
					finding: "Lamp remains lit with the glove box latched. Switch plunger is collapsed.",
					reveals: true,
					visibleOnlyIfFault: true
				},
				{
					area: "battery",
					label: "Battery posts",
					timeHr: .15,
					finding: "Posts are clean. Battery feels warm from recent jumping. Resting voltage is low.",
					reveals: false
				},
				{
					area: "stereo",
					label: "Aftermarket USB",
					timeHr: .2,
					finding: "USB sockets under the dash. They go dead with key off — not the draw.",
					reveals: false
				},
				{
					area: "underhood",
					label: "Alternator",
					timeHr: .15,
					finding: "No oil in the alternator vents. Connections tight.",
					reveals: false
				}
			],
			correctComponentIds: ["glove_box_switch"],
			verification: {
				needDrive: false,
				needHot: false,
				needLoad: false,
				needKeyOffSoak: true,
				needScopeConfirm: false,
				needTrimConfirm: false,
				needNoCodeReturn: false
			}
		},
		interview: {
			greeting: "Every Monday it's dead. If I drive it during the week it's fine.",
			unknown: "I mean… it just doesn't start. That's all I know.",
			items: [
				{
					keywords: [
						"when",
						"weekend",
						"sit",
						"park"
					],
					answer: "If it sits more than a day, especially a weekend, it's dead Monday morning.",
					useful: true
				},
				{
					keywords: [
						"light",
						"interior",
						"glove",
						"dome"
					],
					answer: "I don't think I left a light on. I always close everything. The dash looks dark.",
					useful: false
				},
				{
					keywords: [
						"jump",
						"boost",
						"start"
					],
					answer: "Jumped it twice. Starts right up on a jump and drives normal. Charge light is not on while I'm driving.",
					useful: true
				},
				{
					keywords: [
						"radio",
						"stereo",
						"usb",
						"aftermarket"
					],
					answer: "The USB ports were added last year for the kids. They only work with the car on, I think.",
					useful: false
				},
				{
					keywords: [
						"repair",
						"battery",
						"alt"
					],
					answer: "Advance said the battery is weak and wanted to sell me one. I wanted a real diagnosis.",
					useful: true
				},
				{
					keywords: ["hot", "cold"],
					answer: "Worse lately but it's been warmer, so I don't think it's the cold.",
					useful: false
				},
				{
					keywords: [
						"smell",
						"heat",
						"alternator"
					],
					answer: "No smells. No noises. It just won't crank after sitting.",
					useful: false
				}
			]
		},
		expertPathHours: 1.1,
		allowanceHours: 1.8,
		allowanceUsd: 210,
		pidSet: "full",
		hints: [],
		valuableTests: [
			"parasitic",
			"charging",
			"inspect:interior",
			"overnight"
		]
	},
	{
		id: "corolla-network",
		title: "Multiple warning lights",
		difficulty: "technician",
		stars: 4,
		category: "network",
		vehicle: {
			year: 2024,
			make: "Toyota",
			model: "Corolla",
			engine: "2.0L M20A-FKS",
			vin: "5Y2S1LD26RT018334",
			mileage: 18420
		},
		roNumber: "24162",
		concern: "Half the dash lit up. Traction, ABS, pre-collision, steering assist — they come and go. Radio just went in last month.",
		concernDetail: "Intermittent module communication. Vehicle still drives. Customer had an aftermarket head unit installed at a stereo shop.",
		ambientF: 88,
		fuelLevel: .7,
		serviceHistory: [{
			date: "2026-07-28",
			mileage: 18100,
			work: "Aftermarket head unit installed",
			shop: "Bassline Audio",
			misleading: false
		}, {
			date: "2026-01-15",
			mileage: 9200,
			work: "1st service",
			shop: "Dealer"
		}],
		modules: extraNetwork,
		components: [
			COMMON_PARTS.splice,
			COMMON_PARTS.head,
			COMMON_PARTS.ecm,
			COMMON_PARTS.batt,
			{
				id: "abs",
				name: "ABS actuator / ECU",
				group: "Network",
				partCost: 860,
				laborHours: 2.4
			},
			{
				id: "gateway",
				name: "Central gateway",
				group: "Network",
				partCost: 540,
				laborHours: 1.1
			}
		],
		wiring: canDiagram(),
		fault: {
			id: "can-short",
			rootCause: "CAN-H shorted toward ground at the aftermarket head-unit splice. Bus voltage collapses, modules drop offline, and the cluster throws a handful of U-codes. Isolating the stereo splice restores the bus.",
			componentId: "can_splice_stereo",
			failureMode: "CAN-H short to ground (aftermarket splice)",
			kind: "can_bus_fault",
			canFault: "canh-gnd",
			minVibration: .05,
			dtcs: [{
				code: "U0100",
				description: "Lost Communication with ECM/PCM A",
				module: "gateway",
				mil: true,
				pendingSec: 1,
				confirmSec: 3,
				condition: {
					type: "lost_comm",
					module: "abs"
				}
			}],
			inspectionFindings: [
				{
					area: "stereo",
					label: "Head unit harness",
					timeHr: .25,
					finding: "T-taps and a scotch-lok on a yellow CAN-H pair behind the radio. One tap is copper-bare against a bracket.",
					reveals: true,
					visibleOnlyIfFault: true
				},
				{
					area: "underhood",
					label: "Engine bay",
					timeHr: .15,
					finding: "No aftermarket wiring in the bay. Grounds look factory.",
					reveals: false
				},
				{
					area: "connectors",
					label: "Gateway connector",
					timeHr: .2,
					finding: "Factory connector fully seated. No water.",
					reveals: false
				}
			],
			correctComponentIds: ["can_splice_stereo", "audio"],
			verification: {
				needDrive: true,
				needHot: false,
				needLoad: false,
				needKeyOffSoak: false,
				needScopeConfirm: true,
				needTrimConfirm: false,
				needNoCodeReturn: true
			}
		},
		interview: {
			greeting: "The dash looks like a Christmas tree. It started after the new radio, I think, but the stereo shop said that's a coincidence.",
			unknown: "The warning lights just… happen. I don't know what they mean.",
			items: [
				{
					keywords: [
						"radio",
						"stereo",
						"head",
						"install"
					],
					answer: "Bassline put a new screen in about three weeks ago. The backup camera works. That's when the warnings started, if I'm honest.",
					useful: true
				},
				{
					keywords: [
						"when",
						"bump",
						"rough",
						"turn"
					],
					answer: "Worse over bumps. Sometimes a sharp left from the driveway sets it off.",
					useful: true
				},
				{
					keywords: [
						"start",
						"dead",
						"crank"
					],
					answer: "It always starts. It drives. It just screams at me.",
					useful: true
				},
				{
					keywords: [
						"light",
						"abs",
						"traction"
					],
					answer: "ABS, traction, pre-collision, lane keep — they come on as a set, then they all go away for a while.",
					useful: true
				},
				{
					keywords: ["repair", "dealer"],
					answer: "Dealer said they need it for two days and mentioned a gateway. I wanted a second look.",
					useful: false
				},
				{
					keywords: [
						"wet",
						"water",
						"rain"
					],
					answer: "No leaks that I know of.",
					useful: false
				}
			]
		},
		expertPathHours: 1.3,
		allowanceHours: 2,
		allowanceUsd: 260,
		pidSet: "full",
		hints: [],
		valuableTests: [
			"scan",
			"scope",
			"inspect:stereo",
			"dvom"
		]
	},
	{
		id: "camry-hotckp",
		title: "Hot soak stall",
		difficulty: "master",
		stars: 5,
		category: "driveability",
		vehicle: {
			year: 2019,
			make: "Toyota",
			model: "Camry",
			engine: "2.5L A25A-FKS",
			vin: "4T1B11HK5KU123908",
			mileage: 84211
		},
		roNumber: "24193",
		concern: "Intermittently stalls at stops after a long drive. Fine when cold. Sometimes restarts immediately, sometimes I have to wait.",
		concernDetail: "Prior shop replaced the fuel pump. Symptom unchanged. Customer is hot, literally and figuratively.",
		ambientF: 91,
		fuelLevel: .5,
		serviceHistory: [
			{
				date: "2026-06-14",
				mileage: 83100,
				work: "Fuel pump assembly replaced — no change",
				shop: "Quick Lane",
				misleading: true
			},
			{
				date: "2026-05-02",
				mileage: 82440,
				work: "Throttle body cleaned",
				shop: "Independent"
			},
			{
				date: "2025-12-09",
				mileage: 78012,
				work: "Brake fluid, cabin filter",
				shop: "Dealer"
			}
		],
		modules: STANDARD_MODULES,
		components: [
			COMMON_PARTS.ckp,
			COMMON_PARTS.cmp,
			COMMON_PARTS.pump,
			COMMON_PARTS.maf,
			COMMON_PARTS.relay,
			COMMON_PARTS.coil,
			COMMON_PARTS.ecm,
			COMMON_PARTS.batt,
			COMMON_PARTS.purge
		],
		wiring: ckpDiagram("hall"),
		fault: {
			id: "ckp-hot",
			rootCause: "CKP sensor internal resistance climbs above ~205°F. Cold tests are clean. Fully warm, the Hall signal drops out, RPM PID falls to 0, and the engine stalls. Cooling the sensor restores the signal. Verification requires recreating the hot condition.",
			componentId: "ckp_sensor",
			failureMode: "Temperature-dependent internal resistance",
			kind: "temp_resistance",
			minComponentF: 205,
			intermittentChance: .55,
			resistanceOhms: 960,
			resistanceHotOhms: 52e3,
			dtcs: [
				{
					code: "P0335",
					description: "Crankshaft Position Sensor Circuit A",
					module: "ecm",
					mil: true,
					pendingSec: 2,
					confirmSec: 10,
					condition: { type: "lost_ckp_while_running" }
				},
				{
					code: "P0339",
					description: "Crankshaft Position Sensor Intermittent",
					module: "ecm",
					mil: false,
					pendingSec: 1,
					confirmSec: 8,
					condition: { type: "ckp_intermittent" }
				},
				{
					code: "P0456",
					description: "EVAP Very Small Leak",
					module: "ecm",
					mil: false,
					pendingSec: 30,
					confirmSec: 90,
					condition: { type: "evap_small_leak" },
					distractor: true
				}
			],
			inspectionFindings: [
				{
					area: "connectors",
					label: "CKP connector",
					timeHr: .2,
					finding: "Connector looks factory-clean. No corrosion. That does not rule out an internal sensor fault.",
					reveals: false
				},
				{
					area: "underhood",
					label: "Sensor location",
					timeHr: .2,
					finding: "CKP sits low at the bellhousing — it heat-soaks hard after shutdown on a 91° day.",
					reveals: false
				},
				{
					area: "vacuum",
					label: "Intake / purge",
					timeHr: .2,
					finding: "Hoses intact. Purge valve clicks with a power probe (sim).",
					reveals: false
				}
			],
			correctComponentIds: ["ckp_sensor"],
			verification: {
				needDrive: true,
				needHot: true,
				needLoad: false,
				needKeyOffSoak: false,
				needScopeConfirm: true,
				needTrimConfirm: false,
				needNoCodeReturn: true
			},
			previousBadRepair: {
				part: "Fuel pump",
				shop: "Quick Lane",
				note: "Pump was replaced for a stall complaint. Fuel pressure was never documented."
			}
		},
		interview: {
			greeting: "It only does it after I've been driving a while, usually right as I come to a stop. Cold? Perfect.",
			unknown: "I wish I could tell you more. It's never done it in a shop parking lot.",
			items: [
				{
					keywords: [
						"when",
						"hot",
						"warm",
						"after"
					],
					answer: "Always after 20–30 minutes of driving, usually in this heat. Never first start of the day.",
					useful: true
				},
				{
					keywords: ["cold"],
					answer: "Cold start is perfect. I can idle it in the driveway all morning.",
					useful: true
				},
				{
					keywords: [
						"restart",
						"wait",
						"die"
					],
					answer: "Sometimes it fires right back up. If it doesn't, I wait five or ten minutes and then it's fine — until I get it hot again.",
					useful: true
				},
				{
					keywords: [
						"fuel",
						"pump",
						"repair",
						"shop"
					],
					answer: "Quick Lane put a pump in it in June. Charged me a fortune. Did nothing. That's why I'm here.",
					useful: true
				},
				{
					keywords: ["light", "cel"],
					answer: "Check engine came on after the last stall. It wasn't on for the first few times.",
					useful: true
				},
				{
					keywords: [
						"accel",
						"highway",
						"stop"
					],
					answer: "It hasn't died at speed. It's as I slow down or sit at a light.",
					useful: true
				},
				{
					keywords: ["refuel", "fill"],
					answer: "Not related to gas. I don't even let it get below a quarter.",
					useful: false
				},
				{
					keywords: ["noise"],
					answer: "No noises. It just shuts off like I keyed it.",
					useful: true
				}
			]
		},
		expertPathHours: 1.5,
		allowanceHours: 2.4,
		allowanceUsd: 280,
		pidSet: "full",
		hints: [],
		valuableTests: [
			"scan",
			"scope",
			"drive",
			"dvom",
			"fuel"
		]
	}
];
function getCase(id) {
	return CASES.find((c) => c.id === id);
}
function vehicleLine(c) {
	return `${c.vehicle.year} ${c.vehicle.make} ${c.vehicle.model}`;
}
function engineLine(c) {
	return `${c.vehicle.engine} · ${c.vehicle.mileage.toLocaleString()} mi`;
}
function scoreCase(input) {
	const { def, state, log, hypotheses, laborHours, partsReplaced, surrendered } = input;
	const notes = [];
	const correct = state.faultCleared;
	const correctPart = partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id));
	let root = 0;
	if (correct && correctPart) root = 30;
	else if (correct) root = 24;
	else {
		const named = hypotheses.some((h) => (h.status === "confirmed" || h.status === "likely") && def.fault.correctComponentIds.some((id) => h.text.toLowerCase().includes(id.replace(/_/g, " ").slice(0, 6))));
		const textHit = hypotheses.some((h) => {
			const t = h.text.toLowerCase();
			return (h.status === "confirmed" || h.status === "likely") && (t.includes("crank") || t.includes("ckp") || t.includes("intake") || t.includes("boot") || t.includes("vacuum") || t.includes("glove") || t.includes("parasitic") || t.includes("can") || t.includes("network") || t.includes("splice") || t.includes("head unit") || t.includes("connector"));
		});
		if (named || textHit) root = 8;
	}
	if (surrendered) root = Math.min(root, 6);
	const useful = log.filter((l) => l.useful);
	const usefulKinds = new Set(useful.map((l) => l.testId ?? l.kind));
	let evidence = 0;
	evidence += Math.min(12, usefulKinds.size * 3);
	if (hypotheses.some((h) => h.evidence.plus.length > 0 && (h.status === "confirmed" || h.status === "likely"))) evidence += 5;
	if (log.some((l) => l.kind === "scope" && l.useful)) evidence += 3;
	if (log.some((l) => l.kind === "interview")) evidence += 1;
	evidence = clamp(evidence, 0, 20);
	if (hypotheses.some((h) => h.status === "confirmed" && h.evidence.plus.length === 0)) {
		evidence = Math.max(0, evidence - 4);
		notes.push("A hypothesis was confirmed without attached evidence.");
	}
	const unnecessaryTests = [];
	const seen = /* @__PURE__ */ new Set();
	for (const l of log) {
		const id = l.testId ?? l.kind;
		if (l.kind === "notes" || l.kind === "hypothesis" || l.kind === "key" || l.kind === "interview") continue;
		if ([
			"scan",
			"dtc_clear",
			"drive",
			"inspect",
			"scope",
			"dvom",
			"fuel",
			"smoke",
			"parasitic",
			"charging",
			"wiggle"
		].includes(l.kind) || l.testId) {
			if (seen.has(id) && l.kind !== "drive" && l.kind !== "scan") unnecessaryTests.push(`Repeat: ${l.label}`);
			seen.add(id);
			if (l.useful === false && (l.kind === "smoke" || l.kind === "fuel" || l.kind === "parasitic")) {
				if (!def.valuableTests.includes(l.kind) && !def.valuableTests.includes(id)) unnecessaryTests.push(l.label);
			}
		}
	}
	let efficiency = 20 - Math.min(20, unnecessaryTests.length * 2);
	if (log.filter((l) => l.kind === "scan").length === 0) {
		efficiency -= 3;
		notes.push("Vehicle was never scanned.");
	}
	const ratio = laborHours / Math.max(.4, def.expertPathHours);
	let time = 15;
	if (ratio > 1) time = clamp(15 - (ratio - 1) * 10, 0, 15);
	if (ratio < .5 && !correct) time = 6;
	let verification = 0;
	if (correct) {
		if (def.fault.verification.needDrive) {
			if (input.verifiedDrive) verification += 4;
			else notes.push("No post-repair test drive.");
		} else verification += 3;
		if (def.fault.verification.needHot) {
			if (input.verifiedHot) verification += 4;
			else notes.push("Original hot condition was not reproduced after the repair.");
		} else if (def.fault.verification.needKeyOffSoak) {
			if (input.verifiedSoak) verification += 4;
			else notes.push("Key-off soak was not repeated after the repair.");
		} else verification += 3;
		if (def.fault.verification.needNoCodeReturn) {
			if (input.codesClearedAfter && !state.mil) verification += 4;
			else notes.push("Codes were not cleared and rechecked after the repair.");
		} else if (input.verifiedScope || input.verifiedTrim) verification += 3;
		else verification += 2;
		verification = Math.min(15, verification);
	} else notes.push("Root cause was not corrected, so verification cannot complete.");
	const unnecessaryParts = partsReplaced.filter((p) => !def.fault.correctComponentIds.includes(p.id)).map((p) => p.name);
	const penalty = unnecessaryParts.length * 8 + input.hintsUsed * 3 + (surrendered ? 20 : 0);
	let total = root + evidence + efficiency + time + verification - penalty;
	total = clamp(Math.round(total), 0, 100);
	const bestEvidence = useful.sort((a, b) => (b.useful ? 1 : 0) - (a.useful ? 1 : 0))[0]?.detail ?? "No discriminating test was logged.";
	return {
		total,
		rootCause: {
			got: root,
			max: 30
		},
		evidence: {
			got: evidence,
			max: 20
		},
		efficiency: {
			got: efficiency,
			max: 20
		},
		time: {
			got: Math.round(time),
			max: 15
		},
		verification: {
			got: verification,
			max: 15
		},
		unnecessaryTests: [...new Set(unnecessaryTests)].slice(0, 8),
		unnecessaryParts,
		rootCauseText: def.fault.rootCause,
		bestEvidence,
		diagnosticHours: +laborHours.toFixed(2),
		expertHours: def.expertPathHours,
		notes
	};
}
var ACHIEVEMENTS = [
	{
		id: "first-close",
		label: "First Close",
		desc: "Complete a repair order"
	},
	{
		id: "no-cannon",
		label: "No Cannon",
		desc: "Finish with zero unnecessary parts"
	},
	{
		id: "sub-hour",
		label: "Sub-Hour",
		desc: "Close a case under 1.0 hr"
	},
	{
		id: "heat",
		label: "Heat Soaked",
		desc: "Solve a temperature-dependent fault"
	},
	{
		id: "bus",
		label: "Bus Whisperer",
		desc: "Solve a network case"
	},
	{
		id: "night",
		label: "Graveyard Draw",
		desc: "Solve a parasitic-draw case"
	},
	{
		id: "perfect",
		label: "Master Sheet",
		desc: "Score 95 or higher"
	},
	{
		id: "master",
		label: "Master Tech",
		desc: "Complete a Master Tech case"
	}
];
function createInitialState(def, seed) {
	const f = def.fault;
	const ambient = def.ambientF;
	const lowBatt = f.kind === "parasitic_draw";
	const soc = lowBatt ? .42 : .86;
	const batt = lowBatt ? 11.86 : 12.58;
	const modules = {};
	for (const m of def.modules) modules[m.id] = true;
	if (f.kind === "can_bus_fault") {
		modules.abs = false;
		modules.bcm = Math.random() > .4;
		modules.audio = false;
	}
	return {
		seed,
		simTime: 0,
		key: "off",
		engineRunning: false,
		cranking: false,
		rpm: 0,
		vss: 0,
		coolantF: ambient,
		iatF: ambient,
		ambientF: ambient,
		componentF: ambient,
		batteryV: batt,
		soc,
		altV: 0,
		rippleVac: 0,
		parasiticA: .018,
		load: 0,
		tps: 0,
		accel: 0,
		maf: 0,
		map: 101,
		stft: 0,
		ltft: f.kind === "vacuum_leak" ? 12 : 1.4,
		fuelPsi: 0,
		afr: 1,
		o2dn: .45,
		ignTiming: 0,
		fuelPct: def.fuelLevel,
		mode: "parked",
		vibration: 0,
		wiggleTimer: 0,
		faultActive: false,
		faultSeverity: 0,
		lostSync: 0,
		crankOk: true,
		camOk: true,
		injectorMs: 0,
		spark: false,
		mil: false,
		dtcs: [],
		pendingTimers: {},
		moduleOnline: modules,
		replaced: [],
		faultCleared: false,
		heatSoak: false,
		crankAttempts: 0,
		stalledEvent: false,
		lastStallTime: -999,
		runTime: 0,
		trimsLocked: false
	};
}
function evaluateFault(state, fault, rng) {
	if (state.faultCleared) return {
		active: false,
		severity: 0,
		crankOk: true,
		camOk: true
	};
	const c = fault;
	let cond = true;
	if (c.minCoolantF != null) cond = cond && state.coolantF >= c.minCoolantF;
	if (c.minComponentF != null) cond = cond && state.componentF >= c.minComponentF;
	if (c.minRpm != null) cond = cond && state.rpm >= c.minRpm;
	if (c.minLoad != null) cond = cond && state.load >= c.minLoad;
	if (c.minVibration != null) cond = cond && state.vibration >= c.minVibration;
	if (c.keyOffOnly) cond = cond && state.key === "off" && !state.engineRunning;
	if (c.engineRunningOnly) cond = cond && state.engineRunning;
	let active = cond;
	let severity = 0;
	if (c.kind === "open_circuit") {
		active = true;
		severity = 1;
	} else if (c.kind === "temp_resistance") {
		const lo = c.minComponentF ?? 205;
		const t = state.componentF;
		if (t < lo - 8) {
			active = false;
			severity = 0;
		} else {
			severity = clamp((t - (lo - 8)) / 20, 0, 1);
			active = severity > .25 && (c.intermittentChance == null || rng() < c.intermittentChance * severity + .15);
		}
	} else if (c.kind === "intermittent_connection") {
		const vib = Math.max(state.vibration, state.wiggleTimer > 0 ? .9 : 0);
		const chance = (c.intermittentChance ?? .35) * vib;
		active = vib > .25 && rng() < chance;
		severity = active ? clamp(vib, .3, 1) : 0;
	} else if (c.kind === "vacuum_leak") {
		active = true;
		severity = state.engineRunning ? clamp(.45 + (800 - Math.min(state.rpm, 800)) / 1600, .4, .9) : .2;
	} else if (c.kind === "parasitic_draw") {
		active = state.key === "off" && !state.engineRunning;
		severity = active ? 1 : 0;
	} else if (c.kind === "can_bus_fault") {
		const vib = state.vibration;
		active = true;
		severity = .55 + vib * .4;
	} else if (c.kind === "fuel_delivery") {
		const heat = clamp((state.componentF - 160) / 50, 0, 1);
		const load = state.load / 100;
		severity = clamp(.2 + heat * .5 + load * .5, 0, 1);
		active = severity > .35;
	} else if (c.kind === "charging_fault") {
		active = state.engineRunning;
		severity = active ? 1 : 0;
	}
	let crankOk = true;
	let camOk = true;
	const onCkp = c.componentId.includes("ckp");
	const onCam = c.componentId.includes("cmp") || c.componentId.includes("cam");
	if (onCkp && active) {
		if (c.kind === "open_circuit") crankOk = false;
		else if (c.kind === "temp_resistance") crankOk = severity < .55;
		else if (c.kind === "intermittent_connection") crankOk = !active;
	}
	if (onCam && active) camOk = false;
	return {
		active,
		severity,
		crankOk,
		camOk
	};
}
function modeTargets(mode, running) {
	if (!running) return {
		rpm: 0,
		vss: 0,
		load: 0,
		tps: 0,
		accel: 0,
		vib: 0
	};
	switch (mode) {
		case "parked":
		case "idle": return {
			rpm: 720,
			vss: 0,
			load: 18,
			tps: 2.4,
			accel: 0,
			vib: .08
		};
		case "city": return {
			rpm: 1680,
			vss: 28,
			load: 32,
			tps: 14,
			accel: 18,
			vib: .35
		};
		case "highway": return {
			rpm: 2320,
			vss: 68,
			load: 38,
			tps: 22,
			accel: 24,
			vib: .28
		};
		case "accel": return {
			rpm: 3400,
			vss: 44,
			load: 78,
			tps: 62,
			accel: 80,
			vib: .55
		};
		case "decel": return {
			rpm: 1400,
			vss: 36,
			load: 8,
			tps: 0,
			accel: 0,
			vib: .22
		};
		case "stop_go": return {
			rpm: 1100,
			vss: 12,
			load: 28,
			tps: 11,
			accel: 20,
			vib: .48
		};
		case "hill": return {
			rpm: 2800,
			vss: 38,
			load: 72,
			tps: 48,
			accel: 62,
			vib: .42
		};
		case "hot_soak": return {
			rpm: 0,
			vss: 0,
			load: 0,
			tps: 0,
			accel: 0,
			vib: 0
		};
		default: return {
			rpm: 720,
			vss: 0,
			load: 18,
			tps: 2,
			accel: 0,
			vib: .08
		};
	}
}
function captureFF(s) {
	return {
		rpm: Math.round(s.rpm),
		vss: Math.round(s.vss),
		ect: Math.round(s.coolantF),
		load: Math.round(s.load),
		stft: +s.stft.toFixed(1),
		ltft: +s.ltft.toFixed(1),
		maf: +s.maf.toFixed(2),
		map: +s.map.toFixed(1),
		iat: Math.round(s.iatF),
		vpwr: +s.batteryV.toFixed(2)
	};
}
function evalCondition(cond, s) {
	switch (cond.type) {
		case "no_ckp_while_cranking": return s.cranking && !s.crankOk;
		case "lost_ckp_while_running": return s.stalledEvent && s.runTime > 8;
		case "ckp_intermittent": return s.stalledEvent && s.faultActive;
		case "lean_trims": return s.engineRunning && s.ltft >= cond.ltft && s.stft >= cond.stft && s.runTime > 12;
		case "misfire": return s.engineRunning && s.faultSeverity > .7 && s.stft > 18;
		case "system_voltage_low": return s.batteryV < 11.5;
		case "lost_comm": return s.moduleOnline[cond.module] === false;
		case "always_if_fault_active": return s.faultActive;
		case "evap_small_leak": return s.runTime > 40 && s.engineRunning;
		case "never": return false;
	}
}
function updateDtcs(s, def, dt) {
	const next = {
		...s,
		dtcs: s.dtcs.map((d) => ({ ...d })),
		pendingTimers: { ...s.pendingTimers }
	};
	for (const rule of def.fault.dtcs) {
		if (rule.distractor && def.difficulty !== "master") continue;
		const firing = evalCondition(rule.condition, s);
		const t = next.pendingTimers[rule.code] ?? 0;
		next.pendingTimers[rule.code] = firing ? t + dt : Math.max(0, t - dt * .4);
		const existing = next.dtcs.find((d) => d.code === rule.code);
		if (firing && next.pendingTimers[rule.code] >= rule.pendingSec) {
			if (!existing) next.dtcs.push({
				code: rule.code,
				description: rule.description,
				module: rule.module,
				status: next.pendingTimers[rule.code] >= rule.confirmSec ? "confirmed" : "pending",
				mil: rule.mil && next.pendingTimers[rule.code] >= rule.confirmSec,
				setSimTime: s.simTime,
				freezeFrame: captureFF(s),
				distractor: rule.distractor
			});
			else if (existing.status === "pending" && next.pendingTimers[rule.code] >= rule.confirmSec) {
				existing.status = "confirmed";
				existing.mil = rule.mil;
			}
		}
	}
	if (def.fault.kind === "can_bus_fault" && s.faultActive) {
		for (const c of [
			{
				code: "U0100",
				description: "Lost Communication with ECM/PCM",
				module: "gateway"
			},
			{
				code: "U0121",
				description: "Lost Communication with ABS",
				module: "gateway"
			},
			{
				code: "U0155",
				description: "Lost Communication with IPC",
				module: "gateway"
			}
		]) if (!next.dtcs.some((d) => d.code === c.code)) next.dtcs.push({
			...c,
			status: "confirmed",
			mil: true,
			setSimTime: s.simTime,
			freezeFrame: captureFF(s)
		});
	}
	next.mil = next.dtcs.some((d) => d.mil && d.status === "confirmed");
	return next;
}
function tick(state, def, dt, rng) {
	const s = { ...state };
	s.simTime += dt;
	const fault = def.fault;
	if (s.wiggleTimer > 0) s.wiggleTimer = Math.max(0, s.wiggleTimer - dt);
	if (s.mode === "hot_soak") {
		s.engineRunning = false;
		s.cranking = false;
		s.key = "off";
		s.heatSoak = true;
	}
	const ev = evaluateFault(s, fault, rng);
	s.faultActive = ev.active;
	s.faultSeverity = ev.severity;
	s.crankOk = ev.crankOk;
	s.camOk = ev.camOk;
	if (s.key === "start" && !s.engineRunning) {
		s.cranking = true;
		s.crankAttempts += dt > 0 ? dt : 0;
	} else s.cranking = false;
	const canStart = s.crankOk && s.camOk && s.soc > .18 && (fault.kind !== "fuel_delivery" || s.fuelPsi > 28 || s.faultCleared);
	if (s.cranking) {
		const crankRpm = s.soc > .3 ? 220 : 90;
		s.rpm = s.crankOk ? crankRpm : 0;
		s.batteryV = clamp(s.batteryV - 1.8, 9.2, 12.6);
		if (canStart && s.fuelPsi > 25) {
			s.engineRunning = true;
			s.cranking = false;
			s.key = "on";
			s.stalledEvent = false;
		}
	}
	const tgt = modeTargets(s.mode, s.engineRunning);
	if (s.engineRunning) {
		s.runTime += dt;
		if (!s.crankOk || !s.camOk) {
			s.lostSync += dt;
			s.rpm = lerp(s.rpm, 0, clamp(s.lostSync * 8, 0, 1));
			if (s.lostSync > .18) {
				s.engineRunning = false;
				s.stalledEvent = true;
				s.lastStallTime = s.simTime;
				s.rpm = 0;
				s.spark = false;
				s.injectorMs = 0;
				s.lostSync = 0;
			}
		} else {
			s.lostSync = 0;
			s.rpm = approach(s.rpm, tgt.rpm, 2400, dt);
			s.spark = true;
			s.injectorMs = 2.4 + tgt.load / 100 * 8;
		}
		s.vss = approach(s.vss, tgt.vss, 28, dt);
		s.load = approach(s.load, tgt.load, 50, dt);
		s.tps = approach(s.tps, tgt.tps, 70, dt);
		s.accel = approach(s.accel, tgt.accel, 80, dt);
		s.vibration = approach(s.vibration, Math.max(tgt.vib, s.wiggleTimer > 0 ? .95 : 0), 2, dt);
		const heat = 4.2 + s.rpm / 700 * 2.4 + s.load / 100 * 3;
		s.coolantF = approach(s.coolantF, 196, heat, dt);
		s.componentF = approach(s.componentF, s.coolantF + 18 + s.load / 100 * 14, heat * 1.3, dt);
		s.iatF = approach(s.iatF, s.ambientF + 12 + s.load * .08, 3, dt);
		if (fault.kind === "charging_fault" && !s.faultCleared) {
			s.altV = fault.chargingVoltage ?? 12.3;
			s.rippleVac = fault.rippleVac ?? 1.4;
			s.batteryV = approach(s.batteryV, s.altV, .4, dt);
		} else {
			s.altV = 14.12;
			s.rippleVac = .07;
			s.batteryV = approach(s.batteryV, 14.08, 1.6, dt);
			s.soc = approach(s.soc, .92, .02, dt);
		}
		let psi = 58;
		if (fault.kind === "fuel_delivery" && !s.faultCleared && s.faultActive) psi = Math.max(16, 58 - (fault.fuelPressureDropPsi ?? 30) * s.faultSeverity);
		s.fuelPsi = approach(s.fuelPsi, psi, 80, dt);
		const expectedMaf = 2.6 * (s.rpm / 700) * (.7 + s.load / 140);
		let unmetered = 0;
		if (fault.kind === "vacuum_leak" && !s.faultCleared) unmetered = (fault.unmeteredAirGps ?? 2.8) * (s.rpm < 1200 ? 1 : .45);
		s.maf = Math.max(.4, expectedMaf - unmetered * .55);
		s.map = s.engineRunning ? 32 + s.load * .55 + unmetered * 4 : 101;
		const trueAir = s.maf + unmetered;
		const error = s.maf > .2 ? (trueAir - s.maf) / trueAir * 100 : 0;
		if (!s.trimsLocked) {
			s.stft = approach(s.stft, clamp(error * 1.15, -25, 35), 18, dt);
			if (Math.abs(s.stft) > 8) s.ltft = approach(s.ltft, clamp(s.ltft + s.stft * .04 * dt, -25, 35), 4, dt);
		}
		s.afr = 1 + s.stft / 200;
		s.o2dn = s.stft > 8 ? .12 : .62 + Math.sin(s.simTime * 2) * .12;
		s.ignTiming = 8 + s.load * .12 - (s.coolantF < 140 ? 4 : 0);
		if (s.fuelPsi < 22 && s.engineRunning) s.lostSync += dt * .5;
	} else {
		s.rpm = s.cranking && s.crankOk ? s.rpm : 0;
		s.vss = 0;
		s.load = 0;
		s.tps = 0;
		s.accel = 0;
		s.maf = 0;
		s.map = 101;
		s.injectorMs = 0;
		s.spark = false;
		s.ignTiming = 0;
		s.altV = 0;
		s.rippleVac = 0;
		s.stft = approach(s.stft, 0, 12, dt);
		if (s.key === "on" || s.cranking) {
			s.fuelPsi = approach(s.fuelPsi, 54, 90, dt);
			s.batteryV = approach(s.batteryV, 12.2 + s.soc * .5, .8, dt);
		} else s.fuelPsi = approach(s.fuelPsi, 0, 12, dt);
		if (s.heatSoak && s.runTime > 30) {
			s.componentF = approach(s.componentF, Math.min(s.componentF + 8, s.coolantF + 28), 6, dt);
			s.coolantF = approach(s.coolantF, s.ambientF + 40, 1.2, dt);
		} else {
			s.coolantF = approach(s.coolantF, s.ambientF, .7, dt);
			s.componentF = approach(s.componentF, s.ambientF, .9, dt);
		}
		s.iatF = approach(s.iatF, s.ambientF, 1.4, dt);
		s.vibration = approach(s.vibration, s.wiggleTimer > 0 ? .95 : 0, 3, dt);
		let draw = .018;
		if (fault.kind === "parasitic_draw" && !s.faultCleared && s.key === "off") draw = fault.parasiticAmps ?? 1.85;
		s.parasiticA = draw;
		if (s.key === "off") {
			const used = draw * dt / 3600 / 70;
			s.soc = clamp(s.soc - used, 0, 1);
			s.batteryV = 10.6 + s.soc * 2.2;
		}
	}
	if (fault.kind === "can_bus_fault" && !s.faultCleared) {
		const drop = s.faultSeverity > .5;
		s.moduleOnline = {
			...s.moduleOnline,
			abs: !drop,
			audio: false,
			bcm: s.vibration < .4,
			ipc: !drop || rng() > .4
		};
	} else {
		const online = { ...s.moduleOnline };
		for (const k of Object.keys(online)) online[k] = true;
		s.moduleOnline = online;
	}
	if (s.engineRunning && s.coolantF > 160) s.heatSoak = false;
	return updateDtcs(s, def, dt);
}
function setKey(state, key) {
	const s = {
		...state,
		key
	};
	if (key === "off") {
		s.engineRunning = false;
		s.cranking = false;
	}
	if (key === "on" && state.key === "off") s.trimsLocked = false;
	return s;
}
function setMode(state, mode) {
	const s = {
		...state,
		mode
	};
	if (mode === "hot_soak") {
		s.engineRunning = false;
		s.key = "off";
		s.heatSoak = true;
	} else if (mode !== "parked" && !s.engineRunning && s.crankOk) {}
	return s;
}
function replaceComponent(state, def, componentId) {
	const replaced = state.replaced.includes(componentId) ? state.replaced : [...state.replaced, componentId];
	const correct = def.fault.correctComponentIds.includes(componentId);
	let next = {
		...state,
		replaced
	};
	if (componentId === "battery") {
		next.soc = .95;
		next.batteryV = 12.62;
	}
	if (componentId === "maf_sensor" || componentId === "ecm") {
		next.stft = 0;
		next.ltft = 0;
	}
	if (correct) {
		next.faultCleared = true;
		next.faultActive = false;
		next.faultSeverity = 0;
		next.crankOk = true;
		next.camOk = true;
		next.stalledEvent = false;
	}
	return {
		state: next,
		cleared: correct
	};
}
function clearCodes(state) {
	const history = state.dtcs.filter((d) => d.status === "confirmed" || d.status === "pending").map((d) => ({
		...d,
		status: "history",
		mil: false
	}));
	return {
		...state,
		dtcs: history,
		mil: false,
		pendingTimers: {},
		stalledEvent: false
	};
}
function wiggle(state) {
	return {
		...state,
		wiggleTimer: 4,
		vibration: .95
	};
}
function parkOvernight(state, def) {
	let s = {
		...state,
		key: "off",
		engineRunning: false,
		cranking: false,
		mode: "parked"
	};
	const hours = 12;
	const rng = mulberry32(state.seed + 99);
	const steps = 40;
	const dt = hours * 3600 / steps;
	for (let i = 0; i < steps; i++) s = tick(s, def, dt, rng);
	s.coolantF = s.ambientF;
	s.componentF = s.ambientF;
	s.heatSoak = false;
	s.simTime = state.simTime + hours * 3600;
	return s;
}
function snapshotPids(state) {
	return {
		t: state.simTime,
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
	};
}
function laborFor(kind) {
	return {
		scan: .1,
		dtc_clear: .05,
		live_pin: .02,
		interview: .1,
		inspect: .2,
		wiggle: .15,
		smoke: .4,
		fuel: .3,
		scope: .2,
		dvom: .15,
		drive: .3,
		wiring: .1,
		overnight: .2,
		replace: 0,
		notes: .02,
		hypothesis: .02,
		key: .02
	}[kind] ?? .1;
}
function makeLog(state, kind, label, detail, extra) {
	return {
		t: state.simTime,
		laborHr: extra?.laborHr ?? laborFor(kind),
		kind,
		label,
		detail,
		testId: extra?.testId,
		useful: extra?.useful
	};
}
function toothWave(t, rpm, teeth, missing, amp) {
	if (rpm < 40) return 0;
	const angle = t * (rpm / 60) * 360 % 360;
	const pitch = 360 / teeth;
	if (Math.floor(angle / pitch) >= teeth - missing) return 0;
	const local = angle % pitch / pitch;
	return Math.sin(local * Math.PI) * amp * Math.min(1, rpm / 400);
}
function sampleSignal(kind, t, state, def) {
	const f = def.fault;
	const failed = state.faultActive && !state.faultCleared;
	const drop = failed && state.faultSeverity > .5;
	const rpm = state.rpm;
	switch (kind) {
		case "ckp_vr": {
			let amp = 4.8;
			if (f.kind === "temp_resistance" && failed) amp *= Math.max(.08, 1 - state.faultSeverity);
			if (f.kind === "open_circuit" && f.componentId.includes("ckp") && !state.faultCleared) return .02 * Math.sin(t * 40);
			if (drop && (f.componentId.includes("ckp") || f.kind === "intermittent_connection")) {
				const window = Math.floor(t * 20) % 7;
				if (window === 0 || window === 1) return 0;
			}
			return toothWave(t, rpm, 36, 2, amp);
		}
		case "ckp_hall": {
			if (f.kind === "open_circuit" && f.componentId.includes("ckp") && !state.faultCleared) return .02;
			if (rpm < 40) return .1;
			const rps = rpm / 60;
			const bit = Math.sin(t * rps * Math.PI * 36) > 0 ? 5 : .08;
			if (drop && f.componentId.includes("ckp")) {
				if (Math.floor(t * 18) % 9 === 0) return .08;
			}
			return bit;
		}
		case "cmp_hall": {
			if (rpm < 40) return .1;
			const rps = rpm / 60;
			return Math.sin(t * rps * Math.PI * 6) > .2 ? 5 : .08;
		}
		case "injector": {
			if (!state.engineRunning && !state.cranking) return state.key === "on" ? 12.2 : 0;
			if (!state.crankOk) return state.batteryV;
			const rps = Math.max(rpm, 1) / 60;
			return t * rps * 2 % 1 < (state.injectorMs || 2.5) / (1e3 / Math.max(rps * 2, 1)) * .08 ? .4 : state.batteryV;
		}
		case "ignition": {
			if (!state.spark) return state.key === "on" ? .2 : 0;
			const cycle = t * (rpm / 60) * 2 % 1;
			if (cycle < .04) return 350 * Math.exp(-cycle * 80);
			if (cycle < .12) return .4;
			return 12;
		}
		case "can_h":
			if (f.kind === "can_bus_fault" && !state.faultCleared) {
				if (f.canFault === "canh-gnd" || f.canFault === "shorted") return .25 + Math.random() * .15;
			}
			return Math.sin(t * 5e3) > 0 ? 3.5 : 2.5;
		case "can_l":
			if (f.kind === "can_bus_fault" && !state.faultCleared) {
				if (f.canFault === "canh-gnd") return 2.5 + Math.sin(t * 40) * .1;
				if (f.canFault === "shorted") return .25;
			}
			return Math.sin(t * 5e3) > 0 ? 1.5 : 2.5;
		case "can_diff": return sampleSignal("can_h", t, state, def) - sampleSignal("can_l", t, state, def);
		case "wheel_speed": {
			if (state.vss < 1) return .05;
			const hz = state.vss * 4.2;
			return Math.sin(t * hz * Math.PI * 2) > 0 ? 5 : .08;
		}
		case "tps": return .5 + state.tps / 100 * 4;
		case "alt_bplus": return state.engineRunning ? state.altV + Math.sin(t * (state.rpm / 60) * 6 * Math.PI * 2) * state.rippleVac : state.batteryV;
		case "battery": return state.batteryV;
		case "maf": return state.engineRunning ? .8 + state.maf * .18 : 0;
		case "ref_5v": return state.key === "off" ? 0 : 4.98;
		case "ground": return f.groundDropV && failed ? f.groundDropV : .02;
		case "power": return state.key === "off" ? 0 : state.batteryV;
		case "sensor": return state.key === "off" ? 0 : 1.2 + state.coolantF / 220;
		default: return 0;
	}
}
function nodeById(def, id) {
	return def.wiring.nodes.find((n) => n.id === id);
}
function dcAt(node, state, def) {
	if (!node) return 0;
	return sampleSignal(node.signal, state.simTime, state, def);
}
function measureDvom(mode, redId, blackId, state, def) {
	const red = nodeById(def, redId);
	const black = nodeById(def, blackId);
	if (!red || !black) return {
		display: "-----",
		numeric: null,
		unit: "",
		valid: false,
		note: "Probe a valid point."
	};
	if (redId === blackId) return {
		display: "0.00",
		numeric: 0,
		unit: mode === "ohm" ? "Ω" : "V",
		valid: true,
		note: "Both leads on the same point."
	};
	const f = def.fault;
	const failed = !state.faultCleared;
	if (mode === "ohm" || mode === "continuity") {
		if (state.key === "on" || state.engineRunning) return {
			display: mode === "ohm" ? "OL" : "OPEN",
			numeric: null,
			unit: "Ω",
			valid: false,
			note: "Circuit is powered. Resistance readings are invalid with KOEO/KOER."
		};
		const involvesFault = redId === f.componentId || blackId === f.componentId || red.circuit === black.circuit;
		const acrossSensor = red.kind === "sensor" && black.kind === "ecu" || black.kind === "sensor" && red.kind === "ecu" || red.kind === "sensor" && black.kind === "ground" || black.kind === "sensor" && red.kind === "ground" || red.kind === "connector" || black.kind === "connector";
		if (f.kind === "open_circuit" && failed && involvesFault && acrossSensor) return {
			display: "OL",
			numeric: null,
			unit: "Ω",
			valid: true,
			note: "Open circuit."
		};
		if (f.kind === "temp_resistance" && failed && involvesFault) {
			const cold = f.resistanceOhms ?? 980;
			const hot = f.resistanceHotOhms ?? 48e3;
			const t = (state.componentF - 70) / Math.max(1, (f.minComponentF ?? 205) - 70);
			const r = cold + Math.max(0, t) * (hot - cold);
			return {
				display: r > 1e4 ? `${(r / 1e3).toFixed(1)}k` : r.toFixed(0),
				numeric: r,
				unit: "Ω",
				valid: true
			};
		}
		if (f.kind === "intermittent_connection" && failed && (red.kind === "connector" || black.kind === "connector")) {
			const r = state.wiggleTimer > 0 || state.vibration > .4 ? 12e3 + Math.random() * 8e3 : 1.4;
			return {
				display: r > 100 ? r.toFixed(0) : r.toFixed(1),
				numeric: r,
				unit: "Ω",
				valid: true,
				note: r > 100 ? "Unstable — wiggle the connector." : void 0
			};
		}
		if (red.kind === "ground" && black.kind === "ground") return {
			display: "0.2",
			numeric: .2,
			unit: "Ω",
			valid: true
		};
		if (red.signal === black.signal && red.circuit === black.circuit) return {
			display: "0.4",
			numeric: .4,
			unit: "Ω",
			valid: true
		};
		if (acrossSensor && (red.circuit === black.circuit || involvesFault)) {
			const r = f.resistanceOhms ?? 1120;
			return {
				display: r.toFixed(0),
				numeric: r,
				unit: "Ω",
				valid: true
			};
		}
		return {
			display: mode === "continuity" ? "OPEN" : "OL",
			numeric: null,
			unit: "Ω",
			valid: true
		};
	}
	const dc = dcAt(red, state, def) - dcAt(black, state, def);
	if (mode === "dcv" || mode === "vdrop") return {
		display: dc.toFixed(2),
		numeric: dc,
		unit: "V",
		valid: true,
		note: mode === "vdrop" && Math.abs(dc) > .3 && (red.kind === "ground" || black.kind === "ground") ? "Voltage drop exceeds 0.3 V." : void 0
	};
	let ac = 0;
	if (red.signal === "ckp_vr" || black.signal === "ckp_vr") {
		ac = state.rpm > 50 && state.crankOk ? Math.min(8, state.rpm / 180) : .02;
		if (f.kind === "open_circuit" && f.componentId.includes("ckp") && failed) ac = .01;
		if (f.kind === "temp_resistance" && failed) ac *= Math.max(.05, 1 - state.faultSeverity);
	} else if (red.signal === "alt_bplus" || red.signal === "battery") ac = state.rippleVac;
	else if (red.signal === "can_h" || red.signal === "can_l") ac = f.kind === "can_bus_fault" && failed ? .12 : 1;
	else ac = Math.abs(dc) * .04;
	return {
		display: ac.toFixed(2),
		numeric: ac,
		unit: "V~",
		valid: true
	};
}
function runFuelTest(state, def) {
	const psi = state.fuelPsi;
	const spec = 47;
	const ok = psi >= spec;
	return {
		id: "fuel",
		title: "Fuel pressure (KOEO/KOER)",
		laborHr: .3,
		useful: def.fault.kind === "fuel_delivery" || def.valuableTests.includes("fuel"),
		narrative: ok ? `Rail holds ${psi.toFixed(0)} psi. Spec is ${spec}–62 psi. Delivery is within spec.` : `Rail pressure ${psi.toFixed(0)} psi — below the ${spec} psi minimum. Volume may also be low under load.`,
		lines: [
			{
				k: "Key state",
				v: state.engineRunning ? "KOER" : state.key === "off" ? "Key off" : "KOEO"
			},
			{
				k: "Rail pressure",
				v: `${psi.toFixed(1)} psi`,
				flag: ok ? "ok" : "fault"
			},
			{
				k: "Spec",
				v: "47–62 psi (Denso, 2.5/3.5)"
			},
			{
				k: "Deadhead",
				v: `${Math.min(90, psi + (ok ? 18 : 4)).toFixed(0)} psi`
			},
			{
				k: "Leakdown 5 min",
				v: ok ? "Hold (drop < 8 psi)" : "Drops rapidly",
				flag: ok ? "ok" : "warn"
			}
		]
	};
}
function runSmokeTest(state, def) {
	const leak = def.fault.kind === "vacuum_leak" && !state.faultCleared;
	return {
		id: "smoke",
		title: "Smoke test — intake / EVAP",
		laborHr: .4,
		useful: leak || def.valuableTests.includes("smoke"),
		narrative: leak ? `Smoke exits at ${def.fault.leakLocation ?? "the intake tube downstream of the MAF"}. Unmetered air is present.` : "No visible smoke at the intake boot, vacuum tees, or EVAP purge path. System holds.",
		lines: [
			{
				k: "Machine pressure",
				v: "4.0 inH2O"
			},
			{
				k: "Intake boot",
				v: leak && (def.fault.leakLocation ?? "").includes("boot") ? "SMOKE VISIBLE" : "Sealed",
				flag: leak ? "fault" : "ok"
			},
			{
				k: "Pulleys / PCV",
				v: "No leak"
			},
			{
				k: "Purge solenoid",
				v: "Holds (valve closed)"
			},
			{
				k: "Throttle shaft",
				v: "Trace seepage — typical"
			}
		]
	};
}
function runParasiticTest(state, def) {
	const a = state.key === "off" ? state.parasiticA : 0;
	const ok = a < .05;
	return {
		id: "parasitic",
		title: "Parasitic draw (in-line ammeter)",
		laborHr: .4,
		useful: def.fault.kind === "parasitic_draw" || def.valuableTests.includes("parasitic"),
		narrative: ok ? `Key-off draw is ${(a * 1e3).toFixed(0)} mA. Spec is typically < 50 mA after modules sleep.` : `Key-off draw is ${(a * 1e3).toFixed(0)} mA — well above the 50 mA spec. Pull fuses to isolate the circuit.`,
		lines: [
			{
				k: "Key",
				v: state.key.toUpperCase()
			},
			{
				k: "Draw",
				v: `${(a * 1e3).toFixed(0)} mA`,
				flag: ok ? "ok" : "fault"
			},
			{
				k: "Sleep wait",
				v: "Modules gated (sim)"
			},
			{
				k: "DOME 7.5A fuse",
				v: !ok && def.fault.kind === "parasitic_draw" ? "Pulling this fuse drops draw to 22 mA" : "No change"
			},
			{
				k: "ALT B+ cable",
				v: "0.0 A additional"
			}
		]
	};
}
function runChargingTest(state, def) {
	const loaded = state.engineRunning;
	const v = loaded ? state.altV : state.batteryV;
	const ripple = state.rippleVac;
	const vOk = loaded ? v >= 13.5 && v <= 14.8 : v >= 12.2;
	const rOk = ripple < .4;
	return {
		id: "charging",
		title: "Charging system",
		laborHr: .25,
		useful: def.fault.kind === "charging_fault" || def.valuableTests.includes("charging"),
		narrative: loaded ? `Running voltage ${v.toFixed(2)} V, ripple ${ripple.toFixed(2)} V AC. ${vOk && rOk ? "Alternator output is in spec." : "Charging is out of spec."}` : "Engine is not running. Start the vehicle to load-test the alternator.",
		lines: [
			{
				k: "Battery rest",
				v: `${state.batteryV.toFixed(2)} V`,
				flag: state.batteryV < 12.2 ? "warn" : "ok"
			},
			{
				k: "KOER voltage",
				v: loaded ? `${v.toFixed(2)} V` : "—"
			},
			{
				k: "Ripple (AC)",
				v: loaded ? `${ripple.toFixed(2)} V` : "—",
				flag: rOk ? "ok" : "fault"
			},
			{
				k: "Loaded (headlamps)",
				v: loaded ? `${(v - .12).toFixed(2)} V` : "—"
			}
		]
	};
}
function runHealthCheck(state, def) {
	const comms = def.modules.map((m) => ({
		id: m.id,
		name: m.name,
		online: state.moduleOnline[m.id] !== false
	}));
	const confirmed = state.dtcs.filter((d) => d.status === "confirmed").length;
	const pending = state.dtcs.filter((d) => d.status === "pending").length;
	return {
		mil: state.mil,
		confirmed,
		pending,
		comms,
		ready: {
			catalyst: state.runTime > 80,
			evap: false,
			o2: state.runTime > 40,
			o2htr: state.coolantF > 160,
			egr: true,
			misfire: true,
			fuel: state.runTime > 20
		}
	};
}
var INSPECTION_AREAS = [
	{
		id: "underhood",
		label: "Underhood visual"
	},
	{
		id: "connectors",
		label: "Connectors"
	},
	{
		id: "harness",
		label: "Harness wiggle"
	},
	{
		id: "battery",
		label: "Battery terminals"
	},
	{
		id: "grounds",
		label: "Engine / body grounds"
	},
	{
		id: "vacuum",
		label: "Vacuum hoses / intake"
	},
	{
		id: "fluids",
		label: "Fluids"
	},
	{
		id: "underbody",
		label: "Underbody"
	},
	{
		id: "interior",
		label: "Interior / glove box"
	},
	{
		id: "stereo",
		label: "Aftermarket electronics"
	}
];
function inspectArea(area, state, def, wiggle = false) {
	const hits = def.fault.inspectionFindings.filter((f) => f.area === area);
	const lines = [];
	let narrative = "No obvious defects in this area.";
	let useful = false;
	if (hits.length === 0) lines.push({
		k: "Result",
		v: "No visible fault",
		flag: "ok"
	});
	else for (const h of hits) {
		if (h.requiresWiggle && !wiggle && state.wiggleTimer <= 0) {
			lines.push({
				k: h.label,
				v: "Looks seated. Wiggle to load the circuit.",
				flag: "warn"
			});
			continue;
		}
		if (h.visibleOnlyIfFault && state.faultCleared) {
			lines.push({
				k: h.label,
				v: "Previously noted condition is repaired.",
				flag: "ok"
			});
			continue;
		}
		lines.push({
			k: h.label,
			v: h.finding,
			flag: h.reveals ? "fault" : "warn"
		});
		if (h.reveals) {
			narrative = h.finding;
			useful = true;
		}
	}
	return {
		id: `inspect:${area}`,
		title: `Inspection — ${INSPECTION_AREAS.find((a) => a.id === area)?.label ?? area}`,
		laborHr: wiggle ? .15 : .2,
		useful,
		narrative,
		lines
	};
}
function matchInterview(q, def) {
	const ql = q.toLowerCase().trim();
	if (ql.length < 2) return def.interview.greeting;
	let best = def.interview.unknown;
	let score = 0;
	for (const item of def.interview.items) {
		let s = 0;
		for (const k of item.keywords) if (ql.includes(k)) s += 1;
		if (s > score) {
			score = s;
			best = item.answer;
		}
	}
	return score === 0 ? def.interview.unknown : best;
}
var uiAcc = 0;
var runtimeVehicle = null;
var LABOR_RATE = 185;
function evidenceFor(componentId, log, def) {
	const useful = log.filter((l) => l.useful);
	const name = componentId.replace(/_/g, " ");
	const related = useful.filter((l) => (l.detail + l.label).toLowerCase().includes(name.slice(0, 6)) || (l.testId ?? "").includes(componentId));
	if (def.fault.correctComponentIds.includes(componentId) && useful.length >= 2) return related.length ? "high" : "moderate";
	if (related.length) return "moderate";
	if (useful.length) return "low";
	return "none";
}
function persistLater(p) {
	saveProfile({
		...p,
		level: levelFrom(p)
	});
}
var useGame = create((set, get) => ({
	profile: loadProfile(),
	def: null,
	vehicle: null,
	rng: () => Math.random(),
	tool: "concern",
	laborHours: 0,
	partsCost: 0,
	laborCost: 0,
	log: [],
	hypotheses: [],
	notes: "",
	interviewLog: [],
	testResults: [],
	pinned: [
		"rpm",
		"coolantF",
		"batteryV",
		"stft",
		"ltft",
		"maf"
	],
	pidHistory: [],
	dvom: {
		mode: "dcv",
		red: "ecm_ckp",
		black: "chassis_gnd",
		last: null
	},
	scope: {
		ch1: "ckp_sensor",
		ch2: "cmp_sensor",
		tDiv: .005,
		vDiv: 5,
		paused: false
	},
	partsReplaced: [],
	replaceOffer: null,
	scorecard: null,
	hintsUsed: 0,
	hintOpen: false,
	verifiedDrive: false,
	verifiedHot: false,
	verifiedLoad: false,
	verifiedScope: false,
	verifiedTrim: false,
	verifiedSoak: false,
	codesClearedAfter: false,
	surrendered: false,
	simSpeed: 12,
	paused: false,
	crankHold: 0,
	hydrate: () => set({ profile: loadProfile() }),
	startCase: (id, from) => {
		const def = from ?? getCase(id) ?? get().profile.generatedCases.find((c) => c.id === id);
		if (!def) return;
		const seed = (Date.now() ^ def.id.length * 997) >>> 0;
		const vehicle = createInitialState(def, seed);
		runtimeVehicle = vehicle;
		uiAcc = 0;
		const ch1 = def.wiring.nodes.find((n) => n.signal.includes("ckp") || n.signal === "can_h")?.id ?? def.wiring.nodes[0]?.id ?? "";
		const ch2 = def.wiring.nodes.find((n) => n.id !== ch1 && (n.signal.includes("cmp") || n.signal === "can_l" || n.kind === "sensor"))?.id ?? ch1;
		set({
			def,
			vehicle,
			rng: mulberry32(seed),
			tool: "concern",
			laborHours: 0,
			partsCost: 0,
			laborCost: 0,
			log: [],
			hypotheses: [],
			notes: get().profile.notesByCase[def.id] ?? "",
			interviewLog: [],
			testResults: [],
			pidHistory: [snapshotPids(vehicle)],
			dvom: {
				mode: "dcv",
				red: ch1,
				black: "chassis_gnd",
				last: null
			},
			scope: {
				ch1,
				ch2,
				tDiv: .005,
				vDiv: 5,
				paused: false
			},
			partsReplaced: [],
			replaceOffer: null,
			scorecard: null,
			hintsUsed: 0,
			hintOpen: false,
			verifiedDrive: false,
			verifiedHot: false,
			verifiedLoad: false,
			verifiedScope: false,
			verifiedTrim: false,
			verifiedSoak: false,
			codesClearedAfter: false,
			surrendered: false,
			paused: false,
			crankHold: 0,
			simSpeed: 12
		});
		useDx.getState().startFromSimulator(def);
	},
	startDaily: () => {
		const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		let h = 0;
		for (let i = 0; i < day.length; i++) h = h * 33 + day.charCodeAt(i) >>> 0;
		const c = CASES[h % CASES.length];
		get().startCase(c.id);
		set((s) => {
			const profile = {
				...s.profile,
				lastDaily: day
			};
			persistLater(profile);
			return { profile };
		});
	},
	setTool: (tool) => {
		const { vehicle, laborHours } = get();
		if (!vehicle) {
			set({ tool });
			return;
		}
		set({
			tool,
			laborHours: laborHours + (tool === get().tool ? 0 : .02)
		});
	},
	step: (dtReal) => {
		const { def, rng, paused, simSpeed, crankHold } = get();
		const vehicle = runtimeVehicle ?? get().vehicle;
		if (!def || !vehicle || paused) return;
		let dt = Math.min(dtReal, .1) * simSpeed;
		if (vehicle.mode === "hot_soak") dt *= 2.2;
		let next = tick(vehicle, def, dt, rng);
		let hold = crankHold;
		if (hold > 0) {
			hold -= dt;
			if (hold <= 0 && next.key === "start" && !next.engineRunning) next = setKey(next, "on");
		}
		const hist = get().pidHistory;
		const sampleEvery = .25;
		const lastT = hist.length ? hist[hist.length - 1].t : -999;
		let pidHistory = hist;
		if (next.simTime - lastT >= sampleEvery) pidHistory = [...hist.slice(-240), snapshotPids(next)];
		const extra = {};
		if (get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id))) {
			if (next.engineRunning && next.coolantF > 190) extra.verifiedHot = true;
			if (next.mode === "hill" || next.mode === "accel") extra.verifiedLoad = true;
		}
		uiAcc += dtReal;
		if (!(next.engineRunning !== vehicle.engineRunning || next.stalledEvent !== vehicle.stalledEvent || next.mil !== vehicle.mil) && uiAcc < .1) {
			runtimeVehicle = next;
			return;
		}
		uiAcc = 0;
		runtimeVehicle = next;
		set({
			vehicle: next,
			crankHold: hold,
			pidHistory,
			...extra
		});
	},
	setKeyPos: (k) => {
		const { vehicle, def } = get();
		if (!vehicle || !def) return;
		const next = setKey(vehicle, k);
		runtimeVehicle = next;
		set({
			vehicle: next,
			log: [...get().log, makeLog(next, "key", `Key ${k.toUpperCase()}`, `Ignition set to ${k}`)],
			laborHours: get().laborHours + .02
		});
	},
	holdStart: () => {
		const { vehicle } = get();
		if (!vehicle) return;
		const started = setKey(vehicle, "start");
		runtimeVehicle = started;
		set({
			vehicle: started,
			crankHold: 2.4
		});
	},
	setDriveMode: (m) => {
		const { vehicle, def } = get();
		if (!vehicle || !def) return;
		let next = setMode(vehicle, m);
		if (m !== "parked" && m !== "hot_soak" && !next.engineRunning) {
			next = setKey(next, "start");
			set({ crankHold: 2.2 });
		}
		const log = [...get().log, makeLog(next, "drive", `Drive: ${m.replace("_", " ")}`, `Operating condition set to ${m}`, {
			useful: def.valuableTests.includes("drive"),
			laborHr: laborFor("drive")
		})];
		runtimeVehicle = next;
		const patched = {
			vehicle: next,
			log,
			laborHours: get().laborHours + .3,
			tool: "drive"
		};
		if (get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id))) {
			patched.verifiedDrive = true;
			if (m === "hot_soak" || m === "highway" || m === "idle") patched.verifiedHot = get().verifiedHot || next.componentF > 190;
		}
		set(patched);
	},
	addHypothesis: (text) => {
		const t = text.trim();
		if (!t) return;
		const h = {
			id: `h-${Date.now()}`,
			text: t,
			status: "possible",
			evidence: {
				plus: [],
				minus: []
			}
		};
		set({
			hypotheses: [...get().hypotheses, h],
			laborHours: get().laborHours + .02
		});
	},
	setHypothesis: (id, status) => {
		set({ hypotheses: get().hypotheses.map((h) => h.id === id ? {
			...h,
			status
		} : h) });
	},
	addEvidence: (id, side, text) => {
		const t = text.trim();
		if (!t) return;
		set({ hypotheses: get().hypotheses.map((h) => h.id === id ? {
			...h,
			evidence: {
				...h.evidence,
				[side]: [...h.evidence[side], t]
			}
		} : h) });
	},
	askCustomer: (q) => {
		const { def, vehicle } = get();
		if (!def || !vehicle) return;
		const a = matchInterview(q, def);
		const useful = def.interview.items.some((it) => it.useful && it.keywords.some((k) => q.toLowerCase().includes(k)));
		const log = [...get().log, makeLog(vehicle, "interview", "Customer interview", q, {
			useful,
			laborHr: .08
		})];
		set({
			interviewLog: [...get().interviewLog, {
				q,
				a
			}],
			log,
			laborHours: get().laborHours + .08
		});
		useDx.getState().ingestSimInterview(q, a);
		if (def) useDx.getState().recordEval(def, "interview");
	},
	runTest: (kind) => {
		const { def, vehicle } = get();
		if (!def || !vehicle) return;
		const result = (kind === "smoke" ? runSmokeTest : kind === "fuel" ? runFuelTest : kind === "parasitic" ? runParasiticTest : runChargingTest)(vehicle, def);
		const log = [...get().log, makeLog(vehicle, kind, result.title, result.narrative, {
			testId: result.id,
			useful: result.useful,
			laborHr: result.laborHr
		})];
		const patch = {
			testResults: [result, ...get().testResults].slice(0, 24),
			log,
			laborHours: get().laborHours + result.laborHr
		};
		if (kind === "fuel" && get().partsReplaced.length && def.fault.kind !== "fuel_delivery") {}
		set(patch);
		useDx.getState().ingestSimTest(result);
		useDx.getState().recordEval(def, `test:${kind}`);
	},
	inspect: (area, doWiggle) => {
		const { def, vehicle } = get();
		if (!def || !vehicle) return;
		let s = vehicle;
		if (doWiggle) s = wiggle(s);
		const result = inspectArea(area, s, def, doWiggle);
		runtimeVehicle = s;
		const log = [...get().log, makeLog(s, doWiggle ? "wiggle" : "inspect", result.title, result.narrative, {
			testId: result.id,
			useful: result.useful,
			laborHr: result.laborHr
		})];
		set({
			vehicle: s,
			testResults: [result, ...get().testResults].slice(0, 24),
			log,
			laborHours: get().laborHours + result.laborHr
		});
		useDx.getState().ingestSimTest(result);
		if (def) useDx.getState().recordEval(def, `inspect:${area}`);
	},
	doWiggle: () => {
		const { vehicle, def } = get();
		if (!vehicle || !def) return;
		const s = wiggle(vehicle);
		runtimeVehicle = s;
		set({
			vehicle: s,
			log: [...get().log, makeLog(s, "wiggle", "Harness wiggle", "Loaded the CKP/engine harness under vibration.", {
				useful: def.fault.kind === "intermittent_connection",
				laborHr: .15,
				testId: "wiggle"
			})],
			laborHours: get().laborHours + .15
		});
	},
	overnight: () => {
		const { vehicle, def } = get();
		if (!vehicle || !def) return;
		const s = parkOvernight(vehicle, def);
		const log = [...get().log, makeLog(s, "overnight", "Parked overnight", `Key-off 12 h. Battery now ${s.batteryV.toFixed(2)} V, SOC ${(s.soc * 100).toFixed(0)}%.`, {
			useful: def.fault.kind === "parasitic_draw",
			laborHr: .2,
			testId: "overnight"
		})];
		runtimeVehicle = s;
		const patch = {
			vehicle: s,
			log,
			laborHours: get().laborHours + .2
		};
		if (get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id))) {
			if (def.fault.verification.needKeyOffSoak) patch.verifiedSoak = true;
		}
		set(patch);
	},
	measure: () => {
		const { def, vehicle, dvom } = get();
		if (!def || !vehicle) return;
		const last = measureDvom(dvom.mode, dvom.red, dvom.black, vehicle, def);
		const useful = def.valuableTests.includes("dvom") && (dvom.red.includes("ckp") || dvom.red.includes("can") || dvom.red.includes("glove") || last.note?.includes("Open"));
		const log = [...get().log, makeLog(vehicle, "dvom", `DVOM ${dvom.mode.toUpperCase()}`, `${dvom.red} to ${dvom.black}: ${last.display} ${last.unit}${last.note ? ` — ${last.note}` : ""}`, {
			useful,
			laborHr: .15,
			testId: `dvom:${dvom.red}`
		})];
		set({
			dvom: {
				...dvom,
				last
			},
			log,
			laborHours: get().laborHours + .15
		});
		useDx.getState().ingestSimDvom(`${dvom.mode} ${dvom.red}/${dvom.black}`, `${last.display} ${last.unit}`, last.note);
		if (def) useDx.getState().recordEval(def, "dvom");
	},
	setDvom: (p) => set({ dvom: {
		...get().dvom,
		...p
	} }),
	setScope: (p) => {
		const scope = {
			...get().scope,
			...p
		};
		const { def, vehicle } = get();
		if (def && vehicle && (p.ch1 || p.ch2) && get().partsReplaced.some((x) => def.fault.correctComponentIds.includes(x.id))) {
			set({
				scope,
				verifiedScope: true
			});
			return;
		}
		if (def && vehicle && (p.ch1 || !get().log.some((l) => l.kind === "scope"))) {
			set({
				scope,
				log: [...get().log, makeLog(vehicle, "scope", "Oscilloscope", `Ch1 ${scope.ch1} · Ch2 ${scope.ch2}`, {
					useful: def.valuableTests.includes("scope"),
					laborHr: .2,
					testId: "scope"
				})],
				laborHours: get().laborHours + .12
			});
			useDx.getState().ingestSimScope(scope.ch1, vehicle);
			useDx.getState().recordEval(def, "scope");
			return;
		}
		set({ scope });
	},
	pinPid: (id) => {
		set({ pinned: get().pinned.includes(id) ? get().pinned.filter((x) => x !== id) : [...get().pinned, id].slice(0, 8) });
	},
	scanVehicle: () => {
		const { vehicle, def } = get();
		if (!vehicle || !def) return;
		const useful = true;
		set({
			log: [...get().log, makeLog(vehicle, "scan", "Scan / health check", `MIL ${vehicle.mil ? "ON" : "OFF"} · ${vehicle.dtcs.length} code(s)`, {
				useful,
				laborHr: .1,
				testId: "scan"
			})],
			laborHours: get().laborHours + .1,
			tool: "scan"
		});
		useDx.getState().ingestSimScan(vehicle);
		if (def) useDx.getState().recordEval(def, "scan");
	},
	clearDtcs: () => {
		const { vehicle, def } = get();
		if (!vehicle || !def) return;
		const next = clearCodes(vehicle);
		runtimeVehicle = next;
		const after = get().partsReplaced.some((p) => def.fault.correctComponentIds.includes(p.id));
		set({
			vehicle: next,
			log: [...get().log, makeLog(next, "dtc_clear", "Clear DTCs", "Codes cleared. Drive cycle / reproduce conditions to verify.", { laborHr: .05 })],
			laborHours: get().laborHours + .05,
			codesClearedAfter: after || get().codesClearedAfter
		});
	},
	offerReplace: (componentId) => {
		const { def, log } = get();
		if (!def) return;
		const c = def.components.find((x) => x.id === componentId);
		if (!c) return;
		const evidence = evidenceFor(componentId, log, def);
		const warning = evidence === "none" ? `You have not demonstrated a failure in ${c.name}.` : evidence === "low" ? `Limited evidence supports replacing ${c.name}.` : void 0;
		set({ replaceOffer: {
			id: c.id,
			name: c.name,
			cost: c.partCost,
			labor: c.laborHours,
			evidence,
			warning
		} });
	},
	confirmReplace: () => {
		const { replaceOffer, def, vehicle } = get();
		if (!replaceOffer || !def || !vehicle) return;
		const { state, cleared } = replaceComponent(vehicle, def, replaceOffer.id);
		runtimeVehicle = state;
		const log = [...get().log, makeLog(state, "replace", `Replace ${replaceOffer.name}`, cleared ? "Component replaced. Fault model updated." : "Component replaced. Vehicle behavior is unchanged.", {
			laborHr: replaceOffer.labor,
			useful: cleared,
			testId: `replace:${replaceOffer.id}`
		})];
		if (cleared && get().pidHistory.length) {
			const last = get().pidHistory[get().pidHistory.length - 1];
			if (Math.abs(last.stft) < 6) set({ verifiedTrim: true });
		}
		set({
			vehicle: state,
			log,
			laborHours: get().laborHours + replaceOffer.labor,
			partsCost: get().partsCost + replaceOffer.cost,
			laborCost: get().laborCost + replaceOffer.labor * LABOR_RATE,
			partsReplaced: [...get().partsReplaced, {
				id: replaceOffer.id,
				name: replaceOffer.name,
				cost: replaceOffer.cost
			}],
			replaceOffer: null
		});
	},
	cancelReplace: () => set({ replaceOffer: null }),
	setNotes: (notes) => {
		set({ notes });
		const def = get().def;
		if (!def) return;
		const profile = {
			...get().profile,
			notesByCase: {
				...get().profile.notesByCase,
				[def.id]: notes
			}
		};
		persistLater(profile);
		set({ profile });
	},
	useHint: () => set({
		hintOpen: !get().hintOpen,
		hintsUsed: get().hintOpen ? get().hintsUsed : get().hintsUsed + 1
	}),
	closeRO: () => {
		const s = get();
		if (!s.def || !s.vehicle) return;
		const scorecard = scoreCase({
			def: s.def,
			state: s.vehicle,
			log: s.log,
			hypotheses: s.hypotheses,
			laborHours: s.laborHours,
			partsReplaced: s.partsReplaced,
			verifiedDrive: s.verifiedDrive,
			verifiedHot: s.verifiedHot,
			verifiedLoad: s.verifiedLoad,
			verifiedScope: s.verifiedScope,
			verifiedTrim: s.verifiedTrim,
			verifiedSoak: s.verifiedSoak,
			codesClearedAfter: s.codesClearedAfter,
			surrendered: s.surrendered,
			hintsUsed: s.hintsUsed
		});
		const firstTry = !s.profile.scores.some((x) => x.caseId === s.def.id);
		const rec = {
			caseId: s.def.id,
			score: scorecard.total,
			hours: s.laborHours,
			at: Date.now(),
			firstTry
		};
		const bestByCase = {
			...s.profile.bestByCase,
			[s.def.id]: Math.max(s.profile.bestByCase[s.def.id] ?? 0, scorecard.total)
		};
		const achievements = new Set(s.profile.achievements);
		if (s.profile.casesCompleted + 1 >= 1) achievements.add("first-close");
		if (scorecard.unnecessaryParts.length === 0 && s.vehicle.faultCleared) achievements.add("no-cannon");
		if (s.laborHours < 1 && s.vehicle.faultCleared) achievements.add("sub-hour");
		if (s.def.fault.kind === "temp_resistance" && s.vehicle.faultCleared) achievements.add("heat");
		if (s.def.fault.kind === "can_bus_fault" && s.vehicle.faultCleared) achievements.add("bus");
		if (s.def.fault.kind === "parasitic_draw" && s.vehicle.faultCleared) achievements.add("night");
		if (scorecard.total >= 95) achievements.add("perfect");
		if (s.def.difficulty === "master" && s.vehicle.faultCleared) achievements.add("master");
		const profile = {
			...s.profile,
			casesCompleted: s.profile.casesCompleted + 1,
			scores: [rec, ...s.profile.scores].slice(0, 80),
			bestByCase,
			unnecessaryParts: s.profile.unnecessaryParts + scorecard.unnecessaryParts.length,
			firstTimeHits: s.profile.firstTimeHits + (firstTry && s.vehicle.faultCleared ? 1 : 0),
			achievements: [...achievements]
		};
		profile.level = levelFrom(profile);
		persistLater(profile);
		set({
			scorecard,
			profile,
			paused: true
		});
		useDx.getState().closeEval(s.def);
	},
	surrender: () => {
		set({
			surrendered: true,
			paused: true
		});
		get().closeRO();
	},
	saveGenerated: (c) => {
		const profile = upsertGenerated(get().profile, c);
		persistLater(profile);
		set({ profile });
	}
}));
//#endregion
export { runHealthCheck as a, vehicleLine as c, engineLine as i, CASES as n, sampleSignal as o, INSPECTION_AREAS as r, useGame as s, ACHIEVEMENTS as t };
