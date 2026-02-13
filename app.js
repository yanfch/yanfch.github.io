const LABELS = {
  backend: 'Backend',
  aiData: 'AI / Data',
  infrastructure: 'Infrastructure',
  frontend: 'Frontend'
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
      el('p', { text: p.description }),
      el('a', { class: 'project-link', href: p.url, text: 'View project →' })
    );
    grid.appendChild(card);
  });
}

function renderLinks(data) {
  const list = document.querySelector('.quick-links-list');
  if (!list) return;
  list.replaceChildren();
  data.forEach(l => {
    list.appendChild(el('li', null, el('a', { href: l.url, text: l.title })));
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
  load('data/links.json').then(renderLinks).catch(() => fallback('.quick-links-list'));
});
