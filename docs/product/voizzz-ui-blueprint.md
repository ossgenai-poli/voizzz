# Voizzz UI and Interaction Blueprint

**Version:** 1.0 working experience baseline  
**Date:** September 7, 2026  
**Status:** Approved interaction structure; visual design remains provisional

## 1. Purpose

This document records the approved Voizzz screen structure and behavior demonstrated by the local journey prototype. It is the working design reference for high-fidelity visual design and production frontend planning.

The current green-and-white prototype is not the approved brand system. Colors, typography, spacing, icons, button styling, animation, responsive behavior, and accessibility presentation require a complete visual-design pass before production implementation.

## 2. Experience model

Voizzz borrows Gmail's familiarity without copying email behavior mechanically:

- Compose begins new work.
- Inbox contains assigned Tasks and Messages.
- Drafts contains unfinished composition.
- Each Subject forms a thread.
- Reply continues the thread.
- Forward reuses the intent for another recipient.
- Star is a subtle row-level action.

Creation is conversational. Assigned work becomes a structured record rather than remaining a chatbot page.

## 3. Global shell

### 3.1 Header

The persistent header contains:

- Voizzz brand mark
- Environment or prototype notice when applicable
- Current user and outgoing-number identity
- Access to account-level controls

### 3.2 Primary navigation

The left navigation order is:

1. Compose
2. Inbox
3. Drafts
4. Contacts
5. Memory
6. Settings

Tasks and Messages do not appear as duplicate left-navigation destinations. They are tabs inside Inbox and Drafts.

### 3.3 Responsive intent

Desktop uses persistent navigation and a broad content canvas. Smaller screens collapse navigation while preserving Compose, Inbox, current thread status, and the bottom composer. Production design must avoid forcing desktop mail density onto a narrow phone screen.

## 4. Compose intent chooser

Selecting Compose presents two clear choices:

- **Task:** ask the assistant to accomplish something.
- **Message:** deliver approved communication.

The choice opens the respective flow. Voizzz does not infer intent from the first utterance and does not silently convert one flow into the other.

## 5. Task composer

### 5.1 Empty state

The new Task screen resembles a modern chat start screen:

- Optional To field
- Optional Subject field
- Centered prompt: “What would you like your assistant to handle?”
- Large text composer
- Attach control
- `@memory` hint
- Microphone control
- Send control
- Optional sample prompts beneath the composer

The page should not display task-specific fields before the conversation establishes the task.

### 5.2 Active conversation

After the first message:

- The conversation occupies the main canvas.
- User messages align right.
- Planning Agent messages align left.
- The composer remains anchored near the bottom.
- The message history scrolls independently.
- Enter sends; Shift+Enter creates a new line.
- The user can send unlimited corrections and refinements.
- Save & close preserves the Draft.

The Planning Agent acknowledges details already supplied and asks only for missing or ambiguous information. Questions are grouped naturally.

### 5.3 To and Subject

To and Subject remain visible but secondary to the conversation. Both are optional at the start and may be populated by Planning.

- Typing `@name` resolves Contacts.
- A resolved phone number appears compactly.
- Multiple matches prompt the user to select one.
- Planning never asks “Who should I call?” after a recipient has already been supplied.

### 5.4 Attachments

Attach opens a file selector. Selected files appear as removable chips. Files remain scoped to the thread. The UI must make clear that attaching a file does not automatically authorize Calling to disclose its contents.

### 5.5 Microphone

The microphone sits beside Send.

- First press begins listening and shows an unmistakable recording state.
- Second press stops listening and inserts editable transcription.
- Transcription is never auto-sent.
- Permission denial and unavailable-microphone states require clear recovery guidance.

The current prototype simulates this behavior without activating a microphone.

### 5.6 Memory selection

Typing `@memory` opens an item picker. Selected entries appear in a compact banner stating that they are proposed for the thread and will require approval at review. Edit reopens the picker.

## 6. Task review

Review is a checkpoint within the same thread, not a separate multi-page wizard.

The most prominent content is a three-box summary:

1. **Contact name**
2. **Phone number**
3. **What I’ll discuss**

Below it:

- Keep discussing
- Attachment-derived planning sources
- Memory approval warning with Approve and Edit
- Calling Agent disclosure preview
- Optional Save to Memory suggestion
- Estimated cost
- Call now or Schedule
- Final Approve action

The Calling Agent disclosure preview shows only approved fields and explicitly excludes source files and complete Memory entries.

## 7. Message composer

The Message journey shares the global shell and optional To and Subject fields, but it should not mimic Task's comprehensive planning conversation.

Required composition choices are:

- Delivery channel: Call, Text, or Email
- Delivery identity: My Assistant or My Voice
- Call behavior: Deliver only or Engage in conversation
- Message content
- Optional Request suggestions action
- Call now or Schedule

Selecting Engage reveals a context area. Deliver only keeps the screen focused on approved wording. Suggestions never replace the user's draft without explicit selection.

## 8. Inbox

### 8.1 Tabs

Inbox contains:

- Tasks, selected by default
- Messages

### 8.2 Row layout

Each dense row includes:

- Unlabeled star icon
- Name
- Subject
- Status
- Time

The star is subtle and independently clickable. Name and Subject carry the strongest visual weight. Status should be legible without dominating the row.

### 8.3 Visible statuses

- Pending
- In progress
- Needs you
- Waiting for reply
- Completed
- Couldn't complete

Visual states must be distinguishable without relying on color alone.

## 9. Drafts

Drafts mirrors the Tasks and Messages tab structure. It contains:

- Planning conversations abandoned or intentionally saved before approval
- Retask replacements not yet approved
- Unsent Messages

Opening a Draft resumes the exact conversation and unsent input when available. Deleting a Draft does not affect an already assigned original unless the Draft is explicitly linked as a pending Retask replacement.

## 10. Assigned Task record

Selecting an Inbox Task opens a structured record.

### 10.1 Record header

- Back to Inbox
- TASK label
- Subject
- To name and phone number
- Current status
- Contextual actions

### 10.2 Standard fields

- Task summary
- Subject
- Current status with latest outcome or update
- Execution timing
- Activity timeline

The latest update belongs inside Current status rather than appearing as a competing summary field.

### 10.3 Pending Task

Pending work does not show empty Transcript or Outcome sections. Its actions are:

- **Edit:** modify To or Subject in place.
- **Retask:** redefine the entire goal in Compose.
- **Forward:** reuse the goal for another recipient without cancelling the original.
- **Cancel or reschedule:** change future execution.

Retask preserves the original until Save Retask. After save, the original is cancelled and the replacement remains a Draft until approved.

### 10.4 Completed Task

Completed work adds:

- Outcome summary
- Recording and Listen
- Transcript and Download
- Reply
- Forward
- Mark done or Delete

Reply opens a familiar inline follow-up area under the same Subject. It may create another pending execution within the thread.

## 11. Assigned Message record

Messages use the same record grammar: header, Subject, recipient, status, delivery summary, outcome, transcript or delivery evidence when applicable, activity, Reply, Forward, and lifecycle actions.

The internal execution differs by Deliver only or Engage, but the user's after-delivery record remains consistent with Task.

## 12. Forward, Retask, Edit, and Reply

| Action | Keeps original active? | Retains Subject? | Retains goal or summary? | Recipient behavior |
| --- | --- | --- | --- | --- |
| Edit | Yes | Editable | Unchanged | To is editable |
| Reply | Yes; same thread | Yes | Uses thread context | Same recipient by default |
| Forward | Yes | Yes | Yes | To is cleared and replaceable |
| Retask | Until Save Retask | Prefilled and editable | Redefined conversationally | Prefilled and editable |

Forward provides Additional context for recipient-specific details. Earlier Memory use is proposed but not automatically approved for Forward or Retask.

## 13. Contacts screen

Contacts displays saved names with phone and email. Primary actions:

- Add contact
- Import contacts
- Edit contact
- Delete contact
- Manage aliases and defaults

The production import flow must preview records, report duplicates or missing fields, and require confirmation before saving.

## 14. Memory screen

### 14.1 Tabs

- My Memory
- Files

### 14.2 My Memory

Entries are grouped into clear sections such as Identity, Family, Medical, Insurance, Travel, and user-created categories. Each entry displays its label, value, source, sensitivity, and last verification date with edit and delete controls.

### 14.3 Files

Users can add:

- PDF
- DOCX
- XLS or XLSX
- TXT
- MD
- Clearly named free-form notes

File detail shows proposed extracted Memory entries. Each entry requires user approval before it appears in My Memory.

Deleting a source file asks whether approved entries derived from it should also be removed.

## 15. Settings screen

Settings uses a tabbed Gmail-like layout with:

- General
- Communication
- Phone & Voice
- Connections
- Payments & Usage
- Privacy & Data

Until each workflow is designed, placeholder screens identify the section without implying unapproved defaults.

## 16. Notifications and authorization UI

A runtime decision request should feel like a focused approval card rather than a chatbot interruption. It contains:

- Plain-language explanation
- Recipient's request or new fact
- Recommended option
- Other available choices
- Cost, privacy, or timing impact
- Approve, choose another option, or edit the plan

Urgent requests follow the user's system-level notification settings.

## 17. Cost presentation

Estimated cost appears near final approval, not hidden in Settings. Recurring resources such as a dedicated number clearly display recurring frequency. Completed records show actual usage and cost when available.

Payments & Usage provides account-level history, estimates, storage growth, authorizations, and alerts.

## 18. Accessibility and trust requirements

- Every control has a clear accessible name.
- Status is not communicated by color alone.
- Voice recording has visible, textual, and screen-reader state.
- Keyboard operation covers Compose, conversation, tabs, row actions, approval, and playback.
- Focus returns predictably after dialogs and pickers.
- Destructive actions explain cancellation consequences.
- Prototype notices cannot be confused with production execution.
- Memory and disclosure warnings use plain language rather than legalistic text.

## 19. High-fidelity design phase

The entire interface will be visually revisited before production. That phase defines:

- Brand palette and contrast system
- Typography and content hierarchy
- Navigation density
- Buttons, inputs, cards, badges, tabs, and dialogs
- Icon family
- Status and severity language
- Empty, loading, listening, executing, waiting, failure, and success states
- Motion and transitions
- Desktop, tablet, and mobile behavior
- Accessibility validation

Approval of this blueprint confirms information architecture and interaction behavior, not the prototype's current aesthetics.

## 20. Prototype mapping

The local interactive prototype demonstrates:

- Global navigation
- Compose intent choice
- Conversational Task creation
- To, Subject, contact resolution, attachments, Memory proposal, and microphone simulation
- Three-box review and explicit Memory approval
- Immediate and scheduled execution choice
- Inbox and Drafts structure
- Pending and completed Task records
- Edit, Retask, Forward, Reply, Listen, and transcript download simulations
- Contacts and Memory management simulations
- Settings section placeholders

It does not place calls, invoke AI, upload files, access a microphone, connect calendars, import external contacts, persist account data, or charge money.

