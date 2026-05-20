import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createEvidaRuntime } from "../../packages/domain/index.js";
import { assertCan, roleFromRequest } from "../../packages/security/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const webRoot = join(__dirname, "../web");
const port = Number(process.env.PORT ?? 4173);
const runtime = createEvidaRuntime();

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

async function handleApi(request, response, url) {
  const role = roleFromRequest(request);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return sendJson(response, 200, runtime.health());
  }

  if (request.method === "POST" && url.pathname === "/api/workflow/demo-run") {
    return sendJson(response, 200, runtime.runDemoWorkflow());
  }

  if (request.method === "POST" && url.pathname === "/api/matters") {
    assertCan(role, "matter:create");
    return sendJson(response, 201, runtime.createMatter(await readJson(request)));
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
    return sendJson(response, 201, runtime.importDocument(documentImportMatch[1], await readJson(request)));
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
      return sendJson(response, 201, runtime.exportDraft(draftExportMatch[1], await readJson(request)));
    } catch (error) {
      return sendError(response, 409, "export_blocked", error.message, error.blockers ?? [], "Løs blokkeringer, kjør verifisering/review på nytt og eksporter igjen.");
    }
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
    sendError(response, 500, "internal_error", error.message);
  }
});

server.listen(port, () => {
  console.log(`Evida kjører på http://localhost:${port}`);
});
