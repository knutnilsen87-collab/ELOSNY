const runButton = document.querySelector("#runDemo");
const workflowState = document.querySelector("#workflowState");
const workflowText = document.querySelector("#workflowText");
const verificationState = document.querySelector("#verificationState");
const exportState = document.querySelector("#exportState");
const readinessState = document.querySelector("#readinessState");
const readinessText = document.querySelector("#readinessText");
const bundleStatus = document.querySelector("#bundleStatus");
const nextAction = document.querySelector("#nextAction");
const canExport = document.querySelector("#canExport");
const bundleJson = document.querySelector("#bundleJson");

const labels = {
  verified: "verifisert",
  approved: "godkjent",
  approved_with_notes: "godkjent med merknad",
  exported: "eksportert",
  blocked: "blokkert",
  partial: "delvis",
  klar_for_kontrollert_beta: "klar for kontrollert beta",
  ikke_klar: "ikke klar",
  produksjonsklar: "produksjonsklar",
  draft: "utkast",
  true: "ja",
  false: "nei"
};

function label(value) {
  return labels[String(value)] ?? String(value);
}

function localizeStatusBundle(bundle) {
  return {
    id: bundle.id,
    sakId: bundle.matterId,
    versjon: bundle.version,
    status: label(bundle.status),
    detViVet: bundle.whatWeKnow,
    kilder: bundle.sourceRefs,
    mangler: bundle.missingItems,
    risiko: bundle.risks?.map((risk) => ({
      nivå: label(risk.level),
      beskrivelse: risk.description
    })),
    nesteTryggeHandling: bundle.nextSafeAction,
    kanEksportere: label(bundle.canExport),
    kreverReview: label(bundle.requiresReview)
  };
}

function render(result) {
  workflowState.textContent = `Sak ${result.matterId}`;
  workflowText.textContent = `Utkast ${result.draftId} fullførte den kildebundne arbeidsflyten.`;
  verificationState.textContent = label(result.verificationStatus);
  exportState.textContent = label(result.exportStatus);
  bundleStatus.textContent = label(result.legalStatusBundle.status);
  nextAction.textContent = result.legalStatusBundle.nextSafeAction;
  canExport.textContent = label(result.legalStatusBundle.canExport);
  bundleJson.textContent = JSON.stringify(localizeStatusBundle(result.legalStatusBundle), null, 2);
}

function renderReadiness(readiness) {
  readinessState.textContent = label(readiness.status);
  readinessText.textContent = readiness.nextAction;
}

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  runButton.textContent = "Kjører...";
  const response = await fetch("/api/workflow/demo-run", { method: "POST" });
  const result = await response.json();
  render(result);
  const readinessResponse = await fetch("/api/operations/readiness", {
    headers: { "x-evida-role": "reviewer" }
  });
  renderReadiness(await readinessResponse.json());
  runButton.textContent = "Kjør verifisert flyt";
  runButton.disabled = false;
});
