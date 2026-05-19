# Functional Specification

## Core capabilities
- Matter management with current Legal Status Bundle.
- Document import, processing state and exact source references.
- Fact and evidence review with confidence, status and audit events.
- Source-grounded drafting with version metadata.
- Verification checks that block unsafe export.
- Human review and approval bound to draft version and verification result.
- Export package generation with audit summary.

## Functional requirements

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| FR-001 | User can create/open a matter and see status, risk, missing items and next safe action. | P0 | Implemented in starter runtime/UI. |
| FR-002 | User can import a document into a matter and preserve an immutable document version. | P0 | Implemented in domain service. |
| FR-003 | System can process a document into source-bound fact/evidence candidates. | P0 | Implemented as local deterministic worker simulation. |
| FR-004 | User can approve, reject or dispute an extracted fact. | P0 | Implemented in domain service. |
| FR-005 | User can create a draft only from reviewed/source-bound facts. | P0 | Implemented as gate. |
| FR-006 | Verification checks sources, unsupported claims, contradictions and draft version. | P0 | Implemented as domain verifier. |
| FR-007 | Human review requires verified draft and writes a version-bound decision. | P0 | Implemented as gate. |
| FR-008 | Export fails closed unless verification and review gates pass. | P0 | Covered by automated test. |
| FR-009 | Material commands write audit events. | P0 | Implemented in domain service. |
| FR-010 | Local health, test and smoke commands exist. | P0 | Implemented in starter repo. |

## States and transitions

```text
matter active
-> document uploaded
-> document reviewed / fact unreviewed
-> fact reviewed
-> draft created
-> verification verified or blocked
-> review approved or rejected
-> export exported or blocked
```

Unsafe transitions fail closed:

- draft creation without reviewed facts
- review before verified draft
- export before verified and approved draft
