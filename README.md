# Evida Monorepo

Dette repoet inneholder Evida, en juridisk saksarbeidsflate, samt all prosjektdokumentasjon.

## Struktur

```text
apps/
  server/       Node HTTP-API og statisk appserver
  web/          Desktop-first webflate
packages/
  domain/       Regler og gates for flyten fra sak til eksport
  security/     Rolletilganger
scripts/        Lokale smoke- og hjelpeskript
tests/          Automatiserte flyttester
docs/           Produkt, design, teknisk, QA, drift og status
```

## Kjør lokalt

```powershell
npm install
npm test
npm run smoke
npm start
```

Åpne `http://localhost:4173`.

Eller start alt med:

```powershell
.\start-evida.ps1
```

På Windows kan du også bruke:

```bat
start-evida.bat
```

## Implementert vertikal flyt

```text
Sak -> Dokument -> Fakta/bevis -> Utkast -> Verifisering -> Review -> Eksport
```

Implementert:

- Node HTTP-server med REST-endepunkter.
- Desktop-first webflate.
- Domeneruntime for sak, dokument, fakta/bevis, utkast, verifisering, review og eksport.
- Eksportgate som feiler lukket.
- Rolletilganger for API-kommandoer.
- Godkjenning blir ugyldig hvis utkastet endres etter review.
- Audit-hendelser for viktige handlinger i arbeidsflyten.
- Beregning av juridisk statuspakke.
- Admin-konfigurasjon, observability, integrasjonsprober, privacy-export og readiness-gater.
- Automatiserte tester for suksessflyt og blokkerte tilstander.

## Dokumentasjon

All dokumentasjon ligger under `docs/`.

Viktige startpunkter:

- `docs/00_START_HERE/README_Start_Here.md`
- `docs/03_Design/UI_UX_Product_Spec.md`
- `docs/05_Delivery/Roadmap_and_Milestones.md`
- `docs/status/status_bundle.json`

## Gjenstående produksjonsløft

- Bytt in-memory runtime med database-backed repositories.
- Bytt lokal rolle-header med autentiserte claims.
- Legg til ekte OCR-/dokumentparser-provider.
- Legg til ekte AI-provider for uttrekk og drafting bak provider-kontrakter.
- Legg til artefaktlagring for dokumenter og eksportpakker.
- Legg til strukturert produksjonslogging og telemetry.
