const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- Nav: solid on scroll, hide on scroll down, mobile menu ---------- */
const nav = $('#nav');
const menu = $('#menu');
const menuBtn = $('#menuBtn');

function closeMenu() {
  menu.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
$$('#menu a').forEach(a => a.addEventListener('click', closeMenu));

/* ---------- Scroll-linked effects (single rAF loop) ---------- */
const scrollBar = $('#scrollBar');
const parallaxEls = $$('[data-parallax]');
const parallaxImgs = $$('[data-parallax-img]');
const xpPanels = $$('.xp-panel');
const stackQuery = window.matchMedia('(min-width: 901px)');
const isStacking = () => stackQuery.matches;
let lastY = window.scrollY;
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;

  // progress bar
  const max = document.documentElement.scrollHeight - vh;
  scrollBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

  // nav state
  nav.classList.toggle('solid', y > 40);
  nav.classList.toggle('hide', y > lastY && y > 400 && !menu.classList.contains('open'));
  lastY = y;

  if (!reduceMotion) {
    // hero parallax
    parallaxEls.forEach(el => {
      if (y < vh * 1.2) el.style.transform = `translate3d(0, ${y * parseFloat(el.dataset.parallax)}px, 0)`;
    });

    // image parallax inside masks
    parallaxImgs.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(img.dataset.parallaxImg);
      img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.12)`;
    });

    // stacking experience panels: previous panel recedes as the next slides over it
    if (isStacking()) {
      xpPanels.forEach((panel, i) => {
        const inner = panel.firstElementChild;
        const next = xpPanels[i + 1];
        if (!next) { inner.style.transform = ''; inner.style.opacity = ''; return; }
        const p = 1 - Math.min(Math.max(next.getBoundingClientRect().top / vh, 0), 1);
        inner.style.transform = `scale(${1 - p * 0.08}) translateY(${p * -30}px)`;
        inner.style.opacity = String(1 - p * 0.65);
      });
    } else {
      xpPanels.forEach(p => { p.firstElementChild.style.transform = ''; p.firstElementChild.style.opacity = ''; });
    }
  }

  // scrubbed text: light up words as the paragraph moves up the screen
  $$('.tab-panel.active .scrub').forEach(p => {
    const r = p.getBoundingClientRect();
    const start = vh * 0.9;
    const end = vh * 0.35;
    const prog = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
    const words = p._words || (p._words = $$('.w', p));
    const lit = Math.round(prog * words.length);
    words.forEach((w, idx) => w.classList.toggle('lit', idx < lit));
  });

  // active nav link
  const sections = $$('main section[id]');
  let current = '';
  sections.forEach(s => { if (s.getBoundingClientRect().top < vh * 0.4) current = s.id; });
  $$('#menu a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener('resize', onScroll);

/* ---------- Split scrub paragraphs into words ---------- */
$$('.scrub').forEach(p => {
  p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
});

/* ---------- Reveal on scroll (with stagger inside grids) ---------- */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

$$('.proj-grid, .certs, .featured-steps, .skills-cols').forEach(group => {
  $$('.reveal', group).forEach((el, i) => el.style.setProperty('--rd', `${(i % 3) * 0.1}s`));
});
$$('.reveal').forEach(el => revealObs.observe(el));

/* ---------- About tabs ---------- */
$$('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab.dataset.tab));
    onScroll();
  });
});

/* ---------- Music ---------- */
const musicToggle = $('#musicToggle');
const bgMusic = $('#bgMusic');
let musicPlaying = false;
musicToggle.addEventListener('click', () => {
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicToggle.textContent = '⏸️ Pause My Vibe';
      musicPlaying = true;
    }).catch(() => { musicToggle.textContent = '🎵 Audio unavailable'; });
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🎵 Play My Vibe';
    musicPlaying = false;
  }
});

/* ---------- AI chat ---------- */
const aiIcon = $('#aiIcon');
const aiPanel = $('#aiPanel');
const aiClose = $('#aiClose');
const aiInput = $('#aiInput');
const aiBody = $('#aiBody');

function addMsg(text, who) {
  const div = document.createElement('div');
  div.className = `ai-msg ai-msg-${who}`;
  div.textContent = text;
  aiBody.appendChild(div);
  aiBody.scrollTop = aiBody.scrollHeight;
}

aiIcon.addEventListener('click', () => { aiPanel.style.display = 'flex'; aiInput.focus(); });
aiClose.addEventListener('click', () => { aiPanel.style.display = 'none'; });
aiInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' || !aiInput.value.trim()) return;
  const userMsg = aiInput.value.trim();
  addMsg(userMsg, 'user');
  aiInput.value = '';

  setTimeout(() => {
    const lower = userMsg.toLowerCase();
    let response = "I didn't catch that. Try asking about Xavier's skills, projects, electrical estimates, or for some motivation.";
    if (lower.includes('electric') || lower.includes('estimate') || lower.includes('takeoff') || lower.includes('hackathon')) {
      response = 'Savy Electrical Estimates turns electrical floor plans into priced takeoffs using computer vision + a vision-language model. Built solo for the Meta Global AI Developer Hackathon ⚡';
    } else if (lower.includes('skills')) {
      response = 'HTML, CSS, JS, Python, Java, C++, Swift, React, Flask, MongoDB, computer vision and more!';
    } else if (lower.includes('motivat')) {
      response = "You're not behind. You're building your own lane. Keep going 🐐";
    } else if (lower.includes('project')) {
      response = 'Check the Featured section for Savy Electrical Estimates, then the Projects grid — Savy Circuit Lab, Savy Bet Live, Quiz App, and more 🔥';
    } else if (lower.includes('xavier')) {
      response = 'Xavier Cabrera is a full-stack and AI developer — React, Node, Python, and computer vision.';
    }
    addMsg(response, 'bot');
  }, 450);
});

/* ---------- Dev terminal easter egg ---------- */
const terminal = $('#devTerminal');
const terminalText = $('#terminalText');
const inputFix = $('#terminalInputFix');
let termHistory = '';
let commandBuffer = '';

const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function renderTerminal() {
  terminalText.innerHTML = termHistory + '&gt; ' + esc(commandBuffer) + '<span class="cursor">█</span>';
  terminal.scrollTop = terminal.scrollHeight;
}

function activateDevTerminal() {
  terminal.classList.add('active');
  commandBuffer = '';
  inputFix.value = '';
  termHistory =
    'Welcome to Dev Mode 🧠\nType a command or try:\n- help\n- projects\n- clear\n- exit\n\n';
  renderTerminal();
  inputFix.focus();
}

function runCommand(cmd) {
  switch (cmd) {
    case 'help':
      termHistory += 'Available Commands:\n- help\n- projects\n- skills\n- clear\n- exit\n\n'; break;
    case 'projects':
      termHistory += 'Featured Projects:\n- Savy Electrical Estimates\n- Savy Circuit Lab\n- Savy Bet Live\n- Connect 4 AI\n- Grocery App\n\n'; break;
    case 'skills':
      termHistory += 'Python · JavaScript · Java · C++ · Swift · React · Flask · Computer Vision\n\n'; break;
    case 'clear':
      termHistory = ''; break;
    case 'exit':
      terminal.classList.remove('active'); inputFix.blur(); break;
    case '':
      break;
    default:
      termHistory += `Unknown command: ${esc(cmd)}\n\n`;
  }
}

terminal.addEventListener('click', () => inputFix.focus());
$('#unlockDevBtn').addEventListener('click', activateDevTerminal);

// typing "xavier" anywhere (outside inputs) opens the terminal
let xavierKeys = '';
window.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (e.key.length !== 1) return;
  xavierKeys = (xavierKeys + e.key.toLowerCase()).slice(-6);
  if (xavierKeys === 'xavier') { activateDevTerminal(); xavierKeys = ''; }
});

// terminal input — the hidden input holds the text, so phone keyboards work too
inputFix.addEventListener('input', () => {
  commandBuffer = inputFix.value;
  renderTerminal();
});
document.addEventListener('keydown', (e) => {
  if (!terminal.classList.contains('active')) return;
  if (e.key === 'Escape') { terminal.classList.remove('active'); inputFix.blur(); return; }
  if (document.activeElement !== inputFix) return;

  if (e.key === 'Enter') {
    e.preventDefault();
    const cmd = commandBuffer.trim().toLowerCase();
    termHistory += '&gt; ' + esc(cmd) + '\n';
    commandBuffer = '';
    inputFix.value = '';
    runCommand(cmd);
    renderTerminal();
  }
});

/* ---------- Init ---------- */
window.addEventListener('load', onScroll);
onScroll();