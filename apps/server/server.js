import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createEvidaRuntime } from "../../packages/domain/index.js";
import { assertCan, roleFromRequest } from "../../packages/security/index.js";
import { createAdminConfig } from "../../packages/config/index.js";
import { createObservability } from "../../packages/observability/index.js";
import { createPrivacyExport, assessRetention, createDeletionPlan } from "../../packages/compliance/index.js";
import { runIntegrationChecks } from "../../packages/integrations/index.js";
import { evaluateReadiness } from "../../packages/readiness/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const webRoot = join(__dirname, "../web");
const port = Number(process.env.PORT ?? 4173);
const runtime = createEvidaRuntime();
const adminConfig = createAdminConfig();
const observability = createObservability();

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body, null, 2));
}

function sendError(response, status, code, message, blockers = [], recoveryAction = "Kontroller forespørselen og prøv igjen.") {
  sendJson(response, status, {
    error: {
      code,
      message,
      blockers,
      recovery_action: recoveryAction
    }
  });
}

function readinessPayload() {
  const config = adminConfig.get();
  const integrations = runIntegrationChecks(config);
  const snapshot = observability.snapshot(runtime, config);
  return evaluateReadiness({ config, integrations, observability: snapshot });
}

async function handleApi(request, response, url) {
  const role = roleFromRequest(request);
  observability.record("api.request", { method: request.method, path: url.pathname, role });

  if (request.method === "GET" && url.pathname === "/api/health") {
    return sendJson(response, 200, runtime.health());
  }

  if (request.method === "GET" && url.pathname === "/api/admin/config") {
    assertCan(role, "admin:manage");
    return sendJson(response, 200, adminConfig.get());
  }

  if (request.method === "PATCH" && url.pathname === "/api/admin/config") {
    assertCan(role, "admin:manage");
    try {
      const updated = adminConfig.update(await readJson(request));
      observability.record("admin.config_updated", { role });
      return sendJson(response, 200, updated);
    } catch (error) {
      return sendError(response, 400, "invalid_config", error.message, error.validationErrors ?? [], "Korriger konfigurasjonen og prøv igjen.");
    }
  }

  if (request.method === "GET" && url.pathname === "/api/operations/observability") {
    assertCan(role, "operations:view");
    return sendJson(response, 200, observability.snapshot(runtime, adminConfig.get()));
  }

  if (request.method === "GET" && url.pathname === "/api/operations/integrations") {
    assertCan(role, "operations:view");
    return sendJson(response, 200, runIntegrationChecks(adminConfig.get()));
  }

  if (request.method === "GET" && url.pathname === "/api/operations/readiness") {
    assertCan(role, "operations:view");
    return sendJson(response, 200, readinessPayload());
  }

  if (request.method === "POST" && url.pathname === "/api/workflow/demo-run") {
    const result = runtime.runDemoWorkflow();
    observability.record("workflow.demo_run", { matterId: result.matterId, exportStatus: result.exportStatus });
    return sendJson(response, 200, result);
  }

  if (request.method === "POST" && url.pathname === "/api/matters") {
    assertCan(role, "matter:create");
    const result = runtime.createMatter(await readJson(request));
    observability.record("matter.created", { matterId: result.matter.id, role });
    return sendJson(response, 201, result);
  }

  const matterMatch = url.pathname.match(/^\/api\/matters\/([^/]+)$/);
  if (request.method === "GET" && matterMatch) {
    assertCan(role, "matter:view");
    const matter = runtime.getMatter(matterMatch[1]);
    if (!matter) return sendError(response, 404, "matter_not_found", "Saken ble ikke funnet.");
    return sendJson(response, 200, matter);
  }

  const documentImportMatch = url.pathname.match(/^\/api\/matters\/([^/]+)\/documents$/);
  if (request.method === "POST" && documentImportMatch) {
    assertCan(role, "document:import");
    const result = runtime.importDocument(documentImportMatch[1], await readJson(request));
    observability.record("document.imported", { matterId: documentImportMatch[1], documentId: result.document.id, role });
    return sendJson(response, 201, result);
  }

  const processMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/process$/);
  if (request.method === "POST" && processMatch) {
    assertCan(role, "document:process");
    return sendJson(response, 200, runtime.processDocument(processMatch[1]));
  }

  const factReviewMatch = url.pathname.match(/^\/api\/facts\/([^/]+)\/review$/);
  if (request.method === "POST" && factReviewMatch) {
    assertCan(role, "fact:review");
    return sendJson(response, 200, runtime.reviewFact(factReviewMatch[1], await readJson(request)));
  }

  const draftCreateMatch = url.pathname.match(/^\/api\/matters\/([^/]+)\/drafts$/);
  if (request.method === "POST" && draftCreateMatch) {
    assertCan(role, "draft:create");
    return sendJson(response, 201, runtime.createDraft(draftCreateMatch[1], await readJson(request)));
  }

  const draftEditMatch = url.pathname.match(/^\/api\/drafts\/([^/]+)$/);
  if (request.method === "PATCH" && draftEditMatch) {
    assertCan(role, "draft:edit");
    return sendJson(response, 200, runtime.updateDraft(draftEditMatch[1], await readJson(request)));
  }

  const draftVerifyMatch = url.pathname.match(/^\/api\/drafts\/([^/]+)\/verify$/);
  if (request.method === "POST" && draftVerifyMatch) {
    assertCan(role, "draft:verify");
    return sendJson(response, 200, runtime.verifyDraft(draftVerifyMatch[1]));
  }

  const draftReviewMatch = url.pathname.match(/^\/api\/drafts\/([^/]+)\/review$/);
  if (request.method === "POST" && draftReviewMatch) {
    assertCan(role, "draft:review");
    return sendJson(response, 200, runtime.reviewDraft(draftReviewMatch[1], await readJson(request)));
  }

  const draftExportMatch = url.pathname.match(/^\/api\/drafts\/([^/]+)\/export$/);
  if (request.method === "POST" && draftExportMatch) {
    assertCan(role, "draft:export");
    try {
      const result = runtime.exportDraft(draftExportMatch[1], await readJson(request));
      observability.record("draft.exported", { draftId: draftExportMatch[1], exportPackageId: result.exportPackage.id, role });
      return sendJson(response, 201, result);
    } catch (error) {
      return sendError(response, 409, "export_blocked", error.message, error.blockers ?? [], "Løs blokkeringer, kjør verifisering/review på nytt og eksporter igjen.");
    }
  }

  const privacyExportMatch = url.pathname.match(/^\/api\/privacy\/matters\/([^/]+)\/export$/);
  if (request.method === "GET" && privacyExportMatch) {
    assertCan(role, "privacy:export");
    return sendJson(response, 200, createPrivacyExport(runtime, privacyExportMatch[1]));
  }

  const retentionMatch = url.pathname.match(/^\/api\/privacy\/matters\/([^/]+)\/retention$/);
  if (request.method === "GET" && retentionMatch) {
    assertCan(role, "matter:view");
    return sendJson(response, 200, assessRetention(adminConfig.get(), retentionMatch[1]));
  }

  const deletionPlanMatch = url.pathname.match(/^\/api\/privacy\/matters\/([^/]+)\/deletion-plan$/);
  if (request.method === "POST" && deletionPlanMatch) {
    assertCan(role, "privacy:delete_plan");
    return sendJson(response, 200, createDeletionPlan(adminConfig.get(), deletionPlanMatch[1], role));
  }

  return sendError(response, 404, "not_found", "API-ruten ble ikke funnet.");
}

async function handleStatic(response, url) {
  const requested = url.pathname === "/" ? "/index.html" : url.pathname;
  const path = join(webRoot, requested);
  const body = await readFile(path);
  response.writeHead(200, { "content-type": contentTypes[extname(path)] ?? "application/octet-stream" });
  response.end(body);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    await handleStatic(response, url);
  } catch (error) {
    if (error.status === 403) {
      sendError(response, 403, "permission_denied", error.message, [], "Bruk en autorisert Evida-rolle for denne kommandoen.");
      return;
    }
    sendError(response, error.status ?? 500, "internal_error", error.message);
  }
});

server.listen(port, () => {
  console.log(`Evida kjører på http://localhost:${port}`);
});
