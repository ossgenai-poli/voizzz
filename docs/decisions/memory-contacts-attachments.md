# Memory, Contacts, and Attachments

## Product model

Voizzz keeps three kinds of reusable or supplied information distinct:

- **Contacts** are reusable people or organizations with a name, phone number, and email address.
- **Attachments** belong to one task or message thread. The Planning Agent may inspect them, but the Calling Agent receives only information the user approves in the final plan.
- **Memory** is a persistent, user-managed source of reusable personal information. Memory access is never implicit.

The Planning Agent and Calling Agent are separate agents. The Planning Agent may inspect only the Memory items explicitly selected for a thread and may recommend which fields are relevant. The user approves the disclosure. The Calling Agent receives only those approved fields, not the source file or complete Memory item.

## Memory structure

Memory appears below Contacts in the primary navigation and contains two tabs:

- **My Memory** contains editable individual entries organized into standard or user-created sections.
- **Files** contains uploaded source files and named notes. Supported prototype file types are PDF, DOCX, XLS, XLSX, TXT, and MD.

Each Memory entry has a name, value, section, source, last-verified date, and sensitivity. A source file can propose extracted entries, but the user must approve each proposed entry before it is saved to My Memory. Deleting a source file asks whether approved entries derived from it should also be deleted.

Memory can be created directly from the Memory page or proposed during Task or Message composition. Composition gathers possible entries into one optional **Save to Memory?** area during final review rather than interrupting the conversation.

## Authorization

Typing `@memory` opens a picker of individual Memory entries. Selecting an entry proposes thread access; access begins only after the user approves it.

Approval belongs to the thread and is inherited by follow-ups in that same thread. It does not automatically transfer to Forward or Retask. Those flows show previously used entries as proposed selections with **Approve** and **Edit** controls. Users may revoke Memory access from an active thread at any time; revocation applies to future actions and cannot undo information already shared.

Adding another Memory item or expanding the approved fields requires new approval. Ordinary attachments follow the same Planning-Agent-to-user-to-Calling-Agent disclosure boundary.

## Prototype boundary

This prototype simulates local interactions only. It does not upload files, parse documents, import external contacts, invoke AI, place calls, or disclose information. File names and form entries are stored only in the browser's prototype state.

