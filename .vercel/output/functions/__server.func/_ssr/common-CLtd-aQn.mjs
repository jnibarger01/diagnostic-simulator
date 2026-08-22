import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as cn } from "./parse-BCv98ZRn.mjs";
import { t as LIKELIHOOD_LABEL } from "./dx-store-DrlVr6vQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/common-CLtd-aQn.js
var import_jsx_runtime = require_jsx_runtime();
function vehicleTitle(v) {
	return [
		v.year,
		v.make,
		v.model
	].filter(Boolean).join(" ") || "Vehicle not identified";
}
function vehicleSub(v) {
	return [
		v.engine,
		v.mileage != null ? `${v.mileage.toLocaleString()} mi` : null,
		v.vin ? `VIN ${v.vin}` : null
	].filter(Boolean).join(" · ");
}
function LikelihoodMark({ value, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("font-mono text-micro uppercase tracking-wider", value === "very_high" ? "text-data" : value === "high" ? "text-ok" : value === "moderate" ? "text-warn" : value === "low" ? "text-muted" : "text-subtle", className),
		children: LIKELIHOOD_LABEL[value]
	});
}
//#endregion
export { vehicleSub as n, vehicleTitle as r, LikelihoodMark as t };
