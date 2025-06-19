// Smooth Scroll
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    if (this.hash !== '') {
      e.preventDefault();
      const target = document.querySelector(this.hash);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Typewriter Intro
const introText = document.querySelector('#firstpart h1');
const textContent = "Hello! I'm Xavier";
let index = 0;
function typeWriter() {
  if (index < textContent.length) {
    introText.innerHTML += textContent.charAt(index);
    index++;
    setTimeout(typeWriter, 80);
  }
}
window.addEventListener('load', () => {
  introText.innerHTML = '';
  setTimeout(typeWriter, 300);
  document.querySelector('#navbar').style.opacity = 0;
  setTimeout(() => {
    document.querySelector('#navbar').style.transition = 'opacity 1s ease';
    document.querySelector('#navbar').style.opacity = 1;
  }, 800);
});

// Parallax scroll + scroll bar
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const firstPart = document.getElementById('firstpart');
  if (firstPart) firstPart.style.backgroundPosition = `center ${scrolled * 0.4}px`;

  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolledPercent = (winScroll / height) * 100;
  document.getElementById("scrollBar").style.width = scrolledPercent + "%";
});

// Animate sections and cards
const elements = document.querySelectorAll('section, .card, .about-section');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.style.transition = 'all 1s ease';
    el.style.opacity = 1;
    el.style.transform = 'translateY(0)';
    obs.unobserve(el);
  });
}, { threshold: 0.2 });

elements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(40px)';
  observer.observe(el);
});

// Card hover glow + scale
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
    card.style.boxShadow = '0 0 25px rgba(255,255,255,0.4)';
    card.style.transform = 'scale(1.03)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
    card.style.transform = 'scale(1)';
  });
});

// Button hover trail
document.querySelectorAll('a.btn, button.btn').forEach(button => {
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.addEventListener('mouseenter', function (e) {
    const trail = document.createElement('span');
    trail.style.position = 'absolute';
    trail.style.borderRadius = '50%';
    trail.style.width = '200px';
    trail.style.height = '200px';
    trail.style.background = 'rgba(255,255,255,0.2)';
    trail.style.top = e.offsetY + 'px';
    trail.style.left = e.offsetX + 'px';
    trail.style.transform = 'translate(-50%, -50%)';
    trail.style.animation = 'trailFadeJS 0.6s ease-out forwards';
    this.appendChild(trail);
    setTimeout(() => trail.remove(), 600);
  });
});

// Emoji rain in about section
const aboutSection = document.getElementById("secondPart");
const emojiRain = () => {
  const emojis = ['💻', '⚾', '🎮', '🔥'];
  const emoji = document.createElement('div');
  emoji.innerText = emojis[Math.floor(Math.random() * emojis.length)];
  emoji.style.position = 'fixed';
  emoji.style.left = Math.random() * window.innerWidth + 'px';
  emoji.style.top = '-50px';
  emoji.style.fontSize = '2rem';
  emoji.style.animation = 'fall 3s linear';
  emoji.style.zIndex = 999;
  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 3000);
};
aboutSection.addEventListener("mouseenter", () => {
  const interval = setInterval(emojiRain, 200);
  aboutSection.addEventListener("mouseleave", () => clearInterval(interval), { once: true });
});

// AI Chat Panel
const aiIcon = document.getElementById('aiIcon');
const aiPanel = document.getElementById('aiPanel');
const aiClose = document.getElementById('aiClose');
const aiInput = document.getElementById('aiInput');
const aiBody = document.getElementById('aiBody');

aiIcon?.addEventListener('click', () => {
  aiPanel.style.display = 'flex';
});
aiClose?.addEventListener('click', () => {
  aiPanel.style.display = 'none';
});
aiInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && aiInput.value.trim() !== "") {
    const userMsg = aiInput.value.trim();
    aiBody.innerHTML += `<div class="ai-msg ai-msg-user">${userMsg}</div>`;
    aiInput.value = "";

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = "I didn't understand that. Try asking about Xavier's skills or projects, or for some motivation.";

      if (lower.includes("xavier")) {
        response = "Xavier Cabrera is a full-stack beast — building apps with React, Node, and AI tech.";
      } else if (lower.includes("skills")) {
        response = "He knows HTML, CSS, JS, Python, React, MongoDB, AI, and more!";
      } else if (lower.includes("motivate") || lower.includes("motivation")) {
        response = "You’re not behind. You’re building your own lane. Keep going 🐐";
      } else if (lower.includes("projects")) {
        response = "Check the Projects section — Savy Bet Live, Quiz App, and more 🔥";
      }

      aiBody.innerHTML += `<div class="ai-msg ai-msg-bot">${response}</div>`;
      aiBody.scrollTop = aiBody.scrollHeight;
    }, 500);
  }
});

// Easter Egg Sequence — Trigger terminal (not while typing)
let xavierKeys = [];
const xavierCode = ['x', 'a', 'v', 'i', 'e', 'r'];
window.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  if (active.tagName === "INPUT" || active.tagName === "TEXTAREA") return;

  xavierKeys.push(e.key.toLowerCase());
  if (xavierKeys.slice(-6).toString() === xavierCode.toString()) {
    activateDevTerminal();
    xavierKeys = [];
  }
});

// Button click unlock
document.getElementById('unlockDevBtn')?.addEventListener('click', () => {
  activateDevTerminal();
});

// Dev Terminal Logic
let commandBuffer = "";
function activateDevTerminal() {
  const terminal = document.getElementById('devTerminal');
  const terminalText = document.getElementById('terminalText');
  const inputFix = document.getElementById('terminalInputFix');

  terminal.classList.add('active');
  commandBuffer = "";
  terminalText.innerHTML =
    "Welcome to Dev Mode 🧠<br>" +
    "Type a command or try:<br>" +
    "- <code>help</code><br>" +
    "- <code>projects</code><br>" +
    "- <code>clear</code><br>" +
    "- <code>exit</code><br><br>> ";

  inputFix.focus();
}
document.getElementById('devTerminal')?.addEventListener('click', () => {
  document.getElementById('terminalInputFix')?.focus();
});

// Terminal typing input
document.addEventListener('keydown', (e) => {
  const terminal = document.getElementById('devTerminal');
  const terminalText = document.getElementById('terminalText');
  if (!terminal.classList.contains('active')) return;

  if (e.key === "Escape") {
    terminal.classList.remove('active');
  } else if (e.key === "Enter") {
    const command = commandBuffer.trim().toLowerCase();
    terminalText.innerHTML += command + "<br>";
    runCommand(command);
    commandBuffer = "";
  } else if (e.key === "Backspace") {
    commandBuffer = commandBuffer.slice(0, -1);
    updateTerminalLine();
  } else if (e.key.length === 1) {
    commandBuffer += e.key;
    updateTerminalLine();
  }

  terminalText.scrollTop = terminalText.scrollHeight;
});

function updateTerminalLine() {
  const terminalText = document.getElementById("terminalText");
  const lines = terminalText.innerHTML.split("<br>");
  lines[lines.length - 1] = `> ${commandBuffer}`;
  terminalText.innerHTML = lines.join("<br>");
}

function runCommand(cmd) {
  const terminalText = document.getElementById("terminalText");

  switch (cmd) {
    case "help":
      terminalText.innerHTML +=
        "Available Commands:<br>" +
        "- help<br>" +
        "- projects<br>" +
        "- clear<br>" +
        "- exit<br>> ";
      break;
    case "projects":
      terminalText.innerHTML +=
        "Featured Projects:<br>" +
        "- Savy Bet Live<br>" +
        "- Connect 4 AI<br>" +
        "- Grocery App<br>> ";
      break;
    case "clear":
      terminalText.innerHTML = "> ";
      break;
    case "exit":
      document.getElementById("devTerminal").classList.remove("active");
      break;
    default:
      terminalText.innerHTML += `Unknown command: <code>${cmd}</code><br>> `;
  }
}
const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");
let musicPlaying = false;

musicToggle.addEventListener("click", () => {
  if (!musicPlaying) {
    bgMusic.play();
    musicToggle.innerText = "⏸️ Pause My Vibe";
    musicPlaying = true;
  } else {
    bgMusic.pause();
    musicToggle.innerText = "🎵 Play My Vibe";
    musicPlaying = false;
  }
});
