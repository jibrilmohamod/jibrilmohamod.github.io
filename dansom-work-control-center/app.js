(() => {
  'use strict';
  const KEY = 'dansom-work-control-center-v1';
  const PROJECTS = ['FAO PLACE', 'BORESHA-NABAD', 'KST Somalia', 'UN-Habitat BUDP ETE', 'GEPD Somalia', 'TPDP'];
  const TYPES = ['Task', 'Meeting', 'Deliverable', 'Evidence request', 'Follow-up', 'Field mission', 'Report', 'Presentation', 'Email approval'];
  const STATUSES = ['Backlog', 'Next', 'In Progress', 'Waiting', 'Review', 'Ready to Send', 'Done'];
  const PRIORITIES = ['Normal', 'High', 'Low'];
  const SOURCE_KINDS = ['Manual', 'Email', 'Meeting notes', 'Document', 'Other'];
  const TEMPLATES = [
    { id: 'mission', title: 'Mission plan', subtitle: 'Plan and coordinate a field assignment.', type: 'Field mission', icon: '⌁', steps: ['Confirm mission objectives and scope', 'Confirm location, itinerary and field team', 'Identify stakeholders and appointments', 'Prepare and review data collection tools', 'Confirm logistics, access and contingency arrangements', 'Confirm field quality assurance and reporting plan', 'Secure mission plan approval'] },
    { id: 'debrief', title: 'Debrief presentation', subtitle: 'From field notes to approved slides.', type: 'Presentation', icon: '▥', steps: ['Consolidate field findings and observations', 'Check figures and supporting evidence', 'Draft slide structure and key messages', 'Prepare charts, visuals and limitations', 'Complete internal review and revisions', 'Obtain clearance before sharing'] },
    { id: 'matrix', title: 'Response matrix', subtitle: 'Track feedback and revisions to closure.', type: 'Deliverable', icon: '⊞', steps: ['Collect and log all review comments', 'Map each comment to the relevant section', 'Assign owners and next actions', 'Record responses and evidence of changes', 'Verify closure and seek approval'] },
    { id: 'onboarding', title: 'Onboarding tasks', subtitle: 'Track a colleague’s setup and handover.', type: 'Task', icon: '♙', steps: ['Confirm onboarding scope and responsible person', 'Confirm account and access setup', 'Identify required policies and orientation', 'Schedule introductions and project handover', 'Confirm completion with the responsible person'] },
    { id: 'approval', title: 'Email approval', subtitle: 'Draft, check, approve and send.', type: 'Email approval', icon: '↗', steps: ['Draft message and verify factual statements', 'Check To, CC and subject', 'Check attachments and source versions', 'Request and record approval', 'Send only after approval', 'Capture any follow-up required'] }
  ];
  const TITLES = { today: 'Today', week: 'This Week', projects: 'By Project', project: 'Project overview', waiting: 'Waiting for Others', ready: 'Ready to Send', all: 'All Work', meetings: 'Meetings', deliverables: 'Deliverables & Reports', evidence: 'Evidence Requests', missions: 'Field Missions', contacts: 'Stakeholder Contacts', templates: 'Reusable Templates', settings: 'Backup & Settings' };
  const DESCRIPTIONS = { today: 'What needs attention now, including overdue and active work.', week: 'Deadlines and commitments in the current Monday–Sunday week.', projects: 'A clean overview of your concurrent assignments.', waiting: 'Items blocked by decisions, documents or responses from others.', ready: 'Work prepared for your final check and dispatch.', all: 'One place for tasks, meetings, follow-ups and outputs.', meetings: 'Meeting preparation, decisions and action items.', deliverables: 'Reports, decks and other tracked deliverables.', evidence: 'Requests, missing documentation and verification.', missions: 'Mission planning and field follow-through.', contacts: 'A practical directory linked to your projects.', templates: 'Start recurring workflows without recreating checklists.', settings: 'Keep control of your records and backups.' };
  const now = () => new Date();
  const isoDate = (date = now()) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  const today = () => isoDate();
  const uid = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(36).slice(2, 10);
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const short = (v, n = 85) => String(v || '').length > n ? String(v).slice(0, n - 1) + '…' : String(v || '');
  const fmtDate = str => { if (!str) return 'No date'; const d = new Date(str + 'T12:00:00'); return Number.isNaN(d.getTime()) ? str : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }); };
  const stamp = () => new Date().toISOString();
  const newDb = () => ({ version: 1, projects: PROJECTS.map(name => ({ id: uid(), name, status: '', lead: '', notes: '', link: '' })), items: [], contacts: [] });
  let db;
  let storageAvailable = true;
  try { db = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { db = null; }
  if (!db || !Array.isArray(db.items) || !Array.isArray(db.projects) || !Array.isArray(db.contacts)) db = newDb();
  const state = { view: 'today', projectId: '', query: '', filterProject: '', filterStatus: '', filterType: '', showDone: false };
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modalRoot');
  let toastTimer;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); storageAvailable = true; return true; } catch (e) { storageAvailable = false; toast('Storage unavailable or full. Export a backup now.'); return false; } };
  const toast = msg => { const el = document.getElementById('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3700); };
  const project = id => db.projects.find(p => p.id === id);
  const projectName = id => project(id)?.name || 'Unassigned';
  const closed = x => x.status === 'Done';
  const weekRange = () => { const d = now(); d.setHours(12, 0, 0, 0); const diff = (d.getDay() + 6) % 7; const start = new Date(d); start.setDate(start.getDate() - diff); const end = new Date(start); end.setDate(end.getDate() + 6); return [isoDate(start), isoDate(end)]; };
  const dueToday = x => !closed(x) && !!x.dueDate && x.dueDate <= today();
  const dueThisWeek = x => { const [s, e] = weekRange(); return !closed(x) && !!x.dueDate && x.dueDate >= s && x.dueDate <= e; };
  const waitingItems = () => db.items.filter(x => !closed(x) && x.status === 'Waiting');
  const readyItems = () => db.items.filter(x => !closed(x) && x.status === 'Ready to Send');
  const options = (values, selected, label = '') => (label ? `<option value="">${esc(label)}</option>` : '') + values.map(v => `<option value="${esc(v.value ?? v)}" ${(v.value ?? v) === selected ? 'selected' : ''}>${esc(v.label ?? v)}</option>`).join('');
  const projectOptions = (value, empty = 'No project assigned') => options(db.projects.map(x => ({ value: x.id, label: x.name })), value, empty);
  const group = (label, html, extra = '') => `<div class="field ${extra}"><label>${label}</label>${html}</div>`;
  const input = (name, value = '', placeholder = '', type = 'text') => `<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" />`;
  const select = (name, values, value, first = '') => `<select name="${name}">${options(values, value, first)}</select>`;
  const area = (name, value = '', placeholder = '', rows = 4) => `<textarea name="${name}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`;
  const btn = (label, action, variant = 'btn-soft') => `<button class="btn ${variant}" type="button" data-action="${action}">${label}</button>`;
  const heading = (title, description, extra = '') => `<div class="page-heading"><div><div class="eyebrow">MONITOR · ORGANIZE · DELIVER</div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${extra ? `<div class="heading-right">${extra}</div>` : ''}</div>`;
  const metric = (label, value, foot, accent = false) => `<div class="metric ${accent ? 'accent' : ''}"><div class="metric-label">${esc(label)}</div><div class="metric-value">${value}</div><div class="metric-foot">${esc(foot)}</div></div>`;
  const pill = status => `<span class="pill ${status === 'Waiting' ? 'waiting' : status === 'Ready to Send' ? 'ready' : status === 'In Progress' ? 'progress' : status === 'Review' ? 'review' : status === 'Done' ? 'done' : ''}">${esc(status || 'Backlog')}</span>`;
  const searchMatch = x => { const q = state.query.trim().toLowerCase(); return !q || [x.title, x.projectId && projectName(x.projectId), x.owner, x.nextAction, x.sourceDocument, x.notes, x.waitingOn, x.type].join(' ').toLowerCase().includes(q); };
  const filteredItems = base => {
    let list = base.filter(x => (!state.filterProject || x.projectId === state.filterProject) && (!state.filterStatus || x.status === state.filterStatus) && (!state.filterType || x.type === state.filterType) && (state.showDone || !closed(x)) && searchMatch(x));
    const priorityOrder = { High: 0, Normal: 1, Low: 2 };
    return list.sort((a, b) => (a.dueDate ? 0 : 1) - (b.dueDate ? 0 : 1) || (a.dueDate || '').localeCompare(b.dueDate || '') || (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1) || (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  };
  const baseItems = view => {
    if (view === 'today') return db.items.filter(x => dueToday(x) || (!closed(x) && x.status === 'In Progress'));
    if (view === 'week') return db.items.filter(dueThisWeek);
    if (view === 'waiting') return waitingItems();
    if (view === 'ready') return readyItems();
    if (view === 'project') return db.items.filter(x => x.projectId === state.projectId);
    if (view === 'meetings') return db.items.filter(x => x.type === 'Meeting');
    if (view === 'deliverables') return db.items.filter(x => ['Deliverable', 'Report', 'Presentation', 'Email approval'].includes(x.type));
    if (view === 'evidence') return db.items.filter(x => x.type === 'Evidence request');
    if (view === 'missions') return db.items.filter(x => x.type === 'Field mission');
    return db.items;
  };
  const filterbar = () => `<div class="toolbar"><label class="search"><span>⌕</span><input type="search" id="workSearch" value="${esc(state.query)}" placeholder="Search title, owner, source, next action…" aria-label="Search work items" /></label><select class="select-compact" data-filter="project" aria-label="Project filter">${projectOptions(state.filterProject, 'All projects')}</select><select class="select-compact" data-filter="status" aria-label="Status filter">${options(STATUSES, state.filterStatus, 'All statuses')}</select><select class="select-compact" data-filter="type" aria-label="Type filter">${options(TYPES, state.filterType, 'All types')}</select><label class="check-label"><input type="checkbox" data-filter="done" ${state.showDone ? 'checked' : ''}/> Show done</label></div>`;
  const workTable = (items, view) => {
    if (!items.length) return `<div class="empty"><div class="empty-visual">▧</div><h3>Nothing here yet</h3><p>${state.query || state.filterProject || state.filterStatus || state.filterType ? 'Try clearing a filter to see more work.' : 'No records match this view. Add a real task or capture an action from an email or meeting.'}</p>${btn('＋ Add a work item', 'new-item')}</div>`;
    return `<div class="table-wrap"><table class="work-table"><thead><tr><th>Work item</th><th>Project</th><th>Next action</th><th>Due date</th><th>Owner</th><th>Status</th><th><span class="sr-only">Actions</span></th></tr></thead><tbody>` + items.map(x => `<tr><td><button class="item-title" data-edit-item="${esc(x.id)}">${esc(short(x.title, 90))}</button><div class="item-meta"><span>${esc(x.type || 'Task')}</span>${x.priority === 'High' ? '<span class="pill priority-high">High</span>' : ''}${x.sourceKind && x.sourceKind !== 'Manual' ? `<span>· ${esc(x.sourceKind)}</span>` : ''}</div></td><td>${esc(short(projectName(x.projectId), 30))}</td><td><span class="next-action" title="${esc(x.nextAction || '')}">${esc(x.nextAction ? short(x.nextAction, 56) : 'Not set')}</span></td><td class="${x.dueDate && x.dueDate < today() && !closed(x) ? 'due-over' : 'muted'}">${esc(x.dueDate ? fmtDate(x.dueDate) : 'Not set')}${x.dueDate && x.dueDate < today() && !closed(x) ? '<div style="font-size:10px">Overdue</div>' : ''}</td><td>${esc(x.owner || 'Unassigned')}</td><td>${pill(x.status)}</td><td><button class="small-action" title="Edit item" aria-label="Edit ${esc(x.title)}" data-edit-item="${esc(x.id)}">⋯</button></td></tr>`).join('') + '</tbody></table></div>';
  };
  const taskView = (view, showStats = false) => {
    let title = TITLES[view] || 'All Work';
    let desc = DESCRIPTIONS[view] || '';
    if (view === 'project') { title = project(state.projectId)?.name || 'Project'; desc = 'Project-specific work items, sources and next actions.'; }
    const [weekStart, weekEnd] = weekRange();
    let before = '';
    if (showStats) {
      before = `<div class="metric-grid">${metric('Due / overdue', db.items.filter(dueToday).length, 'Open items with a deadline at or before today', true)}${metric('This week', db.items.filter(dueThisWeek).length, 'Due ' + fmtDate(weekStart) + ' to ' + fmtDate(weekEnd))}${metric('Waiting on others', waitingItems().length, 'Open dependencies and responses')}${metric('Ready to send', readyItems().length, 'Items marked ready for dispatch')}</div>`;
    }
    let projectDetails = '';
    if (view === 'project') {
      const p = project(state.projectId);
      projectDetails = p ? `<div class="project-info"><div><strong>${esc(p.name)}</strong><div class="caption">${p.status ? 'Status: ' + esc(p.status) : 'Project status not provided'}${p.lead ? ' · Lead: ' + esc(p.lead) : ''}</div>${p.notes ? `<div class="caption">${esc(short(p.notes, 180))}</div>` : ''}</div><div class="actions-row">${btn('← Projects', 'back-projects', 'btn-plain')}<button class="btn btn-soft" data-edit-project="${esc(p.id)}">Edit project</button></div></div>` : '';
    }
    const visible = filteredItems(baseItems(view));
    return heading(title, desc, view === 'today' || view === 'week' ? `<span class="date-chip">${esc(now().toLocaleDateString(undefined, {weekday:'short',day:'numeric',month:'short',year:'numeric'}))}</span>` : '') + before + projectDetails + `<section class="section-card" style="padding:19px 19px 0"><div class="section-header"><div><h2 class="section-title">${view === 'today' ? 'Your focus queue' : 'Work items'} <span class="count-dot">${visible.length}</span></h2><p class="section-subtitle">Only your own records appear here. Click an item to edit it.</p></div><button class="btn btn-plain btn-sm" data-action="export-csv">Export CSV</button></div>${filterbar()}</section><section class="table-card" style="margin-top:12px">${workTable(visible, view)}</section>`;
  };
  const projectsView = () => heading(TITLES.projects, DESCRIPTIONS.projects, `<button class="btn btn-soft" data-action="new-project">＋ Add project</button>`) + `<div class="project-grid">${db.projects.map((p, i) => { const items = db.items.filter(x => x.projectId === p.id && !closed(x)); const due = items.filter(dueToday).length; return `<button class="project-card" data-open-project="${esc(p.id)}"><div class="project-head"><div class="project-icon">${esc(p.name.slice(0, 2).toUpperCase())}</div>${pill(p.status || 'Not specified')}</div><h3>${esc(p.name)}</h3><p>${p.notes ? esc(short(p.notes, 85)) : 'Project details can be added when confirmed.'}</p><div class="project-foot"><span><strong>${items.length}</strong> open item${items.length === 1 ? '' : 's'}</span><span><strong>${due}</strong> due / overdue</span></div></button>`; }).join('')}</div>${!db.projects.length ? '<div class="empty"><h3>No projects</h3></div>' : ''}`;
  const contactsView = () => heading(TITLES.contacts, DESCRIPTIONS.contacts, `<button class="btn btn-soft" data-action="new-contact">＋ Add contact</button>`) + `<div class="table-card">${db.contacts.length ? `<div class="table-wrap"><table class="work-table contact-table"><thead><tr><th>Name</th><th>Organization / role</th><th>Project</th><th>Email</th><th>Phone</th><th></th></tr></thead><tbody>${db.contacts.map(c => `<tr><td><button class="item-title" data-edit-contact="${esc(c.id)}">${esc(c.name)}</button></td><td>${esc([c.organization,c.role].filter(Boolean).join(' · ') || 'Not set')}</td><td>${esc(projectName(c.projectId))}</td><td>${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '<span class="muted">Not set</span>'}</td><td>${esc(c.phone || 'Not set')}</td><td><button class="small-action" data-edit-contact="${esc(c.id)}">⋯</button></td></tr>`).join('')}</tbody></table></div>` : `<div class="empty"><div class="empty-visual">♙</div><h3>No contacts recorded</h3><p>Add stakeholders only when their names and details are confirmed.</p>${btn('＋ Add a contact', 'new-contact')}</div>`}</div>`;
  const templatesView = () => heading(TITLES.templates, DESCRIPTIONS.templates) + `<div class="hint-banner">Templates are checklists and starter work items, not completed reports or verified facts. New entries have no assigned owner or due date until you set them.</div><div class="templates-grid">${TEMPLATES.map(t => `<article class="template-card"><div class="template-icon">${esc(t.icon)}</div><h3>${esc(t.title)}</h3><p>${esc(t.subtitle)}</p><ul class="template-list">${t.steps.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join('')}<li>…and ${t.steps.length - 3} more</li></ul><button class="btn btn-soft" data-use-template="${esc(t.id)}">Use template ↗</button></article>`).join('')}</div>`;
  const settingsView = () => heading(TITLES.settings, DESCRIPTIONS.settings) + `<div class="settings-grid"><section class="panel-card settings-panel"><h3>Back up your workspace</h3><p>Export a complete JSON backup of project records, work items, contacts and links. Importing a backup replaces the current data after a confirmation.</p><div class="setting-actions">${btn('↓ Export JSON backup', 'export-json', 'btn-primary')}${btn('↑ Import JSON backup', 'import-json')}${btn('↓ Export tasks to CSV', 'export-csv', 'btn-plain')}</div></section><section class="panel-card settings-panel"><h3>Data and access</h3><p>Your entries are saved in this browser’s local storage. This version has no account login, cloud synchronization or automatic Gmail/Calendar connection. Clearing your browser storage can erase your entries.</p><p class="note">${storageAvailable ? '● Local storage is available.' : '● Local storage is unavailable. Export now.'} Current records: ${db.projects.length} projects, ${db.items.length} work items, ${db.contacts.length} contacts.</p></section></div><section class="section-card" style="margin-top:18px"><h3 class="section-title">Working rules</h3><p class="caption" style="line-height:1.8">Only mark an item “Ready to Send” after checking recipients, version, attachments and approval. Use “Waiting” with the “Waiting on” field to record external dependencies. Keep source links and next actions attached to every task whenever available. No facts are imported from email until you explicitly capture them.</p></section>`;
  function render() {
    const page = state.view;
    document.getElementById('breadcrumb').textContent = TITLES[page] || 'Project';
    document.querySelectorAll('[data-nav]').forEach(el => el.classList.toggle('active', el.dataset.nav === page || (page === 'project' && el.dataset.nav === 'projects')));
    document.getElementById('navToday').textContent = db.items.filter(x => dueToday(x) || (!closed(x) && x.status === 'In Progress')).length || '';
    document.getElementById('navWaiting').textContent = waitingItems().length || '';
    document.getElementById('navReady').textContent = readyItems().length || '';
    if (page === 'projects') app.innerHTML = projectsView();
    else if (page === 'contacts') app.innerHTML = contactsView();
    else if (page === 'templates') app.innerHTML = templatesView();
    else if (page === 'settings') app.innerHTML = settingsView();
    else app.innerHTML = taskView(page, page === 'today');
  }
  function navigate(view, projectId = '') { state.view = view; state.projectId = projectId; state.query = ''; state.filterProject = ''; state.filterStatus = ''; state.filterType = ''; state.showDone = view === 'all' || view === 'project'; render(); window.scrollTo(0,0); document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').hidden = true; }
  function modal(title, description, content, footer) { modalRoot.innerHTML = `<div class="modal-backdrop" data-close-outside="true"><div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-header"><div><h2>${esc(title)}</h2><p>${esc(description)}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div><div class="modal-body">${content}</div><div class="modal-footer">${footer}</div></div></div>`; const first = modalRoot.querySelector('input:not([type="hidden"]),textarea,select'); if (first) setTimeout(() => first.focus(), 0); }
  const closeModal = () => { modalRoot.innerHTML = ''; };
  function editItem(id = '') {
    const x = id ? db.items.find(i => i.id === id) : null;
    const v = x || { id:'', title:'', type:'Task', projectId: state.view === 'project' ? state.projectId : '', status:'Backlog', priority:'Normal', owner:'', dueDate:'', eventTime:'', waitingOn:'', sourceKind:'Manual', sourceDocument:'', sourceUrl:'', nextAction:'', notes:'' };
    const content = `<form id="itemForm"><input type="hidden" name="id" value="${esc(v.id)}"/><div class="form-grid">${group('Title *', input('title', v.title, 'Action, output or commitment'), 'full')}${group('Record type', select('type', TYPES, v.type))}${group('Project', `<select name="projectId">${projectOptions(v.projectId)}</select>`)}${group('Status', select('status', STATUSES, v.status))}${group('Priority', select('priority', PRIORITIES, v.priority))}${group('Owner / responsible person', input('owner', v.owner, 'Leave blank if unknown'))}${group('Due date / meeting date', input('dueDate', v.dueDate, '', 'date'))}${group('Meeting time (optional)', input('eventTime', v.eventTime, '', 'time'))}${group('Waiting on (optional)', input('waitingOn', v.waitingOn, 'Person, team or dependency'))}${group('Next action', input('nextAction', v.nextAction, 'Specific next step'), 'full')}${group('Source type', select('sourceKind', SOURCE_KINDS, v.sourceKind))}${group('Source document / thread', input('sourceDocument', v.sourceDocument, 'Document title, email subject or reference'))}${group('Source link (optional)', input('sourceUrl', v.sourceUrl, 'https://…', 'url'), 'full')}${group('Notes, decisions, evidence and context', area('notes', v.notes, 'Keep the original context here. No details are inferred.', 5), 'full')}</div></form>`;
    modal(x ? 'Edit work item' : 'New work item', 'Keep fields empty where the information is not confirmed.', content, `${x ? `<button class="danger-link" data-delete-item="${esc(x.id)}">Delete item</button>` : ''}<button class="btn btn-plain" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" form="itemForm">${x ? 'Save changes' : 'Create item'}</button>`);
  }
  function editProject(id = '') {
    const x = id ? project(id) : null;
    const v = x || { id:'', name:'', status:'', lead:'', notes:'', link:'' };
    modal(x ? 'Edit project' : 'Add a project', 'Do not fill in project details until verified.', `<form id="projectForm"><input type="hidden" name="id" value="${esc(v.id)}"/><div class="form-grid">${group('Project name *', input('name', v.name, 'Project name'), 'full')}${group('Current status', input('status', v.status, 'Optional'))}${group('Project lead / focal point', input('lead', v.lead, 'Optional'))}${group('Project folder or source link', input('link', v.link, 'https://…', 'url'), 'full')}${group('Notes', area('notes', v.notes, 'Scope, locations or project context, if known'), 'full')}</div></form>`, `${x ? `<button class="danger-link" data-delete-project="${esc(x.id)}">Delete project</button>` : ''}<button class="btn btn-plain" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="projectForm" type="submit">Save project</button>`);
  }
  function editContact(id = '') {
    const x = id ? db.contacts.find(i => i.id === id) : null;
    const v = x || { id:'', name:'', organization:'', role:'', projectId:'', email:'', phone:'', notes:'' };
    modal(x ? 'Edit contact' : 'Add stakeholder contact', 'Record only confirmed contact details.', `<form id="contactForm"><input type="hidden" name="id" value="${esc(v.id)}"/><div class="form-grid">${group('Name *', input('name', v.name, 'Full name'), 'full')}${group('Organization', input('organization', v.organization, 'Optional'))}${group('Role', input('role', v.role, 'Optional'))}${group('Project', `<select name="projectId">${projectOptions(v.projectId)}</select>`)}${group('Email', input('email', v.email, 'name@example.org', 'email'))}${group('Phone', input('phone', v.phone, 'Optional'))}${group('Notes', area('notes', v.notes, 'Relevant contact context'), 'full')}</div></form>`, `${x ? `<button class="danger-link" data-delete-contact="${esc(x.id)}">Delete contact</button>` : ''}<button class="btn btn-plain" data-action="close-modal">Cancel</button><button class="btn btn-primary" form="contactForm" type="submit">Save contact</button>`);
  }
  const extractLines = text => text.split(/\r?\n/).map(x => x.replace(/^\s*(?:[-*•]|\d+[.)]|\[[ xX]\])\s*/, '').trim()).filter(Boolean).slice(0, 50);
  function capture() {
    modal('Quick capture', 'Paste an email action or meeting note. Review each task before assigning a deadline.', `<form id="captureForm"><div class="form-grid">${group('Project', `<select name="projectId">${projectOptions(state.view === 'project' ? state.projectId : '')}</select>`)}${group('Source', select('sourceKind', SOURCE_KINDS, 'Email'))}${group('Source document or email subject', input('sourceDocument', '', 'Subject or meeting name'), 'full')}${group('Source link', input('sourceUrl', '', 'https://…', 'url'), 'full')}${group('Email content, note or action *', area('raw', '', 'Paste source text or one action per line…', 9), 'full')}<div class="field full"><label class="check-label"><input type="checkbox" name="split" id="captureSplit" /> Create one item per non-empty line (maximum 50)</label><span class="field-help">When off, the first line becomes the title and the complete text stays in notes. When on, each line becomes a separate task.</span></div></div></form><div class="line-preview" id="capturePreview">No captured text yet.</div>`, `<button class="btn btn-plain" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" form="captureForm">Capture tasks</button>`);
  }
  function updatePreview() { const raw = modalRoot.querySelector('[name="raw"]')?.value || ''; const split = modalRoot.querySelector('#captureSplit')?.checked; const preview = modalRoot.querySelector('#capturePreview'); if (!preview) return; const lines = extractLines(raw); if (!lines.length) { preview.textContent = 'No captured text yet.'; return; } preview.innerHTML = split ? `<strong>${lines.length} task(s) to create:</strong>` + lines.slice(0, 5).map(t => `<div>• ${esc(short(t, 115))}</div>`).join('') + (lines.length > 5 ? `<div>…and ${lines.length - 5} more</div>` : '') : `<strong>1 task to create:</strong><div>${esc(short(lines[0], 130))}</div><div>Full pasted text will remain in notes.</div>`; }
  function useTemplate(id) {
    const t = TEMPLATES.find(t => t.id === id);
    if (!t) return;
    modal('Use: ' + t.title, 'Choose a project or leave unassigned. You can edit every created record.', `<form id="templateForm"><input type="hidden" name="template" value="${esc(id)}"/><div class="form-grid">${group('Project', `<select name="projectId">${projectOptions(state.view === 'project' ? state.projectId : '')}</select>`, 'full')}${group('Title for parent record', input('title', t.title, 'Work item title'), 'full')}<div class="field full"><label class="check-label"><input type="checkbox" name="steps" checked /> Also create ${t.steps.length} individual checklist tasks</label></div></div><div class="line-preview">${t.steps.map((s,i) => `<div>${i + 1}. ${esc(s)}</div>`).join('')}</div></form>`, `<button class="btn btn-plain" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit" form="templateForm">Create from template</button>`);
  }
  const urlOK = value => { if (!value) return true; try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol); } catch(e) { return false; } };
  function readForm(form) { const fd = new FormData(form); const obj = Object.fromEntries(fd.entries()); Object.keys(obj).forEach(k => { if (typeof obj[k] === 'string') obj[k] = obj[k].trim(); }); return obj; }
  function confirmDelete(message) { return window.confirm(message); }
  function handleSubmit(e) {
    if (e.target.getAttribute('id') === 'itemForm') {
      e.preventDefault(); const data = readForm(e.target);
      if (!data.title) return toast('A title is required.');
      if (!urlOK(data.sourceUrl)) return toast('Source link must be an http or https URL.');
      const existing = db.items.find(x => x.id === data.id);
      const record = { ...existing, ...data, id: existing?.id || uid(), createdAt: existing?.createdAt || stamp(), updatedAt: stamp() };
      if (existing) db.items[db.items.indexOf(existing)] = record; else db.items.push(record);
      save(); closeModal(); render(); toast(existing ? 'Work item updated.' : 'Work item created.');
    } else if (e.target.getAttribute('id') === 'projectForm') {
      e.preventDefault(); const data = readForm(e.target); if (!data.name) return toast('Project name is required.'); if (!urlOK(data.link)) return toast('Project link must be http or https.');
      const existing = project(data.id); const record = { ...existing, ...data, id: existing?.id || uid() };
      if (existing) db.projects[db.projects.indexOf(existing)] = record; else db.projects.push(record);
      save(); closeModal(); render(); toast('Project saved.');
    } else if (e.target.getAttribute('id') === 'contactForm') {
      e.preventDefault(); const data = readForm(e.target); if (!data.name) return toast('Contact name is required.');
      const existing = db.contacts.find(x => x.id === data.id); const record = { ...existing, ...data, id: existing?.id || uid() };
      if (existing) db.contacts[db.contacts.indexOf(existing)] = record; else db.contacts.push(record);
      save(); closeModal(); render(); toast('Contact saved.');
    } else if (e.target.getAttribute('id') === 'captureForm') {
      e.preventDefault(); const data = readForm(e.target); const full = data.raw || ''; const lines = extractLines(full);
      if (!lines.length) return toast('Paste text before capturing.');
      if (!urlOK(data.sourceUrl)) return toast('Source link must be http or https.');
      const split = new FormData(e.target).has('split');
      const titles = split ? lines : [lines[0]];
      titles.forEach(t => db.items.push({ id: uid(), title: short(t, 210), type: 'Task', projectId: data.projectId, status: 'Backlog', priority: 'Normal', owner: '', dueDate: '', eventTime: '', waitingOn: '', sourceKind: data.sourceKind, sourceDocument: data.sourceDocument, sourceUrl: data.sourceUrl, nextAction: '', notes: split ? t + '\n\nCaptured from:\n' + full : full, createdAt: stamp(), updatedAt: stamp() }));
      save(); closeModal(); navigate('all'); toast(`${titles.length} captured item${titles.length !== 1 ? 's' : ''}. Review titles and assignments.`);
    } else if (e.target.getAttribute('id') === 'templateForm') {
      e.preventDefault(); const data = readForm(e.target); const t = TEMPLATES.find(x => x.id === data.template); if (!t) return;
      if (!data.title) return toast('A title is required.');
      const groupId = uid(); const base = { projectId: data.projectId, status: 'Backlog', priority: 'Normal', owner: '', dueDate: '', eventTime: '', waitingOn: '', sourceKind:'Manual', sourceDocument:'Template: ' + t.title, sourceUrl:'', createdAt: stamp(), updatedAt: stamp(), groupId };
      db.items.push({ ...base, id: uid(), title: data.title, type: t.type, nextAction: t.steps[0], notes: t.steps.map(s => '☐ ' + s).join('\n') });
      if (new FormData(e.target).has('steps')) t.steps.forEach(s => db.items.push({ ...base, id: uid(), title: s, type: 'Task', nextAction: '', notes: 'Checklist task from: ' + data.title }));
      save(); closeModal(); navigate('all'); toast('Template records created. Set owners and dates when known.');
    }
  }
  function download(filename, data, type) { const blob = new Blob([data], {type}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000); }
  function exportJSON() { download('dansom-work-control-center-' + today() + '.json', JSON.stringify({ ...db, exportedAt: stamp(), app: 'Dansom Work Control Center' }, null, 2), 'application/json'); toast('Backup exported.'); }
  function csvValue(v) { let s = String(v ?? ''); if (/^[\s]*[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; }
  function exportCSV() { const cols = ['title','type','project','status','priority','owner','dueDate','eventTime','waitingOn','nextAction','sourceKind','sourceDocument','sourceUrl','notes','createdAt','updatedAt']; const lines = [cols.join(',')]; db.items.forEach(item => lines.push(cols.map(k => csvValue(k === 'project' ? projectName(item.projectId) : item[k])).join(','))); download('dansom-work-items-' + today() + '.csv', '\ufeff' + lines.join('\r\n'), 'text/csv;charset=utf-8'); toast('Work items exported to CSV.'); }
  function validateImport(obj) { return obj && obj.version === 1 && Array.isArray(obj.projects) && Array.isArray(obj.items) && Array.isArray(obj.contacts) && obj.projects.every(p => typeof p.id === 'string' && typeof p.name === 'string') && obj.items.every(x => typeof x.id === 'string' && typeof x.title === 'string') && obj.contacts.every(c => typeof c.id === 'string' && typeof c.name === 'string'); }
  document.getElementById('importFile').addEventListener('change', async e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; if (file.size > 10 * 1024 * 1024) return toast('Backup exceeds the 10 MB import limit.'); try { const parsed = JSON.parse(await file.text()); if (!validateImport(parsed)) return toast('Unrecognized backup format. Nothing imported.'); if (!window.confirm(`Replace current records with this backup?\n\nImport contains ${parsed.projects.length} projects, ${parsed.items.length} items and ${parsed.contacts.length} contacts.\n\nExport your current data first if needed.`)) return; const candidate = {version:1,projects:parsed.projects,items:parsed.items,contacts:parsed.contacts}; localStorage.setItem(KEY, JSON.stringify(candidate)); db = candidate; storageAvailable = true; navigate('today'); toast('Backup imported successfully.'); } catch(err) { toast('Import failed. Your existing records were not changed.'); } });
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('click', e => {
    const nav = e.target.closest('[data-nav]'); if (nav) return navigate(nav.dataset.nav);
    const openP = e.target.closest('[data-open-project]'); if (openP) return navigate('project', openP.dataset.openProject);
    const editI = e.target.closest('[data-edit-item]'); if (editI) return editItem(editI.dataset.editItem);
    const editP = e.target.closest('[data-edit-project]'); if (editP) return editProject(editP.dataset.editProject);
    const editC = e.target.closest('[data-edit-contact]'); if (editC) return editContact(editC.dataset.editContact);
    const tmpl = e.target.closest('[data-use-template]'); if (tmpl) return useTemplate(tmpl.dataset.useTemplate);
    const delI = e.target.closest('[data-delete-item]'); if (delI) { if (!confirmDelete('Permanently delete this work item?')) return; db.items = db.items.filter(x => x.id !== delI.dataset.deleteItem); save(); closeModal(); render(); return toast('Work item deleted.'); }
    const delP = e.target.closest('[data-delete-project]'); if (delP) { const count = db.items.filter(x => x.projectId === delP.dataset.deleteProject).length; if (count) return toast('Reassign or delete this project’s work items first.'); if (!confirmDelete('Delete this project?')) return; db.projects = db.projects.filter(x => x.id !== delP.dataset.deleteProject); save(); closeModal(); navigate('projects'); return toast('Project deleted.'); }
    const delC = e.target.closest('[data-delete-contact]'); if (delC) { if (!confirmDelete('Delete this contact?')) return; db.contacts = db.contacts.filter(x => x.id !== delC.dataset.deleteContact); save(); closeModal(); render(); return toast('Contact deleted.'); }
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'new-item') editItem();
    else if (action === 'capture') capture();
    else if (action === 'close-modal') closeModal();
    else if (action === 'new-project') editProject();
    else if (action === 'new-contact') editContact();
    else if (action === 'back-projects') navigate('projects');
    else if (action === 'export-json') exportJSON();
    else if (action === 'export-csv') exportCSV();
    else if (action === 'import-json') document.getElementById('importFile').click();
    if (e.target.id === 'menuToggle') { const open = document.getElementById('sidebar').classList.toggle('open'); document.getElementById('overlay').hidden = !open; }
    if (e.target.id === 'overlay') { document.getElementById('sidebar').classList.remove('open'); e.target.hidden = true; }
    if (e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'workSearch') { const pos = e.target.selectionStart || 0; state.query = e.target.value; render(); const field = document.getElementById('workSearch'); if (field) { field.focus(); try { field.setSelectionRange(pos, pos); } catch(err) {} } }
    if (e.target.name === 'raw') updatePreview();
  });
  document.addEventListener('change', e => {
    if (e.target.dataset.filter) { const f = e.target.dataset.filter; if (f === 'project') state.filterProject = e.target.value; if (f === 'status') state.filterStatus = e.target.value; if (f === 'type') state.filterType = e.target.value; if (f === 'done') state.showDone = e.target.checked; render(); }
    if (e.target.id === 'captureSplit') updatePreview();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').hidden = true; } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); capture(); } });
  if (!localStorage.getItem(KEY)) save();
  render();
})();