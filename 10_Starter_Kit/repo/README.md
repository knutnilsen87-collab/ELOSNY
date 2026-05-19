# Evida Starter Repo

This repo contains the first tested Evida vertical slice:

```text
Matter -> Document -> Fact/Evidence -> Draft -> Verification -> Review -> Export
```

## Run locally

```powershell
npm install
npm test
npm run smoke
npm start
```

Open `http://localhost:4173`.

## What is implemented

- Node HTTP server with REST endpoints.
- Desktop-first web shell.
- Domain runtime for matter, document, fact/evidence, draft, verification, review and export.
- Fail-closed export gate.
- Audit events for material workflow actions.
- Legal Status Bundle computation.
- Automated tests for success and blocked states.

## Current production gaps

- Replace in-memory runtime with database-backed repositories.
- Add authentication and authorization middleware.
- Add real OCR/document parsing provider.
- Add real AI extraction/drafting provider behind contracts.
- Add artifact storage for documents and exports.
- Add structured production logging and telemetry.
