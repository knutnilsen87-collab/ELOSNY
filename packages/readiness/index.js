export function evaluateReadiness({ config, integrations, observability }) {
  const blockers = [];
  const warnings = [];

  if (!config.launch.betaApproved) blockers.push("Beta er ikke godkjent i konfigurasjon.");
  if (integrations.status !== "bestått") warnings.push("Én eller flere kritiske integrasjoner er lokale simuleringer.");
  if (config.auth.provider === "local-header") warnings.push("Auth bruker lokal rolle-header og må erstattes før full produksjon.");
  if (config.launch.supportOwner === "TBD") warnings.push("Support-eier er ikke satt.");
  if (config.launch.incidentChannel === "TBD") warnings.push("Incident-kanal er ikke satt.");
  if (!observability.invariants.auditTrailFinnes) warnings.push("Ingen audit-hendelser er observert ennå.");

  const betaReady = blockers.length === 0;
  const productionReady =
    betaReady &&
    warnings.length === 0 &&
    config.launch.productionApproved &&
    config.auth.provider !== "local-header";

  return {
    status: productionReady ? "produksjonsklar" : betaReady ? "klar_for_kontrollert_beta" : "ikke_klar",
    betaReady,
    productionReady,
    blockers,
    warnings,
    nextAction: productionReady
      ? "Kjør produksjonslansering."
      : betaReady
        ? "Kjør kontrollert beta og lukk produksjonsvarsler."
        : "Løs blokkeringer før beta."
  };
}
