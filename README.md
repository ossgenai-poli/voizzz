# voizzz

Voice-first communication and delegated everyday tasks.

## Current scope: journey prototype

This repository currently contains a **local design prototype**, not the production
application. It is a place to agree on the experience before choosing architecture,
providers, or production agent implementations.

The prototype is on the `Product-Decisions-and-Documentations` branch.

### Open the prototype

Requires Node.js 22.13 or newer (Node 24 recommended).

On Windows, double-click **Start-Prototype.cmd** in this folder. Keep that window open,
then visit **http://127.0.0.1:4317/** in a browser.

Alternatively, from the repository folder:

```powershell
npm start
```

No dependency installation is required just to run the preview. It listens only on
your own computer and cannot be opened from another device using this address.
If port 4317 is already in use by this prototype, reuse the existing preview.
Stop its terminal with Ctrl+C when finished.

### How we iterate

1. Open the preview and try the flow.
2. Describe the change in this Codex task, optionally with an annotated screenshot.
3. Update the files in this repo.
4. Refresh the **same URL** to see the revision. There is no automatic reload.

Draft conversation and unsent input are saved in this browser's local storage,
including across refreshes. Use fictional/sample details only. Browser data is not
committed to Git or sent to an AI service. Another browser or hostname has separate
storage. A private browser session may discard the draft when closed.

### Try the conversation

The preview opens to **Inbox**, with **Tasks** selected and **Messages** beside it.
Choose **Compose**, then **Task**, for a fresh conversation. Unfinished planning is
kept in **Drafts**; Inbox contains assigned work. **Contacts** includes phone and
email details and demonstrates individual add and simulated import. **Memory** keeps
approved structured entries separate from source files and named notes. **Settings**
provides a neutral tabbed shell whose details will be defined in later discussions.
Type naturally, or expand **Try sample wording**.
Those buttons fill the composer; they do not send until you choose **Send**.

1. Send a daycare request from the centered composer. After sending, the conversation
   appears above a bottom-anchored reply composer. User messages align right; assistant
   messages align left. Enter sends; Shift+Enter inserts a new line.
2. Reply with contact details and context in ordinary text.
3. Add a correction, such as “Actually, make it 4:30 PM.”
4. Choose **Review plan**, or keep sending replies.
5. Attach a sample file, or type `@memory` and select an individual Memory entry.
   Selection is only a proposal until you approve it during final review.
6. Use the microphone beside Send to simulate listening and insert editable sample
   transcription. It never activates a real microphone or sends automatically.
7. Use **Keep discussing** to return to the same conversation.
8. Approve **Call now** or choose a date and time under **Schedule**.
9. For an immediate call, use the clearly labeled prototype outcome controls.

### Intentional limitations

- Multiple local conversations are retained per browser. Compose → Task starts fresh
  without deleting previous drafts. A refreshed page resumes the current conversation.
- Planning responses are scripted, **not a live AI model**. They do not interpret,
  validate, or deeply summarize arbitrary requests.
- The scripted demo recognizes an `@name` recipient in the opening instruction so it
  can demonstrate the rule that supplied facts are acknowledged rather than re-asked.
  If that name matches a sample Contact, its number is populated in the task header.
  Production-grade entity and contact resolution is not implemented.
- Review shows three output boxes: contact name, phone number, and discussion summary.
  Limited rule-based extraction demonstrates the handoff for sample wording; it is
  not AI summarization or verification. Unrecognized contact details are labeled as
  missing. Use Keep discussing to amend the conversation and regenerate the preview.
- No phone calls, microphone access, recordings, notifications, calendars, or charges.
- The composer microphone is a UI simulation: it toggles a listening indicator and
  inserts sample text. It requests no device permission and records no audio.
- Cost figures and call outcomes are illustrative. The recording is a placeholder.
- Scheduled work does not execute, including after the browser is closed.
- The Messages inbox tab and Compose → Message entry point are represented, but the
  message-composition journey documented in the PRD is not yet implemented in this
  prototype. Real contact import, settings, and account-backed persistence are not implemented.
- Contacts, attachments, and Memory are browser-local simulations. Selected files
  are represented by their names only and are not uploaded or parsed.
- Memory has **My Memory** and **Files** tabs. A source file can create a simulated
  suggestion, but it does not become Memory until approved. Task attachments remain
  scoped to their draft.
- The Planning Agent and Calling Agent boundary is demonstrated at review: the
  Calling Agent receives only explicitly approved Memory fields, never the source
  file or complete Memory. Approval belongs to the thread and can be revoked for
  future actions. Retask proposes earlier Memory again with Approve/Edit.
- Settings currently contains navigation placeholders only: General, Communication,
  Phone & Voice, Connections, Payments & Usage, and Privacy & Data. It intentionally
  contains no active preferences or implied product defaults.
- Inbox includes one pending and one completed sample task. Their record layouts
  demonstrate conditional transcript display and Reply-style follow-up; they are
  static examples and do not place calls.
- Inbox rows use a compact Name, Subject, Status, and Time layout with an unlabeled
  star control. Pending examples support Edit, Retask, and Forward. Retask leaves
  the original active until Save Retask; Forward preserves the original and creates
  a reusable draft with a cleared recipient and optional additional context.
- Completed voice examples provide simulated listening and a downloadable text
  transcript. The Messages tab uses the same list and action model.
- Draft persistence is device-local, not account-wide or production autosave.

### Files

- `docs/product/voizzz-prd.md`: canonical product requirements baseline.
- `docs/product/voizzz-ui-blueprint.md`: approved screen and interaction structure;
  the current prototype colors and styling are not final.
- `docs/superpowers/specs/2026-09-07-orchestration-agent-architecture-design.md`:
  approved Planning, Orchestration, and Calling Agent runtime architecture.
- `prototype/index.html`: shared shell and presentation.
- `prototype/app.js`: simulated conversation and lifecycle interactions.
- `prototype/server.mjs`: local-only preview server; serves only the prototype assets.
- `prototype/tests/`: interaction checks.
- `docs/decisions/conversational-task-creation.md`: the decision behind this revision.
- `docs/decisions/memory-contacts-attachments.md`: Memory, disclosure, attachment,
  and Contacts decisions.

### Verification

```powershell
npm ci
npm test
npm run build
```

The build writes static prototype assets to ignored `dist/`. It does not deploy.

### Git workflow

The initial prototype changes are local working-tree changes until explicitly
committed and published. Do not use the existing Sofia E4 helper for this repo:
it targets a different project. Respect the user's Git restrictions and obtain
the appropriate voizzz publication instructions before committing or pushing.

