import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parse-BCv98ZRn.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function approach(current, target, rate, dt) {
	const delta = target - current;
	const max = rate * dt;
	if (Math.abs(delta) <= max) return target;
	return current + Math.sign(delta) * max;
}
function formatHours(h) {
	if (h < 1) return `${Math.round(h * 60)} min`;
	const hrs = Math.floor(h);
	const min = Math.round((h - hrs) * 60);
	return min ? `${hrs}h ${min}m` : `${hrs}.0 hr`;
}
function formatMoney(n) {
	return n.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0
	});
}
function formatPid(id, value) {
	if (value === null || value === void 0) return "---";
	if (typeof value === "boolean") return value ? "ON" : "OFF";
	if (typeof value === "string") return value;
	if (!Number.isFinite(value)) return "---";
	const abs = Math.abs(value);
	if (abs >= 100) return value.toFixed(0);
	if (abs >= 10) return value.toFixed(1);
	return value.toFixed(2);
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return function rng() {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
var FAULTS = [
	{
		id: "ckp_sync",
		systemId: "engine_position",
		systemLabel: "Engine position",
		component: "Crank / cam synchronization",
		failureMode: "CKP/CMP signal interruption — ECM loses engine position",
		families: ["stall", "no_start"],
		moreLikelyWhen: [
			"Instant shutdown",
			"RPM PID drops to 0 while engine is rotating",
			"Hot or vibration dependent",
			"Restarts then dies"
		],
		lessLikelyWhen: [
			"Sputters for seconds first",
			"Fuel pressure collapses during event",
			"Dies only under heavy load with misfire"
		],
		confirmTest: "Capture CKP (and CMP) waveform during the failure. Confirm RPM PID and physical rotation disagree.",
		refuteTest: "Stable CKP waveform and synchronized RPM throughout the failure.",
		missing: [
			"CKP waveform during event",
			"RPM PID during event",
			"Connector/circuit integrity"
		],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "ckp_connector",
		systemId: "engine_position",
		systemLabel: "Engine position",
		component: "CKP connector / circuit",
		failureMode: "Intermittent open or high resistance at the CKP connector or harness",
		families: ["stall", "no_start"],
		moreLikelyWhen: [
			"Worse over bumps or with harness movement",
			"Restarts after the connection settles",
			"Codes are fleeting or absent"
		],
		lessLikelyWhen: ["Only fails after heat-soak with a clean connector", "Bus-wide communication loss"],
		confirmTest: "Wiggle the CKP connector under running conditions while watching RPM/CKP. Inspect terminals.",
		refuteTest: "Loaded wiggle and terminal tension checks do not disturb RPM or CKP.",
		missing: [
			"Loaded wiggle result",
			"Terminal tension / corrosion",
			"CKP waveform during wiggle"
		],
		testCostUsd: 0,
		testHours: .25
	},
	{
		id: "ecm_power",
		systemId: "power_ecu",
		systemLabel: "Power / ECU",
		component: "ECM / EFI power feed",
		failureMode: "Momentary loss of ECM, EFI relay, or ignition-switch power",
		families: ["stall", "no_start"],
		moreLikelyWhen: [
			"Instant shutdown as if keyed off",
			"Multiple modules reset",
			"Cluster goes dark with the stall"
		],
		lessLikelyWhen: ["Cluster and accessories stay alive", "Only CKP is lost while ECM remains powered"],
		confirmTest: "Monitor EFI/main relay output and ECM B+ during the failure.",
		refuteTest: "ECM power and relay output remain stable throughout the event.",
		missing: [
			"Relay output during event",
			"ECM keep-alive voltage",
			"Ignition-switch feed"
		],
		testCostUsd: 0,
		testHours: .4
	},
	{
		id: "fuel_delivery",
		systemId: "fuel",
		systemLabel: "Fuel delivery",
		component: "Fuel pressure / pump circuit",
		failureMode: "Fuel pressure collapses or never builds",
		families: [
			"stall",
			"no_start",
			"fuel_trim"
		],
		moreLikelyWhen: [
			"Sputter or loss of power first",
			"Worse at high load",
			"After sitting (loss of residual)"
		],
		lessLikelyWhen: [
			"Instant keyed-off stall",
			"Fuel pressure remains in a typical running range during the event",
			"Prior pump replacement did not change the complaint"
		],
		confirmTest: "Fuel pressure (and preferably volume) during the failure. OEM specification required for pass/fail.",
		refuteTest: "Pressure remains stable and within OEM specification throughout the event.",
		missing: ["Fuel pressure during failure", "OEM fuel-pressure specification"],
		testCostUsd: 0,
		testHours: .4
	},
	{
		id: "ignition",
		systemId: "ignition",
		systemLabel: "Ignition",
		component: "Ignition energy / coils",
		failureMode: "Spark loss or coil failure",
		families: [
			"stall",
			"no_start",
			"fuel_trim"
		],
		moreLikelyWhen: [
			"Misfire under load",
			"P0300-series codes",
			"Sputter then stall"
		],
		lessLikelyWhen: ["Instant shutdown with no sputter", "No injector pulse and no spark together (points at position/power)"],
		confirmTest: "Ignition primary/secondary or misfire counters during the event.",
		refuteTest: "Spark remains present and misfire counters do not explain a sudden stall.",
		missing: ["Misfire data", "Ignition waveform or spark confirmation"],
		testCostUsd: 0,
		testHours: .35
	},
	{
		id: "airflow",
		systemId: "airflow",
		systemLabel: "Airflow / metering",
		component: "Throttle / MAF / airflow",
		failureMode: "Airflow metering or electronic throttle fault",
		families: ["stall", "fuel_trim"],
		moreLikelyWhen: [
			"Idle-only",
			"Throttle-related DTCs",
			"High or stuck load PID"
		],
		lessLikelyWhen: ["Instant shutdown at speed", "Normal MAF/MAP relationship with stable idle"],
		confirmTest: "Compare MAF, MAP, commanded vs actual throttle during the complaint.",
		refuteTest: "Airflow PIDs remain plausible and throttle tracking is normal through the event.",
		missing: ["MAF/MAP/TPS during complaint", "Throttle actuator inspection"],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "immobilizer",
		systemId: "security",
		systemLabel: "Security / immobilizer",
		component: "Immobilizer / smart-key",
		failureMode: "Security interrupt of fuel or start enable",
		families: [
			"stall",
			"no_start",
			"no_crank"
		],
		moreLikelyWhen: [
			"Security light behavior",
			"No-start after key/fob work",
			"Starts then immediately dies in a repeating pattern with immobilizer DTC"
		],
		lessLikelyWhen: ["Fails only after extended hot driving", "Occurs at speed with no security indication"],
		confirmTest: "Security indicator and immobilizer/ID-box communication during the event. OEM procedure required.",
		refuteTest: "No security activity and fuel/spark remain enabled through the event.",
		missing: ["Immobilizer DTCs", "Security-light behavior"],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "unmetered_air",
		systemId: "airflow",
		systemLabel: "Airflow / metering",
		component: "Intake / vacuum leak (unmetered air)",
		failureMode: "Unmetered air after the MAF leans the mixture",
		families: ["fuel_trim", "stall"],
		moreLikelyWhen: [
			"High positive STFT+LTFT at idle that improve off-idle",
			"Rough idle",
			"P0171"
		],
		lessLikelyWhen: ["Trims equally wrong at cruise", "Instant stall with normal trims"],
		confirmTest: "Smoke the intake after the MAF. Compare idle vs 2500 rpm trims.",
		refuteTest: "No smoke leak and trims do not improve off-idle in a leak-typical way.",
		missing: [
			"Smoke test",
			"Idle vs off-idle trims",
			"Visual intake boot"
		],
		testCostUsd: 0,
		testHours: .35
	},
	{
		id: "maf_bias",
		systemId: "airflow",
		systemLabel: "Airflow / metering",
		component: "MAF sensor bias",
		failureMode: "MAF reporting incorrectly across the operating range",
		families: ["fuel_trim"],
		moreLikelyWhen: ["Trims wrong at idle AND cruise", "MAF g/s implausible vs load/RPM"],
		lessLikelyWhen: ["Trims normalize off-idle", "Visible intake leak downstream of MAF"],
		confirmTest: "Compare MAF g/s to OEM idle/cruise specification (OEM spec required) and to calculated load.",
		refuteTest: "MAF tracks load plausibly and trims point at unmetered air instead.",
		missing: ["MAF vs load comparison", "OEM MAF specification"],
		testCostUsd: 0,
		testHours: .25
	},
	{
		id: "af_sensor",
		systemId: "airflow",
		systemLabel: "Airflow / metering",
		component: "A/F or O2 sensor bias",
		failureMode: "Sensor bias driving incorrect fueling",
		families: ["fuel_trim"],
		moreLikelyWhen: ["Trims and A/F disagree", "Sensor heater or slow-response codes"],
		lessLikelyWhen: ["Smoke confirms a leak", "Both banks (if V) behave identically with a shared leak"],
		confirmTest: "A/F sensor response and correlation to fueling changes. OEM spec required.",
		refuteTest: "Sensor responds promptly and trims are explained by measured air or fuel faults.",
		missing: ["A/F response test"],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "pcv_purge",
		systemId: "airflow",
		systemLabel: "Airflow / metering",
		component: "PCV / EVAP purge path",
		failureMode: "Stuck-open purge or PCV introducing unmetered or fuel-laden air",
		families: ["fuel_trim"],
		moreLikelyWhen: [
			"After refuel",
			"EVAP codes plus lean",
			"Idle changes with purge command"
		],
		lessLikelyWhen: ["No purge activity at idle and smoke shows a boot leak"],
		confirmTest: "Command purge, clamp PCV, watch trims. Smoke EVAP/intake.",
		refuteTest: "Purge/PCV isolation does not change trims.",
		missing: ["Purge command vs trim", "PCV isolation"],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "parasitic_lamp",
		systemId: "parasitic",
		systemLabel: "Key-off draw",
		component: "Interior lamp / glove-box / door-ajar circuit",
		failureMode: "Lamp or switch stuck on, drawing current key-off",
		families: ["parasitic"],
		moreLikelyWhen: [
			"Dead after sitting",
			"Charges and drives normally",
			"Aftermarket not key-off live"
		],
		lessLikelyWhen: ["Fails to charge while driving", "Dead only immediately after shutdown (module keep-alive window is normal)"],
		confirmTest: "Key-off parasitic measurement after modules sleep, then isolate circuits. Inspect glove-box and interior lamps.",
		refuteTest: "Draw returns to a typical sleep range after modules time out (OEM spec required) with lamps off.",
		missing: ["Parasitic amperage after sleep", "Interior lamp inspection"],
		testCostUsd: 0,
		testHours: .5
	},
	{
		id: "parasitic_aftermarket",
		systemId: "parasitic",
		systemLabel: "Key-off draw",
		component: "Aftermarket accessory",
		failureMode: "Added circuit remains powered key-off",
		families: ["parasitic", "network"],
		moreLikelyWhen: ["Recent accessory, radio, alarm, or USB install"],
		lessLikelyWhen: ["No aftermarket and a lamp is visibly stuck on"],
		confirmTest: "Pull aftermarket feeds while measuring key-off draw.",
		refuteTest: "Draw is unchanged with aftermarket isolated.",
		missing: ["Aftermarket isolation while measuring draw"],
		testCostUsd: 0,
		testHours: .4
	},
	{
		id: "battery_soh",
		systemId: "starting",
		systemLabel: "Starting / battery",
		component: "Battery state of health",
		failureMode: "Battery cannot hold charge — may be cause or victim",
		families: [
			"parasitic",
			"no_crank",
			"charging"
		],
		moreLikelyWhen: [
			"Old battery",
			"Fails even when driven daily",
			"Load test fails"
		],
		lessLikelyWhen: ["Fails only after a weekend sit and charges/drives normally"],
		confirmTest: "Conductance/load test and charging-system check. Treat as victim until draw is measured.",
		refuteTest: "Battery tests good and a measured parasitic draw explains the overnight loss.",
		missing: [
			"Battery test",
			"Charging voltage",
			"Parasitic draw"
		],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "charging_fail",
		systemId: "charging",
		systemLabel: "Charging",
		component: "Alternator / charging circuit",
		failureMode: "Not charging while running",
		families: ["charging", "parasitic"],
		moreLikelyWhen: ["Charge lamp on while driving", "Voltage low at idle with loads"],
		lessLikelyWhen: ["Drives normally all week, dead only after sitting"],
		confirmTest: "Charging voltage and ripple at idle and 2000 rpm, loaded and unloaded. OEM spec required.",
		refuteTest: "System voltage and ripple are in a typical charging range while running.",
		missing: ["Running charging voltage", "Ripple"],
		testCostUsd: 0,
		testHours: .3
	},
	{
		id: "can_aftermarket",
		systemId: "network",
		systemLabel: "Network / communication",
		component: "Aftermarket CAN splice / radio harness",
		failureMode: "CAN-H/L disturbed at an aftermarket splice",
		families: ["network"],
		moreLikelyWhen: [
			"Warnings started after radio/camera install",
			"Worse over bumps",
			"Multiple U-codes as a set"
		],
		lessLikelyWhen: ["No aftermarket and a single module is internally failed"],
		confirmTest: "CAN-H / CAN-L voltages and waveform. Inspect aftermarket splices. Isolate the accessory.",
		refuteTest: "Bus voltages/waveform remain correct with the accessory connected and warnings persist with it isolated.",
		missing: [
			"CAN voltages",
			"Scope of CAN",
			"Aftermarket harness inspection"
		],
		testCostUsd: 0,
		testHours: .5
	},
	{
		id: "can_gateway",
		systemId: "network",
		systemLabel: "Network / communication",
		component: "Gateway / bus backbone",
		failureMode: "Central gateway or backbone fault",
		families: ["network"],
		moreLikelyWhen: ["No aftermarket", "Many modules offline on one bus"],
		lessLikelyWhen: ["Timing matches a radio install", "Only one module is missing"],
		confirmTest: "Module topology, bus isolation, gateway communication. OEM network diagram required.",
		refuteTest: "Isolating an aftermarket splice restores the bus.",
		missing: ["Network topology scan", "OEM wiring diagram"],
		testCostUsd: 0,
		testHours: .8,
		safety: "Some chassis modules affect ABS/VSC. Confirm vehicle is safe to drive if warnings are present."
	},
	{
		id: "bsm_cal",
		systemId: "adas",
		systemLabel: "ADAS / BSM",
		component: "BSM calibration / initialization",
		failureMode: "Replacement sensor not initialized or calibration incomplete",
		families: ["adas"],
		moreLikelyWhen: [
			"Sensor already replaced",
			"No rear body damage",
			"BSM DTCs for alignment/cal"
		],
		lessLikelyWhen: ["Obvious crushed bracket", "No communication with the module"],
		confirmTest: "Check BSM DTCs and whether initialization/calibration completed per OEM procedure.",
		refuteTest: "OEM initialization is confirmed complete and DTCs point elsewhere.",
		missing: ["BSM DTCs", "Initialization status"],
		testCostUsd: 0,
		testHours: .4
	},
	{
		id: "bsm_mount",
		systemId: "adas",
		systemLabel: "ADAS / BSM",
		component: "BSM bracket / bumper alignment",
		failureMode: "Sensor aiming out of specification after impact or bumper work",
		families: ["adas"],
		moreLikelyWhen: ["Rear collision or bumper repair", "Sensor already replaced without aiming"],
		lessLikelyWhen: ["No body work and a calibration DTC only"],
		confirmTest: "Inspect mounting angle/brackets. OEM aiming spec required — do not invent numbers.",
		refuteTest: "Mounting is intact and aiming is within OEM specification.",
		missing: [
			"Rear body history",
			"Bracket inspection",
			"OEM aiming specification"
		],
		testCostUsd: 0,
		testHours: .5
	},
	{
		id: "bsm_harness",
		systemId: "adas",
		systemLabel: "ADAS / BSM",
		component: "BSM harness / connector",
		failureMode: "Open, short, or water in the BSM circuit",
		families: ["adas"],
		moreLikelyWhen: [
			"Water in bumper",
			"No comm with one side",
			"Circuit DTCs"
		],
		lessLikelyWhen: ["Both modules communicate and only a cal DTC is stored"],
		confirmTest: "Module communication, power/ground, and circuit integrity at the bumper connectors.",
		refuteTest: "Power, ground, and comm are intact.",
		missing: ["BSM module communication", "Power/ground at connector"],
		testCostUsd: 0,
		testHours: .5
	},
	{
		id: "bsm_sensor",
		systemId: "adas",
		systemLabel: "ADAS / BSM",
		component: "BSM sensor (replacement or remaining)",
		failureMode: "Sensor internal failure — last, not first",
		families: ["adas"],
		moreLikelyWhen: ["Cal complete, mount good, circuit good, still failed"],
		lessLikelyWhen: ["Just replaced with no initialization", "Rear body repair unaddressed"],
		confirmTest: "Only after calibration, mounting, communication, and circuit checks.",
		refuteTest: "A cheaper explanation (cal, mount, circuit) is still open.",
		missing: ["Proof that cal/mount/circuit are good"],
		testCostUsd: 180,
		testHours: .6
	},
	{
		id: "mechanical",
		systemId: "mechanical",
		systemLabel: "Mechanical",
		component: "Mechanical engine integrity",
		failureMode: "Timing, compression, or mechanical seizure",
		families: ["stall", "no_start"],
		moreLikelyWhen: [
			"No-start after overheat or jump",
			"Metallic noise",
			"Cranks unevenly"
		],
		lessLikelyWhen: ["Intermittent stall that later runs perfectly", "Strong even crank with fuel and spark absent together"],
		confirmTest: "Relative compression, mechanical inspection. Do not jump here from a running intermittent stall.",
		refuteTest: "Engine cranks evenly and runs perfectly between events.",
		missing: ["Relative compression if still no-start"],
		testCostUsd: 0,
		testHours: .6
	}
];
/** Additive score deltas applied when a tag is present. Never shown as percentages. */
var TAG_WEIGHTS = {
	stall: {
		ckp_sync: 2,
		ecm_power: 2,
		fuel_delivery: 2,
		ignition: 1,
		airflow: 1,
		immobilizer: 0,
		mechanical: 0
	},
	no_start: {
		ckp_sync: 2,
		ecm_power: 2,
		fuel_delivery: 2,
		ignition: 1,
		immobilizer: 1,
		mechanical: 1
	},
	crank_no_start: {
		ckp_sync: 3,
		fuel_delivery: 2,
		ignition: 2,
		ecm_power: 1,
		immobilizer: 1
	},
	no_crank: {
		battery_soh: 3,
		immobilizer: 1,
		charging_fail: 1
	},
	rough_idle: {
		unmetered_air: 3,
		maf_bias: 2,
		pcv_purge: 1,
		fuel_delivery: 1,
		airflow: 1
	},
	lean: {
		unmetered_air: 3,
		maf_bias: 2,
		fuel_delivery: 1,
		af_sensor: 1,
		pcv_purge: 1
	},
	intermittent: {
		ckp_connector: 2,
		ckp_sync: 1,
		ecm_power: 1,
		can_aftermarket: 1
	},
	instant_off: {
		ckp_sync: 3,
		ecm_power: 3,
		ckp_connector: 2,
		fuel_delivery: -2,
		airflow: -2,
		unmetered_air: -2,
		ignition: 0
	},
	sputter: {
		fuel_delivery: 3,
		ignition: 2,
		airflow: 2,
		unmetered_air: 1,
		ckp_sync: -2,
		ecm_power: -1
	},
	restart_die: {
		ckp_sync: 3,
		ckp_connector: 3,
		ecm_power: 2,
		immobilizer: 1,
		fuel_delivery: -1
	},
	hot: {
		ckp_sync: 2,
		fuel_delivery: 0,
		ignition: 1,
		ckp_connector: 0
	},
	cold: {
		fuel_delivery: 1,
		airflow: 1,
		unmetered_air: 1,
		ckp_sync: 0
	},
	while_driving: {
		ckp_sync: 1,
		ecm_power: 1,
		ckp_connector: 1,
		fuel_delivery: 1
	},
	at_idle: {
		unmetered_air: 2,
		airflow: 2,
		fuel_delivery: 1,
		ckp_sync: 0
	},
	vibration: {
		ckp_connector: 4,
		can_aftermarket: 2,
		ckp_sync: 1,
		ecm_power: 1
	},
	no_mil: {
		ckp_connector: 1,
		ecm_power: 1,
		ckp_sync: 0,
		fuel_delivery: 0
	},
	mil_on: {
		unmetered_air: 1,
		ckp_sync: 1,
		maf_bias: 1
	},
	aftermarket: {
		can_aftermarket: 4,
		parasitic_aftermarket: 2,
		ecm_power: 1,
		can_gateway: -1
	},
	dead_battery: {
		parasitic_lamp: 3,
		parasitic_aftermarket: 2,
		battery_soh: 2,
		charging_fail: 1
	},
	sit_overnight: {
		parasitic_lamp: 3,
		parasitic_aftermarket: 2,
		battery_soh: 1,
		charging_fail: -2
	},
	charges_ok: {
		charging_fail: -3,
		parasitic_lamp: 2,
		parasitic_aftermarket: 2
	},
	network: {
		can_aftermarket: 3,
		can_gateway: 2
	},
	bsm: {
		bsm_cal: 3,
		bsm_mount: 2,
		bsm_harness: 2,
		bsm_sensor: 1
	},
	prior_sensor: {
		bsm_cal: 3,
		bsm_mount: 2,
		bsm_sensor: -1,
		bsm_harness: 1
	},
	rear_body: {
		bsm_mount: 4,
		bsm_harness: 2,
		bsm_cal: 1,
		bsm_sensor: 0
	},
	prior_fuel_pump: {
		fuel_delivery: -3,
		ckp_sync: 1,
		ckp_connector: 1,
		ecm_power: 1
	},
	rain: {
		ckp_connector: 2,
		ecm_power: 1,
		bsm_harness: 1
	},
	after_refuel: {
		pcv_purge: 3,
		fuel_delivery: 1,
		unmetered_air: 0
	},
	rpm_zero_event: {
		ckp_sync: 4,
		ckp_connector: 3,
		ecm_power: 1,
		fuel_delivery: -3,
		airflow: -2
	},
	fuel_pressure_ok: {
		fuel_delivery: -4,
		ckp_sync: 1,
		ecm_power: 1
	},
	fuel_pressure_low: {
		fuel_delivery: 4,
		ckp_sync: -1
	},
	ckp_wave_loss: {
		ckp_sync: 5,
		ckp_connector: 3,
		ecm_power: 0,
		fuel_delivery: -2
	},
	ckp_wave_ok: {
		ckp_sync: -5,
		ckp_connector: -3
	},
	ecm_power_ok: { ecm_power: -4 },
	ecm_power_loss: {
		ecm_power: 5,
		ckp_sync: -1
	},
	trims_idle_high: {
		unmetered_air: 4,
		maf_bias: 2,
		pcv_purge: 1,
		fuel_delivery: 1
	},
	trims_cruise_high: {
		maf_bias: 3,
		fuel_delivery: 2,
		unmetered_air: 1
	},
	smoke_leak: {
		unmetered_air: 5,
		maf_bias: -2
	},
	smoke_seal: { unmetered_air: -4 },
	parasitic_high: {
		parasitic_lamp: 3,
		parasitic_aftermarket: 3,
		battery_soh: -1
	},
	parasitic_normal: {
		parasitic_lamp: -4,
		parasitic_aftermarket: -3
	},
	lamp_on_keyoff: { parasitic_lamp: 5 },
	can_voltage_bad: {
		can_aftermarket: 4,
		can_gateway: 2
	},
	can_voltage_ok: {
		can_aftermarket: -2,
		can_gateway: -1
	},
	bsm_no_init: {
		bsm_cal: 4,
		bsm_sensor: -2
	},
	bsm_no_comm: {
		bsm_harness: 4,
		bsm_sensor: 1,
		bsm_cal: -1
	},
	connector_corrosion: {
		ckp_connector: 5,
		ckp_sync: 2
	},
	wiggle_drop: {
		ckp_connector: 5,
		can_aftermarket: 1
	},
	hot_only: {
		ckp_sync: 3,
		ignition: 1,
		fuel_delivery: 0,
		ckp_connector: -1
	},
	cold_only: {
		fuel_delivery: 1,
		unmetered_air: 1,
		ckp_sync: -1
	},
	tach_zero: {
		ckp_sync: 3,
		ecm_power: 1,
		fuel_delivery: -2
	},
	cluster_dies: {
		ecm_power: 4,
		ckp_sync: -1
	},
	cluster_lives: {
		ecm_power: -2,
		ckp_sync: 1
	}
};
var QUESTIONS = [
	{
		id: "stall_character",
		audience: "customer",
		families: ["stall"],
		prompt: "When the engine stalls, does it:",
		rationale: "Instant shutdown vs a sputter splits position/power faults from fuel and airflow.",
		options: [
			{
				id: "instant",
				label: "Shuts off instantly, as if the ignition was switched off",
				tags: ["instant_off"],
				narrative: "Stall is instantaneous — ignition-like cutoff."
			},
			{
				id: "sputter",
				label: "Sputters or loses power for several seconds first",
				tags: ["sputter"],
				narrative: "Stall is preceded by a stumble or loss of power."
			},
			{
				id: "accel",
				label: "Mostly happens during acceleration",
				tags: ["sputter"],
				narrative: "Complaint is load-related."
			},
			{
				id: "idle",
				label: "Mostly happens while stopping or idling",
				tags: ["at_idle"],
				narrative: "Complaint is idle or deceleration related."
			},
			{
				id: "unknown",
				label: "Unknown / mixed",
				tags: [],
				narrative: "Customer cannot classify the stall character."
			}
		]
	},
	{
		id: "thermal",
		audience: "customer",
		families: [
			"stall",
			"no_start",
			"fuel_trim"
		],
		prompt: "Is the complaint temperature-related?",
		rationale: "Hot-only failures raise temperature-dependent sensors and heat-soak circuits; cold-only raises fueling and leaks.",
		options: [
			{
				id: "hot",
				label: "Only after the engine is fully warm / a long drive",
				tags: ["hot", "hot_only"],
				narrative: "Failure is hot-dependent."
			},
			{
				id: "cold",
				label: "Only when cold",
				tags: ["cold", "cold_only"],
				narrative: "Failure is cold-dependent."
			},
			{
				id: "either",
				label: "Happens hot or cold",
				tags: ["intermittent"],
				narrative: "Not clearly thermal."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Temperature relationship unknown."
			}
		]
	},
	{
		id: "restart",
		audience: "customer",
		families: ["stall", "no_start"],
		prompt: "After it dies, what happens when you try to restart?",
		rationale: "Immediate restart vs start-and-die loops vs a cool-down wait separates connector/sync faults from heat-soak and fuel.",
		options: [
			{
				id: "immediate",
				label: "Restarts immediately and stays running",
				tags: ["intermittent"],
				narrative: "Restarts immediately."
			},
			{
				id: "loop",
				label: "Starts and dies several times, then runs",
				tags: ["restart_die"],
				narrative: "Start-and-die loop, then recovers."
			},
			{
				id: "wait",
				label: "Must wait several minutes (often until it cools)",
				tags: ["hot", "hot_only"],
				narrative: "Requires a wait, often a cool-down."
			},
			{
				id: "dead",
				label: "Will not restart until towed / cooled a long time",
				tags: ["no_start"],
				narrative: "Remains a no-start."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Restart behavior unknown."
			}
		]
	},
	{
		id: "vibration",
		audience: "customer",
		families: [
			"stall",
			"network",
			"no_start"
		],
		prompt: "Does it get worse with vibration, bumps, or turning?",
		rationale: "Mechanical disturbance of a connector or aftermarket splice is highly discriminating.",
		options: [
			{
				id: "bumps",
				label: "Worse over bumps or rough roads",
				tags: ["vibration"],
				narrative: "Vibration/rough-road sensitive."
			},
			{
				id: "turn",
				label: "Worse when turning",
				tags: ["vibration"],
				narrative: "Turning-related — harness movement possible."
			},
			{
				id: "no",
				label: "No relationship to bumps or turning",
				tags: [],
				narrative: "Not vibration related."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Unknown."
			}
		]
	},
	{
		id: "tach_cluster",
		audience: "customer",
		families: ["stall"],
		prompt: "During the stall, what does the tachometer / dash do?",
		rationale: "A tach that drops to zero while the engine is still spinning (or an instantly dark cluster) splits CKP from ECM power.",
		options: [
			{
				id: "tach0",
				label: "Tach drops to zero immediately",
				tags: ["tach_zero"],
				narrative: "Tachometer drops to zero at the stall."
			},
			{
				id: "cluster_dark",
				label: "The cluster / radio glitches or goes dark",
				tags: ["cluster_dies"],
				narrative: "Cluster or accessories drop with the stall."
			},
			{
				id: "cluster_ok",
				label: "Dash stays normally lit; just dies",
				tags: ["cluster_lives"],
				narrative: "Cluster remains alive through the stall."
			},
			{
				id: "unknown",
				label: "Didn't notice",
				tags: [],
				narrative: "Dash behavior unknown."
			}
		]
	},
	{
		id: "sit",
		audience: "customer",
		families: ["parasitic", "no_crank"],
		prompt: "When does the battery fail?",
		rationale: "Overnight sit vs fails even when driven daily splits parasitic draw from a battery or charging fault.",
		options: [
			{
				id: "weekend",
				label: "After sitting overnight or over a weekend",
				tags: ["sit_overnight", "dead_battery"],
				narrative: "Fails after a sit."
			},
			{
				id: "daily",
				label: "Even if I drive it every day",
				tags: ["dead_battery"],
				narrative: "Fails even with regular use."
			},
			{
				id: "charge_lamp",
				label: "Charge lamp is on while driving",
				tags: ["charging_fail"],
				narrative: "Charge lamp on while running."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Unknown."
			}
		]
	},
	{
		id: "after_install",
		audience: "customer",
		families: [
			"network",
			"parasitic",
			"adas"
		],
		prompt: "Any recent accessories, radio, or body work?",
		rationale: "Aftermarket work raises CAN and draw faults without proving them.",
		options: [
			{
				id: "radio",
				label: "Radio / camera / alarm installed recently",
				tags: ["aftermarket"],
				narrative: "Recent aftermarket electronic install."
			},
			{
				id: "rear",
				label: "Rear bumper or collision repair",
				tags: ["rear_body"],
				narrative: "Rear body repair."
			},
			{
				id: "usb",
				label: "USB / dash accessory added",
				tags: ["aftermarket"],
				narrative: "Accessory added."
			},
			{
				id: "none",
				label: "No recent accessory or body work",
				tags: [],
				narrative: "No recent accessory/body work."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Unknown."
			}
		]
	},
	{
		id: "bsm_init",
		audience: "technician",
		families: ["adas"],
		prompt: "Was the replacement BSM sensor initialized / calibrated with a scan tool?",
		rationale: "A replaced BSM that was never initialized is a more likely explanation than a second failed sensor.",
		options: [
			{
				id: "no",
				label: "No / not documented",
				tags: ["bsm_no_init", "prior_sensor"],
				narrative: "Initialization not documented."
			},
			{
				id: "yes",
				label: "Yes, completed per OEM",
				tags: ["prior_sensor"],
				narrative: "Initialization claimed complete."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: ["prior_sensor"],
				narrative: "Initialization status unknown."
			}
		]
	},
	{
		id: "trim_when",
		audience: "customer",
		families: ["fuel_trim"],
		prompt: "When is the running problem worst?",
		rationale: "Idle-only vs all-speed trims separates unmetered air from a biased MAF.",
		options: [
			{
				id: "idle",
				label: "Worst at idle / stoplights; highway is acceptable",
				tags: ["at_idle", "trims_idle_high"],
				narrative: "Idle-dominant."
			},
			{
				id: "always",
				label: "Bad at idle and while cruising",
				tags: ["trims_cruise_high"],
				narrative: "Across the range."
			},
			{
				id: "load",
				label: "Only under acceleration",
				tags: ["sputter"],
				narrative: "Load-related."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Unknown."
			}
		]
	},
	{
		id: "rain",
		audience: "customer",
		families: [
			"stall",
			"network",
			"no_start"
		],
		prompt: "Any relationship to rain, car washes, or moisture?",
		rationale: "Moisture can expose connector and aftermarket splice faults.",
		options: [
			{
				id: "yes",
				label: "Worse when wet or after a wash",
				tags: ["rain"],
				narrative: "Moisture-related."
			},
			{
				id: "no",
				label: "No weather relationship",
				tags: [],
				narrative: "Not weather related."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Unknown."
			}
		]
	},
	{
		id: "crank_type",
		audience: "customer",
		families: ["no_start", "no_crank"],
		prompt: "When it will not run, does the engine crank?",
		rationale: "Crank/no-start vs no-crank splits engine management from battery/starter/security.",
		options: [
			{
				id: "cranks",
				label: "Cranks strongly but never fires",
				tags: ["crank_no_start", "no_start"],
				narrative: "Cranks, no start."
			},
			{
				id: "slow",
				label: "Cranks slowly / weakly",
				tags: ["no_crank", "dead_battery"],
				narrative: "Slow crank."
			},
			{
				id: "silent",
				label: "Click or silence — no crank",
				tags: ["no_crank"],
				narrative: "No crank."
			},
			{
				id: "unknown",
				label: "Unknown",
				tags: [],
				narrative: "Unknown."
			}
		]
	}
];
var TESTS = [
	{
		id: "scan_dtc",
		name: "Scan all modules — DTCs, pending, freeze-frame",
		families: [
			"stall",
			"no_start",
			"fuel_trim",
			"network",
			"adas",
			"parasitic",
			"charging",
			"generic"
		],
		discriminates: [
			"ckp_sync",
			"unmetered_air",
			"can_aftermarket",
			"bsm_cal"
		],
		why: "Codes are evidence, not a diagnosis. Freeze-frame captures the operating condition.",
		expectedOutcomes: [
			"No codes",
			"Position codes (P0335/P0339 family)",
			"Lean/misfire",
			"U-codes",
			"BSM/ADAS codes"
		],
		timeHr: .15,
		cost: "minimal",
		invasiveness: "none",
		technicianOnly: true
	},
	{
		id: "rpm_during_fail",
		name: "Monitor RPM PID during the failure",
		families: ["stall", "no_start"],
		discriminates: [
			"ckp_sync",
			"ckp_connector",
			"fuel_delivery",
			"airflow"
		],
		why: "A sudden RPM PID of 0 while the engine is physically rotating strongly separates crank/cam sync from fuel and airflow.",
		expectedOutcomes: [
			"RPM stays plausible until it actually stops",
			"RPM drops to 0 while the engine is still spinning",
			"No duplication"
		],
		timeHr: .2,
		cost: "minimal",
		invasiveness: "none",
		technicianOnly: true
	},
	{
		id: "fuel_pressure_fail",
		name: "Fuel pressure during the failure (or residual after stall)",
		families: [
			"stall",
			"no_start",
			"fuel_trim"
		],
		discriminates: [
			"fuel_delivery",
			"ckp_sync",
			"ecm_power"
		],
		why: "Stable pressure during an instant stall refutes fuel starvation. A collapse supports the pump/circuit. Compare to OEM specification — do not invent one.",
		expectedOutcomes: [
			"Holds in a typical running range",
			"Collapses",
			"Never builds"
		],
		timeHr: .35,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	},
	{
		id: "scope_ckp",
		name: "Scope CKP (and CMP if available) at the failure condition",
		families: ["stall", "no_start"],
		discriminates: [
			"ckp_sync",
			"ckp_connector",
			"ecm_power"
		],
		why: "A dropout simultaneous with RPM PID loss is confirming for position-sensor/circuit. A live waveform with a dead engine points elsewhere.",
		expectedOutcomes: [
			"Clean waveform throughout",
			"Dropout/noise during event",
			"No signal while cranking"
		],
		timeHr: .4,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	},
	{
		id: "efi_relay",
		name: "EFI / main-relay output and ECM B+ during the event",
		families: ["stall", "no_start"],
		discriminates: ["ecm_power", "ckp_sync"],
		why: "Confirms or refutes an ECM power interruption without replacing a computer.",
		expectedOutcomes: ["Power stays up", "Power drops with the stall"],
		timeHr: .35,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	},
	{
		id: "inspect_ckp",
		name: "Inspect CKP connector, terminals, and pigtail (loaded wiggle)",
		families: ["stall", "no_start"],
		discriminates: ["ckp_connector", "ckp_sync"],
		why: "Corrosion or a loose lock can duplicate an intermittent stall that never sets a lasting code.",
		expectedOutcomes: [
			"Clean and tight",
			"Corrosion / backed-out terminal",
			"RPM drop on wiggle"
		],
		timeHr: .25,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	},
	{
		id: "smoke",
		name: "Smoke test intake (after the MAF) and visible boot inspection",
		families: ["fuel_trim", "stall"],
		discriminates: [
			"unmetered_air",
			"maf_bias",
			"pcv_purge"
		],
		why: "A leak after the MAF explains idle-high positive trims. Do not replace a MAF first.",
		expectedOutcomes: ["Leak found", "No leak"],
		timeHr: .3,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	},
	{
		id: "pid_trims",
		name: "Capture STFT/LTFT/MAF/MAP at idle and ~2500 rpm",
		families: ["fuel_trim"],
		discriminates: [
			"unmetered_air",
			"maf_bias",
			"fuel_delivery"
		],
		why: "Idle-only high trims vs all-speed high trims is the cheapest split between unmetered air and MAF bias.",
		expectedOutcomes: [
			"Idle high, cruise normal",
			"High everywhere",
			"Normal"
		],
		timeHr: .2,
		cost: "minimal",
		invasiveness: "none",
		technicianOnly: true
	},
	{
		id: "parasitic",
		name: "Key-off parasitic draw after modules sleep",
		families: ["parasitic", "no_crank"],
		discriminates: [
			"parasitic_lamp",
			"parasitic_aftermarket",
			"battery_soh"
		],
		why: "Measure first. Replacing a battery without a draw test treats the victim. OEM sleep-current spec required for pass/fail.",
		expectedOutcomes: ["Draw remains high after sleep", "Draw returns to a typical sleep range"],
		timeHr: .5,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	},
	{
		id: "interior_lamps",
		name: "Inspect glove-box, dome, and trunk lamps key-off",
		families: ["parasitic"],
		discriminates: ["parasitic_lamp"],
		why: "A stuck glove-box switch is a common, cheap find that a battery test will never reveal.",
		expectedOutcomes: ["Lamp stays on latched", "All lamps off"],
		timeHr: .15,
		cost: "minimal",
		invasiveness: "none",
		technicianOnly: true
	},
	{
		id: "charging",
		name: "Charging-system voltage and ripple, loaded",
		families: ["charging", "parasitic"],
		discriminates: ["charging_fail", "battery_soh"],
		why: "Separates a charging fault from a key-off draw. OEM voltage range required.",
		expectedOutcomes: [
			"Charges in a typical range",
			"Low voltage",
			"High ripple"
		],
		timeHr: .25,
		cost: "minimal",
		invasiveness: "none",
		technicianOnly: true
	},
	{
		id: "can_scope",
		name: "CAN-H / CAN-L voltage and waveform; inspect aftermarket splices",
		families: ["network"],
		discriminates: ["can_aftermarket", "can_gateway"],
		why: "A shorted or scotch-lok'd CAN pair at a radio install is a common cause of a 'Christmas tree' cluster.",
		expectedOutcomes: [
			"Typical recessive/dominant voltages",
			"CAN-H/L collapsed",
			"Visible bad splice"
		],
		timeHr: .45,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true,
		safety: "Vehicle may have ABS/VSC warnings. Confirm it is safe to operate."
	},
	{
		id: "bsm_scan",
		name: "BSM module communication, DTCs, and initialization status",
		families: ["adas"],
		discriminates: [
			"bsm_cal",
			"bsm_harness",
			"bsm_sensor",
			"bsm_mount"
		],
		why: "Do not replace another sensor until communication and calibration state are known.",
		expectedOutcomes: [
			"Both modules communicate, cal incomplete",
			"No comm one side",
			"Aiming/mount DTCs",
			"No codes"
		],
		timeHr: .25,
		cost: "minimal",
		invasiveness: "none",
		technicianOnly: true
	},
	{
		id: "bsm_mount",
		name: "Inspect BSM brackets, bumper alignment, rear body repair",
		families: ["adas"],
		discriminates: [
			"bsm_mount",
			"bsm_harness",
			"bsm_cal"
		],
		why: "A replaced sensor on a bent bracket will keep the warning on. OEM aiming spec required — do not invent angles.",
		expectedOutcomes: ["Bracket damaged or shifted", "Mount intact"],
		timeHr: .3,
		cost: "minimal",
		invasiveness: "low",
		technicianOnly: true
	}
];
var DTC_KB = [
	{
		code: "P0335",
		title: "Crankshaft Position Sensor Circuit A",
		meaning: "ECM did not see a plausible CKP signal when it expected one.",
		tags: ["ckp_code"],
		notADiagnosis: "Could be the sensor, connector, reluctor, or ECM input. Confirm with a waveform.",
		families: ["stall", "no_start"]
	},
	{
		code: "P0339",
		title: "Crankshaft Position Sensor Circuit Intermittent",
		meaning: "CKP signal was lost briefly.",
		tags: ["ckp_code"],
		notADiagnosis: "Intermittent codes often point at a connector or heat-related sensor, not an automatic parts replacement.",
		families: ["stall", "no_start"]
	},
	{
		code: "P0340",
		title: "Camshaft Position Sensor Circuit",
		meaning: "CMP signal fault.",
		tags: ["ckp_code"],
		notADiagnosis: "Compare CKP vs CMP. A dual loss during crank often still starts at engine-position power/ground.",
		families: ["stall", "no_start"]
	},
	{
		code: "P0171",
		title: "System Too Lean Bank 1",
		meaning: "Long-term fueling added air or lost fuel on bank 1.",
		tags: ["lean"],
		notADiagnosis: "Splits into unmetered air, MAF bias, low fuel, A/F sensor bias, exhaust leak, PCV, purge — evidence must separate them.",
		families: ["fuel_trim"]
	},
	{
		code: "P0300",
		title: "Random / Multiple Cylinder Misfire",
		meaning: "Misfire counted on multiple cylinders.",
		tags: ["sputter"],
		notADiagnosis: "Cause may be ignition, fuel, air, or mechanical. Use freeze-frame and which cylinders.",
		families: ["fuel_trim", "stall"]
	},
	{
		code: "U0100",
		title: "Lost Communication with ECM/PCM A",
		meaning: "Another module did not hear the ECM on the bus.",
		tags: ["network"],
		notADiagnosis: "Often a bus problem (splice, short, gateway), not a failed ECM. Inspect recent aftermarket work.",
		families: ["network"]
	},
	{
		code: "P0562",
		title: "System Voltage Low",
		meaning: "Module saw supply voltage below its threshold.",
		tags: ["dead_battery"],
		notADiagnosis: "Battery, charging, or a draw. Measure, do not replace in a vacuum.",
		families: ["parasitic", "charging"]
	},
	{
		code: "C1A10",
		title: "Forward/side radar / BSM related (family)",
		meaning: "ADAS radar/BSM reported a fault. Exact definition is OEM-specific.",
		tags: ["bsm"],
		notADiagnosis: "OEM service information required for the exact definition. Do not treat as 'replace sensor.'",
		families: ["adas"]
	},
	{
		code: "B2321",
		title: "Blind-spot monitor (family — OEM definition required)",
		meaning: "BSM module stored a body/ADAS code. Exact title is OEM-specific.",
		tags: ["bsm"],
		notADiagnosis: "Could be cal, mount, circuit, or sensor. Pull the OEM definition before replacing parts.",
		families: ["adas"]
	}
];
var DTC_CODE_WEIGHTS = {
	P0335: {
		ckp_sync: 3,
		ckp_connector: 2
	},
	P0339: {
		ckp_sync: 3,
		ckp_connector: 3
	},
	P0340: {
		ckp_sync: 2,
		ignition: 0
	},
	P0171: {
		unmetered_air: 2,
		maf_bias: 2,
		fuel_delivery: 1,
		af_sensor: 1,
		pcv_purge: 1
	},
	P0300: {
		ignition: 2,
		fuel_delivery: 1,
		unmetered_air: 1,
		airflow: 1
	},
	U0100: {
		can_aftermarket: 3,
		can_gateway: 2,
		ecm_power: 1
	},
	P0562: {
		battery_soh: 2,
		charging_fail: 2,
		parasitic_lamp: 1
	},
	C1A10: {
		bsm_cal: 2,
		bsm_mount: 2,
		bsm_harness: 1,
		bsm_sensor: 1
	},
	B2321: {
		bsm_cal: 2,
		bsm_harness: 2,
		bsm_sensor: 1
	}
};
function familyFor(tags) {
	if (tags.includes("bsm")) return "adas";
	if (tags.includes("dead_battery") || tags.includes("sit_overnight")) return "parasitic";
	if (tags.includes("network")) return "network";
	if (tags.includes("lean") || tags.includes("rough_idle")) return "fuel_trim";
	if (tags.includes("no_crank") && !tags.includes("stall")) return "no_crank";
	if (tags.includes("charging_fail") && !tags.includes("stall")) return "charging";
	if (tags.includes("no_start") || tags.includes("crank_no_start")) return "no_start";
	if (tags.includes("stall")) return "stall";
	return "generic";
}
var TRUE_CAUSE_MAP = {
	"ckp-open": "ckp_sync",
	"ckp-corr": "ckp_connector",
	"ckp-hot": "ckp_sync",
	"intake-boot": "unmetered_air",
	"glove-draw": "parasitic_lamp",
	"can-short": "can_aftermarket"
};
var TAG_PATTERNS = [
	{
		re: /\bstall(s|ed|ing)?\b|\bdie[sd]?\b|\bcuts? out\b|\bshut(?:s|ting)? off\b/i,
		tags: ["stall"]
	},
	{
		re: /won'?t start|will not start|no start|doesn'?t start/i,
		tags: ["no_start"]
	},
	{
		re: /cranks? (but|and).{0,24}(won'?t|will not|no) start|cranks?,?\s*no start/i,
		tags: ["crank_no_start", "no_start"]
	},
	{
		re: /no crank|doesn'?t crank|click(?:s|ing)?\b|silent/i,
		tags: ["no_crank"]
	},
	{
		re: /rough idle|idle (is |feels )?(rough|hunt)|wants to die/i,
		tags: ["rough_idle"]
	},
	{
		re: /system too lean|too lean|p0171|\blean\b/i,
		tags: ["lean"]
	},
	{
		re: /check engine|\bcel\b|\bmil\b/i,
		tags: ["mil_on"]
	},
	{
		re: /no warning|no light|no cel|no mil|no consistent warning/i,
		tags: ["no_mil"]
	},
	{
		re: /intermittent|sometimes|occasionally|random|ghost|on and off/i,
		tags: ["intermittent"]
	},
	{
		re: /after (a |the )?(long )?drive|fully warm|heat[- ]?soak|\bhot\b|20.?30 min/i,
		tags: ["hot"]
	},
	{
		re: /only (when |if )?cold|cold start is perfect|never (when |if )?cold/i,
		tags: ["cold"]
	},
	{
		re: /immediately dies|starts and (immediately )?dies|start(?:s)? and die/i,
		tags: ["restart_die"]
	},
	{
		re: /instant(?:ly)?|like (the )?(key|ignition)|keyed off|as if.{0,12}switched off/i,
		tags: ["instant_off"]
	},
	{
		re: /sputter|stumble|lose[s]? power/i,
		tags: ["sputter"]
	},
	{
		re: /bump|rough road|vibration|wiggle|over (a )?bump/i,
		tags: ["vibration"]
	},
	{
		re: /aftermarket|stereo|head unit|radio just went|new radio|alarm install/i,
		tags: ["aftermarket"]
	},
	{
		re: /battery.{0,24}(dead|drain)|dead battery|sit over|going dead|won'?t crank after sit/i,
		tags: ["dead_battery", "sit_overnight"]
	},
	{
		re: /blind[- ]?spot|\bbsm\b|rcta|rear cross/i,
		tags: ["bsm"]
	},
	{
		re: /multiple warning|abs.{0,12}traction|christmas tree|dash lit|half the dash/i,
		tags: ["network"]
	},
	{
		re: /fuel pump.{0,20}(replac|already|no change)|pump.{0,16}no change/i,
		tags: ["prior_fuel_pump"]
	},
	{
		re: /sensor already replaced|replaced.{0,20}sensor|bsm.{0,16}replac/i,
		tags: ["prior_sensor"]
	},
	{
		re: /rear (bumper|body|collision)|collision repair/i,
		tags: ["rear_body"]
	},
	{
		re: /while driving|on the (road|highway)|pulling away/i,
		tags: ["while_driving"]
	},
	{
		re: /at (a )?(stop|light|idle)|stoplights?/i,
		tags: ["at_idle"]
	},
	{
		re: /car wash|rain|moisture|wet/i,
		tags: ["rain"]
	},
	{
		re: /after (refuel|fill)|just (filled|gassed)/i,
		tags: ["after_refuel"]
	},
	{
		re: /charge lamp|alt(?:ernator)? (light|fail)/i,
		tags: ["charging_fail"]
	},
	{
		re: /usb (port|outlet)|dash cam/i,
		tags: ["aftermarket"]
	},
	{
		re: /glove box|dome light|trunk light/i,
		tags: ["lamp_on_keyoff"]
	},
	{
		re: /not (initialized|calibrated)|never (initialized|calibrated)|no (init|cal)/i,
		tags: ["bsm_no_init"]
	}
];
var SAFETY_PATTERNS = [
	{
		re: /brake|abs warning while driving|pedal to the floor/i,
		flag: "Brakes — verify the vehicle is safe to operate before any road test."
	},
	{
		re: /steering|assist lost|power steer/i,
		flag: "Steering — loss of assist is a safety concern on a road test."
	},
	{
		re: /airbag|srs/i,
		flag: "SRS — do not probe airbag circuits without OEM procedures."
	},
	{
		re: /hybrid|hv battery|orange (cable|wire)/i,
		flag: "HV system — follow OEM high-voltage safety. Do not invent disable procedures."
	},
	{
		re: /fuel (smell|leak)|gasoline smell|fire/i,
		flag: "Possible fuel leak — do not run the engine until the leak is controlled."
	},
	{
		re: /uncontrolled|lurches|takes off/i,
		flag: "Uncontrolled movement risk — confirm throttle and transmission safety first."
	}
];
var CONDITION_LABELS = {
	hot: "Hot / after extended driving",
	cold: "Cold",
	hot_only: "Hot-only",
	intermittent: "Intermittent",
	while_driving: "While driving",
	at_idle: "Idle / stopping",
	vibration: "Vibration / rough road",
	rain: "Moisture related",
	sit_overnight: "After sitting",
	after_refuel: "After refueling"
};
var SYMPTOM_LABELS = {
	stall: "Engine stall",
	no_start: "No-start",
	crank_no_start: "Cranks, no start",
	no_crank: "No-crank",
	rough_idle: "Rough idle",
	lean: "Lean / fuel-trim concern",
	instant_off: "Instant shutdown",
	sputter: "Sputter / loss of power",
	restart_die: "Starts then dies",
	dead_battery: "Battery goes dead",
	network: "Multiple warning lights",
	bsm: "Blind-spot / ADAS warning",
	mil_on: "Malfunction indicator",
	no_mil: "No consistent warning lamp"
};
function unique(xs) {
	return [...new Set(xs.filter(Boolean))];
}
function extractTags(...texts) {
	const blob = texts.filter(Boolean).join("\n");
	const tags = [];
	for (const p of TAG_PATTERNS) if (p.re.test(blob)) tags.push(...p.tags);
	return unique(tags);
}
function extractSymptoms(tags) {
	return tags.map((t) => SYMPTOM_LABELS[t]).filter(Boolean);
}
function extractConditions(tags) {
	return tags.map((t) => CONDITION_LABELS[t]).filter(Boolean);
}
function extractSafety(text) {
	return SAFETY_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.flag);
}
function detectFamily(tags) {
	return familyFor(tags);
}
function parseDtcCodes(raw) {
	if (!raw.trim()) return [];
	return unique(raw.toUpperCase().match(/\b[PBCU][0-9A-F]{4}\b/g) ?? []).map((code) => {
		return {
			code,
			title: DTC_KB.find((d) => d.code === code)?.title ?? "OEM definition required — title not in the local library"
		};
	});
}
var PID_LINE = /^\s*(rpm|vss|speed|ect|coolant|iat|batt(?:ery)?|vpwr|stft|ltft|maf|map|tps|accel|app|load|fuel(?:\s*pressure)?|a\/?f|o2|lambda|timing|ign)\b[^0-9+\-]*([+\-]?\d+(?:\.\d+)?)\s*(%|psi|kpa|v|g\/s|mph|°f|f|rpm|°)?/i;
var PID_KEY = {
	rpm: "rpm",
	vss: "vss",
	speed: "vss",
	ect: "ect",
	coolant: "ect",
	iat: "iat",
	batt: "vpwr",
	battery: "vpwr",
	vpwr: "vpwr",
	stft: "stft",
	ltft: "ltft",
	maf: "maf",
	map: "map",
	tps: "tps",
	accel: "app",
	app: "app",
	load: "load",
	fuel: "fuel_psi",
	"fuel pressure": "fuel_psi",
	"a/f": "afr",
	af: "afr",
	o2: "o2",
	lambda: "afr",
	timing: "timing",
	ign: "timing"
};
function parsePidPaste(text) {
	const out = [];
	for (const line of text.split(/\n|;/)) {
		const m = line.match(PID_LINE);
		if (!m) continue;
		const label = m[1].toLowerCase();
		const key = PID_KEY[label] ?? label;
		const value = Number(m[2]);
		if (!Number.isFinite(value)) continue;
		out.push({
			key,
			value,
			units: m[3],
			raw: line.trim()
		});
	}
	return out;
}
function tagsFromPids(pids, condition) {
	const tags = [];
	const get = (k) => pids.find((p) => p.key === k)?.value;
	const rpm = get("rpm");
	const stft = get("stft");
	const ltft = get("ltft");
	const fuel = get("fuel_psi");
	const cond = (condition ?? "").toLowerCase();
	const duringFail = /stall|fail|die|event|crank/.test(cond);
	if (rpm === 0 && duringFail) tags.push("rpm_zero_event");
	if (stft != null && ltft != null && stft > 8 && ltft > 8) tags.push("trims_idle_high", "lean");
	if (stft != null && ltft != null && stft > 8 && ltft > 8 && /cruise|highway|2500/.test(cond)) tags.push("trims_cruise_high");
	if (fuel != null && fuel >= 35 && fuel <= 65 && duringFail) tags.push("fuel_pressure_ok");
	if (fuel != null && fuel < 28) tags.push("fuel_pressure_low");
	return unique(tags);
}
var OBS_PATTERNS = [
	{
		re: /ckp.{0,40}(disappear|dropout|no signal|missing|lost)/i,
		tags: ["ckp_wave_loss"],
		source: "oscilloscope"
	},
	{
		re: /ckp.{0,40}(present|stable|clean|good|normal)/i,
		tags: ["ckp_wave_ok"],
		source: "oscilloscope"
	},
	{
		re: /rpm.{0,20}(0|zero|drops? to zero|disappear)/i,
		tags: ["rpm_zero_event"],
		source: "live_pid"
	},
	{
		re: /fuel pressure.{0,24}(\d{2})/i,
		tags: [],
		source: "pressure"
	},
	{
		re: /fuel pressure.{0,30}(spec|normal|held|stayed|ok|good)/i,
		tags: ["fuel_pressure_ok"],
		source: "pressure"
	},
	{
		re: /fuel pressure.{0,24}(low|collapse|drop|zero)/i,
		tags: ["fuel_pressure_low"],
		source: "pressure"
	},
	{
		re: /smoke.{0,20}(leak|found|split|tear)/i,
		tags: ["smoke_leak"],
		source: "inspection"
	},
	{
		re: /smoke.{0,20}(no leak|sealed|tight)/i,
		tags: ["smoke_seal"],
		source: "inspection"
	},
	{
		re: /wiggle.{0,30}(drop|die|stall|rpm)/i,
		tags: ["wiggle_drop"],
		source: "inspection"
	},
	{
		re: /corrosion|green (on )?(the )?terminal|backed.?out/i,
		tags: ["connector_corrosion"],
		source: "inspection"
	},
	{
		re: /glove.{0,20}(lit|on|stuck)/i,
		tags: ["lamp_on_keyoff"],
		source: "inspection"
	},
	{
		re: /parasitic.{0,20}(\d+(?:\.\d+)?)\s*a/i,
		tags: ["parasitic_high"],
		source: "scan_test"
	},
	{
		re: /can[- ]?h.{0,20}(0|short|collapse|ground)/i,
		tags: ["can_voltage_bad"],
		source: "dvom"
	},
	{
		re: /efi (relay|power).{0,20}(drops|lost|0)/i,
		tags: ["ecm_power_loss"],
		source: "dvom"
	},
	{
		re: /efi (relay|power).{0,20}(stays|stable|ok|12)/i,
		tags: ["ecm_power_ok"],
		source: "dvom"
	},
	{
		re: /not (initialized|calibrated)/i,
		tags: ["bsm_no_init"],
		source: "technician"
	},
	{
		re: /no comm(?:unication)? .{0,20}bsm/i,
		tags: ["bsm_no_comm"],
		source: "scan_test"
	}
];
function interpretObservation(text, condition) {
	const pids = parsePidPaste(text);
	const tags = [...extractTags(text, condition ?? ""), ...tagsFromPids(pids, condition)];
	let source = "technician";
	for (const p of OBS_PATTERNS) if (p.re.test(text)) {
		tags.push(...p.tags);
		source = p.source;
	}
	const fuelMatch = text.match(/fuel pressure.{0,24}(\d{2}(?:\.\d+)?)\s*psi/i);
	if (fuelMatch) {
		const v = Number(fuelMatch[1]);
		if (v >= 35 && v <= 65) tags.push("fuel_pressure_ok");
		if (v < 28) tags.push("fuel_pressure_low");
		pids.push({
			key: "fuel_psi",
			value: v,
			units: "psi",
			raw: fuelMatch[0]
		});
	}
	return {
		tags: unique(tags),
		source,
		pids
	};
}
function makeId(prefix) {
	return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
function evidenceShell(partial) {
	return {
		id: partial.id ?? makeId("ev"),
		timestamp: Date.now(),
		supports: [],
		contradicts: [],
		neutralTo: [],
		...partial
	};
}
//#endregion
export { mulberry32 as C, unique as D, tagsFromPids as E, makeId as S, parsePidPaste as T, formatHours as _, TAG_WEIGHTS as a, interpretObservation as b, approach as c, detectFamily as d, evidenceShell as f, extractTags as g, extractSymptoms as h, QUESTIONS as i, clamp as l, extractSafety as m, DTC_KB as n, TESTS as o, extractConditions as p, FAULTS as r, TRUE_CAUSE_MAP as s, DTC_CODE_WEIGHTS as t, cn as u, formatMoney as v, parseDtcCodes as w, lerp as x, formatPid as y };
