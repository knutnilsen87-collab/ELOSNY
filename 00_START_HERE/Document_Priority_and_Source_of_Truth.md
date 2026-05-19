# Document Priority and Source of Truth

## Rule
Each subject should have one primary source of truth.

## Suggested priority
1. Project Profile Card
2. PRD
3. Technical Architecture Spec
4. Canonical Domain Model
5. API Specification
6. UI/UX Product Spec for design and interaction behavior
7. Delivery plan
8. QA gates
9. Decision log
10. Status bundle / operational truth

## Source-of-truth table
| Subject | Source document | Owner | Last confirmed |
|---|---|---|---|
| Product scope | {{DOC_NAME}} | {{OWNER}} | {{DATE}} |
| Technical architecture | {{DOC_NAME}} | {{OWNER}} | {{DATE}} |
| Domain model | {{DOC_NAME}} | {{OWNER}} | {{DATE}} |
| API contract | {{DOC_NAME}} | {{OWNER}} | {{DATE}} |
| Design / UI-UX | `03_Design/UI_UX_Product_Spec.md` + `03_Design/03_Evida_MVP_Figma_Flow.svg` | {{OWNER}} | {{DATE}} |
| QA gates | {{DOC_NAME}} | {{OWNER}} | {{DATE}} |
| Open decisions | {{DOC_NAME}} | {{OWNER}} | {{DATE}} |
| Operational status, verification, next action | `09_Project_Control/Status_Bundle_Contract.md` + latest `status_bundle` | {{OWNER}} | {{DATE}} |
