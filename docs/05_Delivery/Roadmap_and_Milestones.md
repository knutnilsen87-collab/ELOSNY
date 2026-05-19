# Roadmap and Milestones

## Folder analysis summary

This package is currently a strong pre-build specification package for **Evida**, not yet an implementation repository.

The clearest source of truth is `docs/03_Design/UI_UX_Product_Spec.md`, which defines the MVP as a desktop-first legal workflow:

```text
Matter Command Center
-> Document Workspace
-> Fact/Evidence Matrix
-> Draft Workspace
-> Verification Report
-> Review & Approval
-> Export Package
```

The operational philosophy is also clear: no green status without verification, no AI output without sources/review context, and every meaningful execution step should maintain a `status_bundle`.

The main gaps before build are:

- project profile, executive summary, PRD and product requirements are still mostly placeholders
- technical architecture, API spec, data model and SQL schema are not yet defined
- backlog, dependency map, estimates and milestone gates are skeletal
- security/privacy requirements exist only at baseline level
- starter repo exists only as a placeholder under `repo root`
- no real codebase, package structure, tests, CI or local run path exists yet

## Roadmap principle

Build one verified vertical slice before expanding horizontally.

The first successful product proof should demonstrate:

```text
Create/open matter -> import documents -> extract source-bound facts -> draft with sources -> verify -> review -> export package
```

Everything else should support that path.

## Phase 0 - Scope lock and source-of-truth cleanup

**Goal:** Convert the current template package into a build-ready Evida MVP brief.

**Priority:** P0  
**Suggested duration:** 2-5 working days

### Work

- Fill `docs/00_START_HERE/Project_Profile_Card.md`.
- Fill `docs/01_Strategy/Executive_Summary.md`.
- Fill `docs/02_Product/PRD_Product_Requirements_Document.md`.
- Convert the MVP flow from `docs/03_Design/UI_UX_Product_Spec.md` into product requirements.
- Decide which optional modules are active for MVP.
- Mark all non-MVP modules as later-stage or archived.
- Fill `docs/00_START_HERE/Document_Priority_and_Source_of_Truth.md`.
- Create the first real `status_bundle` from `docs/status/status_bundle.template.json`.

### Exit criteria

- Evida has a one-paragraph MVP definition.
- The 7-screen vertical MVP is confirmed as the primary delivery target.
- Product, design, technical, QA and operational sources of truth are listed.
- Open questions are captured in `docs/09_Project_Control/Open_Questions_Table.md`.
- Non-MVP scope is explicitly deferred.

## Phase 1 - Architecture and domain contract

**Goal:** Define the minimum architecture needed to build safely.

**Priority:** P0  
**Suggested duration:** 3-7 working days

### Work

- Fill `docs/04_Technical/Technical_Architecture_Spec.md`.
- Fill `docs/04_Technical/System_Architecture.md`.
- Fill `docs/04_Technical/Canonical_Domain_Model_v1.md`.
- Fill `docs/04_Technical/Data_Model.md`.
- Replace `docs/04_Technical/SQL_Schema_v1.sql` with an initial schema.
- Expand `docs/04_Technical/API_Specification.md` and `docs/04_Technical/OpenAPI_MVP_Spec.yaml`.
- Define worker/job behavior in `docs/04_Technical/Worker_State_Machine_Spec.md`.
- Define provider contracts for OCR, document parsing, AI extraction/generation, storage and export.

### Recommended MVP architecture

- Frontend: desktop-first web app shell
- Backend: modular monolith API
- Worker layer: async document processing, extraction, drafting, verification and export jobs
- Database: relational primary store
- File storage: document and export artifacts
- AI layer: provider-isolated services with source-bound output contracts
- Audit layer: append-only event log for review, verification and export gates

### Core domain entities

- Matter
- Document
- DocumentVersion
- SourceRef
- Fact
- Evidence
- LegalIssue
- Draft
- DraftVersion
- VerificationResult
- ReviewDecision
- ExportPackage
- AuditEvent
- LegalStatusBundle
- AIJob

### Exit criteria

- The team can explain where each core entity lives and who owns it.
- Every P0 workflow has a domain model path.
- API shape exists for the vertical MVP.
- Worker states and retry/failure handling are defined.
- Export-blocking rules are represented in the architecture.

## Phase 2 - Repo scaffold and engineering baseline

**Goal:** Create the real implementation repo with guardrails before feature work.

**Priority:** P0  
**Suggested duration:** 2-4 working days

### Work

- Replace `repo root` placeholder with a real codebase.
- Initialize version control.
- Add package/app structure.
- Add linting, formatting, type checking and test runner.
- Add local setup documentation in `docs/07_Operations/Local_Setup_Guide.md`.
- Add a health endpoint or health command.
- Add CI baseline.
- Add status bundle location and update workflow.

### Suggested package boundaries

```text
apps/web
apps/worker
packages/ui
packages/design-tokens
packages/domain
packages/documents
packages/facts
packages/drafting
packages/verification
packages/review
packages/export
packages/audit
packages/ai
packages/shared
```

### Exit criteria

- A developer can install, run and test the app locally.
- CI proves lint/typecheck/test baseline.
- The app shell can render an empty Matter Command Center.
- Repo conventions are documented.
- `status_bundle` is part of normal execution.

## Phase 3 - Vertical slice A: Matter and document ingestion

**Goal:** Prove the first half of the core workflow with real persisted data.

**Priority:** P0  
**Suggested duration:** 1-2 weeks

### Work

- Build Matter Command Center shell.
- Create/open matter.
- Import documents.
- Store document metadata and versions.
- Add document list and basic viewer.
- Add import status and failure states.
- Add worker job skeleton for document processing.
- Add audit events for matter creation and document import.

### Exit criteria

- User can create/open a matter.
- User can import documents into that matter.
- Documents are persisted and visible.
- Failed imports are visible and recoverable.
- Legal Status Bundle shows known/missing/risk/next action at a basic level.

## Phase 4 - Vertical slice B: extraction, facts and evidence

**Goal:** Turn documents into source-bound facts and evidence.

**Priority:** P0  
**Suggested duration:** 2-3 weeks

### Work

- Implement document classification and extraction contract.
- Create fact and evidence tables.
- Link facts/evidence to exact source references.
- Add confidence, review state and contradiction fields.
- Build Fact/Evidence Matrix UI.
- Add approve/reject/edit controls for extractions.
- Write audit events for review changes.
- Add tests for source-bound fact creation.

### Exit criteria

- Every generated fact has a source reference or is clearly marked unsupported.
- User can approve, reject or edit extracted facts.
- Evidence can be linked to facts.
- Contradictions and missing sources are visible.
- Draft generation is blocked or marked unsafe when minimum source policy is not met.

## Phase 5 - Vertical slice C: sourced drafting and verification

**Goal:** Generate and verify a legal draft without hiding uncertainty.

**Priority:** P0  
**Suggested duration:** 2-3 weeks

### Work

- Build Draft Workspace.
- Generate draft from reviewed/source-bound facts.
- Store draft versions.
- Mark paragraph source bindings and unsupported claims.
- Implement verification checks:
  - source exists
  - critical facts are reviewed
  - unsupported claims are marked
  - contradictions are handled
  - draft version is current
- Save verification artifacts.
- Update Legal Status Bundle from verification result.

### Exit criteria

- User can generate and edit a source-grounded draft.
- Material claims are source-bound, lawyer-written/reviewed, or marked unsupported.
- Verification produces pass/warn/fail states.
- Failed checks have recovery actions.
- Export remains blocked when critical verification gates fail.

## Phase 6 - Vertical slice D: human review and export package

**Goal:** Complete the MVP workflow with version-bound review and safe export.

**Priority:** P0  
**Suggested duration:** 1-2 weeks

### Work

- Build Review & Approval screen.
- Bind review decisions to draft version, verification result and Legal Status Bundle version.
- Invalidate approval after draft changes.
- Build Export Package screen.
- Export Word/PDF package plus audit appendix.
- Store export artifacts.
- Add export failure/retry handling.

### Exit criteria

- Reviewer can approve, approve with notes, reject, defer or request more evidence.
- Approval is audit-logged and version-bound.
- Export is disabled unless verification/review gates pass.
- Export package includes output, sources, verification report, review decision and audit summary.
- End-to-end MVP flow works from matter creation to export.

## Phase 7 - Hardening, security and operational readiness

**Goal:** Make the MVP safe enough for controlled internal/beta use.

**Priority:** P0/P1  
**Suggested duration:** 1-2 weeks

### Work

- Fill project-specific security and privacy requirements.
- Define roles and permissions for admin, lawyer/reviewer and viewer.
- Add authorization checks to matter/document/draft/review/export actions.
- Add observability minimum: logs, job traces, failure reasons and audit event coverage.
- Add backup/recovery expectations.
- Complete release checklist and release gate profile.
- Run accessibility and dense-table UX QA.

### Exit criteria

- Critical actions are permissioned.
- Sensitive artifacts are access-controlled.
- System has logs for import, extraction, verification, review and export.
- Release checklist has no unresolved P0 blockers.
- Known beta limitations are documented.

## Phase 8 - Beta expansion

**Goal:** Expand beyond the first controlled vertical slice only after the core path is reliable.

**Priority:** P1/P2

### Candidate work

- Client portal
- KYC/AML workflow
- Admin console
- Office add-ins
- Firm analytics
- More document types
- Multi-matter search
- Provider redundancy
- Advanced deadline extraction
- Collaboration and comments

### Exit criteria

- MVP metrics show the core workflow is valuable and reliable.
- Support burden and failure modes are understood.
- Expansion items have measurable acceptance criteria.

## First 10 implementation PRs

1. Repo scaffold, workspace structure and local run path.
2. CI, lint, formatter, typecheck and test baseline.
3. Design tokens and desktop app shell.
4. Core domain models and database migration baseline.
5. Matter creation/opening plus basic Legal Status Bundle.
6. Document import, storage and document list/viewer.
7. Worker/job skeleton with import status and failure handling.
8. Extraction contract, SourceRef model and fact/evidence persistence.
9. Fact/Evidence Matrix with review controls and audit events.
10. Draft, verification, review and export gate skeleton.

## Key risks

- **Over-scope risk:** the design spec is rich enough to tempt a broad build. Keep the first release vertical.
- **AI trust risk:** AI output must never appear final without sources, confidence, review state and uncertainty.
- **Verification risk:** green status must require real checks, not narrative confidence.
- **Data model risk:** source references, versions and audit events need to be first-class from day one.
- **Legal/security risk:** document access, review approval and export artifacts require strict permissions.
- **Operational risk:** async jobs need observable states, retries and failure recovery early.

## Recommended next action

Fill the project profile, PRD, architecture spec and canonical domain model before writing production code.

The first build task should then be:

```text
Create the real repo scaffold and render an empty desktop-first Matter Command Center wired to a placeholder Legal Status Bundle.
```
