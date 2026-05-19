# Acceptance Criteria

## End-to-end product acceptance
- Given a new matter, when a user imports a document and processes it, then source-bound facts and evidence are created.
- Given a source-bound fact, when a reviewer approves it, then it can be used for drafting.
- Given reviewed facts, when a user creates a draft, then the draft contains source references.
- Given a source-bound draft, when verification runs, then it returns verified only if sources and gates pass.
- Given a verified draft, when a reviewer approves it, then the decision is bound to draft version and verification result.
- Given a verified and approved draft, when export runs, then an export package is produced.
- Given a draft without verification/review, when export runs, then export is blocked.

## Implemented automated criteria
- `npm test` covers end-to-end success.
- `npm test` covers export fail-closed behavior.
- `npm test` covers unsupported claim verification blocking.
- `npm run smoke` proves the local workflow reaches exported state.
