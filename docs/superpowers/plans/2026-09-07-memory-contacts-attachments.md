# Memory, Contacts, and Attachments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the local Voizzz journey prototype with explicit Memory authorization, thread-scoped attachments, and richer Contacts management.

**Architecture:** Continue the existing dependency-free, browser-local prototype. Add state-backed render branches for Contacts and Memory, then surface explicit Memory selection and attachment metadata in the existing Task composition and review journey. No file content leaves the browser and no external import, AI, or calling service is invoked.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node.js test runner, JSDOM

**Spec:** `docs/decisions/memory-contacts-attachments.md`

## Global Constraints

- Memory access is never automatic.
- The Planning Agent and Calling Agent are separate agents.
- The Calling Agent receives only user-approved information.
- Memory authorization is inherited only within the same thread.
- This is a local simulation with no uploads, AI, calls, charges, or external imports.

---

### Task 1: Contacts management

**Files:**
- Modify: `prototype/app.js`
- Modify: `prototype/index.html`
- Test: `prototype/tests/conversation.test.cjs`

**Interfaces:**
- Consumes: browser-local prototype state and existing `savedContact(name)` resolution
- Produces: contact rows containing name, phone, and email; `contact-add` and `contact-import` interactions

- [x] **Step 1: Write failing behavioral tests**

Add tests that open Contacts, verify email is displayed, add one contact, and simulate importing a supported contacts file by recording its file name.

- [x] **Step 2: Run the focused tests and confirm failure**

Run: `node --test --test-name-pattern="Contacts" prototype/tests/conversation.test.cjs`

Expected: FAIL because email, add, and import controls do not exist.

- [x] **Step 3: Implement browser-local Contacts UI and state**

Render saved contacts with all three fields, add an individual contact form, and a clearly simulated import control. Preserve mention resolution for the added contact's phone number.

- [x] **Step 4: Run focused and full tests**

Run: `npm test`

Expected: all tests pass.

### Task 2: Memory page and entry lifecycle

**Files:**
- Modify: `prototype/app.js`
- Modify: `prototype/index.html`
- Test: `prototype/tests/conversation.test.cjs`

**Interfaces:**
- Consumes: browser-local prototype state
- Produces: `memory-nav`, `memory-items-tab`, `memory-files-tab`, entry add/remove, note add/remove, and simulated source-file add/remove interactions

- [x] **Step 1: Write failing behavioral tests**

Add tests for the two Memory tabs, adding and removing an individual Memory entry, adding a named note, and showing that a selected source file creates only proposed entries rather than approved Memory.

- [x] **Step 2: Run the focused tests and confirm failure**

Run: `node --test --test-name-pattern="Memory" prototype/tests/conversation.test.cjs`

Expected: FAIL because Memory navigation and controls do not exist.

- [x] **Step 3: Implement the Memory page**

Add My Memory and Files tabs, structured entry cards, named note creation, simulated file selection limited to PDF, DOCX, XLS, XLSX, TXT, and MD, and explicit approval before a proposal becomes an entry.

- [x] **Step 4: Run focused and full tests**

Run: `npm test`

Expected: all tests pass.

### Task 3: Task attachments and explicit Memory use

**Files:**
- Modify: `prototype/app.js`
- Modify: `prototype/index.html`
- Test: `prototype/tests/conversation.test.cjs`

**Interfaces:**
- Consumes: Memory entries and existing Task composition/review state
- Produces: task-scoped attachment chips, `@memory` picker, pending Memory proposal, review-time Approve/Edit, approved thread access, and revoke behavior

- [x] **Step 1: Write failing behavioral tests**

Add tests proving that an attachment remains task scoped, `@memory` opens an item picker, selection is not authorization, approval exposes only selected entry names to the Calling Agent handoff, and revocation removes future access.

- [x] **Step 2: Run the focused tests and confirm failure**

Run: `node --test --test-name-pattern="attachment|memory access" prototype/tests/conversation.test.cjs`

Expected: FAIL because the composition and review controls do not exist.

- [x] **Step 3: Implement composition and review interactions**

Add attachment controls to the composer, an explicit Memory picker, proposal summary, final approval/edit controls, and a thread-access panel with revocation. Keep source files and unapproved values out of the Calling Agent handoff.

- [x] **Step 4: Run full verification**

Run: `npm test`

Run: `npm run build`

Request: `http://127.0.0.1:4317/`

Expected: all tests pass, the build exits successfully, and the preview returns HTTP 200.

