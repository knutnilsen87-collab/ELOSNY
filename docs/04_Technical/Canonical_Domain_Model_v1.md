# Canonical Domain Model v1

## Core entities
- Matter: the legal case workspace and primary aggregate root.
- Document: uploaded legal/source material belonging to a matter.
- DocumentVersion: immutable document version used for source binding.
- SourceRef: pointer to an exact document version, page/paragraph/excerpt hash.
- Fact: structured statement extracted or created inside a matter.
- Evidence: source material supporting or weakening facts/legal issues.
- LegalIssue: issue being analyzed or drafted against.
- Draft: legal output under construction.
- DraftVersion: immutable version used by verification/review/export.
- VerificationResult: saved pass/warn/fail result for a draft and matter state.
- ReviewDecision: human decision bound to draft version and verification result.
- ExportPackage: final generated package and metadata.
- AuditEvent: append-only event for material workflow actions.
- LegalStatusBundle: computed operational truth for matter state, risk and next action.
- AIJob: background/provider task with status, input contract and output artifact.

## Aggregate boundaries
- Matter aggregate: owns matter metadata, LegalStatusBundle and lifecycle state.
- Document aggregate: owns document versions, processing state and source references.
- Evidence aggregate: owns facts, evidence, contradictions and review state.
- Draft aggregate: owns draft versions, source bindings and unsupported claims.
- Review/export aggregate: owns verification results, review decisions and export packages.
- Audit stream: append-only cross-cutting record; no domain command should edit historical events.

## Entity rules
| Entity | Purpose | Source of truth | Lifecycle notes |
|---|---|---|---|
| Matter | Case workspace | Database | Created, active, partial, blocked, ready_for_review, approved, archived |
| DocumentVersion | Immutable source basis | Artifact store + database metadata | New version when source file changes |
| SourceRef | Exact source pointer | Database | Must reference immutable document version |
| Fact | Structured claim | Database | Unreviewed until approved/rejected/edited by human |
| Evidence | Support/weakness for fact | Database | Can be strong, medium, weak, missing, contradictory or excluded |
| DraftVersion | Reviewable output | Database + artifact store | Any edit creates or updates version state and may invalidate approval |
| VerificationResult | Gate evidence | Database | Saved artifact; cannot be overwritten |
| ReviewDecision | Human gate | Database | Bound to draft version, verification result and reviewer |
| ExportPackage | Final package | Artifact store + database metadata | Can only be created when verification/review gates pass |
| AuditEvent | Workflow memory | Append-only database table | Created for material changes and decisions |
