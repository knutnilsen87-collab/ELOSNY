# Production Grade Roadmap Status

Dette dokumentet viser status for fasene etter MVP-grunnmuren.

## Fase 13 - Security foundation

Status: implementert som lokal sikkerhetsgrunnmur.

- Rolletilganger ligger i `packages/security`.
- API-et håndhever roller for admin, operations, privacy, review, drafting og export.
- Lokal `x-evida-role` er fortsatt kun en utviklingsmekanisme.
- Full produksjon krever OIDC/auth-provider og autentiserte claims.

## Fase 14 - Privacy og legal compliance

Status: implementert som testbar compliance-kontrakt.

- Privacy-export ligger i `packages/compliance`.
- Retention-vurdering er implementert.
- Deletion-plan blokkerer sletting ved legal hold og krever admin når policy krever det.
- Full produksjon krever endelig GDPR-/retention-policy og database-backed audit trail.

## Fase 15 - Observability og operations

Status: implementert som lokal observability-kontrakt.

- `packages/observability` samler events, tellere og invariants.
- API-endepunkt: `GET /api/operations/observability`.
- Health endpoint viser norsk runtime-status.
- Full produksjon krever strukturert loggdrain, metrics, tracing og alerting.

## Fase 16 - Admin og configuration

Status: implementert som validert admin-konfigurasjon.

- `packages/config` eier runtime policy.
- API-endepunkter:
  - `GET /api/admin/config`
  - `PATCH /api/admin/config`
- Produksjonsgodkjenning blokkeres hvis auth fortsatt bruker lokal rolle-header.

## Fase 17 - Integrasjoner

Status: implementert som probe/verify-kontrakter.

- `packages/integrations` kjører probe/verify for:
  - OCR/dokumentparser
  - AI-uttrekk og drafting
  - artefaktlagring
  - eksport-rendering
- Lokale providers gir `delvis`, ikke full produksjonsklar status.

## Fase 18 - Quality hardening

Status: implementert med automatiserte gates.

- `npm test` dekker 10 tester.
- `npm run smoke` verifiserer sak-til-eksport-flyten.
- Tester dekker fail-closed export, unsupported claims, approval invalidation, rolleblokker, config, compliance, observability, integrasjoner og readiness.

## Fase 19 - Beta/customer readiness

Status: klar for kontrollert lokal/intern beta.

- Readiness-modulen gir status `klar_for_kontrollert_beta` når beta-gater er oppfylt.
- Produksjonsvarsler synliggjør hva som må lukkes før full produksjon.
- API-endepunkt: `GET /api/operations/readiness`.

## Fase 20 - Production launch og kontinuerlig forbedring

Status: styringsmekanisme implementert, full produksjon ikke aktivert.

- `packages/readiness` beregner `produksjonsklar` bare når:
  - beta er godkjent
  - produksjon er godkjent
  - auth ikke bruker lokal rolle-header
  - integrasjoner er ekte produksjonsproviders
  - support-eier og incident-kanal er satt
  - observability-invariants er oppfylt

## Nåværende konklusjon

Evida er nå implementert som en norsk, testet monorepo-grunnmur med prod-grade kontrollflater.

Status:

```text
Klar for kontrollert beta: ja
Full produksjon: nei, eksterne produksjonsvalg gjenstår
```

Gjenstående før full produksjon:

- OIDC/auth-provider.
- Database-backed repositories.
- Produksjonslagring for dokumenter og eksportpakker.
- Ekte OCR/dokumentparser-provider.
- Ekte AI-provider.
- Loggdrain, metrics, tracing og alerting.
- Endelig support-eier og incident-kanal.
