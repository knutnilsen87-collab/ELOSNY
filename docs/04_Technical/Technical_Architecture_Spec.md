# Technical Architecture Spec

## Architecture summary
Evida starts as a modular monolith with a desktop-first web client, server-side domain services, a worker/job layer for document and AI tasks, relational persistence, artifact storage and an append-only audit trail. Provider-specific OCR, AI, export and storage services must sit behind contracts so they can be probed, verified and replaced without changing core legal workflow rules.

## Main runtime parts
- Client/UI: desktop-first matter workspace with seven core MVP screens.
- Backend/API: command/query surface for matters, documents, facts, drafts, verification, review and export.
- Worker/background processing: document ingestion, extraction, drafting, verification and export jobs.
- Data layer: relational core store plus artifact storage for documents and exports.
- Third-party dependencies: OCR/parser provider, AI model provider, document export renderer, auth provider and storage provider.

## Architecture style
MODULAR_MONOLITH

## Data flow
1. User creates a matter and imports documents.
2. Worker processes documents and emits source-bound extraction candidates.
3. User reviews facts/evidence and creates a draft.
4. Verification checks source coverage, review state, contradictions and draft version.
5. Human review writes a version-bound decision.
6. Export creates a package only when gates pass.

## Operational assumptions
- Hosting model: web app plus API/worker deployment.
- Environment model: local, test, staging and production.
- Secrets model: environment-managed secrets, no secrets in source control.
- Scaling model: API scales horizontally; worker concurrency scales by queue depth and provider limits.
