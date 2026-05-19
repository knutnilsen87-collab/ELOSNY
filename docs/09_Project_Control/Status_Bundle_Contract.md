# Status Bundle Contract

## Purpose

`status_bundle` is the operational truth object for the project.

It must answer three questions at all times:

1. What is the current state?
2. Why is that the current state?
3. What is the safest next action?

This file is mandatory for agent-assisted, AI-assisted, or handoff-heavy development workflows.

## Non-negotiable rules

- No execution without a bounded plan.
- No success without verification.
- No green closure with unresolved ambiguity.
- No clean success if repository health is degraded.
- Every meaningful transition must update the `status_bundle`.
- Assumptions must be marked as assumptions, not facts.
- Verification evidence outranks confidence or narrative.
- The recommended next action and fallback action must always be explicit.
- Repo health must be assessed for engineering work.

## When to update the bundle

Update the bundle at minimum when any of these occur:

| Moment | Required update |
|---|---|
| Intake / task start | Initial facts, assumptions, ambiguity, scope, risk |
| Planning | Bounded plan, validation path, rollback path |
| Before execution | Scope lock, stop conditions, execution contract |
| After execution | Changed surfaces, artifact refs, repo-health impact |
| Verification | Test/lint/typecheck/build results, coverage, residual risk |
| Review / handoff | Closure readiness, blocked reasons, next action |
| Rollback / blocked / failed | Failure reason, rollback state, failure-to-asset note |

## Required fields

Every `status_bundle` must contain these sections:

```json
{
  "bundle_id": "SB-...",
  "bundle_version": 1,
  "domain": "project | product | engineering | operations | security | data | ai_agent",
  "task_id": "TASK-...",
  "run_id": "RUN-...",
  "workflow": "workflow_name_v1",
  "created_at": "ISO-8601",
  "updated_at": "ISO-8601",

  "facts": [],
  "assumptions": [],
  "ambiguity_flags": [],

  "current_state": {
    "lifecycle_state": "created | classified | mapped | planned | gated | executing | verifying | reviewing | succeeded | partial | failed | rolled_back | blocked",
    "status": "not_started | in_progress | blocked | partial | verified | failed",
    "blocked": false,
    "partial": false,
    "terminal_state": false,
    "severity": "low | medium | high | critical"
  },

  "summary": {
    "short_summary": "",
    "technical_summary": "",
    "user_visible_summary": ""
  },

  "progress_tracking": {
    "phase": "",
    "percent": 0,
    "blocker": null
  },

  "scope_lock": {
    "in_scope": [],
    "out_of_scope": [],
    "locked_target_surfaces": [],
    "change_budget": "minimal"
  },

  "locked_decisions": [],

  "causal_bridge": {
    "symptom": "",
    "current_hypothesis": "",
    "root_cause_candidate": "",
    "alternate_hypotheses": [],
    "causal_confidence": 0
  },

  "evidence_layer": {
    "signals": [],
    "artifact_refs": [],
    "changed_surfaces": [],
    "evidence_quality": "low | medium | high",
    "evidence_gaps": []
  },

  "verification_state": {
    "status": "not_started | running | pass | partial_pass | fail | inconclusive",
    "must_check": [],
    "maybe_check": [],
    "defer_if_reversible": [],
    "coverage_status": "none | partial | sufficient",
    "residual_risk": "low | medium | high",
    "false_green_risk": "low | medium | high"
  },

  "verification_layer": {
    "validation_status": null,
    "invariant_status": "not_checked | pass | incomplete | fail",
    "broken_invariants": [],
    "untested_invariants": [],
    "coverage_status": "none | partial | sufficient",
    "residual_risk": "low | medium | high",
    "false_green_risk": "low | medium | high"
  },

  "trust_layer": {
    "confidence_overall": 0,
    "confidence_breakdown": {
      "evidence_confidence": 0,
      "verification_confidence": 0,
      "coverage_confidence": 0,
      "rollback_readiness_confidence": 0
    },
    "risk_score": 0,
    "risk_class": "low | medium | high | critical",
    "approval_recommendation": "auto_allowed | review_recommended | review_required | blocked"
  },

  "action_layer": {
    "chosen_strategy": "",
    "chosen_action": "",
    "recommended_next_action": "",
    "fallback_action": "",
    "stop_conditions": [],
    "rollback_ready": false
  },

  "rollback_path": {
    "available": false,
    "checkpoint_ref": null,
    "rollback_instruction": ""
  },

  "execution_contract": {
    "next_action_type": "design_patch | code_patch | review | replan | verify_only",
    "next_action_target": "",
    "next_action_instruction": "",
    "success_condition_for_next_action": "",
    "verification_for_next_action": ""
  },

  "closure_readiness": {
    "can_claim_success": false,
    "blocked_by": [],
    "closure_candidate": "succeeded | partial | failed | rolled_back | blocked | none",
    "remaining_unknowns": []
  },

  "repo_health": {
    "status": "improved | preserved | degraded | not_applicable",
    "structure_fit": "",
    "ownership_fit": "",
    "duplication_risk": "low | medium | high",
    "boundary_violation_risk": "low | medium | high",
    "temporary_mess_introduced": false,
    "cleanup_performed": [],
    "follow_up_required": []
  },

  "repro_layer": {
    "repro_status": "none | partial | ready",
    "replay_manifest_ref": null,
    "replay_ready": false
  },

  "closure_layer": {
    "closure_decision_ref": null,
    "approved_by_review": false,
    "deny_reasons": [],
    "failure_to_asset_required": false
  }
}
```

## Mandatory closure gates

A task may be marked `succeeded` only when:

- verification passed;
- required checks were actually run;
- critical invariants are not broken or untested;
- ambiguity flags are resolved or explicitly moved to a non-green state;
- residual risk is acceptable;
- repo health is `improved` or `preserved`;
- the next action is no longer required for the claimed outcome.

Use `partial`, `blocked`, `failed`, or `rolled_back` when these conditions are not met.

## Required ambiguity handling

Every ambiguity flag must map to an action.

| Ambiguity | Required action |
|---|---|
| `coverage_insufficient` | Add one targeted test or mark closure as non-green |
| `causality_unproven` | Run one narrow repro, counterfactual, or evidence check |
| `invariant_untested` | Run the invariant check or block success |
| `verification_inconclusive` | Rerun with tighter scope or choose partial/blocked |
| `repo_health_degraded` | Fix now, contain, or explicitly record accepted risk |

After two inconclusive loops, replan or escalate.

## Required repo-health check

Before execution, answer:

1. Is this the correct package, module, and layer?
2. Does it preserve canonical contracts and ownership boundaries?
3. Does it introduce duplication or a parallel abstraction?
4. Is there dead code or obsolete wiring to remove now?
5. Does it increase coupling, dependency sprawl, or boundary confusion?
6. Is a new file actually justified?
7. Is the repository easier or harder for another engineer to understand?

After execution, set repo health to exactly one of:

- `improved`
- `preserved`
- `degraded`
- `not_applicable`

If degraded, do not claim clean success.

## Recommended operating loop

Use this loop for every meaningful task:

```text
action -> validation -> learn -> update status_bundle
```

## Required handoff bundle

Every handoff should include:

- latest `status_bundle`
- current facts
- assumptions
- ambiguity flags
- verification state
- recommended next action
- fallback action
- rollback path if relevant
- repo-health verdict if engineering work occurred
