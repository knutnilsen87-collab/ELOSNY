import assert from "node:assert/strict";
import { test } from "node:test";
import { createEvidaRuntime } from "../packages/domain/index.js";

test("full matter-to-export workflow reaches approved export-ready status", () => {
  const runtime = createEvidaRuntime();
  const result = runtime.runDemoWorkflow();

  assert.equal(result.verificationStatus, "verified");
  assert.equal(result.reviewDecision, "approved");
  assert.equal(result.exportStatus, "exported");
  assert.equal(result.legalStatusBundle.status, "approved");
  assert.equal(result.legalStatusBundle.canExport, true);
  assert.equal(result.legalStatusBundle.missingItems.length, 0);
});

test("export fails closed before verification and review", () => {
  const runtime = createEvidaRuntime();
  const { matter } = runtime.createMatter({ title: "Blocked export matter" });
  const { document } = runtime.importDocument(matter.id, { content: "A sourced instruction exists." });
  const { fact } = runtime.processDocument(document.id);
  runtime.reviewFact(fact.id, { decision: "approve" });
  const { draft } = runtime.createDraft(matter.id);

  assert.throws(() => runtime.exportDraft(draft.id), /Export is blocked/);
});

test("verification blocks unsupported claims", () => {
  const runtime = createEvidaRuntime();
  const { matter } = runtime.createMatter({ title: "Unsupported claim matter" });
  const { document } = runtime.importDocument(matter.id, { content: "A sourced instruction exists." });
  const { fact } = runtime.processDocument(document.id);
  runtime.reviewFact(fact.id, { decision: "approve" });
  const { draft } = runtime.createDraft(matter.id, { unsupportedClaims: ["Uncited legal conclusion"] });
  const { verificationResult } = runtime.verifyDraft(draft.id);

  assert.equal(verificationResult.status, "blocked");
  assert.match(verificationResult.failures.join(" "), /unsupported claims/i);
});
