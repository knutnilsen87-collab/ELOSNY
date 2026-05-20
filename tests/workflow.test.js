import assert from "node:assert/strict";
import { test } from "node:test";
import { createEvidaRuntime } from "../packages/domain/index.js";
import { assertCan, can } from "../packages/security/index.js";

test("full sak-til-eksport-flyt når godkjent eksportklar status", () => {
  const runtime = createEvidaRuntime();
  const result = runtime.runDemoWorkflow();

  assert.equal(result.verificationStatus, "verified");
  assert.equal(result.reviewDecision, "approved");
  assert.equal(result.exportStatus, "exported");
  assert.equal(result.legalStatusBundle.status, "approved");
  assert.equal(result.legalStatusBundle.canExport, true);
  assert.equal(result.legalStatusBundle.missingItems.length, 0);
});

test("eksport feiler lukket før verifisering og review", () => {
  const runtime = createEvidaRuntime();
  const { matter } = runtime.createMatter({ title: "Sak med blokkert eksport" });
  const { document } = runtime.importDocument(matter.id, { content: "En kildebasert instruks finnes." });
  const { fact } = runtime.processDocument(document.id);
  runtime.reviewFact(fact.id, { decision: "approve" });
  const { draft } = runtime.createDraft(matter.id);

  assert.throws(() => runtime.exportDraft(draft.id), /Eksport er blokkert/);
});

test("verifisering blokkerer påstander uten kildegrunnlag", () => {
  const runtime = createEvidaRuntime();
  const { matter } = runtime.createMatter({ title: "Sak med påstand uten kilde" });
  const { document } = runtime.importDocument(matter.id, { content: "En kildebasert instruks finnes." });
  const { fact } = runtime.processDocument(document.id);
  runtime.reviewFact(fact.id, { decision: "approve" });
  const { draft } = runtime.createDraft(matter.id, { unsupportedClaims: ["Juridisk konklusjon uten sitat"] });
  const { verificationResult } = runtime.verifyDraft(draft.id);

  assert.equal(verificationResult.status, "blocked");
  assert.match(verificationResult.failures.join(" "), /uten kildegrunnlag/i);
});

test("utkast krever reviewede fakta", () => {
  const runtime = createEvidaRuntime();
  const { matter } = runtime.createMatter({ title: "Sak med utkastgate" });

  assert.throws(() => runtime.createDraft(matter.id), /reviewet faktum/);
});

test("endring av godkjent utkast ugyldiggjør eksportgodkjenning", () => {
  const runtime = createEvidaRuntime();
  const { matter } = runtime.createMatter({ title: "Sak med ugyldiggjort godkjenning" });
  const { document } = runtime.importDocument(matter.id, { content: "En kildebasert instruks finnes." });
  const { fact } = runtime.processDocument(document.id);
  runtime.reviewFact(fact.id, { decision: "approve" });
  const { draft } = runtime.createDraft(matter.id);
  runtime.verifyDraft(draft.id);
  runtime.reviewDraft(draft.id, { decision: "approved" });
  runtime.updateDraft(draft.id, { content: "Endret etter godkjenning." });

  assert.throws(() => runtime.exportDraft(draft.id), /Eksport er blokkert/);
  const { verificationResult } = runtime.verifyDraft(draft.id);
  assert.equal(verificationResult.status, "blocked");
  assert.match(verificationResult.failures.join(" "), /endret etter review/i);
});

test("rolletilganger blokkerer utrygge kommandoer", () => {
  assert.equal(can("viewer", "matter:view"), true);
  assert.equal(can("viewer", "draft:export"), false);
  assert.doesNotThrow(() => assertCan("reviewer", "draft:export"));
  assert.throws(() => assertCan("lawyer", "draft:export"), /kan ikke utføre/);
});
