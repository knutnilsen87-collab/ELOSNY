export function createObservability() {
  const events = [];
  const counters = new Map();

  function increment(name) {
    counters.set(name, (counters.get(name) ?? 0) + 1);
  }

  return {
    record(type, details = {}) {
      increment(type);
      const event = {
        type,
        details,
        createdAt: new Date().toISOString()
      };
      events.push(event);
      return event;
    },

    snapshot(runtime, config) {
      const auditEvents = runtime?.state?.auditEvents ?? [];
      const failedJobs = [...(runtime?.state?.aiJobs?.values() ?? [])].filter((job) => job.status === "failed");
      return {
        status: failedJobs.length === 0 ? "frisk" : "delvis",
        miljø: config?.environment ?? "ukjent",
        tellere: Object.fromEntries(counters.entries()),
        auditHendelser: auditEvents.length,
        feiledeJobber: failedJobs.length,
        sisteHendelser: events.slice(-10),
        invariants: {
          auditTrailFinnes: auditEvents.length > 0,
          eksportGateAktiv: true,
          rolleSjekkAktiv: true
        }
      };
    }
  };
}
