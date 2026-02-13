const LABELS = {
  engineering: 'Engineering',
  exploring: 'Exploring'
};

const ABOUT_LABELS = {
  whatIBuild: 'What I build',
  howIThink: 'How I think',
  currentExploration: 'Currently exploring'
};

function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'text') e.textContent = v;
    else e.setAttribute(k, v);
  });
  children.forEach(c => { if (c) e.appendChild(c); });
  return e;
}

async function load(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}

function renderAbout(data) {
  const target = document.querySelector('.about-blocks');
  if (!target) return;
  target.replaceChildren();
  for (const [key, label] of Object.entries(ABOUT_LABELS)) {
    if (!data[key]) continue;
    target.appendChild(el('dt', { text: label }));
    target.appendChild(el('dd', { text: data[key] }));
  }
}

function renderSkills(data) {
  const section = document.querySelector('.skills');
  if (!section) return;
  const h2 = section.querySelector('h2');
  section.replaceChildren(h2);
  for (const [key, label] of Object.entries(LABELS)) {
    const items = data[key];
    if (!items?.length) continue;
    const ul = el('ul', { class: 'skills-list' });
    items.forEach(s => ul.appendChild(el('li', { text: s })));
    const group = el('div', { class: 'skills-group' }, el('h3', { text: label }), ul);
    section.appendChild(group);
  }
}

function renderProjects(data) {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  grid.replaceChildren();
  data.forEach(p => {
    const card = el('article', { class: 'project-card' },
      el('span', { class: 'project-type', text: p.category }),
      el('h3', { text: p.name }),
      el('p', { text: p.description })
    );
    grid.appendChild(card);
  });
}

const ICONS = {
  github: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  linkedin: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  flask: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>'
};

function renderLinks(data) {
  const list = document.querySelector('.header-links');
  if (!list) return;
  list.replaceChildren();
  data.forEach(l => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = l.url;
    a.setAttribute('aria-label', l.title);
    a.innerHTML = ICONS[l.icon] || '';
    li.appendChild(a);
    list.appendChild(li);
  });
}

function fallback(selector) {
  const target = document.querySelector(selector);
  if (target) target.replaceChildren(el('p', { class: 'load-error', text: 'Content failed to load.' }));
}

document.addEventListener('DOMContentLoaded', () => {
  load('data/about.json').then(renderAbout).catch(() => fallback('.about-blocks'));
  load('data/skills.json').then(renderSkills).catch(() => fallback('.skills'));
  load('data/projects.json').then(renderProjects).catch(() => fallback('.projects-grid'));
  load('data/links.json').then(renderLinks).catch(() => fallback('.header-links'));
});
