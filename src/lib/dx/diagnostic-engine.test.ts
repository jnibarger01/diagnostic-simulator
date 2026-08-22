import assert from "node:assert/strict";
import { it } from "vitest";
import { addEvidence, addObservation, createSession } from "./engine";
import { criteriaForFault, evaluateCriteria } from "./criteria";
import { evidenceShell } from "./parse";
import { InMemoryDiagnosticKnowledgeProvider } from "./providers";

it("high likelihood never confirms without required criterion", () => { const s=createSession({vehicle:{make:"Toyota",model:"Camry"},concern:"Toyota stalls instantly while driving"}); const h=s.hypotheses.find((x)=>x.id==="ckp_sync"); assert.ok(h); assert.equal(h.status,"active"); assert.equal(h.criteria.allRequiredConfirmationSatisfied,false); });
it("confirmation and refutation are transparent and criterion-driven", () => { let s=createSession({vehicle:{make:"Toyota",model:"RAV4"},concern:"Toyota stalls"}); s=addEvidence(s,evidenceShell({source:"oscilloscope",type:"measurement",observation:"CKP dropout",reliability:"high",tags:["ckp_wave_loss","confirmed_ckp_sync"]})); const h=s.hypotheses.find((x)=>x.id==="ckp_sync"); assert.ok(h); assert.equal(h.status,"confirmed"); assert.equal(h.criteria.confirmation[0]?.satisfied,true); s=addEvidence(s,evidenceShell({source:"oscilloscope",type:"measurement",observation:"CKP stable",reliability:"high",tags:["ckp_wave_ok"]})); assert.equal(s.hypotheses.find((x)=>x.id==="ckp_sync")?.status,"ruled_out"); });
it("ranking moves with discriminating evidence and next action stays test-oriented", () => { let s=createSession({vehicle:{make:"Toyota",model:"Tundra"},concern:"Toyota stalls"}); const before=s.hypotheses.findIndex((h)=>h.id==="fuel_delivery"); s=addObservation(s,"Fuel pressure collapses during the failure","while driving","pressure"); const after=s.hypotheses.findIndex((h)=>h.id==="fuel_delivery"); assert.ok(after>=0&&(before<0||after<=before)); assert.ok(s.nextAction); });
it("provider normalizes retrieved evidence without network dependence", () => { const p=new InMemoryDiagnosticKnowledgeProvider(); const e=p.normalizeEvidence({source:"technician",type:"inspection",observation:"connector",tags:["wiggle_drop","wiggle_drop"]}); assert.deepEqual(e.tags,["wiggle_drop"]); assert.equal(p.retrieveEvidence({vehicle:{},faultIds:[],query:""}).length,0); });
it("criterion evaluator exposes missing state", () => { const e=evidenceShell({source:"customer",type:"symptom",observation:"stall",reliability:"medium",tags:["stall"]}); const state=evaluateCriteria([e],"ckp_sync"); assert.equal(state.confirmation[0]?.satisfied,false); assert.equal(state.refutation[0]?.satisfied,false); });

it("every fault template has explicit confirmation and refutation criteria", async () => {
  const { FAULTS } = await import("./knowledge");
  for (const fault of FAULTS) {
    const criteria = criteriaForFault(fault.id);
    assert.ok(criteria.confirmation.length > 0, `${fault.id} missing confirmation criteria`);
    assert.ok(criteria.refutation.length > 0, `${fault.id} missing refutation criteria`);
  }
});
