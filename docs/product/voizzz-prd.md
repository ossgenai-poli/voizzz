# Voizzz Product Requirements Document

**Version:** 1.0 product baseline  
**Date:** September 7, 2026  
**Status:** Consolidated from approved product and UX decisions  
**Product:** Voizzz

## 1. Product definition

Voizzz is a voice-first AI assistant for communication and delegated everyday tasks. It allows a person to ask an AI assistant to make or receive calls, deliver messages, and complete bounded real-world work on the person's behalf.

Gmail is optimized around reading and writing text. Voizzz uses a similarly familiar inbox-and-thread mental model, but voice is the primary execution medium. Text and email remain available when the user's chosen workflow or recipient requires them.

Voizzz is not intended to replace ordinary person-to-person voice messages that a user can already send from a phone. Its value is performing communication the user cannot conveniently perform themselves: reasoning through a task, calling an organization, operating at a scheduled time, handling a bounded conversation, following up, and preserving the outcome.

## 2. Product promise

A user should be able to give Voizzz a short instruction such as:

> Call the daycare and tell them I will be twenty minutes late. I am in a meeting and cannot call myself.

Voizzz should understand supplied facts, identify only material gaps, prepare for likely recipient questions, obtain authorization for consequential decisions, perform the communication, and return a useful outcome without requiring the user to manage every step.

The product promise is **thinking and doing within explicit user authority**.

## 3. Target users

The primary audience is everyday Gmail-style users rather than technical operators. They understand Compose, Inbox, Drafts, contacts, subjects, threads, replies, and scheduled communication.

Representative users include:

- Busy parents coordinating daycare, school, caregivers, and family.
- People booking, changing, or cancelling appointments.
- Professionals who cannot interrupt meetings to make routine calls.
- People scheduling personal greetings and reminders.
- Users who want an assistant to communicate consistently across phone, text, and email.

## 4. Core product principles

### 4.1 Voice first, not voice only

Calling is the primary channel and the defining experience. Text and email are alternate delivery and notification channels, not the center of the product.

### 4.2 Task and Message are explicit intents

Voizzz never asks an AI model to guess whether the user intends a Task or Message. Compose requires the user to select one of two product paths:

- **Task:** achieve an outcome through a potentially two-way conversation.
- **Message:** communicate approved wording through call, text, or email.

### 4.3 Intelligence belongs behind a simple interface

The reusable creation interface is a conversation. Task-specific details such as a child's name, appointment type, or insurance constraints belong in the conversation and execution contract, not as universal form fields.

### 4.4 Never ask for information already supplied

The Planning Agent extracts and acknowledges names, outcomes, dates, constraints, and contact references already present in the user's instruction. It asks only about missing, ambiguous, or consequential information.

### 4.5 Clarify comprehensively and naturally

Voizzz avoids one-question-at-a-time interrogation. Related clarifications are grouped categorically and presented conversationally. Planning should feel like working with a capable human assistant.

### 4.6 Suggest, but never silently decide

The Planning Agent may recommend wording, alternatives, dates, tactics, or fallback behavior. The user chooses what is approved. Suggested wording for Messages appears only when requested.

### 4.7 Least privilege by thread

Attachments and Memory never create implicit execution authority. The user approves what may be used for a thread, and the Calling Agent receives only the approved subset.

### 4.8 Transparent pay-as-you-go economics

There is no subscription hierarchy and no privileged feature tier. Every user can access every feature and pays for actual usage. Estimated cost appears before execution. Material changes to ongoing storage or usage cost require timely notification and authorization.

### 4.9 Outcome over activity

The user does not listen to calls live by default. Voizzz returns the outcome summary, recording, transcript, current status, and any required follow-up.

## 5. Product vocabulary

| Term | Meaning |
| --- | --- |
| Compose | Starts creation and asks whether the user wants a Task or Message |
| Task | Delegated work intended to achieve an outcome |
| Message | User-approved communication delivered by call, text, or email |
| Thread | One subject and its related planning, executions, follow-ups, approvals, and outcomes |
| Subject | Human-readable context for a thread, analogous to an email subject |
| My Assistant | The agent identifies itself as the user's assistant and communicates on the user's behalf |
| My Voice | The approved communication is delivered using the user's cloned voice and represents the user directly |
| Planning Agent | Works with the user to define and approve the Task Contract |
| Orchestration Agent | Supervises approved execution, state, permissions, exceptions, retries, callbacks, and outcomes |
| Calling Agent | Performs a tightly scoped real-time voice interaction |
| Memory | User-managed reusable personal information that requires explicit thread authorization |

## 6. Information architecture

The primary navigation contains:

1. **Compose**
2. **Inbox**
3. **Drafts**
4. **Contacts**
5. **Memory**
6. **Settings**

Inbox and Drafts each provide **Tasks** and **Messages** as sibling tabs. Tasks are selected by default in Inbox.

Threads follow an email-like subject model. Communication with the same recipient becomes a new thread when the subject or intent changes. Follow-ups under the same subject remain in the existing thread.

## 7. Onboarding

### 7.1 Required account setup

Onboarding gathers the user's name, verified communication methods, time zone, payment method, and notification preferences. The user may add contacts during onboarding or later.

### 7.2 Outgoing number choices

Every user receives access to a shared pool number for outgoing calls. Shared-number use does not provide general incoming calling.

The user may purchase a dedicated number during onboarding or at any later time. The product presents available numbers from the selected telephony provider and clearly states the recurring number cost before purchase. The initial working assumption is approximately $0.50 per month, subject to provider verification before launch.

### 7.3 Communication preferences

Settings determine how Voizzz contacts the user by severity and urgency. Text is the minimum default notification channel. Urgent matters may use text, email, and phone according to user preferences.

### 7.4 Connections

Users may connect services such as Google Calendar. Connections remain optional. When authorized, Planning may use them to propose available times and reduce unnecessary questions.

## 8. Compose

Selecting Compose opens a simple choice:

- Create a Task
- Create a Message

The chosen intent opens its dedicated journey. The product does not infer or switch intent silently.

Both journeys may begin with optional fields:

- **To:** a name, organization, phone number, email address, or saved contact.
- **Subject:** a short description of the context.

These fields orient the conversation but do not become a rigid intake form. An `@name` mention resolves a saved Contact and populates its available phone or email details. If a reference is ambiguous, Voizzz presents the matches and asks the user to choose.

The composer supports text input, microphone input, and file attachments. Voice transcription remains editable and is never sent automatically.

## 9. Task journey

### 9.1 Creation

The Task journey is an open conversation with the Planning Agent. The user may provide an initial instruction, use a guided starting example, correct information, or change direction over multiple turns.

The Planning Agent:

- Extracts supplied facts before asking questions.
- Takes the perspective of the intended recipient and anticipates likely questions.
- Resolves foreseeable edge cases during planning.
- Uses connected calendars or services only when authorized.
- Suggests reasonable options and boundaries.
- Distinguishes trivial conversational flexibility from consequential user decisions.
- Builds an approved Task Contract for execution.

If the browser closes or planning stops midway, the unfinished conversation remains a Draft.

### 9.2 Review and approval

The planning handoff always includes three prominent summary boxes:

1. Contact name
2. Phone number
3. What the assistant will discuss

Supporting review information includes approved Memory fields, attachment-derived disclosures, constraints, estimated cost, and execution timing.

The user may return to the conversation to make corrections. Nothing executes until the user explicitly approves the plan.

### 9.3 Execution timing

The final timing choice is intentionally simple:

- Call now
- Schedule by date and time

The user can cancel or reschedule an assigned task later.

### 9.4 Runtime authorization

The Calling Agent may reason and converse within the approved contract. It may not make a material decision that the user did not authorize.

When a recipient introduces a new fee, commitment, date, disclosure, or materially different arrangement:

1. Calling deflects naturally or pauses.
2. Orchestration checks the approved contract.
3. Planning asks the user one consolidated question with relevant context and options.
4. Execution continues only after a versioned approval amendment.

If real-time authorization is inappropriate or unavailable, Calling says it will check with the user, ends or arranges a callback, and Voizzz marks the thread **Needs you**.

### 9.5 Outcome

The completed task record contains:

- Task summary
- Subject
- Current status and latest update
- Execution timing
- Outcome summary
- Recording with Listen control
- Transcript with download control
- Activity history
- Reply-style follow-up
- Forward action

The user may mark work done or delete it. Deleting an active or pending task automatically cancels its future execution and retries.

## 10. Message journey

Message creation is deliberately lighter than Task creation. It is primarily a one-shot composition experience rather than a probing planning conversation.

The user selects:

- Recipient
- Subject
- Delivery channel: call, text, or email
- Delivery identity: My Assistant or My Voice, when available
- Call behavior: Deliver only or Engage in conversation
- Immediate or scheduled delivery

### 10.1 Suggested wording

Voizzz does not rewrite by default. The user may explicitly request suggested wording or alternate drafts, similar to an optional writing assistant. The user approves the final message before delivery.

### 10.2 Deliver only

Calling delivers the approved message without improvising or engaging in a broader conversation. If appropriate and authorized, it leaves the same message as voicemail.

### 10.3 Engage in conversation

Selecting Engage opens a context area. The user provides the facts and boundaries the agent may use. If little context is provided, the Calling Agent operates only with that limited knowledge and does not invent background.

The post-call experience remains consistent with Task: summary, recording, transcript, status, and follow-up appear in the same thread model.

## 11. Inbox and thread records

### 11.1 Inbox semantics

Inbox contains assigned work rather than unfinished planning. It includes tasks and messages that are pending, executing, waiting for the user, waiting for an external reply, completed but not marked done, or unable to complete.

Drafts contains unfinished planning and unsent Messages.

### 11.2 Inbox row

Rows use familiar mail density and show:

- A subtle unlabeled star
- Name
- Subject
- Status
- Time

Selecting the star must not open the thread.

### 11.3 Customer-visible statuses

- Pending
- In progress
- Needs you
- Waiting for reply
- Completed
- Couldn't complete

Cancelled items remain available in history rather than as active Inbox work.

### 11.4 Pending actions

- **Edit:** changes only To or Subject on the assigned work.
- **Retask:** opens Compose with To and Subject prefilled so the goal can be redefined. The original remains active until Save Retask; saving cancels the original and creates the replacement Draft.
- **Forward:** preserves the original task, Subject, and task summary; clears To; and allows recipient-specific additional context.

### 11.5 Completed actions

- Listen to recording
- Download transcript
- Reply under the same Subject
- Forward the reusable goal to another recipient
- Mark done or delete

## 12. Contacts

Contacts are reusable people and organizations containing:

- Clear display name
- Phone number
- Email address
- Optional relationship or category

Users can add contacts individually and import them. During Compose, `@name` resolves a contact. When a user supplies a new name and number while planning, Voizzz saves it as a proposed Contact for confirmation rather than repeatedly asking in future tasks.

When the same generic reference is used repeatedly, Voizzz may progressively suggest a default:

- First use: request missing contact details.
- Later use: confirm the previously used contact.
- Repeated use: offer to make that contact the default for the reference.

The user can change or remove defaults in Contacts.

## 13. Memory and attachments

### 13.1 Attachments

Attachments belong to one Task or Message thread. Supported product formats include PDF, DOCX, XLS, XLSX, TXT, and MD. The Planning Agent may inspect an attachment, but Calling receives only facts the user approves for disclosure.

### 13.2 Memory structure

Memory contains two tabs:

- **My Memory:** organized, editable structured entries.
- **Files:** uploaded source files and clearly named text notes.

Each structured entry includes name, value, section, source, verification date, and sensitivity.

### 13.3 Creating Memory

Memory can be created:

1. Explicitly from the Memory section.
2. During Task or Message creation when either the user or Planning identifies reusable information.

A source file may produce proposed structured entries. Nothing becomes Memory until the user approves the individual entries. Users may add, edit, or remove Memory at any time.

### 13.4 Using Memory

Memory is never available to a task by default. Typing `@memory` opens a picker for individual entries. Selection is a proposal; the final review shows a simple warning that the thread will use named Memory items and offers **Approve** or **Edit**.

Approval belongs to the thread and carries forward to follow-ups. It does not automatically transfer to Retask or Forward. Those journeys present earlier items as proposed selections requiring approval or editing.

Revocation stops future access but cannot undo information already disclosed.

## 14. Agent architecture

Voizzz uses three separate agents:

- **Planning Agent:** defines the approved task with the user.
- **Orchestration Agent:** supervises the approved task lifecycle in real time.
- **Calling Agent:** performs the external voice interaction.

Orchestration is a hybrid of a durable workflow engine and a reasoning supervisor. It owns states, schedules, policy checks, contract versions, retries, callbacks, cancellations, costs, and outcomes. Calling receives a minimal brief rather than the planning conversation or complete Memory.

The detailed architecture is specified in [Voizzz Orchestration Agent Architecture](../superpowers/specs/2026-09-07-orchestration-agent-architecture-design.md).

### 14.1 Product administration

Voizzz Admin is a separate product control plane for configuring product-wide behavior and overseeing operations. It is not part of the customer application and does not configure personal user choices.

Engineering owns the foundational platform and approved providers. Admin configures system prompts, agent behavior, orchestration, approved tools, channels, policies, pricing rules, evaluations, and releases. Customers remain the sole authority for their personal preferences, Contacts, Memory, channel selections, and Task or Message approvals.

For the Voizzz SaaS deployment, authorized Admins may inspect aggregate and individual-call operations, including recordings and transcripts. Every sensitive access is immutably audited. In a private implementation, Voizzz personnel have no access to the private customer's call data.

All Admin configuration changes follow **Draft → Test → Publish → Rollback**. Approved work remains pinned to the configuration version under which the user approved it.

The detailed boundary and Admin information architecture are specified in [Voizzz Admin Product Control Plane](voizzz-admin-control-plane.md).

## 15. Incoming calls and dedicated numbers

Shared outgoing numbers do not support a general callback conversation. Dedicated-number customers may configure:

- Call forwarding directly to the user.
- AI answering based on the matched originating number and an existing task thread.

For the first implementation, trust is rule-based. Voizzz may continue a contextual conversation only when the incoming number matches the known outgoing recipient number and available context supports the match. A mismatched or unknown caller receives no private information; Voizzz may take a message and pass it to the user.

Inbound messages requiring action enter the relevant Task thread with **Waiting for reply** or **Needs you** status. The user may call back personally or provide Planning with additional context to continue.

## 16. Voice cloning

Voice cloning is an optional feature available to every user under the pay-as-you-go model. It may carry a one-time provider cost, disclosed before creation.

The product must evaluate first-party platform capabilities and third-party providers for quality, consent, safety, latency, and cost before implementation. My Voice changes delivery identity, not execution authority.

## 17. Pricing, billing, and storage

### 17.1 Pricing model

- No subscription fee.
- No commitment fee.
- No feature-based user tier.
- Pay only for measured feature usage and selected persistent resources.

### 17.2 Cost disclosure

Every Task and Message shows an estimated execution cost before approval. Dedicated numbers, voice cloning, long-term storage, and other billable resources show their own estimates and recurring or one-time nature.

Final cost may differ from an estimate because call duration and provider usage vary. The completed record shows actual measured usage and cost when available.

### 17.3 Persistent storage authorization

Voizzz periodically recalculates estimated storage cost as retained recordings, transcripts, attachments, Memory files, and task history grow. A material increase triggers a notification offering deletion, retention changes, or authorization for the new amount.

The product must not create an unexpected recurring charge merely because data accumulated silently.

## 18. Settings

Settings uses a Gmail-like tabbed layout. The approved section structure is:

1. General
2. Communication
3. Phone & Voice
4. Connections
5. Payments & Usage
6. Privacy & Data

Detailed controls will be defined as their workflows are designed. The current prototype intentionally provides placeholders rather than inventing defaults.

## 19. Notifications

Voizzz communicates status and authorization requests through user-configured channels. Text is the minimum default. Urgent matters can use text, email, and phone.

Notifications must be concise and actionable. A runtime approval request includes:

- What changed
- Why it matters
- Available choices
- Voizzz's recommendation
- Time, privacy, and cost impact
- What happens if the user does not respond

## 20. Privacy and safety requirements

- No Memory access without explicit thread approval.
- No Calling Agent access to source files or unrelated information.
- No material commitment without authorization.
- No invented personal details.
- No continued execution after cancellation.
- No disclosure to an unverified inbound caller.
- Append-only approval and execution history.
- Clear distinction between My Assistant and My Voice.
- Explicit consent and provider safeguards for voice cloning.
- Download and deletion controls for user data.

## 21. Reliability requirements

- Approved scheduled work runs without an open browser.
- Duplicate events cannot produce duplicate calls or charges.
- Dropped calls preserve partial transcripts and never imply agreement.
- Provider outages retry only within approved time and cost limits.
- Stale or conflicting contracts cannot execute.
- Cancellation during a live call closes the interaction politely at the next safe moment.
- Every failure is visible with its reason and a useful next action.

## 22. Product analytics and success measures

The initial product should measure:

- Percentage of approved tasks that reach the user-defined outcome.
- Percentage of tasks completed without further user intervention.
- Planning turns required before approval.
- Rate of redundant clarification questions.
- Runtime escalation rate and user response time.
- Calling brief adherence and out-of-scope deflection accuracy.
- Unauthorized commitment or disclosure incidents.
- Call connection, voicemail, retry, and callback rates.
- Transcript and outcome-summary usefulness.
- Estimated-versus-actual cost accuracy.
- User completion, cancellation, forwarding, and retasking behavior.

Unauthorized commitments and unapproved disclosures are release-blocking failures in evaluation.

## 23. Initial production scope

The first production slice should implement one outbound Task journey end to end:

1. Compose a Task.
2. Plan conversationally.
3. Resolve or enter a Contact.
4. Optionally attach a file or explicitly select Memory.
5. Review the three-box handoff and complete Task Contract.
6. Approve Call now or Schedule.
7. Execute through Orchestration and Calling.
8. Handle one runtime approval loop.
9. Return status, outcome summary, recording, transcript, usage, and cost.
10. Support Reply, cancel, reschedule, Retask, and Forward.

After this slice passes evaluation, expansion proceeds to Message delivery, Engage mode, inbound callbacks, dedicated numbers, calendar integrations, voice cloning, and provider redundancy.

## 24. Explicitly deferred decisions

The following decisions are intentionally made through research and evaluation rather than assumed in this PRD:

- Specific reasoning models for Planning and Orchestration.
- Realtime voice model and telephony provider.
- Voice-cloning provider.
- Exact price formulas and margins.
- Dedicated-number inventory integration details.
- Detailed Settings controls.
- Final visual identity, color palette, typography, component styling, and responsive design.

Deferral does not remove these requirements. It prevents the prototype's temporary technical and visual choices from becoming accidental production architecture.

## 25. Documentation hierarchy

This PRD is the canonical product baseline. Supporting documents provide greater detail:

- [UI and Interaction Blueprint](voizzz-ui-blueprint.md)
- [Conversational Task Creation](../decisions/conversational-task-creation.md)
- [Memory, Contacts, and Attachments](../decisions/memory-contacts-attachments.md)
- [Orchestration Agent Architecture](../superpowers/specs/2026-09-07-orchestration-agent-architecture-design.md)
- [Admin Product Control Plane](voizzz-admin-control-plane.md)

When a supporting document conflicts with this PRD, the most recently approved explicit product decision governs and the PRD should be updated in the same change.

