# Data Model

## Storage strategy
- Primary DB: relational database for matters, documents, facts, evidence, drafts, verification, review, export and audit metadata.
- Secondary stores: search/vector index may be added after the first vertical slice.
- Cache: optional read-through cache for matter summaries and status bundles.
- File/blob storage: original documents, normalized text, generated draft artifacts, PDFs, Word exports and audit package files.

## Data retention notes
- What is stored? Matter metadata, document metadata, source references, facts, evidence, draft versions, verification results, review decisions, export metadata and audit events.
- For how long? Default retention follows firm/client policy and legal hold requirements; beta defaults should preserve all audit-critical artifacts until explicit deletion policy is approved.
- Why? Legal defensibility requires proof of source basis, review state, output version and export history.

## Minimum tables
- matters
- documents
- document_versions
- source_refs
- facts
- evidence
- drafts
- draft_versions
- verification_results
- review_decisions
- export_packages
- audit_events
- ai_jobs
