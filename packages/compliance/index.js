export function createPrivacyExport(runtime, matterId) {
  const matter = runtime.getMatter(matterId);
  if (!matter) {
    const error = new Error(`Sak ${matterId} ble ikke funnet.`);
    error.status = 404;
    throw error;
  }

  return {
    generatedAt: new Date().toISOString(),
    matterId,
    dataCategories: [
      "saksmetadata",
      "dokumentmetadata",
      "kildehenvisninger",
      "fakta",
      "bevis",
      "utkast",
      "verifisering",
      "review",
      "eksportmetadata",
      "audit"
    ],
    matter
  };
}

export function assessRetention(config, matterId) {
  const retention = config.retention;
  return {
    matterId,
    retentionDays: retention.defaultRetentionDays,
    legalHold: retention.legalHold,
    deletionAllowed: !retention.legalHold,
    deletionRequiresAdmin: retention.deletionRequiresAdmin,
    policy: retention.legalHold
      ? "Saken er under legal hold og kan ikke slettes."
      : `Standard retention er ${retention.defaultRetentionDays} dager.`
  };
}

export function createDeletionPlan(config, matterId, role) {
  const retention = assessRetention(config, matterId);
  const blockers = [];
  if (retention.legalHold) blockers.push("legal_hold");
  if (retention.deletionRequiresAdmin && role !== "admin") blockers.push("admin_required");

  return {
    matterId,
    allowed: blockers.length === 0,
    blockers,
    requiredSteps: blockers.length === 0
      ? ["eksporter auditpakke", "bekreft retention-policy", "soft-delete sak", "registrer audit-hendelse"]
      : ["løse blokkeringer før sletting"],
    retention
  };
}
