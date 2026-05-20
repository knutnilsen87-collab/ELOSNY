import { createEvidaRuntime } from "../packages/domain/index.js";

const runtime = createEvidaRuntime();
const result = runtime.runDemoWorkflow();

if (result.verificationStatus !== "verified" || result.exportStatus !== "exported" || !result.legalStatusBundle.canExport) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log("Smoke OK: verifisert review-/eksportflyt fullført.");
