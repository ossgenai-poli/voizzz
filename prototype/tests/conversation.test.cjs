const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const scriptPath=path.join(__dirname,'../app.js');
const script=fs.existsSync(scriptPath)?fs.readFileSync(scriptPath,'utf8'):'';
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8').replace('<script src="/app.js"></script>',()=>`<script>${script}</script>`);
function setup(t, saved){
 const dom=new JSDOM(html,{runScripts:'dangerously',url:'http://127.0.0.1:4317',beforeParse(w){if(saved)w.localStorage.setItem('voizzz-prototype-v2',saved);}});
 t.after(()=>dom.window.close()); const d=dom.window.document;
 return {d,dom,click(id){const e=d.getElementById(id);assert.ok(e,`Missing ${id}`);e.click();},fill(id,v){const e=d.getElementById(id);assert.ok(e,`Missing ${id}`);e.value=v;e.dispatchEvent(new dom.window.Event('input',{bubbles:true}));},status(){return d.querySelector('[data-status]').textContent;}};
}
function say(x,s){x.fill('reply',s);x.click('send-reply');}
function beginTask(x){x.click('create-menu');x.click('create-task-option');}
function prepare(x){beginTask(x);say(x,'Call daycare. I will be 20 minutes late.');say(x,'Little Oaks, 202-555-0147. Maya Rao. I expect to arrive at 4:20 PM.');}
test('opens on one Inbox with Tasks selected and Messages beside it',t=>{
 const x=setup(t);
 assert.equal(x.d.getElementById('inbox-nav').textContent.trim(),'Inbox');
 assert.equal(x.d.getElementById('tasks-tab').getAttribute('aria-selected'),'true');
 assert.equal(x.d.getElementById('messages-tab').getAttribute('aria-selected'),'false');
 assert.equal(x.d.getElementById('tasks-nav'),null);
});
test('Create offers Task and Message and opens the selected creation journey',t=>{
 const x=setup(t);x.click('create-menu');
 assert.ok(x.d.querySelector('[role=dialog]'));
 x.click('create-task-option');
 assert.equal(x.d.querySelector('[role=dialog]'),null);
 assert.ok(x.d.getElementById('reply'));
 assert.match(x.d.querySelector('main').textContent,/New task/i);
 x.click('create-menu');x.click('create-message-option');
 assert.match(x.d.querySelector('main').textContent,/Create a message/i);
 assert.match(x.d.querySelector('main').textContent,/designed next/i);
});
test('Inbox switches between task and message lists on the same screen',t=>{
 const x=setup(t);x.click('messages-tab');
 assert.equal(x.d.getElementById('messages-tab').getAttribute('aria-selected'),'true');
 assert.match(x.d.querySelector('main').textContent,/Birthday greeting/i);
 x.click('tasks-tab');
 assert.equal(x.d.getElementById('tasks-tab').getAttribute('aria-selected'),'true');
});
test('task creation opens a centered chat entry, then switches to conversation layout',t=>{
 const x=setup(t);beginTask(x);
 assert.ok(x.d.getElementById('reply'),'Composer must be immediately available');
 assert.ok(x.d.querySelector('.vz-chat-layout.is-empty'));
 say(x,'Call daycare');
 assert.ok(x.d.querySelector('.vz-chat-layout.is-active'));
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,1);
 assert.ok(x.d.querySelector('.vz-composer-dock #reply'));
});
test('new task opens an empty conversation without losing the previous draft',t=>{
 const x=setup(t);prepare(x);beginTask(x);
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,0);
 assert.equal(x.d.getElementById('reply').value,'');
 x.click('drafts-nav');x.click('open-draft-0');
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,2);
 assert.match(x.d.querySelector('main').textContent,/Little Oaks/);
});
test('previous draft conversations remain reachable from Drafts after starting fresh',t=>{
 const x=setup(t);prepare(x);beginTask(x);x.click('drafts-nav');
 x.click('open-draft-0');
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,2);
});
test('Enter sends, Shift+Enter and composition events do not',t=>{
 const x=setup(t);beginTask(x);x.fill('reply','Call daycare');
 x.d.getElementById('reply').dispatchEvent(new x.dom.window.KeyboardEvent('keydown',{key:'Enter',shiftKey:true,bubbles:true,cancelable:true}));
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,0);
 x.d.getElementById('reply').dispatchEvent(new x.dom.window.KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true,cancelable:true}));
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,0);
 x.d.getElementById('reply').dispatchEvent(new x.dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,1);
});
test('first reply acknowledges an explicitly named recipient instead of asking who',t=>{
 const x=setup(t);beginTask(x);say(x,'Ask @vinni aunty to pick up Charu');
 const reply=x.d.querySelectorAll('[data-speaker=assistant] .vz-message-text')[0].textContent;
 assert.match(reply,/Vinni Aunty/);
 assert.match(reply,/phone number|contacts/i);
 assert.doesNotMatch(reply,/who should I contact/i);
 assert.match(reply,/pick up Charu/i);
});
test('first reply does not ask how to reach a named recipient when phone is supplied',t=>{
 const x=setup(t);beginTask(x);say(x,'Ask @Vinni Aunty at 202-555-0147 to pick up Charu');
 const reply=x.d.querySelectorAll('[data-speaker=assistant] .vz-message-text')[0].textContent;
 assert.match(reply,/Vinni Aunty/);
 assert.doesNotMatch(reply,/who should I contact|how can I reach|phone number/i);
});
test('preparation uses one reusable reply composer and accepts multiple corrections',t=>{
 const x=setup(t);prepare(x);
 assert.equal(x.d.querySelectorAll('input[type=tel],input[type=time]').length,0);
 say(x,'Actually, make it 4:30 PM.');say(x,'Please do not agree to any fees.');say(x,'Use text if you need me.');
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,5);
 x.click('review-plan');assert.match(x.d.querySelector('main').textContent,/4:30 PM/);
 assert.equal(x.status(),'Draft');x.click('continue-chat');
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,5);
});
test('input is displayed as text, never executable markup',t=>{
 const x=setup(t);beginTask(x);say(x,'<img src=x onerror=alert(1)>');
 assert.equal(x.d.querySelector('main img'),null);
 assert.match(x.d.querySelector('main').textContent,/<img/);
});
test('unsent corrections cannot be silently skipped by review',t=>{
 const x=setup(t);prepare(x);x.fill('reply','Actually arrive at 5 PM, not 4:20.');x.click('review-plan');
 assert.ok(x.d.getElementById('reply'),'Keep the user in the conversation');
 assert.equal(x.d.getElementById('reply').value,'Actually arrive at 5 PM, not 4:20.');
 assert.match(x.d.querySelector('[role=alert]').textContent,/send|clear/i);
 x.click('send-reply');x.click('review-plan');
 assert.match(x.d.querySelector('main').textContent,/5 PM/);
});
test('draft conversation and unsent input survive reload',t=>{
 const x=setup(t);prepare(x);x.fill('reply','One more thing');
 const saved=x.dom.window.localStorage.getItem('voizzz-prototype-v2');
 const y=setup(t,saved);
 assert.match(y.d.querySelector('main').textContent,/Little Oaks/);
 assert.equal(y.d.getElementById('reply').value,'One more thing');
});
test('approval is explicit and completion is simulated',t=>{
 const x=setup(t);prepare(x);x.click('review-plan');assert.equal(x.status(),'Draft');
 x.click('approve');assert.equal(x.status(),'In progress');x.click('simulate-success');
 assert.equal(x.status(),'Completed');x.click('transcript-tab');assert.match(x.d.querySelector('main').textContent,/Sample transcript/);
});
test('handoff has contact name, phone, and a summary instead of a message list',t=>{
 const x=setup(t);prepare(x);say(x,'Actually, make it 4:30 PM.');x.click('review-plan');
 assert.equal(x.d.querySelectorAll('[data-handoff-field]').length,3);
 assert.equal(x.d.getElementById('handoff-name').textContent,'Little Oaks');
 assert.equal(x.d.getElementById('handoff-phone').textContent,'202-555-0147');
 assert.match(x.d.getElementById('handoff-summary').textContent,/4:30 PM/);
 assert.doesNotMatch(x.d.getElementById('handoff-summary').textContent,/4:20 PM/);
 assert.equal(x.d.querySelector('.vz-proposal ol'),null);
 x.click('continue-chat');assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,3);
});
test('unidentified contact data is labeled as missing rather than invented',t=>{
 const x=setup(t);beginTask(x);say(x,'Call the office');say(x,'Ask about opening hours');x.click('review-plan');
 assert.equal(x.d.getElementById('handoff-phone').textContent,'Not yet identified');
 assert.equal(x.d.getElementById('handoff-name').textContent,'Not yet identified');
});
test('scheduled work can be rescheduled, deleted, restored but never auto-restarted',t=>{
 const x=setup(t);prepare(x);x.click('review-plan');x.click('schedule-choice');
 x.fill('schedule-date','2099-10-10');x.fill('schedule-time','10:30');x.click('approve');assert.equal(x.status(),'Scheduled');
 x.click('reschedule');x.fill('schedule-date','2099-10-11');x.click('approve');assert.equal(x.status(),'Scheduled');
 x.click('delete-task');x.click('restore-task');assert.equal(x.status(),'Cancelled');assert.equal(x.d.getElementById('simulate-success'),null);
});
test('empty replies and past schedules are rejected',t=>{
 const x=setup(t);beginTask(x);say(x,'   ');assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,0);
 say(x,'Call daycare');say(x,'Little Oaks.');x.click('review-plan');x.click('schedule-choice');x.fill('schedule-date','2000-01-01');x.fill('schedule-time','10:30');x.click('approve');
 assert.equal(x.status(),'Draft');assert.match(x.d.querySelector('[role=alert]').textContent,/future/);
});
test('active cancellation stops work and fee request awaits authorization',t=>{
 const x=setup(t);prepare(x);x.click('review-plan');x.click('approve');x.click('cancel-task');assert.equal(x.status(),'Cancelled');
 const y=setup(t);prepare(y);y.click('review-plan');y.click('approve');y.click('simulate-issue');assert.equal(y.status(),'Needs attention');assert.match(y.d.querySelector('main').textContent,/No fee was accepted/);
});
test('primary navigation separates Inbox, Drafts, and Contacts under Compose',t=>{
 const x=setup(t);
 assert.equal(x.d.getElementById('create-menu').textContent.trim(),'＋ Compose');
 assert.equal(x.d.getElementById('inbox-nav').textContent.trim(),'Inbox');
 assert.equal(x.d.getElementById('drafts-nav').textContent.trim(),'Drafts');
 assert.equal(x.d.getElementById('contacts-nav').textContent.trim(),'Contacts');
 x.click('contacts-nav');
 assert.ok(x.d.getElementById('contacts-nav').classList.contains('vz-nav-current'));
 assert.ok(!x.d.getElementById('inbox-nav').classList.contains('vz-nav-current'));
});
test('Inbox contains assigned tasks while unfinished planning appears in Drafts',t=>{
 const x=setup(t);beginTask(x);say(x,'Call daycare');x.click('inbox-nav');
 assert.doesNotMatch(x.d.querySelector('main').textContent,/Call daycare/);
 assert.match(x.d.querySelector('main').textContent,/Pending execution/);
 assert.match(x.d.querySelector('main').textContent,/Completed/);
 x.click('drafts-nav');
 assert.match(x.d.querySelector('main').textContent,/daycare/i);
 x.click('open-current-draft');
 assert.ok(x.d.getElementById('reply'));
});
test('pending task record shows structured status and omits transcript',t=>{
 const x=setup(t);x.click('demo-pending-task');
 assert.match(x.d.querySelector('main').textContent,/Task summary/);
 assert.match(x.d.querySelector('main').textContent,/Subject/);
 assert.match(x.d.querySelector('main').textContent,/Current status/);
 assert.match(x.d.querySelector('main').textContent,/Scheduled for today at 10:30 AM/);
 assert.equal(x.d.getElementById('task-transcript'),null);
 assert.ok(x.d.getElementById('edit-task'));
 assert.ok(x.d.getElementById('retask-task'));
 assert.ok(x.d.getElementById('forward-task'));
});
test('completed task record includes outcome, transcript, and reply continuation',t=>{
 const x=setup(t);x.click('demo-completed-task');
 assert.match(x.d.querySelector('main').textContent,/Completed/);
 assert.match(x.d.querySelector('main').textContent,/Daycare confirmed/);
 assert.ok(x.d.getElementById('task-transcript'));
 x.click('reply-task');
 x.fill('task-follow-up','Ask whether the late pickup fee was waived.');
 x.click('send-follow-up');
 assert.match(x.d.querySelector('main').textContent,/Follow-up queued/);
});
test('Compose provides optional To and Subject and resolves saved contact mentions',t=>{
 const x=setup(t);beginTask(x);
 assert.ok(x.d.getElementById('task-to'));
 assert.ok(x.d.getElementById('task-subject'));
 say(x,'Ask @Vinni Aunty to pick up Charu');
 assert.equal(x.d.getElementById('task-to').value,'Vinni Aunty');
 assert.equal(x.d.getElementById('resolved-phone').textContent,'202-555-0147');
 assert.match(x.d.getElementById('task-subject').value,/pick up Charu/i);
 say(x,'Pickup is at 4 PM.');x.click('review-plan');
 assert.equal(x.d.getElementById('handoff-phone').textContent,'202-555-0147');
 x.click('contacts-nav');
 assert.match(x.d.querySelector('main').textContent,/Vinni Aunty/);
 assert.match(x.d.querySelector('main').textContent,/202-555-0147/);
});
test('Inbox rows show an unlabeled star, name, subject, status, and time',t=>{
 const x=setup(t);const row=x.d.querySelector('[data-inbox-row="pending"]');
 assert.ok(row);
 assert.match(row.textContent,/Lakeside Medical/);
 assert.match(row.textContent,/Book annual physical/);
 assert.match(row.textContent,/Pending execution/);
 assert.match(row.textContent,/10:30 AM/);
 assert.doesNotMatch(x.d.querySelector('main').textContent,/Starred/);
 const star=x.d.getElementById('inbox-star-pending');
 assert.equal(star.getAttribute('aria-pressed'),'false');star.click();
 assert.equal(x.d.getElementById('inbox-star-pending').getAttribute('aria-pressed'),'true');
 assert.ok(x.d.getElementById('tasks-tab'),'Star click must not open the task');
});
test('pending task can be edited without reopening planning',t=>{
 const x=setup(t);x.click('demo-pending-task');x.click('edit-task');
 x.fill('edit-to','Northside Clinic');x.fill('edit-subject','Book dental cleaning');x.click('save-edit');
 assert.match(x.d.querySelector('main').textContent,/Northside Clinic/);
 assert.match(x.d.querySelector('main').textContent,/Book dental cleaning/);
 assert.equal(x.d.getElementById('reply'),null);
});
test('Retask leaves the original active until the replacement is saved',t=>{
 const x=setup(t);x.click('demo-pending-task');x.click('retask-task');
 assert.equal(x.d.getElementById('task-to').value,'Lakeside Medical');
 assert.equal(x.d.getElementById('task-subject').value,'Book annual physical');
 x.click('inbox-nav');assert.ok(x.d.getElementById('demo-pending-task'));
 x.click('demo-pending-task');x.click('retask-task');say(x,'Find a dentist and arrange a cleaning instead.');x.click('save-retask');
 assert.match(x.d.querySelector('main').textContent,/Retask saved/i);
 x.click('inbox-nav');assert.equal(x.d.getElementById('demo-pending-task'),null);
});
test('Forward preserves the goal and subject, clears To, and accepts more context',t=>{
 const x=setup(t);x.click('demo-completed-task');x.click('forward-task');
 assert.equal(x.d.getElementById('task-to').value,'');
 assert.equal(x.d.getElementById('task-subject').value,'Late pickup at daycare');
 assert.match(x.d.getElementById('retained-goal').textContent,/delayed by 20 minutes/);
 assert.ok(x.d.getElementById('additional-context'));
 x.click('inbox-nav');assert.ok(x.d.getElementById('demo-completed-task'));
});
test('completed voice task supports listening and transcript download',t=>{
 const x=setup(t);x.click('demo-completed-task');x.click('listen-task');
 assert.match(x.d.querySelector('main').textContent,/Playing sample recording/i);
 const download=x.d.getElementById('download-transcript');
 assert.equal(download.getAttribute('download'),'late-pickup-at-daycare-transcript.txt');
 assert.match(download.getAttribute('href'),/^data:text\/plain/);
});
test('Messages use the same inbox columns and lifecycle actions',t=>{
 const x=setup(t);x.click('messages-tab');
 const row=x.d.querySelector('[data-inbox-row="message-pending"]');
 assert.match(row.textContent,/Grandma/);
 assert.match(row.textContent,/Birthday greeting/);
 x.click('demo-message-pending');
 assert.ok(x.d.getElementById('edit-task'));
 assert.ok(x.d.getElementById('retask-task'));
 assert.ok(x.d.getElementById('forward-task'));
});
test('Contacts show email and allow adding an individual reusable contact',t=>{
 const x=setup(t);x.click('contacts-nav');
 assert.match(x.d.querySelector('main').textContent,/vinni@example.com/i);
 x.click('add-contact');
 x.fill('contact-name','Northside Dental');
 x.fill('contact-phone','202-555-0129');
 x.fill('contact-email','appointments@northside.example');
 x.click('save-contact');
 assert.match(x.d.querySelector('main').textContent,/Northside Dental/);
 assert.match(x.d.querySelector('main').textContent,/appointments@northside.example/);
 x.click('create-menu');x.click('create-task-option');
 say(x,'Ask @Northside Dental to schedule a cleaning');
 assert.equal(x.d.getElementById('resolved-phone').textContent,'202-555-0129');
});
test('Contacts import records the selected source without uploading it',t=>{
 const x=setup(t);x.click('contacts-nav');
 const input=x.d.getElementById('contact-import-input');
 const file=new x.dom.window.File(['sample'],'family-contacts.csv',{type:'text/csv'});
 Object.defineProperty(input,'files',{value:[file]});
 input.dispatchEvent(new x.dom.window.Event('change',{bubbles:true}));
 assert.match(x.d.querySelector('[role=status]').textContent,/family-contacts.csv/);
 assert.match(x.d.querySelector('[role=status]').textContent,/simulated/i);
});
test('Memory is below Contacts and separates organized entries from source files',t=>{
 const x=setup(t);
 const nav=[...x.d.querySelectorAll('nav>button')].map(button=>button.textContent.trim());
 assert.deepEqual(nav.slice(1,5),['Inbox','Drafts','Contacts','Memory']);
 x.click('memory-nav');
 assert.equal(x.d.getElementById('memory-items-tab').getAttribute('aria-selected'),'true');
 assert.match(x.d.querySelector('main').textContent,/Date of birth/);
 x.click('memory-files-tab');
 assert.equal(x.d.getElementById('memory-files-tab').getAttribute('aria-selected'),'true');
 assert.match(x.d.querySelector('main').textContent,/Source files and notes/i);
});
test('Memory allows adding and removing one structured entry',t=>{
 const x=setup(t);x.click('memory-nav');x.click('add-memory-entry');
 x.fill('memory-label','Preferred pharmacy');
 x.fill('memory-value','Green Street Pharmacy');
 x.fill('memory-section',' Regularly Used ');
 x.click('save-memory-entry');
 const entry=x.d.querySelector('[data-memory-entry="preferred-pharmacy"]');
 assert.ok(entry);
 assert.match(entry.textContent,/Green Street Pharmacy/);
 assert.match(entry.textContent,/Regularly Used/);
 x.click('remove-memory-preferred-pharmacy');
 assert.equal(x.d.querySelector('[data-memory-entry="preferred-pharmacy"]'),null);
});
test('Memory Files accepts named notes as persistent sources',t=>{
 const x=setup(t);x.click('memory-nav');x.click('memory-files-tab');x.click('add-memory-note');
 x.fill('memory-note-name','School pickup notes');
 x.fill('memory-note-text','Only Maya may be picked up by Vinni Aunty.');
 x.click('save-memory-note');
 const note=x.d.querySelector('[data-memory-file="school-pickup-notes"]');
 assert.ok(note);
 assert.match(note.textContent,/Named note/);
});
test('a Memory source file creates a proposal and requires approval before becoming Memory',t=>{
 const x=setup(t);x.click('memory-nav');
 const before=x.d.querySelectorAll('[data-memory-entry]').length;
 x.click('memory-files-tab');
 const input=x.d.getElementById('memory-file-input');
 const file=new x.dom.window.File(['sample'],'driver-license.pdf',{type:'application/pdf'});
 Object.defineProperty(input,'files',{value:[file]});
 input.dispatchEvent(new x.dom.window.Event('change',{bubbles:true}));
 assert.match(x.d.querySelector('[data-memory-file="driver-license-pdf"]').textContent,/Needs your review/i);
 x.click('review-memory-proposal');
 assert.ok(x.d.getElementById('approve-memory-proposal'));
 x.click('memory-items-tab');
 assert.equal(x.d.querySelectorAll('[data-memory-entry]').length,before);
 x.click('memory-files-tab');x.click('review-memory-proposal');x.click('approve-memory-proposal');
 x.click('memory-items-tab');
 assert.equal(x.d.querySelectorAll('[data-memory-entry]').length,before+1);
});
test('task attachments remain on their task and are not carried into a new draft',t=>{
 const x=setup(t);beginTask(x);
 const input=x.d.getElementById('task-attachment-input');
 const file=new x.dom.window.File(['sample'],'referral.pdf',{type:'application/pdf'});
 Object.defineProperty(input,'files',{value:[file]});
 input.dispatchEvent(new x.dom.window.Event('change',{bubbles:true}));
 assert.match(x.d.querySelector('[data-task-attachment]').textContent,/referral.pdf/);
 beginTask(x);
 assert.equal(x.d.querySelector('[data-task-attachment]'),null);
});
test('@memory opens an item picker and selection remains proposed until final approval',t=>{
 const x=setup(t);beginTask(x);say(x,'Use @memory for my date of birth when calling the clinic.');
 assert.ok(x.d.getElementById('memory-picker'));
 assert.equal(x.d.getElementById('task-to').value,'','@memory is a reserved command, not a contact');
 x.click('memory-choice-date-of-birth');x.click('propose-memory-access');
 assert.match(x.d.getElementById('memory-proposal-banner').textContent,/1 Memory item proposed/i);
 say(x,'Ask for the earliest annual physical appointment.');x.click('review-plan');
 assert.match(x.d.getElementById('memory-approval-panel').textContent,/not shared yet/i);
 assert.doesNotMatch(x.d.getElementById('calling-agent-memory').textContent,/January 15/);
 x.click('approve-memory-access');
 assert.match(x.d.getElementById('calling-agent-memory').textContent,/Date of birth/);
 assert.match(x.d.getElementById('calling-agent-memory').textContent,/January 15/);
});
test('approved Memory belongs to the thread and can be revoked before future actions',t=>{
 const x=setup(t);beginTask(x);say(x,'Use @memory for my date of birth.');
 x.click('memory-choice-date-of-birth');x.click('propose-memory-access');
 say(x,'Call the clinic about an annual physical.');x.click('review-plan');x.click('approve-memory-access');x.click('approve');
 assert.match(x.d.getElementById('thread-memory-access').textContent,/Date of birth/);
 x.click('revoke-thread-memory');
 assert.match(x.d.querySelector('[role=status]').textContent,/revoked/i);
 assert.equal(x.d.getElementById('thread-memory-access'),null);
});
test('review distinguishes task attachments from Calling Agent disclosure',t=>{
 const x=setup(t);beginTask(x);
 const input=x.d.getElementById('task-attachment-input');
 Object.defineProperty(input,'files',{value:[new x.dom.window.File(['sample'],'insurance-card.pdf',{type:'application/pdf'})]});
 input.dispatchEvent(new x.dom.window.Event('change',{bubbles:true}));
 say(x,'Call the clinic.');say(x,'Ask for an annual physical appointment.');x.click('review-plan');
 assert.match(x.d.getElementById('planning-sources').textContent,/insurance-card.pdf/);
 assert.match(x.d.getElementById('planning-sources').textContent,/Calling Agent receives only information you approve/i);
});
test('dismissing a Save to Memory suggestion does not create a Memory entry',t=>{
 const x=setup(t);prepare(x);x.click('review-plan');
 assert.match(x.d.querySelector('main').textContent,/Save to Memory\?/);
 x.click('dismiss-memory-suggestion');
 assert.doesNotMatch(x.d.querySelector('main').textContent,/Save to Memory\?/);
 x.click('memory-nav');
 assert.equal(x.d.querySelector('[data-memory-entry="child-name"]'),null);
 assert.doesNotMatch(x.d.querySelector('main').textContent,/Suggestion dismissed/);
});
test('Retask proposes earlier thread Memory and requires Approve or Edit again',t=>{
 const x=setup(t);x.click('demo-pending-task');x.click('retask-task');
 const banner=x.d.getElementById('memory-proposal-banner');
 assert.match(banner.textContent,/from the earlier task/i);
 assert.match(banner.textContent,/approve/i);
 assert.ok(x.d.getElementById('edit-proposed-memory'));
});
test('Settings provides a neutral Gmail-style tab shell without defining controls',t=>{
 const x=setup(t);
 const nav=[...x.d.querySelectorAll('nav>button')].map(button=>button.textContent.trim());
 assert.deepEqual(nav.slice(1,6),['Inbox','Drafts','Contacts','Memory','Settings']);
 x.click('settings-nav');
 const labels=[...x.d.querySelectorAll('[role=tab]')].map(tab=>tab.textContent.trim());
 assert.deepEqual(labels,['General','Communication','Phone & Voice','Connections','Payments & Usage','Privacy & Data']);
 assert.equal(x.d.getElementById('settings-general-tab').getAttribute('aria-selected'),'true');
 assert.match(x.d.getElementById('settings-placeholder').textContent,/Settings to be defined/i);
 x.click('settings-payments-tab');
 assert.equal(x.d.getElementById('settings-payments-tab').getAttribute('aria-selected'),'true');
 assert.match(x.d.getElementById('settings-placeholder').textContent,/Payments & Usage/);
 assert.equal(x.d.querySelector('#settings-placeholder input'),null);
});
test('simulated mic sits before Send, shows listening, and inserts editable text without sending',t=>{
 const x=setup(t);beginTask(x);x.fill('reply','Please ');
 const actions=[...x.d.querySelectorAll('.vz-composer-actions button')].map(button=>button.id);
 assert.deepEqual(actions,['voice-input','send-reply']);
 const mic=x.d.getElementById('voice-input');
 assert.equal(mic.getAttribute('aria-pressed'),'false');
 x.click('voice-input');
 assert.equal(x.d.getElementById('voice-input').getAttribute('aria-pressed'),'true');
 assert.match(x.d.getElementById('voice-status').textContent,/Listening/i);
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,0);
 x.click('voice-input');
 assert.equal(x.d.getElementById('voice-input').getAttribute('aria-pressed'),'false');
 assert.match(x.d.getElementById('reply').value,/Please Call the daycare/i);
 assert.match(x.d.getElementById('voice-status').textContent,/editable/i);
 assert.equal(x.d.querySelectorAll('[data-speaker=user]').length,0);
});

