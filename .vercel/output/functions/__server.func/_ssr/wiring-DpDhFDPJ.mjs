//#region node_modules/.nitro/vite/services/ssr/assets/wiring-DpDhFDPJ.js
function N(id, label, kind, x, y, signal, circuit) {
	return {
		id,
		label,
		kind,
		x,
		y,
		signal,
		circuit
	};
}
function ckpDiagram(sensor = "hall") {
	const sig = sensor === "vr" ? "ckp_vr" : "ckp_hall";
	return {
		title: "Crankshaft position circuit",
		nodes: [
			N("batt_p", "B+", "battery", 8, 12, "battery", "power"),
			N("efi_fuse", "EFI 15A", "fuse", 24, 12, "power", "power"),
			N("efi_relay", "EFI relay", "relay", 40, 12, "power", "power"),
			N("ecm_bplus", "ECM B+", "ecu", 62, 12, "power", "power"),
			N("ecm_5v", "ECM 5V ref", "ecu", 78, 28, "ref_5v", "ckp"),
			N("ckp_sensor", "CKP sensor", "sensor", 24, 52, sig, "ckp"),
			N("ckp_connector", "CKP connector", "connector", 42, 52, sig, "ckp"),
			N("ecm_ckp", "ECM CKP pin", "ecu", 78, 52, sig, "ckp"),
			N("ckp_gnd", "CKP shield/gnd", "ground", 24, 74, "ground", "ckp"),
			N("ecm_gnd", "ECM ground", "ground", 78, 74, "ground", "gnd"),
			N("chassis_gnd", "Chassis Gnd", "ground", 8, 88, "ground", "gnd"),
			N("batt_n", "B−", "battery", 8, 28, "ground", "gnd")
		],
		wires: [
			{
				from: "batt_p",
				to: "efi_fuse",
				color: "red"
			},
			{
				from: "efi_fuse",
				to: "efi_relay",
				color: "red"
			},
			{
				from: "efi_relay",
				to: "ecm_bplus",
				color: "wht"
			},
			{
				from: "ecm_5v",
				to: "ckp_connector",
				color: "yel",
				label: "5V"
			},
			{
				from: "ckp_connector",
				to: "ckp_sensor",
				color: "yel"
			},
			{
				from: "ckp_sensor",
				to: "ckp_connector",
				color: "grn"
			},
			{
				from: "ckp_connector",
				to: "ecm_ckp",
				color: "grn",
				label: "SIG"
			},
			{
				from: "ckp_sensor",
				to: "ckp_gnd",
				color: "blk"
			},
			{
				from: "ckp_gnd",
				to: "ecm_gnd",
				color: "brn"
			},
			{
				from: "ecm_gnd",
				to: "chassis_gnd",
				color: "blk"
			},
			{
				from: "batt_n",
				to: "chassis_gnd",
				color: "blk"
			}
		]
	};
}
function intakeDiagram() {
	return {
		title: "MAF / intake air circuit",
		nodes: [
			N("batt_p", "B+", "battery", 8, 14, "battery", "power"),
			N("ig_fuse", "IG 10A", "fuse", 26, 14, "power", "power"),
			N("maf_sensor", "MAF sensor", "sensor", 26, 48, "maf", "maf"),
			N("maf_connector", "MAF connector", "connector", 44, 48, "maf", "maf"),
			N("ecm_maf", "ECM MAF pin", "ecu", 78, 48, "maf", "maf"),
			N("ecm_5v", "5V ref", "ecu", 78, 28, "ref_5v", "maf"),
			N("intake_boot", "Intake boot", "splice", 26, 72, "none", "air"),
			N("throttle", "Throttle body", "sensor", 50, 72, "tps", "air"),
			N("ecm_gnd", "ECM ground", "ground", 78, 86, "ground", "gnd"),
			N("chassis_gnd", "Chassis Gnd", "ground", 8, 86, "ground", "gnd")
		],
		wires: [
			{
				from: "batt_p",
				to: "ig_fuse",
				color: "red"
			},
			{
				from: "ig_fuse",
				to: "maf_sensor",
				color: "red"
			},
			{
				from: "maf_sensor",
				to: "maf_connector",
				color: "yel"
			},
			{
				from: "maf_connector",
				to: "ecm_maf",
				color: "yel",
				label: "VG"
			},
			{
				from: "ecm_5v",
				to: "maf_connector",
				color: "blu"
			},
			{
				from: "intake_boot",
				to: "throttle",
				color: "gry"
			},
			{
				from: "maf_sensor",
				to: "ecm_gnd",
				color: "brn"
			},
			{
				from: "ecm_gnd",
				to: "chassis_gnd",
				color: "blk"
			}
		]
	};
}
function chargingDiagram() {
	return {
		title: "Charging / interior lamp circuit",
		nodes: [
			N("batt_p", "Battery +", "battery", 10, 16, "battery", "power"),
			N("alt_bplus", "Alternator B+", "sensor", 42, 16, "alt_bplus", "charge"),
			N("alt_sense", "ALT S", "sensor", 42, 36, "power", "charge"),
			N("fuse_dome", "DOME 7.5A", "fuse", 70, 16, "power", "dome"),
			N("glove_box_switch", "Glove box switch", "sensor", 70, 48, "power", "dome"),
			N("glove_lamp", "Glove lamp", "splice", 70, 70, "power", "dome"),
			N("bcm", "BCM", "module", 42, 70, "power", "dome"),
			N("chassis_gnd", "Chassis Gnd", "ground", 10, 70, "ground", "gnd"),
			N("batt_n", "Battery −", "battery", 10, 40, "ground", "gnd"),
			N("alt_gnd", "ALT case gnd", "ground", 42, 86, "ground", "gnd")
		],
		wires: [
			{
				from: "batt_p",
				to: "alt_bplus",
				color: "red",
				label: "B+"
			},
			{
				from: "batt_p",
				to: "fuse_dome",
				color: "wht"
			},
			{
				from: "fuse_dome",
				to: "glove_box_switch",
				color: "red"
			},
			{
				from: "glove_box_switch",
				to: "glove_lamp",
				color: "org"
			},
			{
				from: "glove_lamp",
				to: "bcm",
				color: "grn"
			},
			{
				from: "glove_lamp",
				to: "chassis_gnd",
				color: "blk"
			},
			{
				from: "batt_n",
				to: "chassis_gnd",
				color: "blk"
			},
			{
				from: "alt_gnd",
				to: "chassis_gnd",
				color: "blk"
			},
			{
				from: "alt_bplus",
				to: "alt_sense",
				color: "yel"
			}
		]
	};
}
function canDiagram() {
	return {
		title: "HS-CAN gateway",
		nodes: [
			N("ecm", "ECM", "ecu", 18, 24, "can_h", "can"),
			N("gateway", "Gateway", "module", 50, 24, "can_h", "can"),
			N("abs", "ABS", "module", 82, 24, "can_h", "can"),
			N("bcm", "BCM", "module", 18, 62, "can_h", "can"),
			N("ipc", "Combination meter", "module", 50, 62, "can_h", "can"),
			N("audio", "Head unit (AM)", "module", 82, 62, "can_h", "can"),
			N("can_splice_stereo", "Aftermarket splice", "splice", 82, 86, "can_h", "can"),
			N("can_h", "CAN-H test point", "connector", 50, 86, "can_h", "can"),
			N("can_l", "CAN-L test point", "connector", 18, 86, "can_l", "can"),
			N("chassis_gnd", "Chassis Gnd", "ground", 8, 10, "ground", "gnd")
		],
		wires: [
			{
				from: "ecm",
				to: "gateway",
				color: "yel",
				label: "CAN-H"
			},
			{
				from: "gateway",
				to: "abs",
				color: "yel"
			},
			{
				from: "gateway",
				to: "bcm",
				color: "yel"
			},
			{
				from: "gateway",
				to: "ipc",
				color: "yel"
			},
			{
				from: "gateway",
				to: "audio",
				color: "yel"
			},
			{
				from: "audio",
				to: "can_splice_stereo",
				color: "yel"
			},
			{
				from: "can_splice_stereo",
				to: "can_h",
				color: "yel"
			},
			{
				from: "bcm",
				to: "can_l",
				color: "blu",
				label: "CAN-L"
			},
			{
				from: "can_h",
				to: "can_l",
				color: "gry"
			}
		]
	};
}
var COMMON_PARTS = {
	ckp: {
		id: "ckp_sensor",
		name: "Crankshaft position sensor",
		group: "Engine",
		partCost: 168,
		laborHours: .9
	},
	ckp_conn: {
		id: "ckp_connector",
		name: "CKP pigtail / connector",
		group: "Engine",
		partCost: 42,
		laborHours: .6
	},
	cmp: {
		id: "cmp_sensor",
		name: "Camshaft position sensor",
		group: "Engine",
		partCost: 94,
		laborHours: .5
	},
	maf: {
		id: "maf_sensor",
		name: "Mass air flow sensor",
		group: "Fuel",
		partCost: 286,
		laborHours: .3
	},
	boot: {
		id: "intake_boot",
		name: "Intake air hose / boot",
		group: "Fuel",
		partCost: 48,
		laborHours: .5
	},
	pump: {
		id: "fuel_pump",
		name: "Fuel pump assembly",
		group: "Fuel",
		partCost: 482,
		laborHours: 2.1
	},
	relay: {
		id: "efi_relay",
		name: "EFI main relay",
		group: "Electrical",
		partCost: 38,
		laborHours: .3
	},
	coil: {
		id: "ignition_coil_1",
		name: "Ignition coil (each)",
		group: "Ignition",
		partCost: 89,
		laborHours: .4
	},
	plugs: {
		id: "spark_plugs",
		name: "Spark plugs (set)",
		group: "Ignition",
		partCost: 72,
		laborHours: .8
	},
	purge: {
		id: "purge_valve",
		name: "EVAP purge valve",
		group: "Fuel",
		partCost: 76,
		laborHours: .4
	},
	alt: {
		id: "alternator",
		name: "Alternator",
		group: "Electrical",
		partCost: 378,
		laborHours: 1.4
	},
	batt: {
		id: "battery",
		name: "Battery (650 CCA)",
		group: "Electrical",
		partCost: 189,
		laborHours: .3
	},
	glove: {
		id: "glove_box_switch",
		name: "Glove box lamp switch",
		group: "Electrical",
		partCost: 28,
		laborHours: .4
	},
	ecm: {
		id: "ecm",
		name: "Engine control module",
		group: "Network",
		partCost: 980,
		laborHours: .9
	},
	splice: {
		id: "can_splice_stereo",
		name: "CAN splice repair / stereo isolation",
		group: "Network",
		partCost: 0,
		laborHours: 1.2
	},
	head: {
		id: "audio",
		name: "Remove aftermarket head unit",
		group: "Network",
		partCost: 0,
		laborHours: .8
	},
	pcv: {
		id: "pcv_valve",
		name: "PCV valve",
		group: "Engine",
		partCost: 22,
		laborHours: .3
	},
	tb: {
		id: "throttle_body",
		name: "Throttle body",
		group: "Engine",
		partCost: 412,
		laborHours: .8
	},
	o2: {
		id: "o2_upstream",
		name: "A/F sensor B1S1",
		group: "Fuel",
		partCost: 198,
		laborHours: .6
	}
};
var STANDARD_MODULES = [
	{
		id: "ecm",
		name: "Engine Control",
		address: "7E0",
		protocol: "CAN"
	},
	{
		id: "tcm",
		name: "Transmission",
		address: "7E1",
		protocol: "CAN"
	},
	{
		id: "abs",
		name: "ABS / VSC",
		address: "7B0",
		protocol: "CAN"
	},
	{
		id: "bcm",
		name: "Body Control",
		address: "750",
		protocol: "CAN"
	},
	{
		id: "ipc",
		name: "Combination Meter",
		address: "7C0",
		protocol: "CAN"
	},
	{
		id: "srs",
		name: "Airbag",
		address: "780",
		protocol: "CAN"
	}
];
//#endregion
export { ckpDiagram as a, chargingDiagram as i, STANDARD_MODULES as n, intakeDiagram as o, canDiagram as r, COMMON_PARTS as t };
