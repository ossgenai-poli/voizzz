# Decision: task creation is a conversation, not a task-specific form

Status: agreed in product discussion; prototype v3 demonstrates the direction.

## Correction to the first mock-up

The first daycare screen exposed child name and arrival time as fixed input fields.
That generalized a particular scenario into a reusable task template and prematurely
assumed preparation would finish after one reply.

The reusable interface is the conversation. Task-specific structure belongs behind
the interface, in the planning agent's execution brief.

## Agreed behavior

- Keep one continuous conversation with one text/voice input surface.
- Allow multiple replies, clarifications, and changes of direction without a fixed
  number of exchanges.
- Group related questions intelligently; avoid serial micro-questions and lengthy
  questionnaires.
- Anticipate what the recipient will ask and settle foreseeable decisions during
  preparation.
- Keep task-specific facts in natural conversation, not mandatory task-specific UI
  fields. Recipient/contact references may be shown compactly when resolved.
- Preserve previous context and user corrections. Later corrections supersede earlier
  instructions; a real planning agent must resolve ambiguity before execution.
- Treat review as a checkpoint. The user may continue discussing before approving.
- Show estimated cost and the simple Call now / Schedule options at handoff.
- No execution until explicit approval. Changing the plan requires renewed approval.

## Agent responsibility boundary

The task-planning agent and calling agent are separate roles. The planning role
anticipates questions and builds the authorized execution brief. The caller reasons
from confirmed facts, converses naturally, and handles variations within the brief.
Material new decisions are deferred to the user, using their name naturally.

Delivery identity (My Assistant / My Voice) never expands authority.

## Preserved lifecycle agreements

- Unapproved work is a Draft and should be recoverable.
- Scheduled and active production work must not depend on an open browser.
- Cancel stops pending work; an active caller ends politely.
- Delete automatically cancels work and retries.
- Restore recovers history, never automatic execution.
- Summary, recording, transcript, and unresolved follow-up remain available after calls.

## What this local prototype does and does not establish

It demonstrates conversation layout, repeated replies, corrections, review, explicit
approval, simple scheduling, sample outcomes, and local draft persistence.

It uses scripted assistant responses and a rule-based review preview rather than real reasoning.
It does not validate whether a task is sufficiently specified or safe to execute.
No production architecture, provider choice, pricing calculation, or prompt format
is selected by this code. Do not promote the demo state machine into production by
adding credentials or a real calling API.

## Review questions

- Does the conversation feel natural and easy to amend?
- Is the transition from discussion to approval clear without feeling like a wizard?
- Should a compact contact reference appear during preparation or only at review?
- Is the plan review too verbose, or does it need an expandable detail section?

These questions invite feedback; they are not new approved requirements.

## Chat presentation refinement

The user's annotated references call for a full-height chat experience, not a
conversation embedded in a document-like card. The empty state centers the prompt
and composer. After sending, user messages appear on the right, assistant responses
on the left, and the reply composer stays at the bottom while the conversation scrolls.
The shared Inbox is the default entry point. Tasks and Messages are sibling tabs in
that same screen, with Tasks selected by default. Compose first asks whether the user
is creating a Task or a Message; the chosen intent opens its own creation journey.
Compose → Task opens a fresh conversation without discarding previous drafts.

The left navigation contains Compose, Inbox, Drafts, and Contacts. It does not
duplicate Tasks and Messages as separate destinations. Drafts holds incomplete
planning; Inbox holds assigned tasks that are pending, active, awaiting attention,
or completed but not marked done. Selecting an inbox row
opens that task or message's inner record, where its status, conversation, and
outcome belong. The Message creation journey remains intentionally unspecified until
it is designed; the prototype shows only its entry point and empty inbox state.

Task composition may begin with optional To and Subject fields. They orient the
conversation without becoming a required form. When an `@name` matches Contacts,
the contact name and phone are populated. A supplied or resolved fact must not be
asked for again.

Assigned task records are structured around Task summary, Subject, Current status,
execution timing, and activity. Current status includes the latest update in the same
section. Transcript, recording, and outcome appear only when execution has produced
them. Follow-up uses a Reply-style action under the same subject; it may create a new
pending execution without starting a new thread.

Inbox rows mirror familiar mail density: an unlabeled subtle star followed by Name,
Subject, Status, and Time. The star toggles independently and never opens the record.
Tasks and Messages use the same lifecycle presentation.

For pending work, Edit changes only To or Subject in place. Retask opens Compose with
To and Subject prefilled so the goal can be redefined; the original remains active
until the user explicitly chooses Save Retask, at which point it is cancelled and the
replacement is stored as a Draft. Forward is non-destructive and available on pending
and completed work. It retains Subject and task summary, clears To, and provides an
Additional context field for provider-specific differences. Completed voice work also
offers Listen and Download transcript.

## Never ask for information already supplied

The planning agent must first extract and acknowledge the facts in the user's latest
instruction before generating clarification questions. It asks only for missing or
ambiguous information. For example, “Ask Vinni Aunty to pick up Charu” already
identifies both the intended recipient and the outcome. The next response may ask for
a missing phone number, pickup time, location, or authority boundary, but must never
ask who to contact.

This applies to information supplied directly, resolved from an explicit contact
mention, confirmed earlier in the current conversation, or retrieved from an approved
default. If multiple possible contacts match, the agent explains the ambiguity and
asks the user to choose; it does not discard the recognized name and restart intake.

## Three-box handoff

At the end of planning, show three consistent output boxes: Contact name, Phone
number, and What I’ll discuss. This is an agent-populated summary of the conversation,
not a task-specific intake form. Keep the option to return to the conversation for
corrections. Estimated cost and Call now / Schedule stay below the summary.

The three values provide a stable handoff presentation across task types. They do
not replace the full context, permissions, or fallback instructions in the eventual
calling agent's execution brief. Prototype extraction is intentionally limited and
is not suitable for real calls.

