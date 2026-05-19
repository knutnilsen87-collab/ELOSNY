# API Specification

## API style
REST for synchronous commands/queries, plus event/job records for asynchronous work.

## Core endpoints / commands

| Method | Path / Command | Purpose | Auth |
|---|---|---|---|
| GET | /api/health | Runtime health check | none/local |
| POST | /api/matters | Create matter | user |
| GET | /api/matters/:matterId | Get matter command center data | user |
| POST | /api/matters/:matterId/documents | Import document metadata/content | user |
| POST | /api/documents/:documentId/process | Run document processing job | user |
| POST | /api/facts/:factId/review | Approve, reject or edit a fact | reviewer |
| POST | /api/matters/:matterId/drafts | Create sourced draft | user |
| PATCH | /api/drafts/:draftId | Edit draft and invalidate approval when needed | user |
| POST | /api/drafts/:draftId/verify | Run verification | user |
| POST | /api/drafts/:draftId/review | Submit human review decision | reviewer |
| POST | /api/drafts/:draftId/export | Create export package if gates pass | reviewer |
| POST | /api/workflow/demo-run | Run full demo workflow for verification | local/dev |

## Error shape

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "blockers": [],
    "recovery_action": "string"
  }
}
```

## Contract rules
- Commands return the updated Legal Status Bundle when matter state changes.
- Non-health commands require an authorized role.
- Gate failures return machine-readable blockers.
- Export commands fail closed when verification or review is incomplete.
- All material commands write audit events.
