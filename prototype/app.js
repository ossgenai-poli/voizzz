/* Local design simulation, not an AI implementation or production task engine. */
(() => {
  const root = document.getElementById('voizzz-daycare');
  const main = root.querySelector('main');
  const key = 'voizzz-prototype-v2';
  const defaultContacts = [
    { name: 'Vinni Aunty', phone: '202-555-0147', email: 'vinni@example.com' },
    { name: 'Little Oaks Daycare', phone: '202-555-0188', email: 'hello@littleoaks.example' }
  ];
  const defaultMemoryEntries = [
    { id: 'date-of-birth', label: 'Date of birth', value: 'January 15, 1985 · sample', section: 'Identity', source: 'Added manually', verified: 'Sep 7, 2026', sensitive: true },
    { id: 'preferred-pharmacy', label: 'Preferred pharmacy', value: 'Green Street Pharmacy · sample', section: 'Health', source: 'Added manually', verified: 'Sep 7, 2026', sensitive: false }
  ];
  const demoTasks = [
    { id: 'pending', subject: 'Book annual physical', to: 'Lakeside Medical', phone: '202-555-0116', status: 'Pending execution', latest: 'Scheduled for today at 10:30 AM', summary: 'Call the clinic when appointments open and book the earliest suitable annual physical.', execution: 'Today · 10:30 AM', activity: ['Task approved · 8:42 AM', 'Call scheduled · 8:43 AM'], memoryIds: ['date-of-birth'] },
    { id: 'completed', subject: 'Late pickup at daycare', to: 'Little Oaks Daycare', phone: '202-555-0188', status: 'Completed', latest: 'Daycare confirmed the later pickup · 4:12 PM', summary: 'Tell daycare that Poli is delayed by 20 minutes and confirm that the pickup can still be accommodated.', execution: 'Completed today · 4:12 PM', activity: ['Task approved · 3:58 PM', 'Call connected · 4:10 PM', 'Outcome received · 4:12 PM'], outcome: 'Daycare confirmed the later pickup is okay. No fee or additional arrangement was required.', transcript: [['My Assistant', 'Hi, I’m calling for Poli. He is running about 20 minutes late for pickup.'], ['Little Oaks', 'Thanks for letting us know. That is okay.'], ['My Assistant', 'Thank you. I’ll pass that confirmation to Poli.']] }
  ];
  const demoMessages = [
    { id: 'message-pending', kind: 'message', subject: 'Birthday greeting', to: 'Grandma', phone: '202-555-0194', status: 'Pending execution', latest: 'Scheduled for Saturday at 9:00 AM', summary: 'Deliver the approved birthday greeting in Poli’s voice.', execution: 'Saturday · 9:00 AM', activity: ['Message approved · Monday', 'Delivery scheduled · Monday'] },
    { id: 'message-completed', kind: 'message', subject: 'Thank you for dinner', to: 'Vinni Aunty', phone: '202-555-0147', status: 'Completed', latest: 'Voice message delivered · Yesterday', summary: 'Thank Vinni Aunty for hosting dinner.', execution: 'Delivered yesterday · 6:15 PM', activity: ['Message approved · 6:12 PM', 'Voice message delivered · 6:15 PM'], outcome: 'The voice message was delivered successfully.', transcript: [['My Voice', 'Thank you so much for dinner. We had a wonderful time.']] }
  ];
  const fresh = () => ({ exists: false, view: 'inbox', activeTab: 'tasks', status: 'Draft', messages: [], reply: '', when: 'now', date: '', time: '10:30', tab: 'summary', issue: false, trash: false, title: 'New task', to: '', phone: '', subject: '', selectedDemo: '', replyingToDemo: false, editingDemo: false, demoFollowUp: '', demoNotice: '', playback: '', composeMode: '', sourceDemo: '', retainedGoal: '', additionalContext: '', lastAction: '', starred: {}, itemEdits: {}, cancelledDemoIds: [], history: [], contacts: defaultContacts.map(contact => ({ ...contact })), addingContact: false, contactNotice: '', memoryTab: 'items', memoryEntries: defaultMemoryEntries.map(entry => ({ ...entry })), memoryFiles: [], addingMemoryEntry: false, addingMemoryNote: false, memoryProposalId: '', memoryNotice: '', attachments: [], memoryPickerOpen: false, selectedMemoryIds: [], proposedMemoryIds: [], approvedMemoryIds: [], inheritedMemory: false, memorySuggestionDismissed: false, threadNotice: '', settingsTab: 'general', voiceListening: false, voiceStatus: '' });
  let state = fresh();
  let storageWorks = true;
  let error = '';
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Array.isArray(saved.messages) && saved.messages.every(m => typeof m.text === 'string' && ['user', 'assistant'].includes(m.role))) {
      state = { ...fresh(), ...saved, history: Array.isArray(saved.history) ? saved.history : [], activeTab: saved.activeTab === 'messages' ? 'messages' : 'tasks', view: saved.trash ? 'trash' : saved.status === 'Draft' ? 'chat' : 'detail' };
    }
  } catch { storageWorks = false; }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { storageWorks = false; }
  }
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slug = value => String(value).toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const btn = (id, text, primary = false) => `<button id="${id}" ${primary ? 'class="vz-primary"' : ''}>${text}</button>`;
  const badge = () => `<span data-status class="vz-badge">${esc(state.status)}</span>`;
  const instructions = () => state.messages.filter(m => m.role === 'user');
  // Display-only extraction for the demo. A production planning agent will populate
  // these three fields from confirmed context, not these limited text patterns.
  function handoffPreview() {
    const texts = instructions().map(m => m.text);
    const phonePattern = /(?:\+\d{1,3}[ -]?)?(?:\(\d{3}\)|\b\d{3})[ .-]\d{3}[ .-]\d{4}\b/g;
    let name = state.to || '', phone = state.phone || '';
    for (const text of texts) {
      const matches = [...text.matchAll(phonePattern)];
      if (!matches.length) continue;
      const match = matches[matches.length - 1]; phone = match[0];
      const prefix = text.slice(0, match.index).split(/[.!?;\n]/).pop().trim()
        .replace(/^(?:it's|it is|the daycare is|contact(?: name)?\s*:|name\s*:)\s*/i, '').replace(/[, :–-]+$/, '');
      if (/^[A-Z][\p{L}'’ -]{1,60}$/u.test(prefix) && !/\b(number|phone|call|use)\b/i.test(prefix)) name = prefix;
    }
    const timePattern = /\b(?:1[0-2]|0?[1-9])(?::[0-5]\d)?\s*(?:AM|PM)\b/gi;
    let latestTime = '', timeMessage = -1;
    texts.forEach((text,i) => { const match = [...text.matchAll(timePattern)]; if (match.length) { latestTime = match[0][0]; timeMessage = i; } });
    const notes = texts.flatMap((text,i) => {
      let note = text.replace(phonePattern, '');
      if (name) note = note.replace(name, '');
      // Avoid presenting an earlier arrival sentence as current after a correction.
      return note.split(/(?<=[.!?])\s+/).filter(sentence => {
        timePattern.lastIndex = 0;
        return !(i < timeMessage && timePattern.test(sentence));
      }).map(sentence => sentence.replace(/^[,;:\s]+|[,;:\s]+$/g, '').trim()).filter(sentence => /[\p{L}\p{N}]/u.test(sentence));
    });
    let summary = notes.join(' ');
    if (latestTime && !summary.includes(latestTime)) summary += ` Expected arrival: ${latestTime}.`;
    return { name: name || 'Not yet identified', phone: phone || 'Not yet identified', summary: summary || 'No discussion details yet.' };
  }
  const heading = () => `<div class="vz-top"><div><div class="vz-small">TASK</div><h1>${esc(state.title)}</h1></div>${badge()}</div>`;
  const alert = () => `<p role="alert" class="vz-error">${esc(error)}</p>`;
  const storageNote = () => `<div class="vz-storage">${storageWorks ? 'Draft saved on this browser only. Use sample data.' : 'Browser storage unavailable. Keep this page open to retain this draft.'}</div>`;
  function on(id, fn) { const el = root.querySelector('#' + id); if (el) el.onclick = fn; }
  function field(id, prop) {
    const el = root.querySelector('#' + id);
    if (el) el.oninput = () => { state[prop] = el.value; save(); };
  }
  function go(view) { error = ''; state.view = view; save(); render(); }
  function openTask() { go(state.trash ? 'trash' : state.status === 'Draft' ? 'chat' : 'detail'); }
  function snapshot() { const { history, ...task } = state; return task; }
  function create() {
    root.querySelector('.vz-create-backdrop')?.remove();
    const history = [...state.history];
    if (state.exists || state.reply.trim()) history.unshift(snapshot());
    const shared = { starred: state.starred, itemEdits: state.itemEdits, cancelledDemoIds: state.cancelledDemoIds, contacts: state.contacts, memoryEntries: state.memoryEntries, memoryFiles: state.memoryFiles };
    state = { ...fresh(), ...shared, history, activeTab: 'tasks' }; go('chat');
    root.querySelector('#reply')?.focus();
  }
  function createMessage() {
    root.querySelector('.vz-create-backdrop')?.remove();
    const history = [...state.history];
    if (state.exists || state.reply.trim()) history.unshift(snapshot());
    const shared = { starred: state.starred, itemEdits: state.itemEdits, cancelledDemoIds: state.cancelledDemoIds, contacts: state.contacts, memoryEntries: state.memoryEntries, memoryFiles: state.memoryFiles };
    state = { ...fresh(), ...shared, history, activeTab: 'messages', view: 'message-compose' };
    save(); render();
  }
  function demoItem(id) {
    const base = [...demoTasks, ...demoMessages].find(item => item.id === id);
    return base ? { ...base, ...(state.itemEdits[id] || {}) } : null;
  }
  function startFromTemplate(mode, task) {
    const history = [...state.history];
    const shared = { starred: state.starred, itemEdits: state.itemEdits, cancelledDemoIds: state.cancelledDemoIds, contacts: state.contacts, memoryEntries: state.memoryEntries, memoryFiles: state.memoryFiles };
    const inheritedIds = Array.isArray(task.memoryIds) ? task.memoryIds : [];
    state = { ...fresh(), ...shared, history, view: 'chat', activeTab: task.kind === 'message' ? 'messages' : 'tasks', to: mode === 'retask' ? task.to : '', phone: mode === 'retask' ? task.phone : '', subject: task.subject, title: task.subject, composeMode: mode, sourceDemo: task.id, retainedGoal: mode === 'forward' ? task.summary : '', selectedMemoryIds: inheritedIds, proposedMemoryIds: inheritedIds, inheritedMemory: inheritedIds.length > 0 };
    save(); render(); root.querySelector('#reply')?.focus();
  }
  function showCreateChoice() {
    root.querySelector('.vz-create-backdrop')?.remove();
    root.insertAdjacentHTML('beforeend', `<div class="vz-create-backdrop" id="create-choice-backdrop"><section class="vz-create-dialog" role="dialog" aria-modal="true" aria-labelledby="create-choice-title"><h2 id="create-choice-title">What would you like to compose?</h2><div class="vz-create-options"><button id="create-task-option" class="vz-primary">Task</button><button id="create-message-option">Message</button></div><button id="create-choice-cancel">Cancel</button></section></div>`);
    on('create-task-option', create);
    on('create-message-option', createMessage);
    on('create-choice-cancel', () => root.querySelector('.vz-create-backdrop')?.remove());
    root.querySelector('#create-task-option')?.focus();
  }
  function restoreHistory(index) {
    const history = [...state.history];
    const [task] = history.splice(index, 1);
    if (!task) return;
    if (state.exists || state.reply.trim()) history.unshift(snapshot());
    state = { ...fresh(), ...task, history }; openTask();
  }
  function renderHistory() {
    const shelf = root.querySelector('#task-history');
    if (!shelf) return;
    shelf.innerHTML = `<div class="vz-history-label">Recent tasks</div>${state.exists || state.reply.trim() ? `<button id="${state.view === 'inbox' ? 'resume-current' : 'open-task'}" class="vz-history-current">${esc(state.title)}<span>${state.trash ? 'Trash' : esc(state.status)}</span></button>` : ''}${state.history.map((task,i) => `<button id="history-${i}">${esc(task.title)}<span>${task.trash ? 'Trash' : esc(task.status)}</span></button>`).join('')}`;
    on(state.view === 'inbox' ? 'resume-current' : 'open-task', openTask);
    state.history.forEach((_,i) => on('history-' + i, () => restoreHistory(i)));
  }
  function mentionedRecipient(text) {
    const contactText = text.replace(/@memory\b/gi, '');
    const mention = contactText.match(/@([^,.;]+?)(?=\s+(?:to\b|at\s+(?:\+?\d|\())|[,.;]|$)/i);
    if (!mention) return '';
    return mention[1].trim().replace(/\b\p{L}/gu, letter => letter.toLocaleUpperCase());
  }
  function savedContact(name) {
    const normalized = name.trim().toLocaleLowerCase();
    return state.contacts.find(contact => contact.name.toLocaleLowerCase() === normalized);
  }
  function memoryEntries(ids) {
    return ids.map(id => state.memoryEntries.find(entry => entry.id === id)).filter(Boolean);
  }
  function requestedOutcome(text) {
    const match = text.match(/\bto\s+(.+?)(?:[.!?]|$)/i);
    return match ? match[1].trim() : '';
  }
  function hasPhoneNumber(text) {
    return /(?:\+\d{1,3}[ -]?)?(?:\(\d{3}\)|\b\d{3})[ .-]\d{3}[ .-]\d{4}\b/.test(text);
  }
  function send() {
    const text = state.reply.trim();
    if (!text) { error = 'Write a message before sending.'; render(); return; }
    state.exists = true;
    state.messages.push({ role: 'user', text }); state.reply = ''; error = '';
    const count = instructions().length;
    if (count === 1) state.title = /daycare/i.test(text) ? 'Let daycare know I’m running late' : text.slice(0, 65);
    // Scripted responses intentionally do not pretend to extract or verify personal facts.
    const recipient = mentionedRecipient(text);
    const outcome = requestedOutcome(text);
    const contact = recipient ? savedContact(recipient) : null;
    if (recipient && !state.to) state.to = contact?.name || recipient;
    if (contact) state.phone = contact.phone;
    if (count === 1 && !state.subject) {
      state.subject = outcome ? outcome.replace(/^\p{L}/u, letter => letter.toLocaleUpperCase()) : state.title;
      state.title = state.subject;
    }
    const acknowledgedMention = recipient
      ? `I understand that you want me to contact ${recipient}${outcome ? ` and ask her to ${outcome}` : ''}. ${hasPhoneNumber(text)
        ? 'I have the contact number from your instruction. What relevant timing, location, or boundaries should I know before I contact her?'
        : `I still need a way to reach ${recipient}. Is she already saved in your Contacts, or would you like to share her phone number? Please include any relevant timing, location, or boundaries in the same reply.`}`
      : '';
    const answer = count === 1
      ? (acknowledgedMention || (/daycare/i.test(text)
        ? 'Which daycare should I contact, and what number should I use? Tell me which child to mention and roughly when you expect to arrive. You can include anything else they should know in your reply.'
        : 'Who should I contact and how can I reach them? Tell me the outcome you want, any important context, and anything I should check with you before agreeing to.'))
      : count === 2
        ? 'Thank you. I’ll keep those details with your request. I’ll use your saved notification preferences if a new decision needs your attention, and won’t accept fees or make new arrangements without your authorization. What would you like to add or change? You can review the plan whenever you’re ready.'
        : /actually|instead|change|correction|make it/i.test(text)
          ? 'I’ve kept your correction with the plan. Your latest instruction takes precedence over earlier details. Keep talking if anything else needs changing, or review before approving.'
          : 'I’ve added that instruction to the conversation. You can keep refining the plan here—nothing starts until you explicitly approve it.';
    state.messages.push({ role: 'assistant', text: answer });
    if (/@memory\b/i.test(text)) state.memoryPickerOpen = true;
    save(); render();
    root.querySelector('#reply')?.focus();
  }
  function approve() {
    if (state.when === 'schedule') {
      const scheduled = new Date(`${state.date}T${state.time}`);
      if (!state.date || !state.time || !Number.isFinite(scheduled.getTime()) || scheduled <= new Date()) {
        error = 'Choose a future date and time.'; render(); return;
      }
    }
    state.status = state.when === 'schedule' ? 'Scheduled' : 'In progress';
    state.tab = 'summary'; go('detail');
  }
  function render() {
    main.classList.toggle('vz-chat-main', state.view === 'chat');
    ['inbox', 'drafts', 'contacts', 'memory', 'settings'].forEach(view => root.querySelector(`#${view}-nav`)?.classList.toggle('vz-nav-current', state.view === view));
    renderHistory();
    if (state.view === 'inbox') {
      const localRow = (task, id) => `<button id="${id}" class="vz-item"><span>${esc(task.to || 'Contact')}<br><span class="vz-small">${esc(task.subject || task.title)}</span></span><span class="vz-badge">${task.trash ? 'Trash' : esc(task.status)}</span></button>`;
      const assignedRows = `${state.exists && state.status !== 'Draft' ? localRow(state,'open-task') : ''}${state.history.map((task,i) => task.status !== 'Draft' ? localRow(task,'list-history-' + i) : '').join('')}`;
      const inboxRow = task => `<div class="vz-inbox-row" data-inbox-row="${esc(task.id)}"><button id="inbox-star-${esc(task.id)}" class="vz-star" aria-label="${state.starred[task.id] ? 'Unstar' : 'Star'} ${esc(task.subject)}" aria-pressed="${Boolean(state.starred[task.id])}">${state.starred[task.id] ? '★' : '☆'}</button><button id="demo-${esc(task.id)}${task.kind === 'message' ? '' : '-task'}" class="vz-inbox-open"><strong>${esc(task.to)}</strong><span>${esc(task.subject)}</span><span>${esc(task.status)}</span><time>${esc(task.id === 'pending' ? '10:30 AM' : task.id === 'completed' ? '4:12 PM' : task.status === 'Completed' ? 'Yesterday' : 'Saturday')}</time></button></div>`;
      const visibleTasks = demoTasks.filter(task => !state.cancelledDemoIds.includes(task.id)).map(task => demoItem(task.id));
      const visibleMessages = demoMessages.map(task => demoItem(task.id));
      const demoRows = (state.activeTab === 'tasks' ? visibleTasks : visibleMessages).map(inboxRow).join('');
      const tabs = `<div class="vz-inbox-tabs" role="tablist" aria-label="Inbox type"><button id="tasks-tab" role="tab" aria-selected="${state.activeTab === 'tasks'}">Tasks</button><button id="messages-tab" role="tab" aria-selected="${state.activeTab === 'messages'}">Messages</button></div>`;
      const list = `<div class="vz-inbox-list">${state.activeTab === 'tasks' ? assignedRows : ''}${demoRows}</div>`;
      main.innerHTML = `<div class="vz-top"><h1>Inbox</h1><span class="vz-small">Prototype v3</span></div>${tabs}${list}`;
      on('tasks-tab', () => { state.activeTab = 'tasks'; save(); render(); });
      on('messages-tab', () => { state.activeTab = 'messages'; save(); render(); });
      on('open-task', openTask);
      [...demoTasks, ...demoMessages].forEach(task => {
        on(`inbox-star-${task.id}`, () => { state.starred[task.id] = !state.starred[task.id]; save(); render(); });
        on(`demo-${task.id}${task.kind === 'message' ? '' : '-task'}`, () => { state.selectedDemo = task.id; state.replyingToDemo = false; state.editingDemo = false; state.demoFollowUp = ''; state.demoNotice = ''; state.playback = ''; go('demo-detail'); });
      });
      state.history.forEach((_,i) => on('list-history-' + i, () => restoreHistory(i))); return;
    }
    if (state.view === 'drafts') {
      const draftRow = (task,id) => `<button id="${id}" class="vz-item"><span>${esc(task.subject || task.title)}<br><span class="vz-small">Continue planning</span></span><span class="vz-badge">Draft</span></button>`;
      const current = state.status === 'Draft' && (state.exists || state.reply.trim()) ? draftRow(state,'open-current-draft') : '';
      const history = state.history.map((task,i) => task.status === 'Draft' ? draftRow(task,`open-draft-${i}`) : '').join('');
      main.innerHTML = `<div class="vz-top"><h1>Drafts</h1></div>${state.lastAction ? `<p role="status" class="vz-surface">${esc(state.lastAction)}</p>` : ''}<div class="vz-stack">${current}${history || (!current ? '<div class="vz-empty"><h2>No drafts</h2></div>' : '')}</div>`;
      on('open-current-draft', openTask);
      state.history.forEach((_,i) => on(`open-draft-${i}`, () => restoreHistory(i)));
      return;
    }
    if (state.view === 'contacts') {
      const form = state.addingContact ? `<section class="vz-surface vz-contact-form"><h2>Add contact</h2><div class="vz-fields"><label>Name<input id="contact-name"></label><label>Phone<input id="contact-phone"></label><label>Email<input id="contact-email" type="email"></label></div><div class="vz-row">${btn('save-contact','Save contact',true)}${btn('cancel-contact','Cancel')}</div></section>` : '';
      main.innerHTML = `<div class="vz-top"><div><h1>Contacts</h1><p class="vz-small">Saved names can be used with @ in task and message conversations.</p></div><div class="vz-row">${btn('add-contact','Add contact',true)}<label class="vz-link-button vz-file-action">Import<input id="contact-import-input" type="file" accept=".csv,.vcf" hidden></label></div></div>${state.contactNotice ? `<p role="status" class="vz-surface">${esc(state.contactNotice)}</p>` : ''}${form}<section class="vz-surface vz-contact-list"><div class="vz-contact-head"><span>Name</span><span>Phone</span><span>Email</span></div>${state.contacts.map(contact => `<div class="vz-contact-row"><strong>${esc(contact.name)}</strong><span>${esc(contact.phone)}</span><span>${esc(contact.email || '—')}</span></div>`).join('')}</section>`;
      on('add-contact', () => { state.addingContact = true; save(); render(); });
      on('cancel-contact', () => { state.addingContact = false; save(); render(); });
      on('save-contact', () => {
        const name = root.querySelector('#contact-name').value.trim();
        const phone = root.querySelector('#contact-phone').value.trim();
        const email = root.querySelector('#contact-email').value.trim();
        if (!name || (!phone && !email)) { state.contactNotice = 'Add a name and at least a phone number or email address.'; save(); render(); return; }
        state.contacts = [...state.contacts.filter(contact => contact.name.toLocaleLowerCase() !== name.toLocaleLowerCase()), { name, phone, email }];
        state.addingContact = false; state.contactNotice = `${name} was added to Contacts.`; save(); render();
      });
      const importInput = root.querySelector('#contact-import-input');
      importInput.onchange = () => {
        const file = importInput.files?.[0];
        if (!file) return;
        state.contactNotice = `${file.name} selected. Import is simulated in this prototype; no file was uploaded.`; save(); render();
      };
      return;
    }
    if (state.view === 'memory') {
      const tabs = `<div class="vz-inbox-tabs" role="tablist" aria-label="Memory type"><button id="memory-items-tab" role="tab" aria-selected="${state.memoryTab === 'items'}">My Memory</button><button id="memory-files-tab" role="tab" aria-selected="${state.memoryTab === 'files'}">Files</button></div>`;
      if (state.memoryTab === 'items') {
        const entryForm = state.addingMemoryEntry ? `<section class="vz-surface"><h2>Add to My Memory</h2><div class="vz-fields"><label>Name<input id="memory-label" placeholder="e.g. Preferred pharmacy"></label><label>Value<input id="memory-value"></label><label>Section<input id="memory-section" placeholder="Identity, Health, Family…"></label><label class="vz-choice"><input id="memory-sensitive" type="checkbox"> Sensitive information</label></div><div class="vz-row">${btn('save-memory-entry','Save to Memory',true)}${btn('cancel-memory-entry','Cancel')}</div></section>` : '';
        const entries = state.memoryEntries.map(entry => `<article class="vz-memory-card" data-memory-entry="${esc(entry.id)}"><div><strong>${esc(entry.label)}</strong><p class="vz-small">${esc(entry.section)} · ${entry.sensitive ? 'Sensitive' : 'Standard'}</p></div><div class="vz-memory-value">${esc(entry.value)}</div><div class="vz-small">${esc(entry.source)}<br>Verified ${esc(entry.verified)}</div><button id="remove-memory-${esc(entry.id)}" aria-label="Remove ${esc(entry.label)}">Remove</button></article>`).join('');
        main.innerHTML = `<div class="vz-top"><div><h1>Memory</h1><p class="vz-small">Nothing in Memory is available to a task unless you explicitly select and approve it.</p></div>${btn('add-memory-entry','Add memory',true)}</div>${tabs}${state.memoryNotice ? `<p role="status" class="vz-surface">${esc(state.memoryNotice)}</p>` : ''}${entryForm}<section class="vz-surface vz-memory-list">${entries || '<p>No approved Memory entries.</p>'}</section>`;
        on('add-memory-entry', () => { state.addingMemoryEntry = true; save(); render(); });
        on('cancel-memory-entry', () => { state.addingMemoryEntry = false; save(); render(); });
        on('save-memory-entry', () => {
          const label = root.querySelector('#memory-label').value.trim();
          const value = root.querySelector('#memory-value').value.trim();
          const section = root.querySelector('#memory-section').value.trim();
          if (!label || !value || !section) { state.memoryNotice = 'Add a name, value, and section before saving.'; save(); render(); return; }
          const id = slug(label) || `memory-${Date.now()}`;
          const entry = { id, label, value, section, source: 'Added manually', verified: 'Today', sensitive: root.querySelector('#memory-sensitive').checked };
          state.memoryEntries = [...state.memoryEntries.filter(item => item.id !== id), entry];
          state.addingMemoryEntry = false; state.memoryNotice = `${label} was saved to My Memory.`; save(); render();
        });
        state.memoryEntries.forEach(entry => on(`remove-memory-${entry.id}`, () => { state.memoryEntries = state.memoryEntries.filter(item => item.id !== entry.id); state.memoryNotice = `${entry.label} was removed from My Memory.`; save(); render(); }));
      } else {
        const noteForm = state.addingMemoryNote ? `<section class="vz-surface"><h2>Add named note</h2><label>Name<input id="memory-note-name" placeholder="e.g. School pickup notes"></label><label>Note<textarea id="memory-note-text"></textarea></label><div class="vz-row">${btn('save-memory-note','Save note',true)}${btn('cancel-memory-note','Cancel')}</div></section>` : '';
        const proposal = state.memoryFiles.find(file => file.id === state.memoryProposalId && file.status === 'Needs your review');
        const proposalPanel = proposal ? `<section class="vz-surface vz-memory-proposal"><h2>Review suggested Memory</h2><p>The Planning Agent proposes one entry from <strong>${esc(proposal.name)}</strong>. Edit it before approving; nothing is stored yet.</p><div class="vz-fields"><label>Name<input id="proposal-label" value="${esc(proposal.proposal.label)}"></label><label>Value<input id="proposal-value" value="${esc(proposal.proposal.value)}"></label><label>Section<input id="proposal-section" value="${esc(proposal.proposal.section)}"></label></div><div class="vz-row">${btn('approve-memory-proposal','Approve & save',true)}${btn('cancel-memory-proposal','Not now')}</div></section>` : '';
        const files = state.memoryFiles.map(file => `<article class="vz-memory-card" data-memory-file="${esc(file.id)}"><div><strong>${esc(file.name)}</strong><p class="vz-small">${esc(file.kind)}</p></div><div>${esc(file.preview || 'Stored as a browser-local prototype reference.')}</div><div><span class="vz-chip">${esc(file.status)}</span></div><div class="vz-row">${file.status === 'Needs your review' ? btn('review-memory-proposal','Review suggestion') : ''}<button id="remove-memory-file-${esc(file.id)}">Delete</button></div></article>`).join('');
        main.innerHTML = `<div class="vz-top"><div><h1>Memory</h1><p class="vz-small">Source files and notes can suggest Memory entries, but never become approved Memory automatically.</p></div><div class="vz-row"><label class="vz-link-button vz-file-action">Add file<input id="memory-file-input" type="file" accept=".pdf,.docx,.xls,.xlsx,.txt,.md" hidden></label>${btn('add-memory-note','Add note',true)}</div></div>${tabs}${state.memoryNotice ? `<p role="status" class="vz-surface">${esc(state.memoryNotice)}</p>` : ''}${noteForm}${proposalPanel}<section class="vz-surface vz-memory-list">${files || '<p>No source files or notes yet.</p>'}</section>`;
        on('add-memory-note', () => { state.addingMemoryNote = true; save(); render(); });
        on('cancel-memory-note', () => { state.addingMemoryNote = false; save(); render(); });
        on('save-memory-note', () => {
          const name = root.querySelector('#memory-note-name').value.trim();
          const preview = root.querySelector('#memory-note-text').value.trim();
          if (!name || !preview) { state.memoryNotice = 'Give the note a clear name and add its information.'; save(); render(); return; }
          const id = slug(name) || `note-${Date.now()}`;
          state.memoryFiles = [...state.memoryFiles.filter(file => file.id !== id), { id, name, kind: 'Named note', preview, status: 'Available as a source' }];
          state.addingMemoryNote = false; state.memoryNotice = `${name} was added as a Memory source.`; save(); render();
        });
        const fileInput = root.querySelector('#memory-file-input');
        fileInput.onchange = () => {
          const file = fileInput.files?.[0]; if (!file) return;
          if (!/\.(pdf|docx|xls|xlsx|txt|md)$/i.test(file.name)) { state.memoryNotice = 'Choose a PDF, DOCX, XLS, XLSX, TXT, or MD file.'; save(); render(); return; }
          const id = slug(file.name) || `file-${Date.now()}`;
          const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\p{L}/gu, letter => letter.toLocaleUpperCase());
          const record = { id, name: file.name, kind: 'Source file · browser-local simulation', status: 'Needs your review', proposal: { label: `${cleanName} details`, value: 'Sample extracted value — edit before approving', section: 'Identity' } };
          state.memoryFiles = [...state.memoryFiles.filter(item => item.id !== id), record]; state.memoryNotice = `${file.name} was added locally. Review its suggestion before anything is saved to My Memory.`; save(); render();
        };
        on('review-memory-proposal', () => { const pending = state.memoryFiles.find(file => file.status === 'Needs your review'); if (pending) state.memoryProposalId = pending.id; save(); render(); });
        on('cancel-memory-proposal', () => { state.memoryProposalId = ''; save(); render(); });
        on('approve-memory-proposal', () => {
          if (!proposal) return;
          const label = root.querySelector('#proposal-label').value.trim(); const value = root.querySelector('#proposal-value').value.trim(); const section = root.querySelector('#proposal-section').value.trim();
          if (!label || !value || !section) { state.memoryNotice = 'Review the proposed name, value, and section before approving.'; save(); render(); return; }
          const id = slug(label) || `memory-${Date.now()}`;
          state.memoryEntries = [...state.memoryEntries.filter(entry => entry.id !== id), { id, label, value, section, source: proposal.name, verified: 'Today', sensitive: true }];
          state.memoryFiles = state.memoryFiles.map(file => file.id === proposal.id ? { ...file, status: 'Suggestion approved' } : file);
          state.memoryProposalId = ''; state.memoryNotice = `${label} was approved and saved to My Memory.`; save(); render();
        });
        state.memoryFiles.forEach(file => on(`remove-memory-file-${file.id}`, () => { state.memoryFiles = state.memoryFiles.filter(item => item.id !== file.id); state.memoryNotice = `${file.name} was deleted. Approved Memory entries remain until you remove them separately.`; save(); render(); }));
      }
      on('memory-items-tab', () => { state.memoryTab = 'items'; state.memoryProposalId = ''; save(); render(); });
      on('memory-files-tab', () => { state.memoryTab = 'files'; save(); render(); });
      return;
    }
    if (state.view === 'settings') {
      const sections = [
        { id: 'general', label: 'General', description: 'System-level defaults and account-wide behavior will be defined here.' },
        { id: 'communication', label: 'Communication', description: 'How Voizzz communicates with you—including urgency and channel preferences—will be defined here.' },
        { id: 'phone', label: 'Phone & Voice', description: 'Shared and dedicated numbers, My Assistant, and My Voice settings will be defined here.' },
        { id: 'connections', label: 'Connections', description: 'Calendar, email, and other service connections will be defined here.' },
        { id: 'payments', label: 'Payments & Usage', description: 'Payment methods, pay-as-you-go usage, estimates, and spending transparency will be defined here.' },
        { id: 'privacy', label: 'Privacy & Data', description: 'Memory, permissions, retention, export, and deletion settings will be defined here.' }
      ];
      const active = sections.find(section => section.id === state.settingsTab) || sections[0];
      const tabs = `<div class="vz-inbox-tabs vz-settings-tabs" role="tablist" aria-label="Settings sections">${sections.map(section => `<button id="settings-${section.id}-tab" role="tab" aria-selected="${active.id === section.id}">${section.label}</button>`).join('')}</div>`;
      main.innerHTML = `<div class="vz-top"><div><h1>Settings</h1><p class="vz-small">This page establishes the sections only. We will define each setting together.</p></div></div>${tabs}<section id="settings-placeholder" class="vz-surface vz-settings-placeholder"><div class="vz-small">${esc(active.label)}</div><h2>${esc(active.label)}</h2><p>${esc(active.description)}</p><span class="vz-badge">Settings to be defined</span></section>`;
      sections.forEach(section => on(`settings-${section.id}-tab`, () => { state.settingsTab = section.id; save(); render(); }));
      return;
    }
    if (state.view === 'demo-detail') {
      const task = demoItem(state.selectedDemo);
      if (!task) { go('inbox'); return; }
      const transcriptText = task.transcript?.map(line => `${line[0]}: ${line[1]}`).join('\n\n') || '';
      const transcript = task.transcript ? `<section id="task-transcript" class="vz-record-card vz-record-wide"><h2>Transcript</h2>${task.transcript.map(line => `<p><strong>${esc(line[0])}</strong><br>${esc(line[1])}</p>`).join('')}<div class="vz-row"><button id="listen-task">▶ Listen</button><a id="download-transcript" class="vz-link-button" download="${esc(task.subject.toLocaleLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''))}-transcript.txt" href="data:text/plain;charset=utf-8,${encodeURIComponent(transcriptText)}">Download transcript</a></div>${state.playback ? `<p role="status">${esc(state.playback)}</p>` : ''}</section>` : '';
      const reply = state.replyingToDemo ? `<div class="vz-reply-panel"><label for="task-follow-up">Reply under this subject</label><textarea id="task-follow-up" placeholder="Add a follow-up instruction…">${esc(state.demoFollowUp)}</textarea><div class="vz-row">${btn('send-follow-up','Send follow-up',true)}${btn('cancel-follow-up','Cancel')}</div></div>` : `<div class="vz-reply-panel"><div class="vz-row">${btn('reply-task','↩ Reply')}</div></div>`;
      const edit = state.editingDemo ? `<section class="vz-record-card vz-record-wide"><h2>Edit assigned ${task.kind === 'message' ? 'message' : 'task'}</h2><div class="vz-fields"><label>To<input id="edit-to" value="${esc(task.to)}"></label><label>Subject<input id="edit-subject" value="${esc(task.subject)}"></label></div><div class="vz-row">${btn('save-edit','Save',true)}${btn('cancel-edit','Cancel')}</div></section>` : '';
      const pendingActions = task.status === 'Pending execution' ? `<div class="vz-row vz-record-actions">${btn('edit-task','Edit')}${btn('retask-task','Retask')}${btn('forward-task','Forward')}</div>` : '';
      const completedActions = task.status === 'Completed' ? `<div class="vz-row vz-record-actions">${btn('reply-task','↩ Reply')}${btn('forward-task','Forward')}</div>` : '';
      main.innerHTML = `<article class="vz-record"><div class="vz-record-header"><button id="demo-back">← Inbox</button><div class="vz-top" style="margin-top:18px"><div><div class="vz-small">${task.kind === 'message' ? 'MESSAGE' : 'TASK'}</div><h1>${esc(task.subject)}</h1><p class="vz-small">To: ${esc(task.to)} · ${esc(task.phone)}</p></div><span class="vz-badge">${esc(task.status)}</span></div>${pendingActions}${completedActions}</div><div class="vz-record-grid">${edit}<section class="vz-record-card"><h2>Task summary</h2><p>${esc(task.summary)}</p></section><section class="vz-record-card"><h2>Subject</h2><p>${esc(task.subject)}</p></section><section class="vz-record-card vz-record-wide"><h2>Current status</h2><p class="vz-status-line">${esc(state.demoNotice ? 'Pending execution' : task.status)}</p><p>${esc(state.demoNotice || task.latest)}</p></section><section class="vz-record-card"><h2>Execution</h2><p>${esc(task.execution)}</p></section>${task.outcome ? `<section class="vz-record-card"><h2>Outcome summary</h2><p>${esc(task.outcome)}</p></section>` : ''}${transcript}</div><section><h2>Activity</h2><div class="vz-timeline">${task.activity.map(item => `<p>${esc(item)}</p>`).join('')}${state.demoNotice ? `<p>${esc(state.demoNotice)}</p>` : ''}</div></section>${task.status === 'Completed' && state.replyingToDemo ? reply : ''}</article>`;
      on('demo-back', () => go('inbox'));
      on('reply-task', () => { state.replyingToDemo = true; save(); render(); });
      on('edit-task', () => { state.editingDemo = true; save(); render(); });
      on('cancel-edit', () => { state.editingDemo = false; save(); render(); });
      on('save-edit', () => { const to = root.querySelector('#edit-to').value.trim(); const subject = root.querySelector('#edit-subject').value.trim(); state.itemEdits[task.id] = { to: to || task.to, subject: subject || task.subject }; state.editingDemo = false; save(); render(); });
      on('retask-task', () => startFromTemplate('retask', task));
      on('forward-task', () => startFromTemplate('forward', task));
      on('listen-task', () => { state.playback = 'Playing sample recording — no real audio in this prototype.'; save(); render(); });
      field('task-follow-up','demoFollowUp');
      on('cancel-follow-up', () => { state.replyingToDemo = false; state.demoFollowUp = ''; save(); render(); });
      on('send-follow-up', () => { if (!state.demoFollowUp.trim()) return; state.demoNotice = 'Follow-up queued · awaiting execution'; state.replyingToDemo = false; state.demoFollowUp = ''; save(); render(); });
      return;
    }
    if (state.view === 'message-compose') {
      main.innerHTML = `<div class="vz-top"><div><div class="vz-small">MESSAGE</div><h1>Create a message</h1></div><span class="vz-badge">Draft</span></div><section class="vz-surface vz-message-placeholder"><h2>Message creation will be designed next</h2><p>This keeps Tasks and Messages separate without guessing how the message journey should work.</p><div class="vz-row" style="justify-content:center">${btn('back-inbox', 'Back to Inbox')}${btn('start-task-instead', 'Create a Task')}</div></section>`;
      on('back-inbox', () => go('inbox'));
      on('start-task-instead', create);
      return;
    }
    if (state.view === 'chat') {
      const active = state.messages.length > 0;
      const messages = state.messages.map(m => `<article class="vz-message" data-speaker="${m.role}" aria-label="${m.role === 'user' ? 'You' : 'voizzz'}"><div class="vz-speaker">${m.role === 'user' ? 'You' : 'voizzz'}</div><div class="vz-message-text">${esc(m.text)}</div></article>`).join('');
      const modeNote = state.composeMode ? `<div class="vz-template-note"><strong>${state.composeMode === 'retask' ? 'Retask' : 'Forward'}</strong><span>${state.composeMode === 'retask' ? 'The original remains active until you save this replacement.' : 'The original remains unchanged.'}</span></div>` : '';
      const retained = state.retainedGoal ? `<section class="vz-retained"><span class="vz-small">Retained task summary</span><p id="retained-goal">${esc(state.retainedGoal)}</p><label>Additional context<textarea id="additional-context" placeholder="Add provider, insurance, timing, or other differences…">${esc(state.additionalContext)}</textarea></label></section>` : '';
      const retaskAction = state.composeMode === 'retask' && active ? btn('save-retask','Save Retask',true) : '';
      const attachmentChips = state.attachments.map(file => `<span class="vz-chip" data-task-attachment>${esc(file.name)} <button id="remove-attachment-${esc(file.id)}" aria-label="Remove ${esc(file.name)}">×</button></span>`).join('');
      const proposed = memoryEntries(state.proposedMemoryIds);
      const memoryBanner = proposed.length ? `<section id="memory-proposal-banner" class="vz-access-banner"><strong>${proposed.length} Memory item${proposed.length === 1 ? '' : 's'} ${state.inheritedMemory ? 'from the earlier task' : 'proposed for this thread'}</strong><span>${proposed.map(entry => esc(entry.label)).join(', ')} · approve at final review or edit now.</span>${btn('edit-proposed-memory','Edit')}</section>` : '';
      const picker = state.memoryPickerOpen ? `<section id="memory-picker" class="vz-memory-picker"><div class="vz-top"><div><h2>Select individual Memory items</h2><p class="vz-small">Selection is a proposal—not permission. You will approve it at final review.</p></div>${btn('close-memory-picker','Close')}</div><div class="vz-memory-choices">${state.memoryEntries.map(entry => `<label class="vz-choice"><input id="memory-choice-${esc(entry.id)}" type="checkbox" ${state.selectedMemoryIds.includes(entry.id) ? 'checked' : ''}> <span><strong>${esc(entry.label)}</strong><br><span class="vz-small">${esc(entry.section)} · ${entry.sensitive ? 'Sensitive' : 'Standard'}</span></span></label>`).join('')}</div>${btn('propose-memory-access','Use selected in this thread',true)}</section>` : '';
      const micIcon = `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0M12 17v4M9 21h6"/></svg>`;
      main.innerHTML = `<div class="vz-chat-heading">${active ? `<span>${esc(state.subject || state.title)}</span>${badge()}` : '<span>New task</span>'}</div>${modeNote}<div class="vz-compose-meta"><label><span>To</span><input id="task-to" value="${esc(state.to)}" placeholder="Optional name or contact"></label>${state.phone ? `<div class="vz-resolved">Resolved number: <span id="resolved-phone">${esc(state.phone)}</span></div>` : ''}<label><span>Subject</span><input id="task-subject" value="${esc(state.subject)}" placeholder="Optional subject"></label></div>${retained}<div class="vz-chat-layout ${active ? 'is-active' : 'is-empty'}"><div class="vz-chat-scroll" id="conversation-scroll"><div class="vz-chat-stream" role="log" aria-label="Planning conversation" aria-live="polite">${active ? messages : '<h1 class="vz-welcome">What would you like your assistant to handle?</h1>'}${memoryBanner}${picker}</div></div><div class="vz-composer-dock"><div class="vz-composer"><label for="reply" class="vz-sr-only">${active ? 'Reply or change the plan' : 'Describe your task'}</label><textarea id="reply" rows="2" placeholder="${active ? 'Reply or change the plan…' : 'Ask your assistant to handle something…'}">${esc(state.reply)}</textarea><div class="vz-row vz-bottom"><div class="vz-row"><label class="vz-attach-action" aria-label="Attach file">＋ Attach<input id="task-attachment-input" type="file" hidden></label><span class="vz-small">Type @memory to use saved information</span></div><div class="vz-composer-actions"><button id="voice-input" class="vz-mic" aria-label="${state.voiceListening ? 'Stop voice input' : 'Start voice input'}" aria-pressed="${state.voiceListening}">${micIcon}</button><button id="send-reply" class="vz-primary vz-send" aria-label="Send message">↑</button></div></div>${state.voiceStatus ? `<div id="voice-status" role="status" class="vz-voice-status ${state.voiceListening ? 'is-listening' : ''}">${esc(state.voiceStatus)}</div>` : '<div id="voice-status" role="status" class="vz-voice-status"></div>'}${attachmentChips ? `<div class="vz-attachment-list">${attachmentChips}</div>` : ''}</div><div class="vz-chat-actions"><span class="vz-small">Enter to send · Shift+Enter for a new line</span>${retaskAction}${state.composeMode !== 'retask' && instructions().length >= 2 ? btn('review-plan', 'Review plan') : ''}${active ? btn('save-close', 'Save & close') : ''}</div><details class="vz-examples"><summary class="vz-small">Try sample wording</summary><div class="vz-row"><button class="vz-sample" id="sample-request">Daycare request</button><button class="vz-sample" id="sample-details">Contact and context</button><button class="vz-sample" id="sample-correction">Change arrival time</button></div></details>${error ? alert() : '<div role="alert"></div>'}${storageNote()}</div></div>`;
      field('reply', 'reply'); on('send-reply', send); on('save-close', () => go('inbox'));
      on('voice-input', () => {
        if (!state.voiceListening) {
          state.voiceListening = true; state.voiceStatus = 'Listening… simulated voice input; no microphone is active.';
        } else {
          const sample = 'Call the daycare and let them know I’ll be 20 minutes late.';
          const separator = state.reply && !/\s$/.test(state.reply) ? ' ' : '';
          state.reply = `${state.reply}${separator}${sample}`; state.voiceListening = false; state.voiceStatus = 'Sample transcription added. It is editable and has not been sent.';
        }
        save(); render(); root.querySelector('#reply')?.focus();
      });
      const toField = root.querySelector('#task-to');
      toField.oninput = () => { state.to = toField.value; const contact = savedContact(state.to); state.phone = contact?.phone || ''; save(); };
      const subjectField = root.querySelector('#task-subject');
      subjectField.oninput = () => { state.subject = subjectField.value; if (state.subject.trim()) state.title = state.subject.trim(); save(); };
      field('additional-context','additionalContext');
      const attachmentInput = root.querySelector('#task-attachment-input');
      attachmentInput.onchange = () => { const file = attachmentInput.files?.[0]; if (!file) return; const id = slug(file.name) || `attachment-${Date.now()}`; state.attachments = [...state.attachments.filter(item => item.id !== id), { id, name: file.name }]; save(); render(); };
      state.attachments.forEach(file => on(`remove-attachment-${file.id}`, () => { state.attachments = state.attachments.filter(item => item.id !== file.id); save(); render(); }));
      state.memoryEntries.forEach(entry => on(`memory-choice-${entry.id}`, () => { const checked = root.querySelector(`#memory-choice-${entry.id}`).checked; state.selectedMemoryIds = checked ? [...new Set([...state.selectedMemoryIds, entry.id])] : state.selectedMemoryIds.filter(id => id !== entry.id); save(); }));
      on('close-memory-picker', () => { state.memoryPickerOpen = false; save(); render(); });
      on('edit-proposed-memory', () => { state.memoryPickerOpen = true; save(); render(); });
      on('propose-memory-access', () => { state.proposedMemoryIds = [...state.selectedMemoryIds]; state.memoryPickerOpen = false; save(); render(); });
      on('save-retask', () => { if (!state.sourceDemo) return; state.cancelledDemoIds = [...new Set([...state.cancelledDemoIds, state.sourceDemo])]; state.composeMode = ''; state.lastAction = 'Retask saved. The original task was cancelled and this replacement is now a Draft.'; save(); go('drafts'); });
      const composer = root.querySelector('#reply');
      composer.onkeydown = event => {
        if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); send(); }
      };
      const scroller = root.querySelector('#conversation-scroll');
      if (active) scroller.scrollTop = scroller.scrollHeight;
      on('review-plan', () => {
        if (state.reply.trim()) { error = 'Please send or clear your unsent reply before reviewing the plan.'; render(); return; }
        go('review');
      });
      const samples = {
        'sample-request': 'Call daycare and tell them I’ll be 20 minutes late. I’m in a meeting and can’t call myself.',
        'sample-details': 'Little Oaks, 202-555-0147. My daughter is Maya Rao. I expect to arrive at 4:20 PM today.',
        'sample-correction': 'Actually, tell them 4:30 PM to be safe. Don’t agree to any fees without checking with me.'
      };
      Object.entries(samples).forEach(([id, text]) => on(id, () => { state.reply = text; save(); render(); root.querySelector('#reply').focus(); }));
      return;
    }
    if (state.view === 'review') {
      const handoff = handoffPreview();
      const proposed = memoryEntries(state.proposedMemoryIds); const approved = memoryEntries(state.approvedMemoryIds);
      const memoryApproval = proposed.length ? `<section id="memory-approval-panel" class="vz-surface vz-memory-proposal"><h2>Memory access for this thread</h2><p><strong>${proposed.length} item${proposed.length === 1 ? '' : 's'}:</strong> ${proposed.map(entry => esc(entry.label)).join(', ')}</p>${approved.length ? `<p class="vz-small">Approved for this thread and inherited by its follow-ups.</p><div class="vz-row">${btn('edit-memory-access','Edit')}${btn('revoke-memory-access','Revoke')}</div>` : `<p class="vz-small">These items are not shared yet. Approve or edit the selection.</p><div class="vz-row">${btn('approve-memory-access','Approve',true)}${btn('edit-memory-access','Edit')}</div>`}</section>` : '';
      const callingMemory = approved.length ? approved.map(entry => `<div class="vz-memory-disclosure"><strong>${esc(entry.label)}</strong><span>${esc(entry.value)}</span></div>`).join('') : '<p>No Memory information authorized.</p>';
      const planningSources = state.attachments.length ? `<section id="planning-sources" class="vz-surface"><h2>Planning sources</h2><div class="vz-row">${state.attachments.map(file => `<span class="vz-chip">${esc(file.name)}</span>`).join('')}</div><p class="vz-small">The Planning Agent may inspect these thread attachments. The Calling Agent receives only information you approve in the plan.</p></section>` : '';
      const saveSuggestion = !state.memorySuggestionDismissed && /\bMaya Rao\b/i.test(instructions().map(item => item.text).join(' ')) && !state.memoryEntries.some(entry => entry.label === 'Child name') ? `<section class="vz-surface"><h2>Save to Memory?</h2><p>The planner noticed a reusable detail: <strong>Child name · Maya Rao</strong>.</p><p class="vz-small">Optional—this task can proceed without saving it.</p><div class="vz-row">${btn('save-memory-suggestion','Review & save')}${btn('dismiss-memory-suggestion','Not now')}</div></section>` : '';
      main.innerHTML = `${heading()}<div class="vz-conversation"><section class="vz-handoff"><div class="vz-speaker">voizzz · ready for your review</div><h2>Here’s what I’ll take into the call</h2><div class="vz-handoff-grid"><section data-handoff-field="name" class="vz-handoff-box"><h3>Contact name</h3><p id="handoff-name">${esc(handoff.name)}</p></section><section data-handoff-field="phone" class="vz-handoff-box"><h3>Phone number</h3><p id="handoff-phone">${esc(handoff.phone)}</p></section><section data-handoff-field="summary" class="vz-handoff-box vz-handoff-summary"><h3>What I’ll discuss</h3><p id="handoff-summary">${esc(handoff.summary)}</p></section></div><p class="vz-small">Rule-based demo preview, not AI summarization. Check the details; nothing has been verified or sent.</p>${btn('continue-chat', 'Keep discussing')}<p class="vz-small" style="margin-top:14px">Your permissions still apply. I’ll check with you before making commitments outside the agreed plan.</p></section>${planningSources}${memoryApproval}<section id="calling-agent-memory" class="vz-surface"><h2>Calling Agent handoff</h2>${callingMemory}<p class="vz-small">The Calling Agent receives only the approved fields above—not source files or complete Memory.</p></section>${saveSuggestion}<hr class="vz-line"><div class="vz-row vz-bottom"><div><h2>Estimated cost</h2><span>$0.05–$0.15</span></div><span class="vz-small">Illustrative only · no charges</span></div><hr class="vz-line"><h2>When should the call happen?</h2><div class="vz-row"><label class="vz-choice"><input id="now-choice" name="when" type="radio" ${state.when === 'now' ? 'checked' : ''}> Call now</label><label class="vz-choice"><input id="schedule-choice" name="when" type="radio" ${state.when === 'schedule' ? 'checked' : ''}> Schedule</label></div>${state.when === 'schedule' ? `<div class="vz-fields"><label>Date<input id="schedule-date" type="date" value="${esc(state.date)}"></label><label>Time<input id="schedule-time" type="time" value="${esc(state.time)}"></label></div><p class="vz-small">Local device time. This selects when to call.</p>` : ''}${alert()}${btn('approve', state.when === 'now' ? 'Approve & call now' : 'Approve & schedule', true)}</div>`;
      on('continue-chat', () => { state.status = 'Draft'; go('chat'); });
      on('approve-memory-access', () => { state.approvedMemoryIds = [...state.proposedMemoryIds]; save(); render(); });
      on('edit-memory-access', () => { state.selectedMemoryIds = [...state.proposedMemoryIds]; state.memoryPickerOpen = true; go('chat'); });
      on('revoke-memory-access', () => { state.approvedMemoryIds = []; state.proposedMemoryIds = []; state.selectedMemoryIds = []; state.threadNotice = 'Memory access was revoked for future actions in this thread.'; save(); render(); });
      on('save-memory-suggestion', () => { state.memoryEntries = [...state.memoryEntries, { id: 'child-name', label: 'Child name', value: 'Maya Rao', section: 'Family', source: 'Approved from task review', verified: 'Today', sensitive: true }]; state.memoryNotice = 'Child name was saved to My Memory.'; save(); render(); });
      on('dismiss-memory-suggestion', () => { state.memorySuggestionDismissed = true; save(); render(); });
      on('now-choice', () => { state.when = 'now'; save(); render(); }); on('schedule-choice', () => { state.when = 'schedule'; save(); render(); });
      field('schedule-date', 'date'); field('schedule-time', 'time'); on('approve', approve); return;
    }
    if (state.view === 'trash') {
      main.innerHTML = `<div class="vz-top"><h1>Task in Trash</h1><span class="vz-badge">Trash</span></div><p>Execution and retries are stopped. Restoring preserves history but does not restart work.</p>${btn('restore-task', 'Restore task', true)}`;
      on('restore-task', () => { state.trash = false; state.status = 'Cancelled'; go('detail'); }); return;
    }
    let content = '';
    if (state.status === 'Scheduled') content = `<h2>Scheduled for ${esc(state.date)} at ${esc(state.time)}</h2><p class="vz-small">This mock does not execute scheduled calls.</p><div class="vz-row">${btn('reschedule', 'Reschedule')}${btn('cancel-task', 'Cancel task')}</div>`;
    else if (state.status === 'In progress') content = `<h2>Your assistant is handling it</h2><p>Simulated call in progress using the plan you approved.</p><p class="vz-small">No live listening. No real call is being placed.</p>${btn('cancel-task', 'Cancel task')}<div class="vz-demo"><p class="vz-small">Prototype controls · choose a sample outcome</p><div class="vz-row">${btn('simulate-success', 'Daycare accepts')}${btn('simulate-issue', 'Daycare requests a fee')}</div></div>`;
    else if (state.status === 'Cancelled') content = '<h2>Further work stopped</h2><p>The call or schedule is cancelled. No work restarts automatically.</p>';
    else if (state.tab === 'recording') content = '<h2>Call recording</h2><button disabled>Recording placeholder — no audio</button><p class="vz-small">No real call was made or recorded.</p>';
    else if (state.tab === 'transcript') content = `<h2>Sample transcript</h2><p><span class="vz-small">Assistant</span><br>Hi, I’m Poli’s AI assistant. I’m calling about a late pickup.</p><p><span class="vz-small">Daycare</span><br>${state.issue ? 'There is a late pickup fee. Can you approve it?' : 'Thanks for letting us know. We can accommodate the delay.'}</p><p><span class="vz-small">Assistant</span><br>${state.issue ? 'I’ll check with Poli and get back to you.' : 'Thank you. I’ll let Poli know.'}</p>`;
    else content = state.issue ? '<h2>Your authorization is needed</h2><p>Daycare requested a late pickup fee. No fee was accepted. The task is unresolved.</p><p class="vz-small">Sample notifications: text, email, and phone/voice.</p>' : '<h2>Daycare confirmed the delay is okay</h2><p>In this sample outcome, daycare accepted the pickup arrangement. No further action is needed.</p><p class="vz-small">Confirmation by text · simulated</p>';
    const done = ['Completed', 'Needs attention'].includes(state.status);
    const threadMemory = memoryEntries(state.approvedMemoryIds);
    main.innerHTML = `${heading()}${state.threadNotice ? `<p role="status" class="vz-surface">${esc(state.threadNotice)}</p>` : ''}${done ? `<div class="vz-tabs" aria-label="Task record">${['summary', 'transcript', 'recording'].map(t => `<button id="${t}-tab" aria-pressed="${state.tab === t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div>` : ''}<section class="vz-surface">${content}</section>${threadMemory.length ? `<section id="thread-memory-access" class="vz-surface"><h2>Memory access · this thread</h2><p>${threadMemory.map(entry => esc(entry.label)).join(', ')}</p><p class="vz-small">Follow-ups under this thread inherit this approval.</p>${btn('revoke-thread-memory','Revoke future access')}</section>` : ''}<details style="margin-top:20px"><summary>Planning conversation</summary>${state.messages.map(m => `<p class="vz-summary"><span class="vz-small">${m.role === 'user' ? 'You' : 'voizzz'}</span><br>${esc(m.text)}</p>`).join('')}</details><div class="vz-row" style="margin-top:20px">${btn('back-list', 'Back to Inbox')}${btn('delete-task', 'Delete task')}</div>`;
    ['summary', 'transcript', 'recording'].forEach(t => on(t + '-tab', () => { state.tab = t; save(); render(); }));
    on('back-list', () => go('inbox')); on('reschedule', () => { state.when = 'schedule'; go('review'); });
    on('revoke-thread-memory', () => { state.approvedMemoryIds = []; state.proposedMemoryIds = []; state.selectedMemoryIds = []; state.threadNotice = 'Memory access was revoked for future actions in this thread.'; save(); render(); });
    on('cancel-task', () => { state.status = 'Cancelled'; save(); render(); });
    on('delete-task', () => { state.status = 'Cancelled'; state.trash = true; go('trash'); });
    on('simulate-success', () => { state.status = 'Completed'; state.issue = false; save(); render(); });
    on('simulate-issue', () => { state.status = 'Needs attention'; state.issue = true; save(); render(); });
  }
  on('create-menu', showCreateChoice);
  on('inbox-nav', () => { state.activeTab = 'tasks'; go('inbox'); });
  on('drafts-nav', () => go('drafts'));
  on('contacts-nav', () => go('contacts'));
  on('memory-nav', () => go('memory'));
  on('settings-nav', () => go('settings'));
  render();
})();

