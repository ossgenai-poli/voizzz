# Voizzz project instructions

## Scope

- This repository is for the Voizzz product only.
- Treat `C:\Users\pnrao\projects\voizzz` as the complete working scope unless the user explicitly names another location.
- Do not inspect, modify, archive, delete, or apply instructions from sibling projects during Voizzz work.
- Vaachak is deprecated. Its code and documentation are historical reference only and must not shape Voizzz unless the user explicitly requests a comparison.
- ETTA and E4 workflows do not apply to this repository.

## Product source of truth

Read the relevant approved documents before proposing or implementing a change:

- `docs/product/voizzz-prd.md` — canonical product baseline
- `docs/product/voizzz-ui-blueprint.md` — customer interface and interaction blueprint
- `docs/product/voizzz-admin-control-plane.md` — Admin product control plane
- `docs/superpowers/specs/2026-09-07-orchestration-agent-architecture-design.md` — agent and orchestration architecture

When documents conflict, the user's most recently approved explicit decision governs. Update the canonical documents when that decision becomes final.

## Product boundaries

- Voizzz is voice first, with Task and Message as separate explicit intents.
- Planning, Orchestration, and Calling are separate agents with separate responsibilities.
- The customer product and Admin product are separate applications and personas.
- Memory access requires explicit thread-level user approval.
- The Calling Agent receives only the approved execution contract and approved disclosures.
- No material commitment, personal-data disclosure, or charge may occur without the required user authorization.

## Working approach

- Start product work from the approved user journey and product documents.
- Resolve product and UX decisions before selecting implementation architecture.
- Break implementation into independently testable modules with clear interfaces.
- Preserve unrelated work and do not import legacy Vaachak structure by default.
- Use plain language when discussing the product with the user.

## Branches and publication

- Publish approved product decisions and documentation to `Product-Decisions-and-Documentations` unless the user explicitly selects another branch.
- Use a task-specific branch for implementation after its design and plan are approved.
- Never force-push.
- Verify the remote commit before reporting documentation or code as published.

## Current execution limits

- Prototype behavior is simulated unless a task explicitly authorizes production integration.
- Do not place live calls, send messages or email, incur charges, purchase numbers, or deploy publicly without an explicit user request.

