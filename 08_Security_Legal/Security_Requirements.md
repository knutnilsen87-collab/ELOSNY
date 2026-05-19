# Security Requirements

## Baseline
- Least privilege.
- Secrets handling discipline.
- Dependency hygiene.
- Authn/authz correctness.
- Input validation.
- Auditability where needed.

## Project-specific controls
- Matter, document, draft, review and export access must be role-based.
- Review decisions and export packages must be version-bound and audit-logged.
- Original documents and export artifacts must be treated as sensitive legal data.
- Audit events must be append-only.
- External AI/OCR providers must not receive data unless provider terms, retention and confidentiality are approved.
- Secrets must come from environment/secret manager, never source control.
- Export must fail closed when verification, review or source coverage is incomplete.
- Data retention and deletion must respect legal hold and client policy.

## Production hardening requirements
- Add authentication provider before external beta.
- Keep authorization middleware on all non-health API routes and replace the local role header with authenticated claims.
- Add database-backed audit trail before production use.
- Add encryption at rest through managed database/blob storage.
- Add structured logs without leaking document content.
- Add incident response and backup/restore drill before production launch.
