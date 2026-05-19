# Universal CTO / Developer Project Template

This package is a reusable pre-work, delivery, and handoff template for future projects.
It is designed to work for:
- web apps
- mobile apps
- SaaS products
- desktop software
- plugins
- APIs and backend services
- AI/agent systems
- internal tools
- automation platforms
- data/ML systems

## How this template works

This package has two layers:
1. **Core package** — always relevant in most projects
2. **Optional modules** — activate only when they fit the project

## Recommended usage order

1. Fill `00_START_HERE/Project_Intake_and_Scoring.md`
2. Fill `00_START_HERE/Project_Profile_Card.md`
3. Fill strategy and product docs
4. Fill technical and delivery docs
5. Activate relevant optional modules
6. Archive unused modules instead of deleting them immediately


## Design source of truth for Evida

For Evida-specific UI/UX work, the canonical design specification is `03_Design/UI_UX_Product_Spec.md`.

The visual MVP/Figma flow artifact is `03_Design/03_Evida_MVP_Figma_Flow.svg`.

The older design files in `03_Design/` are retained as navigation pointers only. Do not treat them as competing sources of truth.

## Mandatory operating truth: status_bundle

Every meaningful build, handoff, agent run, or implementation task must maintain a current `status_bundle`.

The canonical contract lives in `09_Project_Control/Status_Bundle_Contract.md`.
The starter JSON template lives in `10_Starter_Kit/repo/docs/status_bundle.template.json`.

Rules:
- no execution without a bounded plan;
- no success without verification;
- no green closure with unresolved ambiguity;
- no clean success if repo health is degraded;
- every meaningful transition updates the bundle.

## Output goal

At the end, the filled package should answer:
- what the project is
- why it exists
- who it serves
- what MVP is
- how it will be built
- how it will be validated
- how it will be shipped and operated
- what remains open
- what “done” means

## Notes

- This is a template, not a final spec.
- Fill only what matters.
- Avoid fake precision. If a decision is unknown, mark it clearly.
- Keep one source of truth per subject.


# Placeholder convention
Use double curly braces for project-specific fields.
Examples:
- {{PROJECT_NAME}}
- {{PROJECT_TYPE}}
- {{PRIMARY_USER}}
- {{CORE_JOB_TO_BE_DONE}}
- {{MVP_DEFINITION}}
- {{PRIMARY_PLATFORM}}
- {{STACK_DECISION}}
- {{OWNER}}
- {{DATE}}
