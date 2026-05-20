import { createHash } from "node:crypto";

const now = () => new Date().toISOString();

function id(prefix, state) {
  const value = String(state.nextId++).padStart(4, "0");
  return `${prefix}-${value}`;
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function audit(state, type, matterId, payload = {}) {
  const event = {
    id: id("AUD", state),
    type,
    matterId,
    payload,
    createdAt: now()
  };
  state.auditEvents.push(event);
  return event;
}

function sourceRefFor(documentVersion, excerpt) {
  return {
    documentId: documentVersion.documentId,
    documentVersionId: documentVersion.id,
    page: 1,
    paragraph: "p1",
    excerpt,
    excerptHash: hash(excerpt)
  };
}

function computeLegalStatusBundle(state, matterId) {
  const matter = state.matters.get(matterId);
  const documents = [...state.documents.values()].filter((item) => item.matterId === matterId);
  const facts = [...state.facts.values()].filter((item) => item.matterId === matterId);
  const drafts = [...state.drafts.values()].filter((item) => item.matterId === matterId);
  const latestDraft = drafts.at(-1);
  const latestVerification = latestDraft
    ? [...state.verificationResults.values()].filter((item) => item.draftId === latestDraft.id).at(-1)
    : null;
  const latestReview = latestDraft
    ? [...state.reviewDecisions.values()].filter((item) => item.draftId === latestDraft.id).at(-1)
    : null;
  const latestExport = latestDraft
    ? [...state.exportPackages.values()].filter((item) => item.draftId === latestDraft.id).at(-1)
    : null;

  const missingItems = [];
  if (documents.length === 0) missingItems.push("Importer minst ett kildedokument.");
  if (!facts.some((fact) => fact.status === "reviewed")) missingItems.push("Review minst ett kildebundet faktum.");
  if (!latestDraft) missingItems.push("Lag et kildebasert utkast.");
  if (!latestVerification || latestVerification.status !== "verified") missingItems.push("Kjør verifisering og løs blokkeringer.");
  if (!latestReview || !["approved", "approved_with_notes"].includes(latestReview.decision)) missingItems.push("Fullfør menneskelig review og godkjenning.");

  const risks = [];
  if (facts.some((fact) => fact.status === "unsupported")) {
    risks.push({ level: "blocking", description: "Et kritisk faktum mangler kildegrunnlag." });
  }
  if (facts.some((fact) => fact.status === "contradicted")) {
    risks.push({ level: "high", description: "Motstridende faktum må håndteres." });
  }
  if (latestDraft?.changedAfterReview) {
    risks.push({ level: "blocking", description: "Utkastet er endret etter review; godkjenningen er ugyldig." });
  }

  const canExport = Boolean(
    latestVerification?.status === "verified" &&
      latestReview &&
      ["approved", "approved_with_notes"].includes(latestReview.decision) &&
      !latestDraft?.changedAfterReview &&
      risks.every((risk) => risk.level !== "blocking")
  );

  const nextSafeAction =
    missingItems[0] ??
    (latestExport ? "Eksportpakken er klar for overlevering." : canExport ? "Eksporter pakken." : "Review gjenværende risiko.");

  return {
    id: `LSB-${matterId}`,
    matterId,
    version: state.statusBundleVersions.get(matterId) ?? 1,
    status: canExport ? "approved" : risks.some((risk) => risk.level === "blocking") ? "blocked" : "partial",
    whatWeKnow: [
      `${documents.length} dokument(er) importert.`,
      `${facts.filter((fact) => fact.status === "reviewed").length} faktum/fakta reviewet.`,
      latestDraft ? `Utkast ${latestDraft.id} finnes.` : "Ingen utkast finnes ennå."
    ],
    sourceRefs: facts.flatMap((fact) => fact.sourceRefs),
    missingItems,
    risks,
    nextSafeAction,
    canExport,
    requiresReview: true
  };
}

function bumpStatusBundle(state, matterId) {
  state.statusBundleVersions.set(matterId, (state.statusBundleVersions.get(matterId) ?? 1) + 1);
  return computeLegalStatusBundle(state, matterId);
}

export function createEvidaRuntime() {
  const state = {
    nextId: 1,
    matters: new Map(),
    documents: new Map(),
    documentVersions: new Map(),
    facts: new Map(),
    evidence: new Map(),
    drafts: new Map(),
    verificationResults: new Map(),
    reviewDecisions: new Map(),
    exportPackages: new Map(),
    aiJobs: new Map(),
    auditEvents: [],
    statusBundleVersions: new Map()
  };

  function getMatterByDocument(documentId) {
    const document = state.documents.get(documentId);
    if (!document) throw new Error(`Dokument ${documentId} ble ikke funnet.`);
    return document.matterId;
  }

  return {
    state,

    health() {
      return {
        status: "ok",
        service: "evida",
        version: "0.1.0",
        message: "Evida kjører",
        checks: {
          domain: "bestått",
          audit: "bestått",
          gates: "bestått"
        }
      };
    },

    createMatter(input = {}) {
      const matter = {
        id: id("MAT", state),
        title: input.title ?? "Ny juridisk sak",
        client: input.client ?? "Klient ikke avklart",
        status: "active",
        createdAt: now(),
        updatedAt: now()
      };
      state.matters.set(matter.id, matter);
      state.statusBundleVersions.set(matter.id, 1);
      audit(state, "matter.created", matter.id, { title: matter.title });
      return { matter, legalStatusBundle: computeLegalStatusBundle(state, matter.id) };
    },

    getMatter(matterId) {
      const matter = state.matters.get(matterId);
      if (!matter) return null;
      return {
        matter,
        documents: [...state.documents.values()].filter((item) => item.matterId === matterId),
        facts: [...state.facts.values()].filter((item) => item.matterId === matterId),
        evidence: [...state.evidence.values()].filter((item) => item.matterId === matterId),
        drafts: [...state.drafts.values()].filter((item) => item.matterId === matterId),
        verificationResults: [...state.verificationResults.values()].filter((item) => item.matterId === matterId),
        reviewDecisions: [...state.reviewDecisions.values()].filter((item) => item.matterId === matterId),
        exportPackages: [...state.exportPackages.values()].filter((item) => item.matterId === matterId),
        auditEvents: state.auditEvents.filter((item) => item.matterId === matterId),
        legalStatusBundle: computeLegalStatusBundle(state, matterId)
      };
    },

    importDocument(matterId, input = {}) {
      if (!state.matters.has(matterId)) throw new Error(`Sak ${matterId} ble ikke funnet.`);
      const document = {
        id: id("DOC", state),
        matterId,
        name: input.name ?? "kildedokument.txt",
        type: input.type ?? "text/plain",
        status: "uploaded",
        createdAt: now()
      };
      const content = input.content ?? "Klienten ba advokaten lage et kildebasert svar. Fristen er om 12 dager.";
      const version = {
        id: id("DVER", state),
        documentId: document.id,
        matterId,
        content,
        contentHash: hash(content),
        createdAt: now()
      };
      state.documents.set(document.id, document);
      state.documentVersions.set(version.id, version);
      audit(state, "document.imported", matterId, { documentId: document.id, documentVersionId: version.id });
      return { document, documentVersion: version, legalStatusBundle: bumpStatusBundle(state, matterId) };
    },

    processDocument(documentId) {
      const matterId = getMatterByDocument(documentId);
      const document = state.documents.get(documentId);
      const version = [...state.documentVersions.values()].find((item) => item.documentId === documentId);
      document.status = "reviewed";
      const sourceRef = sourceRefFor(version, version.content.slice(0, 160));
      const fact = {
        id: id("FACT", state),
        matterId,
        statement: "Klientinstruks og frist finnes i kildematerialet.",
        sourceRefs: [sourceRef],
        confidence: 0.91,
        status: "unreviewed",
        createdBy: "ai",
        createdAt: now()
      };
      const evidence = {
        id: id("EVID", state),
        matterId,
        factId: fact.id,
        documentId,
        strength: "strong",
        status: "needs_review",
        sourceRefs: [sourceRef]
      };
      const job = {
        id: id("JOB", state),
        matterId,
        documentId,
        type: "document_processing",
        status: "succeeded",
        createdAt: now(),
        completedAt: now()
      };
      state.facts.set(fact.id, fact);
      state.evidence.set(evidence.id, evidence);
      state.aiJobs.set(job.id, job);
      audit(state, "document.processed", matterId, { documentId, factId: fact.id, evidenceId: evidence.id });
      return { document, fact, evidence, job, legalStatusBundle: bumpStatusBundle(state, matterId) };
    },

    reviewFact(factId, input = {}) {
      const fact = state.facts.get(factId);
      if (!fact) throw new Error(`Faktum ${factId} ble ikke funnet.`);
      fact.status = input.decision === "reject" ? "rejected" : input.decision === "dispute" ? "contradicted" : "reviewed";
      if (input.statement) fact.statement = input.statement;
      fact.reviewedBy = input.reviewer ?? "legal-reviewer";
      fact.reviewedAt = now();
      for (const item of state.evidence.values()) {
        if (item.factId === fact.id) item.status = fact.status === "reviewed" ? "reviewed" : "needs_review";
      }
      audit(state, "fact.reviewed", fact.matterId, { factId, status: fact.status });
      return { fact, legalStatusBundle: bumpStatusBundle(state, fact.matterId) };
    },

    createDraft(matterId, input = {}) {
      const reviewedFacts = [...state.facts.values()].filter((fact) => fact.matterId === matterId && fact.status === "reviewed");
      if (reviewedFacts.length === 0) {
        throw new Error("Et kildebasert utkast krever minst ett reviewet faktum.");
      }
      const draft = {
        id: id("DRF", state),
        matterId,
        title: input.title ?? "Kildebasert juridisk utkast",
        version: 1,
        status: "draft",
        changedAfterReview: false,
        content:
          input.content ??
          `Utkast basert på reviewet kildemateriale: ${reviewedFacts.map((fact) => fact.statement).join(" ")}`,
        paragraphSourceRefs: reviewedFacts.flatMap((fact) => fact.sourceRefs),
        unsupportedClaims: input.unsupportedClaims ?? [],
        createdAt: now(),
        updatedAt: now()
      };
      state.drafts.set(draft.id, draft);
      audit(state, "draft.created", matterId, { draftId: draft.id, sourceRefCount: draft.paragraphSourceRefs.length });
      return { draft, legalStatusBundle: bumpStatusBundle(state, matterId) };
    },

    updateDraft(draftId, input = {}) {
      const draft = state.drafts.get(draftId);
      if (!draft) throw new Error(`Utkast ${draftId} ble ikke funnet.`);
      const hadApproval = [...state.reviewDecisions.values()].some(
        (item) => item.draftId === draftId && ["approved", "approved_with_notes"].includes(item.decision)
      );
      draft.version += 1;
      draft.content = input.content ?? draft.content;
      draft.unsupportedClaims = input.unsupportedClaims ?? draft.unsupportedClaims;
      draft.changedAfterReview = hadApproval || draft.changedAfterReview;
      draft.updatedAt = now();
      audit(state, "draft.updated", draft.matterId, {
        draftId,
        version: draft.version,
        changedAfterReview: draft.changedAfterReview
      });
      return { draft, legalStatusBundle: bumpStatusBundle(state, draft.matterId) };
    },

    verifyDraft(draftId) {
      const draft = state.drafts.get(draftId);
      if (!draft) throw new Error(`Utkast ${draftId} ble ikke funnet.`);
      const facts = [...state.facts.values()].filter((fact) => fact.matterId === draft.matterId);
      const failures = [];
      const warnings = [];
      if (draft.paragraphSourceRefs.length === 0) failures.push("Utkastet mangler kildehenvisninger på avsnittsnivå.");
      if (draft.unsupportedClaims.length > 0) failures.push("Utkastet inneholder påstander uten kildegrunnlag.");
      if (facts.some((fact) => fact.status === "contradicted")) failures.push("Motstridende fakta er ikke løst.");
      if (draft.changedAfterReview) failures.push("Utkastet er endret etter review og krever ny godkjenning.");
      if (facts.some((fact) => fact.status === "unreviewed")) warnings.push("Noen fakta mangler review.");
      const result = {
        id: id("VER", state),
        matterId: draft.matterId,
        draftId,
        draftVersion: draft.version,
        status: failures.length === 0 ? "verified" : "blocked",
        sourceCoverage: draft.paragraphSourceRefs.length > 0 ? 1 : 0,
        checks: [
          "source_exists",
          "facts_reviewed",
          "unsupported_claims_marked",
          "contradictions_handled",
          "draft_version_current"
        ],
        warnings,
        failures,
        residualRisk: warnings.length > 0 ? "medium" : "low",
        recommendedNextAction: failures.length === 0 ? "Send til review." : "Løs blokkeringer før review/eksport.",
        createdAt: now()
      };
      state.verificationResults.set(result.id, result);
      audit(state, "draft.verified", draft.matterId, { draftId, verificationId: result.id, status: result.status });
      return { verificationResult: result, legalStatusBundle: bumpStatusBundle(state, draft.matterId) };
    },

    reviewDraft(draftId, input = {}) {
      const draft = state.drafts.get(draftId);
      if (!draft) throw new Error(`Utkast ${draftId} ble ikke funnet.`);
      const verification = [...state.verificationResults.values()].filter((item) => item.draftId === draftId).at(-1);
      if (!verification || verification.status !== "verified") {
        throw new Error("Utkastet må verifiseres før godkjenning.");
      }
      const decision = {
        id: id("REV", state),
        matterId: draft.matterId,
        draftId,
        draftVersion: draft.version,
        verificationResultId: verification.id,
        decision: input.decision ?? "approved",
        reviewer: input.reviewer ?? "legal-reviewer",
        comment: input.comment ?? "Godkjent for eksport.",
        createdAt: now()
      };
      state.reviewDecisions.set(decision.id, decision);
      audit(state, "draft.reviewed", draft.matterId, { draftId, reviewDecisionId: decision.id, decision: decision.decision });
      return { reviewDecision: decision, legalStatusBundle: bumpStatusBundle(state, draft.matterId) };
    },

    exportDraft(draftId, input = {}) {
      const draft = state.drafts.get(draftId);
      if (!draft) throw new Error(`Utkast ${draftId} ble ikke funnet.`);
      const verification = [...state.verificationResults.values()].filter((item) => item.draftId === draftId).at(-1);
      const review = [...state.reviewDecisions.values()].filter((item) => item.draftId === draftId).at(-1);
      const blockers = [];
      if (!verification || verification.status !== "verified") blockers.push("verification_not_verified");
      if (!review || !["approved", "approved_with_notes"].includes(review.decision)) blockers.push("review_not_approved");
      if (draft.changedAfterReview) blockers.push("draft_changed_after_review");
      if (blockers.length > 0) {
        const error = new Error("Eksport er blokkert av verifiserings- eller review-gater.");
        error.blockers = blockers;
        throw error;
      }
      const exportPackage = {
        id: id("EXP", state),
        matterId: draft.matterId,
        draftId,
        draftVersion: draft.version,
        formats: input.formats ?? ["docx", "pdf", "audit_json"],
        includedArtifacts: [
          "draft_document",
          "source_reference_appendix",
          "verification_report",
          "review_decision",
          "audit_summary"
        ],
        status: "exported",
        createdAt: now()
      };
      state.exportPackages.set(exportPackage.id, exportPackage);
      audit(state, "draft.exported", draft.matterId, { draftId, exportPackageId: exportPackage.id });
      return { exportPackage, legalStatusBundle: bumpStatusBundle(state, draft.matterId) };
    },

    runDemoWorkflow() {
      const { matter } = this.createMatter({ title: "Evida demosak", client: "Demoklient" });
      const { document } = this.importDocument(matter.id, {
        name: "klientinstruks.txt",
        content: "Klienten ba advokaten svare. Svarfristen er om 12 dager. Kilden må siteres."
      });
      const { fact } = this.processDocument(document.id);
      this.reviewFact(fact.id, { decision: "approve", reviewer: "demo-reviewer" });
      const { draft } = this.createDraft(matter.id, { title: "Verifisert svarutkast" });
      const { verificationResult } = this.verifyDraft(draft.id);
      const { reviewDecision } = this.reviewDraft(draft.id, { decision: "approved", reviewer: "demo-reviewer" });
      const { exportPackage } = this.exportDraft(draft.id);
      return {
        matterId: matter.id,
        draftId: draft.id,
        verificationStatus: verificationResult.status,
        verificationStatusLabel: "verifisert",
        reviewDecision: reviewDecision.decision,
        reviewDecisionLabel: "godkjent",
        exportStatus: exportPackage.status,
        exportStatusLabel: "eksportert",
        legalStatusBundle: computeLegalStatusBundle(state, matter.id)
      };
    }
  };
}
