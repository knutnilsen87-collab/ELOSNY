# Evida Monorepo

This repository contains the Evida legal matter workspace and all project documentation.

## Structure

```text
apps/
  server/       Node HTTP API and static app server
  web/          Desktop-first web shell
packages/
  domain/       Matter-to-export workflow rules and gates
  security/     Role permission checks
scripts/        Local smoke and utility scripts
tests/          Automated workflow tests
docs/           Product, design, technical, QA, operations and status docs
```

## Run locally

```powershell
npm install
npm test
npm run smoke
npm start
```

Open `http://localhost:4173`.

## Implemented vertical slice

```text
Matter -> Document -> Fact/Evidence -> Draft -> Verification -> Review -> Export
```

Implemented:

- Node HTTP server with REST endpoints.
- Desktop-first web shell.
- Domain runtime for matter, document, fact/evidence, draft, verification, review and export.
- Fail-closed export gate.
- Role permission checks for API commands.
- Approval invalidation when a draft is edited after review.
- Audit events for material workflow actions.
- Legal Status Bundle computation.
- Automated tests for success and blocked states.

## Documentation

All documentation now lives under `docs/`.

Important starting points:

- `docs/00_START_HERE/README_Start_Here.md`
- `docs/03_Design/UI_UX_Product_Spec.md`
- `docs/05_Delivery/Roadmap_and_Milestones.md`
- `docs/status/status_bundle.json`

## Current production gaps

- Replace in-memory runtime with database-backed repositories.
- Replace local role header with authenticated claims.
- Add real OCR/document parsing provider.
- Add real AI extraction/drafting provider behind contracts.
- Add artifact storage for documents and exports.
- Add structured production logging and telemetry.
