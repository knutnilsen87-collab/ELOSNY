# Product Requirements Document (PRD)

## Product definition
Evida is a desktop-first legal matter platform for transforming documents into source-bound facts, verified drafts, reviewed approvals and audit-ready exports.

## Problem statement
Legal work often depends on fragmented documents, manually tracked evidence, unstructured drafts and review decisions that are hard to tie back to exact sources. AI can accelerate drafting, but without source references, confidence, review state and verification gates it can also increase legal and operational risk.

## JTBD
When I am handling a document-heavy legal matter, I want to understand the matter status, review the source basis, produce a draft, verify it and export it safely, so that I can move faster without losing control of risk, evidence and auditability.

## Users
- Primary: lawyers and legal reviewers.
- Secondary: administrators, compliance stakeholders and support staff.
- Not optimizing for yet: external clients, billing users and firm-wide analytics users.

## MVP scope

### In scope
- Matter Command Center.
- Document import and processing state.
- Source references.
- Fact/Evidence Matrix.
- Sourced drafting.
- Verification checks and Legal Status Bundle.
- Human review and version-bound approval.
- Word/PDF/audit export package.

### Out of scope
- Client portal.
- Billing/time registration.
- External legal system integrations.
- Office add-ins.
- Firm analytics.
- Fully automated legal advice without human review.

## Primary user flows
1. Create or open a matter, inspect status, risk, missing items and next safe action.
2. Import documents, process them, inspect source references and approve/reject extracted facts.
3. Generate a sourced draft, run verification, complete human review and export a safe package.

## Success criteria
- A lawyer can complete the matter-to-export workflow end to end.
- Every material fact or draft claim is source-bound, lawyer-written/reviewed or marked unsupported.
- Export is blocked when required verification or review gates fail.
- Audit events exist for material changes, verification, review and export.

## Release criteria
- All P0 acceptance criteria pass.
- Tests cover domain gates and the end-to-end workflow.
- Local setup, smoke test and status bundle are documented.
- Security baseline, roles and audit expectations are documented.
- Known non-MVP limitations are explicit.

## P0 capabilities

| ID | Capability | Acceptance signal |
|---|---|---|
| P0-001 | Matter Command Center | User can see matter status, risk, missing items and next safe action. |
| P0-002 | Document Workspace | User can import documents, see processing state and inspect source excerpts. |
| P0-003 | Fact/Evidence Matrix | User can review source-bound facts and evidence, including unsupported or contradictory items. |
| P0-004 | Draft Workspace | User can create and edit a draft with paragraph/source metadata. |
| P0-005 | Verification Report | System produces explicit pass/warn/fail checks and blocks unsafe export. |
| P0-006 | Review & Approval | Reviewer decision is bound to matter, draft version and verification result. |
| P0-007 | Export Package | Export includes document output, source appendix, verification result, review decision and audit summary. |

## Product invariants
- No export without passing required verification and review gates.
- No AI-generated fact may be treated as final unless it is source-bound or explicitly marked unsupported.
- Approval must be invalidated when the approved draft changes.
- Every critical workflow writes audit events.
- The Legal Status Bundle must always show current state, risk and next safe action.
