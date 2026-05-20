import assert from "node:assert/strict";
import { test } from "node:test";
import { createEvidaRuntime } from "../packages/domain/index.js";
import { createAdminConfig } from "../packages/config/index.js";
import { createObservability } from "../packages/observability/index.js";
import { createPrivacyExport, assessRetention, createDeletionPlan } from "../packages/compliance/index.js";
import { runIntegrationChecks } from "../packages/integrations/index.js";
import { evaluateReadiness } from "../packages/readiness/index.js";

test("admin-konfigurasjon validerer produksjonsgater", () => {
  const config = createAdminConfig();

  assert.equal(config.get().auth.provider, "local-header");
  assert.throws(
    () => config.update({ launch: { productionApproved: true } }),
    /Konfigurasjonen er ugyldig/
  );

  const updated = config.update({
    auth: { provider: "oidc", requireAuthenticatedClaims: true },
    launch: { productionApproved: true, supportOwner: "Evida Support", incidentChannel: "#evida-incident" },
    providers: { ocr: "external-ocr", ai: "external-ai", storage: "external-blob", export: "external-renderer" }
  });

  assert.equal(updated.launch.productionApproved, true);
});

test("integrasjonsprober skiller lokal simulering fra produksjonsprovider", () => {
  const localConfig = createAdminConfig().get();
  const localChecks = runIntegrationChecks(localConfig);
  assert.equal(localChecks.status, "delvis");
  assert.equal(localChecks.blockersForFullProduction.length, 4);

  const prodConfig = createAdminConfig({
    providers: { ocr: "external-ocr", ai: "external-ai", storage: "external-blob", export: "external-renderer" }
  }).get();
  const prodChecks = runIntegrationChecks(prodConfig);
  assert.equal(prodChecks.status, "bestått");
});

test("privacy-export, retention og deletion-plan er kontrollert", () => {
  const runtime = createEvidaRuntime();
  const result = runtime.runDemoWorkflow();
  const config = createAdminConfig();

  const privacyExport = createPrivacyExport(runtime, result.matterId);
  assert.equal(privacyExport.matterId, result.matterId);
  assert.ok(privacyExport.dataCategories.includes("audit"));

  const retention = assessRetention(config.get(), result.matterId);
  assert.equal(retention.deletionAllowed, true);

  const deniedPlan = createDeletionPlan(config.get(), result.matterId, "lawyer");
  assert.equal(deniedPlan.allowed, false);
  assert.ok(deniedPlan.blockers.includes("admin_required"));

  const adminPlan = createDeletionPlan(config.get(), result.matterId, "admin");
  assert.equal(adminPlan.allowed, true);
});

test("observability og readiness gir beta-status med tydelige produksjonsvarsler", () => {
  const runtime = createEvidaRuntime();
  runtime.runDemoWorkflow();
  const config = createAdminConfig().get();
  const observability = createObservability();
  observability.record("test.hendelse", { ok: true });

  const snapshot = observability.snapshot(runtime, config);
  assert.equal(snapshot.status, "frisk");
  assert.equal(snapshot.invariants.auditTrailFinnes, true);

  const integrations = runIntegrationChecks(config);
  const readiness = evaluateReadiness({ config, integrations, observability: snapshot });
  assert.equal(readiness.status, "klar_for_kontrollert_beta");
  assert.equal(readiness.betaReady, true);
  assert.equal(readiness.productionReady, false);
  assert.ok(readiness.warnings.length >= 1);
});
