# Voizzz Orchestration Agent Architecture

**Status:** Product design approved; ready for implementation planning after document review  
**Date:** September 7, 2026

## 1. Purpose

Voizzz separates task definition, runtime supervision, and external voice execution into three agents. This separation preserves the user's intent, limits disclosure, supports real-time authorization, and allows each role to use the model and provider best suited to its work.

The architecture is:

`User → Planning Agent → Approved Task Contract → Orchestration Agent → Calling Agent`

During execution, the flow is bidirectional. Calling reports structured events to Orchestration. When a new user decision is required, Orchestration pauses or safely deflects the live interaction and invokes Planning. Planning returns a versioned amendment only after the user approves it.

## 2. Design principles

1. The approved Task Contract, not model confidence, defines authority.
2. Orchestration may act autonomously only inside that contract.
3. Anything outside the contract returns through Planning for user approval.
4. The Calling Agent receives the minimum information needed for one interaction.
5. Memory access is explicit per thread and only approved fields may cross into execution.
6. Interrupted conversations never imply agreement.
7. Execution must be resumable, idempotent, auditable, and transparent about cost.
8. Models are selected independently for each role through evaluation, not by using one provider for the entire system.

## 3. Agent boundaries

### 3.1 Planning Agent

The Planning Agent collaborates with the user before execution and whenever execution raises a new decision. It:

- Determines the real objective and desired outcome.
- Adopts the likely recipient's perspective to anticipate questions and edge cases.
- Asks natural, categorically bundled clarifications rather than one question at a time.
- Suggests options without treating a suggestion as approval.
- Identifies relevant attachments or explicitly selected Memory entries.
- Produces the Task Contract for the user's review.
- Obtains explicit approval before execution.
- Produces a narrowly scoped amendment when Orchestration returns a runtime exception.

Planning does not schedule providers, launch calls, own retries, classify runtime events, or silently expand the approved objective.

### 3.2 Orchestration Agent

The Orchestration Agent is a stateful runtime supervisor supported by a deterministic workflow engine. It owns the task after approval and:

- Validates that the approved contract is executable.
- Schedules or initiates execution.
- Compiles a least-privilege brief for the Calling Agent.
- Selects and invokes the appropriate execution capability.
- Monitors structured call events in real time.
- Determines whether an event is inside, outside, or forbidden by the contract.
- Invokes Planning when the user must make a new decision.
- Pauses, continues, retries, reschedules, waits for callbacks, or stops execution.
- Maintains contract versions and prevents stale versions from being used.
- Updates customer-visible status, outcome, recording, transcript, usage, and cost.
- Ensures cancellation and retry operations are idempotent.

Orchestration does not invent a new goal, grant its own approval, expose additional information, or converse freely with the external recipient.

### 3.3 Calling Agent

The Calling Agent performs one real-time voice interaction. It:

- Introduces itself according to the approved delivery identity: **My Assistant** or **My Voice**.
- Pursues the goal stated in its call brief.
- Uses only the facts and Memory fields included in that brief.
- Acts within the approved choices and negotiation limits.
- Deflects out-of-scope questions naturally.
- Reports connection state, facts, options, approval triggers, and outcomes as structured events.
- Leaves voicemail only when the contract permits it.
- Pauses, continues, or ends when instructed by Orchestration.

Calling does not change the task, approve commitments, retrieve broader Memory, inspect source files, or decide whether a new development is authorized.

## 4. Hybrid orchestration design

Orchestration is not an unrestricted language model controlling the system. It is a subsystem with two parts:

1. **Workflow engine:** owns durable state, schedules, timers, contract versions, retries, idempotency, cancellation, event ordering, and audit history.
2. **Reasoning supervisor:** interprets unexpected but bounded runtime events and recommends a permitted transition or escalation.

The workflow engine enforces the final decision. A reasoning output cannot bypass contract validation, disclosure rules, cost limits, or required approvals.

## 5. Task Contract

Planning sends Orchestration a versioned, user-approved Task Contract containing:

- Thread identifier, contract version, and approval record.
- Task or message type.
- Recipient name and verified contact method.
- Subject, objective, and definition of success.
- Delivery identity: My Assistant or My Voice.
- Interaction behavior:
  - Task: reason and negotiate only within approved limits.
  - Message—deliver only: deliver the approved message without engaging.
  - Message—engage: converse only within the supplied context and boundaries.
- Approved facts, attachment-derived facts, and Memory disclosures.
- Allowed actions, choices, ranges, and negotiation limits.
- Approval triggers and forbidden actions.
- Immediate or scheduled execution time.
- Retry, voicemail, callback, and fallback rules.
- Notification preferences and urgency routing.
- Estimated cost, authorized cost limit, and any time limit.

The user approves the contract as a whole. Permission persists within the same thread, including follow-ups, until revoked or replaced. Retask and Forward create a new contract that must be approved or edited before use.

## 6. Calling Agent brief

Orchestration compiles a minimal call brief for each call. The brief includes only:

- Recipient and destination number.
- Approved introduction and delivery identity.
- Goal for this call.
- Relevant approved statements and facts.
- Allowed actions and negotiation limits.
- Questions the caller may answer.
- Approval triggers, forbidden actions, and natural deflection language.
- Voicemail, hold, and call-ending instructions.

The brief explicitly excludes:

- The full planning conversation.
- Source attachments.
- Complete Memory entries.
- Unrelated contacts or tasks.
- Payment details and account history.
- Any fact not approved for this thread.

## 7. Lifecycle and status model

### 7.1 Internal orchestration states

1. **Ready:** approved and eligible to run.
2. **Scheduled:** waiting for the selected date and time.
3. **Dispatching:** validating the contract, compiling the brief, and starting execution.
4. **In call:** the Calling Agent is connected.
5. **Waiting for user:** a new approval or piece of information is required.
6. **Waiting for external reply:** the recipient will respond or call back later.
7. **Retry scheduled:** a retry is allowed and scheduled after a temporary failure.
8. **Completed:** the approved outcome was reached or the permitted message was delivered.
9. **Failed:** execution stopped without completing the objective.
10. **Cancelled:** future activity is prohibited.

### 7.2 Customer-visible statuses

The Inbox uses fewer, human-friendly statuses:

| Customer status | Internal states represented |
| --- | --- |
| Pending | Ready, Scheduled, Dispatching, Retry scheduled |
| In progress | In call or an actively managed multi-step execution |
| Needs you | Waiting for user |
| Waiting for reply | Waiting for external reply |
| Completed | Completed; outcome artifacts are available |
| Couldn't complete | Failed; reason and next actions are shown |

Cancelled tasks remain in history but do not appear as active Inbox work.

## 8. Authority model

### 8.1 Orchestration may act automatically

Inside the approved contract, Orchestration may:

- Start at the approved time.
- Share approved fields with the Calling Agent.
- Use approved dates, limits, and preferences.
- Wait on hold and navigate phone menus.
- Retry within the approved window, count, and budget.
- Leave an approved voicemail.
- Record task state, cost, transcript, recording, and outcome.

### 8.2 Orchestration must return to Planning

A new user decision is required before Orchestration may:

- Accept a new fee or commitment.
- Choose a date, time, or option outside approved limits.
- Disclose another Memory field or attachment-derived fact.
- Change the recipient, channel, delivery identity, or task goal.
- Exceed an approved cost, retry, or time limit.
- Resolve conflicting user instructions.
- Respond to a material situation not anticipated by the contract.

Planning must present these matters as a consolidated, contextual decision rather than a sequence of fragmented questions.

### 8.3 Hard prohibitions

No agent may:

- Invent personal or sensitive facts.
- Expose source files or unapproved Memory.
- Approve on the user's behalf.
- Silently broaden the objective.
- Hide costs, failures, or outcomes.
- Continue after cancellation.
- Alter recordings, transcripts, approvals, or audit history.

When classification is uncertain, Orchestration chooses the more restrictive category.

## 9. Real-time events

Operational coordination uses structured events. Natural-language explanations may accompany an event but cannot replace it.

### 9.1 Planning to Orchestration

- **Task approved:** begin immediately or schedule execution.
- **Contract amended:** apply a user-approved change as a new version.
- **Task rescheduled:** replace the future execution time.
- **Task cancelled:** stop future activity and end active work safely.

### 9.2 Calling to Orchestration

- **Call started / connected.**
- **Voicemail reached / no answer / busy.**
- **Information received:** recipient supplied facts or options.
- **Decision required:** a fee, commitment, disclosure, or user choice is needed.
- **Callback promised.**
- **Call ended / call failed.**

Calling reports what happened. It does not classify the event as authorized.

### 9.3 Orchestration actions

- Start, pause, continue, or end a call.
- Request a consolidated decision from Planning.
- Schedule a retry or wait for an external reply.
- Record an outcome and update the Inbox.

## 10. Runtime approval loop

When Calling reports a development that is outside the contract:

1. Orchestration instructs Calling to pause, deflect naturally, arrange a callback, or end safely.
2. Orchestration sends Planning a decision request containing the new fact, why it matters, available choices, recommendation, time sensitivity, cost or privacy impact, and default behavior if the user does not respond.
3. Planning communicates with the user and obtains an explicit decision.
4. Planning returns a versioned approved amendment.
5. Orchestration validates and records the amendment.
6. Orchestration compiles an updated minimal brief.
7. Calling resumes if the call remains active; otherwise Orchestration schedules the appropriate follow-up.

## 11. Inbound callbacks

Callbacks belong to the original task thread when the incoming number matches the known outgoing recipient number and available context supports the match.

- A verified match may resume within the approved thread contract.
- A call from an unrecognized or mismatched number receives no private information. Voizzz may take a message and pass it to the user.
- An inbound event that requires a new user decision follows the same Orchestration-to-Planning approval loop.

## 12. Failure and recovery

| Situation | Required behavior | Customer status |
| --- | --- | --- |
| No answer or busy | Leave voicemail only if approved; otherwise retry within the contract | Pending |
| Call drops midway | Save partial evidence, treat commitments as unconfirmed, then retry or ask the user | Pending or Needs you |
| User unavailable during a live decision | Deflect naturally, end or arrange callback, and never guess | Needs you |
| Recipient promises a callback | Persist the task and validate the inbound number before sharing context | Waiting for reply |
| Provider or platform outage | Retry without duplicating the call; stop transparently when the safe window expires | Pending or Couldn't complete |
| Contract is stale or conflicting | Do not dispatch; return a consolidated clarification through Planning | Needs you |
| Cancellation arrives during a call | End politely at the next safe moment and preserve evidence | Cancelled |
| Duplicate event arrives | Recognize it as already processed; do not repeat calls, charges, or approvals | No visible change |

The runtime must guarantee:

- No duplicate calls or charges.
- No assumed agreement after interruption.
- No loss of partial events or transcripts.
- No silent failure.

## 13. Persistence and auditability

For every task thread, Voizzz records:

- Every Task Contract version and its approval evidence.
- Every disclosure included in a Calling Agent brief.
- Every state transition and the event that caused it.
- Every provider invocation, retry, callback match, and cancellation.
- Decision requests and user-approved amendments.
- Recording, transcript, summary, duration, usage, and cost.

Audit history is append-only. Corrections create new entries or versions rather than rewriting past execution.

## 14. Model and provider evaluation

Models are evaluated independently by role using a shared library of representative Voizzz scenarios.

### 14.1 Planning evaluation

- Objective comprehension.
- Natural, bundled clarification quality.
- Recipient-perspective edge-case identification.
- Refusal to invent facts.
- Task Contract completeness and accuracy.
- Correct and explicit approval behavior.

### 14.2 Orchestration evaluation

- Correct authorization classification.
- Valid state transitions.
- Correct escalation to Planning.
- Recovery without duplicate external actions.
- Strict use of approved information and tools.
- Accurate status, cost, and failure reporting.

### 14.3 Calling evaluation

- Voice quality, latency, and natural turn-taking.
- Interruption and phone-menu handling.
- Adherence to the minimal brief.
- Natural deflection of out-of-scope questions.
- Structured event accuracy.
- Recording and transcript quality.

### 14.4 End-to-end release gates

A release candidate must demonstrate:

- Zero observed unauthorized commitments in the release evaluation set.
- Zero observed unapproved disclosures in the release evaluation set.
- No duplicate calls or charges under retries and duplicate events.
- Reliable pause, resume, retry, callback, reschedule, and cancellation behavior.
- Acceptable task success, latency, and cost for the intended release cohort.

Every candidate runs against the same scenario set. Planning, Orchestration, and Calling may use different winning models or providers. Model, prompt, tool, contract, and policy changes require re-evaluation of affected scenarios before release.

## 15. Implementation boundaries

The architecture should be implemented as independently testable modules:

- Planning Agent service.
- Task Contract and approval service.
- Orchestration reasoning supervisor.
- Durable workflow and scheduling engine.
- Policy and disclosure validator.
- Call-brief compiler.
- Calling Agent adapter layer.
- Event store and task-state projection.
- Notification and user-approval gateway.
- Recording, transcript, outcome, usage, and cost service.
- Evaluation harness and scenario library.

Provider-specific implementations sit behind adapters. Replacing a reasoning model, realtime voice model, telephony provider, or transcription provider must not change the Task Contract or event interfaces.

## 16. Scope decisions

- This document defines role boundaries and runtime behavior; it does not select specific models or vendors.
- Model selection follows the approved evaluation process rather than a design-time preference.
- The current prototype remains a workflow wireframe. Visual design, typography, colors, and production component styling are a separate high-fidelity design phase.
- The first production slice should validate one outbound task journey end to end before expanding to inbound calls, complex multistep workflows, or provider redundancy.

