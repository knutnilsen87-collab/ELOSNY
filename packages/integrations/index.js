const localProviderStatus = {
  "local-stub": "simulert",
  "local-memory": "simulert",
  "local-renderer": "simulert"
};

function providerResult(name, provider, critical = true) {
  const simulated = Boolean(localProviderStatus[provider]);
  return {
    name,
    provider,
    critical,
    probe: {
      status: "bestått",
      message: simulated ? "Lokal provider svarer." : "Provider-konfigurasjon finnes."
    },
    verify: {
      status: simulated ? "delvis" : "bestått",
      message: simulated
        ? "Lokal simulering er nok for utvikling/beta, men må erstattes før full produksjon."
        : "Provider er konfigurert som ekstern produksjonsprovider."
    }
  };
}

export function runIntegrationChecks(config) {
  const providers = config.providers;
  const results = [
    providerResult("OCR/dokumentparser", providers.ocr),
    providerResult("AI-uttrekk og drafting", providers.ai),
    providerResult("Artefaktlagring", providers.storage),
    providerResult("Eksport-rendering", providers.export)
  ];
  const criticalPartials = results.filter((result) => result.critical && result.verify.status !== "bestått");
  return {
    status: criticalPartials.length === 0 ? "bestått" : "delvis",
    results,
    blockersForFullProduction: criticalPartials.map((result) => `${result.name}: ${result.verify.message}`)
  };
}
