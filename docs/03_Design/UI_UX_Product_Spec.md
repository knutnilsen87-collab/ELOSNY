# 03 Design / UI-UX Product Spec

**Produkt:** Evida  
**Dokument:** `docs/03_Design/UI_UX_Product_Spec.md`  
**Versjon:** v0.1  
**Status:** MVP-ready design specification  
**Vertikal MVP:** Matter Command Center → Document Workspace → Fact/Evidence Matrix → Draft → Verification → Review → Export  
**Primærflate:** Desktop-first juridisk arbeidsplattform  
**Sekundærflater:** Web/klientportal, Office add-ins, admin senere  

---

## 0. Executive summary

Evida skal ikke være “Jussys med AI-chat”. Evida skal være en **desktop-first juridisk kontrollflate** hvor advokaten alltid ser:

1. Hva saken gjelder.
2. Hva vi vet.
3. Hva vi bygger det på.
4. Hva som mangler.
5. Hva som er usikkert eller risikabelt.
6. Hva neste trygge handling er.
7. Om et dokument kan sendes, eller må reviewes.

Den vertikale MVP-en skal bevise én ting ekstremt godt:

> Fra dokumenttung sak til kildeverifisert juridisk output med fact/evidence matrix, verification, human review og auditbar eksport.

---

## 1. Product principles

### 1.1 Core UX promise

```text
Open a matter.
Import documents.
Understand the case.
Extract facts and evidence.
Draft with sources.
Verify.
Review.
Export safely.
```

### 1.2 Design direction

Evida skal føles:

- rolig
- presist
- juridisk seriøst
- desktop-raskt
- dokumenttungt uten å være rotete
- AI-assistert uten å virke magisk
- kontrollert, auditbart og trygt

### 1.3 What this product must not feel like

Evida skal ikke føles som:

- et generisk SaaS-dashboard
- en chatbot med juridisk tema
- et legacy Windows-register med 80 felter
- et regnskapssystem med saksmodul
- et AI-verktøy som gir skråsikre svar uten kilder
- et system som skjuler risiko bak grønne statuser

### 1.4 Design doctrine

```text
Saken er sentrum.
AI er støtte.
Kilder er kontrakten.
Review er porten.
Verification er sannhetslaget.
Audit er hukommelsen.
```

---

## 2. Information architecture

### 2.1 App shell

Desktop MVP bør bruke tre hovedsoner:

```text
┌────────────────────┬────────────────────────────────────┬────────────────────────────┐
│ Matter Navigation  │ Main Workspace                     │ Legal Status / AI / Review │
│                    │                                    │                            │
│ Matters            │ Current screen                     │ Status Bundle              │
│ Inbox              │ Documents / matrices / draft       │ Sources                    │
│ Deadlines          │                                    │ Risks                      │
│ Review             │                                    │ Missing items              │
│ Drafts             │                                    │ Next action                │
│ Exports            │                                    │ Review queue               │
└────────────────────┴────────────────────────────────────┴────────────────────────────┘
```

### 2.2 Shell dimensions

| Region | Desktop width | Behavior |
|---|---:|---|
| Left navigation | 256 px | Collapsible to 72 px |
| Main workspace | Flexible | Minimum 760 px |
| Right status panel | 360 px | Collapsible to drawer |
| Top bar | 56 px | Persistent |
| Bottom utility/status bar | 32 px | Optional in MVP |

### 2.3 Navigation model

Primary navigation:

1. Matters
2. Documents
3. Fact/Evidence
4. Drafts
5. Verification
6. Review
7. Exports
8. Search
9. Settings / Admin later

Inside a matter, navigation should be contextual:

```text
Matter Overview
Documents
Facts
Evidence
Issues
Drafts
Verification
Review
Export
Audit
```

---

## 3. Design tokens

Tokens should be implemented in code as semantic variables first, not raw color names.

### 3.1 Color primitives

| Token | Hex | Use |
|---|---:|---|
| `color.navy.950` | `#07111F` | Deep app chrome |
| `color.navy.900` | `#0B1F33` | Sidebar, header |
| `color.navy.800` | `#12304D` | Active nav, dark cards |
| `color.slate.950` | `#0F172A` | Primary text |
| `color.slate.700` | `#334155` | Secondary text |
| `color.slate.500` | `#64748B` | Muted text |
| `color.slate.300` | `#CBD5E1` | Strong border |
| `color.slate.200` | `#E2E8F0` | Default border |
| `color.slate.100` | `#F1F5F9` | Subtle surface |
| `color.slate.50` | `#F8FAFC` | App background |
| `color.white` | `#FFFFFF` | Main surfaces |
| `color.blue.700` | `#1D4ED8` | Primary action |
| `color.blue.600` | `#2563EB` | Link/action hover |
| `color.indigo.700` | `#4338CA` | AI/source relation |
| `color.purple.700` | `#6D28D9` | Drafting/AI assist |
| `color.magenta.700` | `#A21CAF` | Brand accent, sparingly |
| `color.green.700` | `#15803D` | Verified/success |
| `color.amber.700` | `#B45309` | Warning/partial |
| `color.red.700` | `#B91C1C` | Blocked/error |
| `color.cyan.700` | `#0E7490` | Evidence/document relation |

### 3.2 Semantic colors

| Token | Value | Notes |
|---|---|---|
| `surface.app` | `color.slate.50` | Overall background |
| `surface.panel` | `color.white` | Main panels |
| `surface.sidebar` | `color.navy.950` | Left nav |
| `surface.subtle` | `color.slate.100` | Group backgrounds |
| `surface.selected` | `#EFF6FF` | Selected row/card |
| `text.primary` | `color.slate.950` | Main text |
| `text.secondary` | `color.slate.700` | Supporting text |
| `text.muted` | `color.slate.500` | Labels, metadata |
| `text.inverse` | `color.white` | Sidebar text |
| `border.default` | `color.slate.200` | Standard borders |
| `border.strong` | `color.slate.300` | Tables, split panes |
| `action.primary` | `color.blue.700` | Main CTA |
| `action.primary.hover` | `color.blue.600` | CTA hover |
| `action.danger` | `color.red.700` | Destructive |
| `status.verified` | `color.green.700` | Verified |
| `status.partial` | `color.amber.700` | Partial / needs attention |
| `status.blocked` | `color.red.700` | Blocked |
| `status.needs_review` | `color.indigo.700` | Review required |
| `status.draft` | `color.slate.500` | Draft/unstarted |
| `ai.confidence.high` | `color.green.700` | ≥ 0.85 |
| `ai.confidence.medium` | `color.amber.700` | 0.60–0.84 |
| `ai.confidence.low` | `color.red.700` | < 0.60 |
| `source.linked` | `color.indigo.700` | Source reference |
| `evidence.strong` | `color.green.700` | Strong evidence |
| `evidence.medium` | `color.amber.700` | Medium |
| `evidence.weak` | `color.red.700` | Weak/missing |

### 3.3 Typography

Preferred font stack:

```css
font-family: Inter, "IBM Plex Sans", "Noto Sans", system-ui, sans-serif;
font-family-mono: "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace;
```

| Token | Size/line | Weight | Use |
|---|---:|---:|---|
| `type.display.sm` | 32/40 | 650 | Major page titles |
| `type.heading.lg` | 24/32 | 650 | Screen titles |
| `type.heading.md` | 20/28 | 650 | Panel titles |
| `type.heading.sm` | 16/24 | 650 | Card/table titles |
| `type.body.lg` | 16/24 | 400 | Main body |
| `type.body.md` | 14/22 | 400 | Default UI text |
| `type.body.sm` | 13/20 | 400 | Table metadata |
| `type.label.md` | 12/16 | 600 | Labels, badges |
| `type.mono.sm` | 12/18 | 500 | IDs, source refs |

### 3.4 Spacing

Use a 4 px base grid.

| Token | Value |
|---|---:|
| `space.0` | 0 |
| `space.1` | 4 px |
| `space.2` | 8 px |
| `space.3` | 12 px |
| `space.4` | 16 px |
| `space.5` | 20 px |
| `space.6` | 24 px |
| `space.8` | 32 px |
| `space.10` | 40 px |
| `space.12` | 48 px |
| `space.16` | 64 px |

### 3.5 Radius

| Token | Value | Use |
|---|---:|---|
| `radius.none` | 0 | Split panes, dense tables |
| `radius.sm` | 4 px | Badges, small inputs |
| `radius.md` | 8 px | Buttons, inputs |
| `radius.lg` | 12 px | Cards |
| `radius.xl` | 16 px | Major panels |
| `radius.full` | 999 px | Pills |

### 3.6 Elevation

Keep shadows minimal. Most hierarchy should come from spacing, border and surface color.

| Token | Value | Use |
|---|---|---|
| `shadow.none` | none | Default |
| `shadow.sm` | `0 1px 2px rgba(15,23,42,.06)` | Buttons/cards |
| `shadow.md` | `0 8px 24px rgba(15,23,42,.10)` | Floating panels |
| `shadow.lg` | `0 16px 40px rgba(15,23,42,.16)` | Modals |

### 3.7 Motion

| Token | Value | Use |
|---|---:|---|
| `motion.fast` | 120 ms | Hover, press |
| `motion.base` | 180 ms | Panel transitions |
| `motion.slow` | 260 ms | Drawer/modals |
| `motion.easing` | cubic-bezier(.2,.8,.2,1) | Default |
| `motion.reduced` | 0 ms | Reduced motion mode |

Motion must communicate state, not decorate. No bouncing, no dramatic animation.

### 3.8 Layout tokens

| Token | Value |
|---|---:|
| `shell.leftNav.width` | 256 px |
| `shell.leftNav.collapsed` | 72 px |
| `shell.rightPanel.width` | 360 px |
| `shell.topBar.height` | 56 px |
| `shell.statusBar.height` | 32 px |
| `workspace.maxContentWidth` | 1280 px |
| `table.row.height` | 44 px |
| `table.row.compact` | 36 px |
| `input.height` | 40 px |
| `button.height.md` | 40 px |
| `button.height.sm` | 32 px |

---

## 4. State taxonomy

### 4.1 Universal UI states

Every component and screen must define:

| State | Meaning |
|---|---|
| `idle` | Ready for user input |
| `loading` | Request/job running |
| `empty` | No data yet |
| `error` | Recoverable failure |
| `permission_denied` | User lacks access |
| `offline` | Local view without sync |
| `syncing` | Data being synced |
| `stale` | Data may be outdated |
| `disabled` | Action not available |
| `selected` | User-selected object |
| `focused` | Keyboard focus |
| `dirty` | Unsaved changes |
| `saving` | Persisting changes |
| `saved` | Persisted |

### 4.2 Matter states

| State | UI label | Meaning | Color |
|---|---|---|---|
| `draft` | Utkast | Matter created but incomplete | Gray |
| `active` | Aktiv | Work can proceed | Blue |
| `partial` | Delvis klar | Some missing/review items | Amber |
| `blocked` | Blokkert | Critical missing/compliance issue | Red |
| `ready_for_review` | Klar for review | Draft/analysis ready for human review | Indigo |
| `approved` | Godkjent | Required review passed | Green |
| `archived` | Arkivert | Closed/read-only | Gray |

### 4.3 Document states

| State | UI label | Meaning |
|---|---|---|
| `uploaded` | Lastet opp | Document exists, not processed |
| `importing` | Importerer | Upload/index/OCR running |
| `indexed` | Indeksert | Searchable |
| `classified` | Klassifisert | Document type assigned |
| `needs_review` | Krever review | AI extraction needs human check |
| `reviewed` | Reviewet | Human accepted |
| `rejected` | Avvist | Extraction/document not relevant |
| `duplicate` | Duplikat | Duplicated document |
| `contradicted` | Motstrid | Conflicts with other source |
| `missing` | Mangler | Expected but absent |
| `failed` | Feilet | Processing failed |

### 4.4 Fact states

| State | UI label | Rule |
|---|---|---|
| `unreviewed` | Ureviewet | Cannot be used as final claim without marking |
| `reviewed` | Reviewet | Can support draft |
| `disputed` | Omstridt | Must display dispute |
| `rejected` | Avvist | Cannot support draft |
| `unsupported` | Uten kilde | Blocks verified status |
| `contradicted` | Motstrid | Blocks send-ready until handled |
| `missing_source` | Mangler kilde | Blocks verified status |

### 4.5 Evidence states

| State | UI label | Meaning |
|---|---|---|
| `strong` | Sterkt | Direct, reliable evidence |
| `medium` | Middels | Helpful but not decisive |
| `weak` | Svakt | Limited value |
| `missing` | Mangler | Needed but not present |
| `contradictory` | Motstridende | Conflicts with another source |
| `excluded` | Utelatt | Not used in output |
| `privileged` | Beskyttet | Restricted handling |

### 4.6 AI job states

| State | UI label |
|---|---|
| `queued` | I kø |
| `running` | Kjører |
| `extracting` | Trekker ut |
| `classifying` | Klassifiserer |
| `drafting` | Lager utkast |
| `verifying` | Verifiserer |
| `awaiting_review` | Venter på review |
| `completed` | Fullført |
| `failed` | Feilet |
| `blocked_by_policy` | Stoppet av policy |
| `cancelled` | Avbrutt |

### 4.7 Verification states

| State | UI label | Send-ready? |
|---|---|---:|
| `not_run` | Ikke kjørt | No |
| `verified` | Verifisert | Yes, if review policy also passes |
| `partial` | Delvis verifisert | No |
| `needs_review` | Krever review | No |
| `blocked` | Blokkert | No |
| `rejected` | Avvist | No |

### 4.8 Review states

| State | UI label |
|---|---|
| `not_requested` | Ikke sendt til review |
| `requested` | Sendt til review |
| `in_progress` | Under review |
| `approved` | Godkjent |
| `approved_with_notes` | Godkjent med merknad |
| `rejected` | Avvist |
| `deferred` | Utsatt |
| `requires_more_evidence` | Krever mer dokumentasjon |

### 4.9 Export states

| State | UI label |
|---|---|
| `not_ready` | Ikke klar |
| `ready` | Klar |
| `exporting` | Eksporterer |
| `exported` | Eksportert |
| `failed` | Eksport feilet |
| `archived` | Arkivert |

---

## 5. Screen inventory

### 5.1 MVP screens

| ID | Screen | Purpose | MVP priority |
|---|---|---|---|
| `MVP-01` | Matter Command Center | 60-second case overview | P0 |
| `MVP-02` | Document Workspace | Import, classify, review documents | P0 |
| `MVP-03` | Fact/Evidence Matrix | Source-bound facts and evidence | P0 |
| `MVP-04` | Draft Workspace | Source-grounded legal draft | P0 |
| `MVP-05` | Verification Report | Checks, failures, next actions | P0 |
| `MVP-06` | Review & Approval | Human review, version-bound approval | P0 |
| `MVP-07` | Export Package | Export Word/PDF/audit package | P0 |

### 5.2 Supporting MVP surfaces

| ID | Surface | Purpose |
|---|---|---|
| `SUP-01` | Global Command Palette | Open matter, run verify, jump to source |
| `SUP-02` | Source Drawer | Show document excerpt, page, paragraph |
| `SUP-03` | Legal Status Bundle Panel | What we know, sources, missing, risk, next action |
| `SUP-04` | Review Queue Drawer | Items needing review |
| `SUP-05` | Audit Timeline Drawer | Who did what, when and why |
| `SUP-06` | Import Progress Modal | Batch import/OCR/classification progress |

### 5.3 Non-MVP but reserved

| Screen | When |
|---|---|
| Client Portal | Beta |
| KYC / AML | Beta/v1 |
| Admin console | v1 |
| Billing/time | v1 or integration |
| Office add-ins | v1.5 |
| Firm analytics | v1.5 |

---

## 6. Figma file structure

Create Figma pages:

```text
00_Cover
01_Foundations
02_Components
03_MVP_Flow
04_Screen_Details
05_Prototype_States
06_Annotations
07_Developer_Handoff
```

### 6.1 Figma naming convention

Use this naming pattern:

```text
[MVP step number] / [Screen name] / [State]
```

Examples:

```text
01 / Matter Command Center / Ready
01 / Matter Command Center / Blocked
02 / Document Workspace / Importing
02 / Document Workspace / Needs Review
05 / Verification Report / Blocked
06 / Review / Approved
07 / Export / Ready
```

### 6.2 Figma frame size

Primary frame:

```text
Desktop / 1440 × 960
```

Secondary frame for dense table stress testing:

```text
Desktop Compact / 1280 × 800
```

Do not design only for a wide monitor. Legal users will split screen with Word, Outlook and PDF tools.

### 6.3 Figma prototype flow

```text
Matter Command Center
  CTA: Review missing documents
  → Document Workspace

Document Workspace
  CTA: Approve selected extractions / Continue to facts
  → Fact/Evidence Matrix

Fact/Evidence Matrix
  CTA: Generate sourced draft
  → Draft Workspace

Draft Workspace
  CTA: Run verification
  → Verification Report

Verification Report
  CTA: Send to review
  → Review & Approval

Review & Approval
  CTA: Approve for export
  → Export Package

Export Package
  CTA: Export Word/PDF + audit
  → Export completed state
```

### 6.4 Prototype connector map

| From frame | Trigger | To frame | Prototype behavior |
|---|---|---|---|
| `01 / Matter Command Center / Partial` | Click `Review missing documents` | `02 / Document Workspace / Needs Review` | Smart animate, 180 ms |
| `02 / Document Workspace / Needs Review` | Click `Approve extraction` | same frame | Open source drawer |
| `02 / Document Workspace / Ready` | Click `Continue to Fact/Evidence` | `03 / Fact Evidence Matrix / Ready` | Smart animate |
| `03 / Fact Evidence Matrix / Ready` | Click `Generate sourced draft` | `04 / Draft / Drafting` | Dissolve, 180 ms |
| `04 / Draft / Ready` | Click `Run verification` | `05 / Verification / Running` | Smart animate |
| `05 / Verification / Needs Review` | Click `Send to review` | `06 / Review / In Progress` | Smart animate |
| `06 / Review / Approved` | Click `Approve for export` | `07 / Export / Ready` | Smart animate |
| `07 / Export / Ready` | Click `Export package` | `07 / Export / Exported` | Modal overlay |

---

## 7. Vertical MVP workflow

### 7.1 Flow overview

```text
1. Matter Command Center
   ↓
2. Document Workspace
   ↓
3. Fact/Evidence Matrix
   ↓
4. Draft Workspace
   ↓
5. Verification Report
   ↓
6. Review & Approval
   ↓
7. Export Package
```

### 7.2 Business goal

Reduce time from document chaos to safe legal output.

### 7.3 User goal

The lawyer wants to open a document-heavy matter, understand what matters, draft a source-grounded document, verify it, review it and export it without losing control.

### 7.4 Trust goal

No document, claim or status should appear “safe” unless it has:

- source
- confidence
- review state
- verification result
- audit trail

---

## 8. Core workflows

### 8.1 Workflow A: Open matter and understand status

```text
Open Matter
→ Matter Command Center loads
→ Legal Status Bundle summarizes matter
→ Missing evidence and review blockers are shown
→ User selects next safe action
```

Acceptance:

- User understands case status in under 60 seconds.
- Primary CTA is obvious.
- Blocking items are not hidden below the fold.
- Legal Status Bundle always shows status, risk and next action.

### 8.2 Workflow B: Import and review documents

```text
Open Document Workspace
→ Drag in documents/folder
→ OCR/index/classification runs
→ AI extracts key facts, dates, people, amounts
→ Low confidence items enter review queue
→ Lawyer approves/rejects extractions
```

Acceptance:

- Import progress is visible.
- Failed documents are listed with recovery action.
- Every extraction has a source reference.
- User can jump from extraction to exact source.

### 8.3 Workflow C: Build fact and evidence matrix

```text
Review extractions
→ Facts are grouped
→ Evidence is linked
→ Contradictions are flagged
→ Missing documents are identified
→ User approves/disputes facts
```

Acceptance:

- Facts cannot be marked reviewed without source or reviewer.
- Contradicted facts have visible badges.
- Evidence strength is explicit.
- Facts and evidence can open source drawer.

### 8.4 Workflow D: Draft source-grounded document

```text
Select document type
→ Choose purpose, recipient and tone
→ Draft uses reviewed facts first
→ Unsupported claims are marked
→ User edits manually
→ Each paragraph shows source status
```

Acceptance:

- Draft never hides unsupported claims.
- Paragraph-level source status is visible.
- User can compare AI draft, lawyer edits and final version.
- Autosave and versioning are visible.

### 8.5 Workflow E: Verify

```text
Run verification
→ System checks sources, facts, dates, parties, amounts, contradictions, review
→ Result shows pass/warn/fail per category
→ Critical failures block send-ready status
→ Recommended next action is shown
```

Acceptance:

- `verified` requires source + review + risk check.
- `blocked` state cannot be bypassed without explicit override policy.
- Verification report is saved as artifact.
- User sees why a status was assigned.

### 8.6 Workflow F: Review and approve

```text
Send to review
→ Reviewer sees uncertain points, sources, verification result
→ Reviewer approves/rejects/defers
→ Approval is bound to document version and Legal Status Bundle version
→ Audit event is written
```

Acceptance:

- Reviewer can open source references directly.
- Approval cannot apply to a changed draft version.
- Rejection creates actionable tasks.
- Audit captures who, what, when, version and reason.

### 8.7 Workflow G: Export

```text
Prepare export package
→ Choose Word/PDF/Audit package
→ Verify final status
→ Export
→ Archive artifact and audit event
```

Acceptance:

- Export is unavailable if critical verification/review gates fail.
- Exported files include version metadata.
- Audit package is exportable.
- User receives clear success/failure state.

---

## 9. Component library

### 9.1 Shell components

| Component | Purpose | Key states |
|---|---|---|
| `AppShell` | Overall layout | normal, compact, offline |
| `MatterSidebar` | Matter navigation | expanded, collapsed |
| `TopBar` | Search, user, sync | synced, syncing, offline |
| `RightStatusPanel` | Legal status, AI, review | expanded, collapsed |
| `SplitPane` | Document/editor layout | resized, locked |

### 9.2 Navigation components

| Component | Purpose |
|---|---|
| `PrimaryNavItem` | Main app navigation |
| `MatterNavItem` | In-matter navigation |
| `BreadcrumbTrail` | Matter → screen → artifact |
| `CommandPalette` | Keyboard-first navigation |
| `RecentMatterList` | Quick matter switcher |

### 9.3 Status components

| Component | Purpose |
|---|---|
| `LegalStatusBundle` | What we know, sources, missing, risk, next action |
| `StatusBadge` | Universal lifecycle status |
| `RiskBadge` | Low/medium/high/blocking |
| `ConfidenceIndicator` | AI confidence with explanation |
| `ReviewBadge` | Review state |
| `SourceCoverageMeter` | % of claims with source/review |
| `SyncStatusPill` | Cloud/local sync state |

### 9.4 Document components

| Component | Purpose |
|---|---|
| `DocumentList` | Left document list |
| `DocumentViewer` | PDF/Word/email preview |
| `DocumentClassificationCard` | AI document type with confidence |
| `SourceReferencePill` | `DOC-22 p.3 l.14–19` |
| `SourceDrawer` | Exact source excerpt |
| `ExtractionReviewCard` | Approve/reject AI extraction |
| `ImportDropzone` | Drag-and-drop document import |
| `ImportProgressPanel` | Batch import/OCR/classification status |

### 9.5 Matrix components

| Component | Purpose |
|---|---|
| `FactTable` | Fact matrix |
| `EvidenceTable` | Evidence matrix |
| `LinkedIssueCell` | Legal issue relation |
| `ContradictionBadge` | Conflicting source warning |
| `EvidenceStrengthChip` | Strong/medium/weak |
| `MatrixFilterBar` | Filter by status/source/risk |
| `InlineReviewControls` | Approve/reject/dispute row |

### 9.6 Draft components

| Component | Purpose |
|---|---|
| `DraftEditor` | Legal document editor |
| `DocumentOutline` | Sections and paragraph status |
| `ParagraphSourceRail` | Source/review status per paragraph |
| `UnsupportedClaimMarker` | Inline unsupported claim warning |
| `VersionComparePanel` | AI vs lawyer vs final |
| `DraftSettingsPanel` | Purpose, recipient, tone, document type |

### 9.7 Verification components

| Component | Purpose |
|---|---|
| `VerificationSummaryCard` | Overall status |
| `VerificationCheckList` | Pass/warn/fail checks |
| `VerificationFailureCard` | Blocking issue |
| `ResidualRiskPanel` | What remains uncertain |
| `RecommendedNextActionCard` | Next safe action |
| `VerificationArtifactLink` | Saved report |

### 9.8 Review components

| Component | Purpose |
|---|---|
| `ReviewQueue` | All items awaiting human review |
| `ReviewDecisionPanel` | Approve/reject/defer |
| `ReviewerCommentThread` | Comments |
| `VersionLockBanner` | Review bound to draft/status version |
| `ApprovalSummaryCard` | Who approved what |
| `AuditEventRow` | Audit trail |

### 9.9 Export components

| Component | Purpose |
|---|---|
| `ExportReadinessCard` | Shows if export is allowed |
| `ExportFormatSelector` | Word/PDF/Audit package |
| `ExportChecklist` | Final review before export |
| `ExportProgressModal` | Export progress |
| `ExportResultCard` | Success/failure |
| `DownloadArtifactRow` | Exported files |

---

## 10. Interaction rules

### 10.1 Primary action rule

Each screen must have exactly one primary CTA.

Examples:

| Screen | Primary CTA |
|---|---|
| Matter Command Center | `Review missing documents` or `Open document workspace` |
| Document Workspace | `Continue to Fact/Evidence` |
| Fact/Evidence Matrix | `Generate sourced draft` |
| Draft | `Run verification` |
| Verification | `Send to review` |
| Review | `Approve for export` |
| Export | `Export package` |

### 10.2 No false green rule

Never use green for:

- AI confidence alone
- unreviewed content
- partial verification
- export readiness without review
- “looks good” states

Green only means that the relevant gate has passed.

### 10.3 Source jump rule

Any claim, fact, evidence item or paragraph source must support:

```text
Click source → open Source Drawer → highlight exact page/paragraph/excerpt
```

### 10.4 Review gate rule

Critical outputs cannot be sent/exported if:

- verification is not run
- verification is blocked
- required review is missing
- draft changed after approval
- source coverage is below policy threshold
- KYC/compliance blocker exists for the matter

### 10.5 Keyboard-first rules

Minimum shortcuts:

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + K` | Command palette |
| `Ctrl/Cmd + O` | Open matter |
| `Ctrl/Cmd + F` | Search current screen |
| `Ctrl/Cmd + Shift + F` | Search matter |
| `Ctrl/Cmd + J` | Jump to source |
| `Ctrl/Cmd + R` | Send/run review depending context |
| `Ctrl/Cmd + E` | Export |
| `Esc` | Close drawer/modal |
| `[` / `]` | Previous/next document |
| `Alt + 1–7` | Jump between MVP steps |

### 10.6 Drag-and-drop rules

- Dragging files opens import confirmation.
- Import confirmation shows file count, unsupported files and destination matter.
- Large imports show progress by file and processing stage.
- Failed imports remain visible with retry.
- No silent discard of unsupported files.

### 10.7 Autosave rules

- Drafts autosave every meaningful edit.
- Status shows `Saving…`, `Saved`, or `Failed to save`.
- Review approval is invalidated if draft content changes after approval.
- User can restore prior versions.

### 10.8 Error recovery rules

Every error must answer:

1. What happened?
2. What is affected?
3. Is data safe?
4. What can I do next?
5. Who/what has audit record?

---

## 11. Accessibility rules

### 11.1 Baseline

Target WCAG 2.2 AA.

### 11.2 Keyboard

- All primary workflows must be usable without mouse.
- Focus order follows visual order.
- Drawers and modals trap focus.
- `Esc` closes non-destructive overlays.
- Tables support row navigation.

### 11.3 Focus

- Focus ring must be visible on all interactive elements.
- Focus ring token:

```css
outline: 2px solid #2563EB;
outline-offset: 2px;
```

### 11.4 Contrast

- Body text minimum 4.5:1 contrast.
- Large text minimum 3:1.
- Status badges must include icons/text, not color alone.

### 11.5 Tables and matrices

- Rows must be screen-reader navigable.
- Column headers must be programmatically associated.
- Dense views need a comfortable mode.
- Virtualized tables must preserve keyboard and screen-reader context.

### 11.6 Forms

- Labels always visible.
- Required fields marked with text, not only `*`.
- Errors appear inline and in summary.
- Sensitive fields explain why data is needed.

### 11.7 Motion

- Respect `prefers-reduced-motion`.
- Critical status changes must not rely on animation alone.

### 11.8 Language

- Use clear Norwegian legal language.
- Avoid “AI says”.
- Prefer “Forslag”, “Krever review”, “Mangler kilde”, “Kan ikke eksporteres ennå”.

---

## 12. AI UX rules

### 12.1 AI is not authority

AI output must always appear as:

```text
Suggestion + source + confidence + review state + risk
```

Never as final legal truth.

### 12.2 Confidence labels

| Confidence | Label | UI treatment |
|---:|---|---|
| `0.85–1.00` | Høy | Still requires source/review if critical |
| `0.60–0.84` | Middels | Needs review |
| `<0.60` | Lav | Do not use without review |

### 12.3 Required AI output contract

Every AI-generated artifact must include:

```json
{
  "artifact_id": "string",
  "matter_id": "string",
  "created_by": "ai",
  "model_version": "string",
  "prompt_version": "string",
  "source_refs": [],
  "confidence": 0.0,
  "risk_level": "low | medium | high | blocking",
  "review_requirement": "none | lawyer | partner | compliance",
  "unsupported_claims": [],
  "uncertainties": [],
  "recommended_next_action": "string"
}
```

### 12.4 AI copy rules

Use:

- “Evida fant…”
- “Forslag basert på…”
- “Kildegrunnlag…”
- “Mangler…”
- “Dette bør reviewes…”

Avoid:

- “Svaret er…”
- “Dette er korrekt…”
- “Du bør sende…”
- “Trygt” unless verified and reviewed.

### 12.5 AI failure rules

If AI cannot ground output:

- show `Mangler grunnlag`
- do not generate confident prose
- list missing sources
- suggest next safe action
- send item to review queue if useful

### 12.6 AI transparency

The user must be able to inspect:

- source documents used
- excluded/ignored documents where relevant
- model/prompt version in audit details
- confidence
- residual uncertainty
- review requirement

---

## 13. Review and verification rules

### 13.1 Verification checks

Verification must check:

- source exists
- fact is reviewed or explicitly marked unreviewed
- document reference is valid
- deadlines are identified
- dates are consistent
- parties are correct
- amounts are consistent with sources
- unsupported claims are marked
- contradictions are handled
- client instruction is reflected
- compliance blockers are absent or handled
- sensitive actions have approval

### 13.2 Verification output

```json
{
  "verification_id": "VER-001",
  "matter_id": "MAT-001",
  "draft_id": "DRAFT-001",
  "status": "verified | partial | needs_review | blocked | rejected",
  "source_coverage": 0.95,
  "checks": [],
  "warnings": [],
  "failures": [],
  "residual_risk": "low | medium | high",
  "recommended_next_action": "string",
  "artifact_url": "string"
}
```

### 13.3 Review binding

Approval must be bound to:

- `document_version_id`
- `draft_version_id`
- `legal_status_bundle_version`
- `verification_result_id`
- reviewer identity
- timestamp
- decision
- reason/comment

### 13.4 Review decisions

Allowed decisions:

| Decision | Effect |
|---|---|
| `approve` | Enables next gate if verification passes |
| `approve_with_notes` | Enables next gate with visible notes |
| `reject` | Blocks and creates tasks |
| `defer` | Keeps in review queue |
| `request_more_evidence` | Creates missing evidence task |
| `escalate` | Sends to partner/compliance |

### 13.5 Blocking rules

Export is blocked if:

- verification state is `blocked` or `rejected`
- review state is not approved where required
- draft changed after approval
- unsupported critical claim remains
- source coverage below policy threshold
- unresolved contradiction exists
- required KYC/compliance status blocks matter

---

## 14. MVP screen specifications

## 14.1 MVP-01: Matter Command Center

### Purpose

Give the lawyer a 60-second overview of the matter.

### Layout

```text
Top: Matter title, client, status, risk, next deadline
Main grid:
  - Next safest action
  - Key documents
  - Fact summary
  - Evidence summary
  - Legal issues
  - Timeline
  - Tasks/review queue
Right panel:
  - Legal Status Bundle
```

### Required components

- `MatterHeader`
- `LegalStatusBundle`
- `NextActionCard`
- `RiskBadge`
- `DeadlineCard`
- `DocumentSummaryCard`
- `FactCoverageCard`
- `EvidenceCoverageCard`
- `ReviewQueuePreview`
- `AuditMiniTimeline`

### Primary CTA

`Review missing documents`

### Empty state

Matter has no documents:

```text
Denne saken har ingen dokumenter ennå.
Importer dokumenter for å bygge faktum, bevis og sakssammendrag.
[Importer dokumenter]
```

### Blocked state

```text
Saken er blokkert.
Årsak: Kritisk dokumentasjon mangler / KYC ikke fullført / uløst motstrid.
Neste trygge handling: [specific action]
```

### Acceptance criteria

- User can understand status, risk, missing items and next action without opening another screen.
- Matter status is visible above the fold.
- At least one next action is shown.
- User can open documents, facts, evidence, draft, verification and review from this screen.
- Legal Status Bundle is always visible or one click away.

---

## 14.2 MVP-02: Document Workspace

### Purpose

Import, classify and review documents.

### Layout

```text
Left: Document list + filters
Center: Document viewer
Right: AI extractions + review controls + source metadata
```

### Required components

- `ImportDropzone`
- `ImportProgressPanel`
- `DocumentList`
- `DocumentViewer`
- `DocumentMetadataPanel`
- `ExtractionReviewCard`
- `SourceReferencePill`
- `ConfidenceIndicator`
- `ReviewQueue`

### Primary CTA

`Continue to Fact/Evidence`

### Import state

Show:

- number of files
- file types
- unsupported files
- OCR progress
- classification progress
- failures and retry

### Extraction review state

Each extraction must show:

- extracted text/fact
- source reference
- confidence
- linked fact/evidence candidate
- approve/reject/edit controls

### Acceptance criteria

- User can import documents by drag-and-drop and file picker.
- Failed files are not hidden.
- Documents can be filtered by status, type, source, confidence and review state.
- AI extractions can be approved/rejected/edited.
- Approved extractions create/update facts and evidence.
- User can jump from extraction to source.

---

## 14.3 MVP-03: Fact/Evidence Matrix

### Purpose

Turn documents into structured, source-bound facts and evidence.

### Layout

```text
Top: Matrix filters and coverage summary
Main: Tabbed matrix
  - Facts
  - Evidence
  - Legal issues
Right: Source drawer / selected row details
```

### Required components

- `FactTable`
- `EvidenceTable`
- `LegalIssuePanel`
- `EvidenceStrengthChip`
- `ContradictionBadge`
- `InlineReviewControls`
- `SourceDrawer`
- `CoverageSummary`

### Primary CTA

`Generate sourced draft`

### Fact table columns

| Column | Notes |
|---|---|
| Fact ID | `FACT-001` |
| Statement | Human-readable fact |
| Sources | Source reference pills |
| Confidence | AI confidence |
| Status | unreviewed/reviewed/disputed/rejected |
| Related issue | Legal issue |
| Evidence | Linked evidence |
| Reviewer | Human reviewer |

### Evidence table columns

| Column | Notes |
|---|---|
| Evidence ID | `EVID-001` |
| Document | Linked document |
| Supports | Facts/claims |
| Strength | strong/medium/weak |
| Weakness | free text |
| Contradiction | yes/no |
| Status | review state |

### Acceptance criteria

- Every critical fact has source or is clearly marked unsupported.
- Fact status can be changed only with audit.
- Contradictions are visually prominent.
- Evidence can be opened directly from fact or draft.
- User can generate a draft only when minimum source/review policy is met, or draft is explicitly marked as unsafe/needs review.

---

## 14.4 MVP-04: Draft Workspace

### Purpose

Create a source-grounded legal document.

### Layout

```text
Left: Document outline and sections
Center: Editor
Right: Paragraph sources, unsupported claims, AI suggestions, review status
```

### Required components

- `DraftEditor`
- `DocumentOutline`
- `ParagraphSourceRail`
- `UnsupportedClaimMarker`
- `DraftSettingsPanel`
- `VersionComparePanel`
- `AutosaveStatus`
- `SourceDrawer`

### Primary CTA

`Run verification`

### Draft metadata

Every draft must show:

- document type
- purpose
- recipient
- tone
- source basis
- review state
- version
- last saved
- author/AI contribution

### Paragraph states

| State | Meaning |
|---|---|
| `source_bound` | Paragraph has source/fact/evidence |
| `lawyer_written` | Human-written without source requirement or human-approved |
| `unsupported` | Material claim without source |
| `uncertain` | AI marked uncertainty |
| `changed_after_review` | Invalidates previous approval |

### Acceptance criteria

- User can edit draft directly.
- Every material claim is source-bound, lawyer-approved or marked.
- Unsupported claims are visible inline and in side panel.
- Draft version history is available.
- User cannot proceed to export directly from draft without verification/review gates.

---

## 14.5 MVP-05: Verification Report

### Purpose

Show whether the draft/matter output is safe to send/export.

### Layout

```text
Top: Verification status summary
Main:
  - Check groups
  - Failures
  - Warnings
  - Residual risk
  - Recommended next actions
Right:
  - Legal Status Bundle
  - Audit details
```

### Required components

- `VerificationSummaryCard`
- `VerificationCheckList`
- `VerificationFailureCard`
- `ResidualRiskPanel`
- `RecommendedNextActionCard`
- `VerificationArtifactLink`

### Primary CTA

`Send to review`

### Status behavior

- `verified`: primary CTA enabled if review policy is satisfied or review not required.
- `partial`: CTA is `Resolve warnings` or `Send to review with warnings`.
- `needs_review`: CTA is `Send to review`.
- `blocked`: CTA is `Resolve blocker`; export disabled.
- `rejected`: CTA is `Return to draft`.

### Acceptance criteria

- Verification result is understandable without technical knowledge.
- Every failed check has a concrete recovery action.
- Verification result is saved as artifact.
- User can open source/fact/draft location from each check.
- Blocked state cannot be visually confused with verified.

---

## 14.6 MVP-06: Review & Approval

### Purpose

Human review and approval of critical legal output.

### Layout

```text
Left: Review item list
Center: Draft/document preview
Right: Review checklist, sources, decision panel
```

### Required components

- `ReviewQueue`
- `ReviewChecklist`
- `ReviewDecisionPanel`
- `ReviewerCommentThread`
- `VersionLockBanner`
- `ApprovalSummaryCard`
- `AuditEventRow`

### Primary CTA

`Approve for export`

### Reviewer checklist

Minimum checklist:

- Sources checked
- Unsupported claims resolved
- Contradictions handled
- Dates/parties/amounts checked
- Client instruction reflected
- Verification status accepted
- Residual risk acceptable

### Acceptance criteria

- Reviewer sees all uncertainties and blockers.
- Reviewer can open exact source references.
- Approval is bound to draft version and Legal Status Bundle version.
- Any draft edit after approval invalidates approval.
- Approval/rejection writes audit event.

---

## 14.7 MVP-07: Export Package

### Purpose

Export safely to Word/PDF/audit package.

### Layout

```text
Top: Export readiness
Main:
  - Export formats
  - Included artifacts
  - Final checklist
  - Destination
Right:
  - Approval summary
  - Verification summary
  - Audit package
```

### Required components

- `ExportReadinessCard`
- `ExportFormatSelector`
- `ExportChecklist`
- `ApprovalSummaryCard`
- `VerificationSummaryCard`
- `ExportProgressModal`
- `ExportResultCard`

### Primary CTA

`Export package`

### Export package contents

Minimum:

- Word document
- PDF document
- source reference appendix
- verification report
- review decision
- audit summary
- document version metadata

### Acceptance criteria

- Export button disabled if gates fail.
- Export result is shown clearly.
- Failed export has retry and logs.
- Export artifact is stored and linked to matter.
- Export includes version and approval metadata.

---

## 15. Figma frame-by-frame flow

### 15.1 Flow layout on Figma canvas

Use vertical placement:

```text
X = 0
Y = 0       01 / Matter Command Center / Partial
Y = 1120    02 / Document Workspace / Needs Review
Y = 2240    03 / Fact Evidence Matrix / Ready
Y = 3360    04 / Draft / Ready
Y = 4480    05 / Verification / Needs Review
Y = 5600    06 / Review / Approved
Y = 6720    07 / Export / Ready
```

Each frame:

```text
Width: 1440
Height: 960
Gap between frames: 160
```

### 15.2 Frame 01: Matter Command Center

Visible elements:

- dark left nav
- top matter header
- status badges: `Delvis klar`, `Risiko: Medium`, `Neste frist: 12 dager`
- `Next safest action` card
- cards for documents, facts, evidence, legal issues, tasks
- right Legal Status Bundle

Prototype action:

```text
Click "Review missing documents" → Frame 02
```

### 15.3 Frame 02: Document Workspace

Visible elements:

- document list with statuses
- document viewer with highlighted source
- extraction review cards
- confidence indicators
- approve/reject controls
- import progress collapsed

Prototype action:

```text
Click "Continue to Fact/Evidence" → Frame 03
Click source pill → Open source drawer overlay
```

### 15.4 Frame 03: Fact/Evidence Matrix

Visible elements:

- coverage summary
- tabs: Facts / Evidence / Issues
- dense table with fact rows
- evidence strength chips
- contradiction badge
- source drawer for selected fact

Prototype action:

```text
Click "Generate sourced draft" → Frame 04
```

### 15.5 Frame 04: Draft Workspace

Visible elements:

- document outline
- editor
- paragraph source rail
- unsupported claim marker
- autosave status
- right AI/sources panel

Prototype action:

```text
Click "Run verification" → Frame 05
```

### 15.6 Frame 05: Verification Report

Visible elements:

- status `Needs review`
- check groups
- warnings and failures
- residual risk
- recommended next action
- saved artifact link

Prototype action:

```text
Click "Send to review" → Frame 06
```

### 15.7 Frame 06: Review & Approval

Visible elements:

- review queue
- draft preview
- review checklist
- version lock banner
- decision panel
- audit note

Prototype action:

```text
Click "Approve for export" → Frame 07
```

### 15.8 Frame 07: Export Package

Visible elements:

- export readiness card
- format selector
- package contents
- verification summary
- approval summary
- export CTA

Prototype action:

```text
Click "Export package" → Export success overlay
```

---

## 16. MVP acceptance criteria by screen

| Screen | Acceptance criteria |
|---|---|
| Matter Command Center | Lawyer understands matter, urgency, missing items and next action in under 60 seconds. |
| Document Workspace | Lawyer can import, classify and review documents; all AI extractions are source-bound. |
| Fact/Evidence Matrix | Critical facts and evidence are visible, reviewable, source-bound and contradiction-aware. |
| Draft Workspace | Draft is editable and every material claim is source-bound, lawyer-approved or marked. |
| Verification Report | Verification produces explicit pass/warn/fail result and blocks unsafe send-ready status. |
| Review & Approval | Reviewer can approve/reject with source access; approval is version-bound and auditlogged. |
| Export Package | Export only works when verification/review gates pass; package includes output and audit artifacts. |

---

## 17. End-to-end MVP acceptance criteria

The vertical MVP is accepted when:

- A lawyer can create/open a matter.
- Documents can be imported and processed.
- AI extracts facts and evidence with source references.
- User can review, reject or edit extracted facts/evidence.
- Draft can be generated from reviewed/source-bound material.
- Verification can detect unsupported claims, contradictions and missing review.
- Human review can approve/reject and write audit events.
- Export can produce Word/PDF/audit package.
- System blocks export when critical gates fail.
- User can always see what Evida knows, what it builds on, what is missing, what is risky and what to do next.

---

## 18. QA checklist

### Product QA

- [ ] Matter status is clear.
- [ ] Primary action is clear on every screen.
- [ ] Legal Status Bundle appears in every critical workflow.
- [ ] No screen relies on AI confidence alone.
- [ ] User can recover from errors.

### UX QA

- [ ] Empty state exists.
- [ ] Loading state exists.
- [ ] Error state exists.
- [ ] Permission state exists.
- [ ] Offline/sync state exists.
- [ ] Keyboard path works for core flow.
- [ ] Dense tables remain readable.

### AI QA

- [ ] Every AI artifact has source refs or explicit missing source.
- [ ] Confidence is shown.
- [ ] Review requirement is shown.
- [ ] Unsupported claims are marked.
- [ ] Prompt/model version is auditlogged.

### Verification QA

- [ ] Verification cannot return green without sources/review.
- [ ] Critical failures block export.
- [ ] Warnings have recovery actions.
- [ ] Verification artifact is stored.
- [ ] Verification state updates Legal Status Bundle.

### Review QA

- [ ] Approval is tied to draft version.
- [ ] Approval is tied to Legal Status Bundle version.
- [ ] Draft edits invalidate approval.
- [ ] Reviewer can access sources.
- [ ] Decision writes audit event.

### Accessibility QA

- [ ] Contrast passes AA.
- [ ] Focus state visible.
- [ ] Screen-reader labels exist.
- [ ] Tables have headers.
- [ ] Status not conveyed by color alone.
- [ ] Reduced motion supported.

---

## 19. Developer handoff notes

### 19.1 Suggested package boundaries

```text
/packages/ui
/packages/design-tokens
/packages/matter
/packages/documents
/packages/facts
/packages/evidence
/packages/drafting
/packages/verification
/packages/review
/packages/export
/packages/audit
/packages/ai-agents
```

### 19.2 Canonical UI state shape

```ts
type GateStatus =
  | "not_run"
  | "draft"
  | "partial"
  | "needs_review"
  | "blocked"
  | "verified"
  | "approved"
  | "rejected";

type SourceRef = {
  documentId: string;
  documentVersionId: string;
  page?: number;
  paragraph?: string;
  lineRange?: string;
  excerptHash?: string;
};

type LegalStatusBundle = {
  id: string;
  matterId: string;
  version: number;
  status: "draft" | "partial" | "blocked" | "ready_for_review" | "approved";
  whatWeKnow: string[];
  sourceRefs: SourceRef[];
  missingItems: string[];
  risks: Array<{
    level: "low" | "medium" | "high" | "blocking";
    description: string;
  }>;
  nextSafeAction: string;
  canExport: boolean;
  requiresReview: boolean;
};
```

### 19.3 Design token JSON starter

```json
{
  "color": {
    "surface": {
      "app": "#F8FAFC",
      "panel": "#FFFFFF",
      "sidebar": "#07111F",
      "subtle": "#F1F5F9",
      "selected": "#EFF6FF"
    },
    "text": {
      "primary": "#0F172A",
      "secondary": "#334155",
      "muted": "#64748B",
      "inverse": "#FFFFFF"
    },
    "action": {
      "primary": "#1D4ED8",
      "primaryHover": "#2563EB",
      "danger": "#B91C1C"
    },
    "status": {
      "verified": "#15803D",
      "partial": "#B45309",
      "blocked": "#B91C1C",
      "needsReview": "#4338CA",
      "draft": "#64748B"
    }
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px"
  },
  "space": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "6": "24px",
    "8": "32px",
    "12": "48px",
    "16": "64px"
  },
  "motion": {
    "fast": "120ms",
    "base": "180ms",
    "slow": "260ms",
    "easing": "cubic-bezier(.2,.8,.2,1)"
  }
}
```

---

## 20. Definition of Done for this design spec

This design spec is ready for Figma implementation when:

- Design tokens are created as Figma variables.
- Component library page contains all P0 components.
- MVP flow page contains 7 connected frames.
- Each frame has ready/loading/error/blocked variants where relevant.
- Prototype can be clicked from Matter Command Center to Export.
- Developer handoff includes tokens, states, interactions and acceptance criteria.
- QA can test the vertical flow end-to-end.
