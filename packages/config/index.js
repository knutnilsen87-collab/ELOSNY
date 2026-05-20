const defaultConfig = {
  environment: "local",
  releaseChannel: "intern",
  auth: {
    provider: "local-header",
    requireAuthenticatedClaims: false
  },
  verification: {
    minimumSourceCoverage: 1,
    requireHumanReview: true,
    blockUnsupportedClaims: true,
    blockChangedAfterReview: true
  },
  retention: {
    defaultRetentionDays: 3650,
    legalHold: false,
    deletionRequiresAdmin: true
  },
  providers: {
    ocr: "local-stub",
    ai: "local-stub",
    storage: "local-memory",
    export: "local-renderer"
  },
  launch: {
    betaApproved: true,
    productionApproved: false,
    supportOwner: "TBD",
    incidentChannel: "TBD"
  }
};

function mergeObject(base, patch) {
  const merged = { ...base };
  for (const [key, value] of Object.entries(patch ?? {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && typeof base[key] === "object") {
      merged[key] = mergeObject(base[key], value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

function validateConfig(config) {
  const errors = [];
  if (config.verification.minimumSourceCoverage < 0 || config.verification.minimumSourceCoverage > 1) {
    errors.push("minimumSourceCoverage må være mellom 0 og 1.");
  }
  if (!config.retention.defaultRetentionDays || config.retention.defaultRetentionDays < 1) {
    errors.push("defaultRetentionDays må være minst 1.");
  }
  if (config.launch.productionApproved && config.auth.provider === "local-header") {
    errors.push("Produksjon kan ikke godkjennes med lokal rolle-header som auth-provider.");
  }
  return errors;
}

export function createAdminConfig(initial = {}) {
  let config = mergeObject(defaultConfig, initial);
  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  return {
    get() {
      return structuredClone(config);
    },

    update(patch = {}) {
      const candidate = mergeObject(config, patch);
      const validationErrors = validateConfig(candidate);
      if (validationErrors.length > 0) {
        const error = new Error("Konfigurasjonen er ugyldig.");
        error.validationErrors = validationErrors;
        throw error;
      }
      config = candidate;
      return this.get();
    },

    validate() {
      return {
        status: "bestått",
        errors: validateConfig(config)
      };
    }
  };
}

export { defaultConfig, validateConfig };
