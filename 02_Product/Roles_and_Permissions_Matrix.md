# Roles and Permissions Matrix

| Role | Can view | Can create | Can edit | Can delete | Can administer |
|---|---|---|---|---|---|
| Admin | All matters, users and settings | Matters, users, policies | All configurable records | Allowed by retention policy | Yes |
| Lawyer | Assigned matters, documents, facts, drafts and exports | Matters, documents, drafts | Facts, evidence, drafts | Draft-only soft delete | No |
| Reviewer | Assigned review queue, sources and verification artifacts | Review decisions | Review comments and decisions | No | No |
| Viewer | Assigned read-only matters and exports | No | No | No | No |
| Worker | Job inputs and required artifacts only | Job outputs | Job status | No | No |

## Permission rules
- Export requires reviewer approval or admin override policy.
- Review decisions require reviewer or admin role.
- Worker access must be least-privilege and scoped to assigned job artifacts.
- Audit events are append-only and cannot be deleted through normal application flows.
