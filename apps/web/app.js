const runButton = document.querySelector("#runDemo");
const workflowState = document.querySelector("#workflowState");
const workflowText = document.querySelector("#workflowText");
const verificationState = document.querySelector("#verificationState");
const exportState = document.querySelector("#exportState");
const bundleStatus = document.querySelector("#bundleStatus");
const nextAction = document.querySelector("#nextAction");
const canExport = document.querySelector("#canExport");
const bundleJson = document.querySelector("#bundleJson");

function render(result) {
  workflowState.textContent = `Matter ${result.matterId}`;
  workflowText.textContent = `Draft ${result.draftId} completed the source-bound workflow.`;
  verificationState.textContent = result.verificationStatus;
  exportState.textContent = result.exportStatus;
  bundleStatus.textContent = result.legalStatusBundle.status;
  nextAction.textContent = result.legalStatusBundle.nextSafeAction;
  canExport.textContent = String(result.legalStatusBundle.canExport);
  bundleJson.textContent = JSON.stringify(result.legalStatusBundle, null, 2);
}

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  runButton.textContent = "Running...";
  const response = await fetch("/api/workflow/demo-run", { method: "POST" });
  const result = await response.json();
  render(result);
  runButton.textContent = "Run verified workflow";
  runButton.disabled = false;
});
