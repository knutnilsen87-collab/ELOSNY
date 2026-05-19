# Business Rules

| Rule ID | Rule | Owner | Notes |
|---|---|---|---|
| BR-001 | A draft cannot be created from zero reviewed/source-bound facts. | Product/Legal | Prevents unsupported AI drafting. |
| BR-002 | Verification must fail when a draft has no source references. | Product/Legal | Export gate dependency. |
| BR-003 | Verification must fail when unsupported claims remain. | Product/Legal | Critical safety invariant. |
| BR-004 | Verification must fail when unresolved contradictions exist. | Product/Legal | Critical safety invariant. |
| BR-005 | Human approval requires a verified draft. | Legal reviewer | Implemented as review gate. |
| BR-006 | Export requires verified draft and approved review decision. | Legal reviewer | Covered by automated test. |
| BR-007 | Approval must be bound to draft version and verification result. | Legal reviewer | Required for auditability. |
| BR-008 | Material workflow actions must write audit events. | Operations/Security | Applies to matter, document, fact, draft, verification, review and export. |
| BR-009 | Legal Status Bundle must show missing items, risks and next safe action. | Product | Required for every critical state. |
| BR-010 | Provider configuration alone is not proof of readiness; critical providers need probe and verify behavior. | Engineering | See provider probe/verify rule. |
