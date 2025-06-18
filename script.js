// Smooth Scroll
document.querySelectorAll('a.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
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

// Parallax scroll effect
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const firstPart = document.getElementById('firstpart');
  if (firstPart) firstPart.style.backgroundPosition = `center ${scrolled * 0.4}px`;

  // Scroll progress bar
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolledPercent = (winScroll / height) * 100;
  document.getElementById("scrollBar").style.width = scrolledPercent + "%";
});

// Section + card reveal animation
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

// Emoji rain on About section
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

// Konami Code Easter Egg
let inputKeys = [];
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
window.addEventListener('keydown', e => {
  inputKeys.push(e.key);
  if (inputKeys.toString().includes(konami.toString())) {
    alert('🧠 Dev Mode Activated!');
    document.body.style.filter = 'invert(1)';
    inputKeys = [];
  }
});
// Show chat panel
const aiIcon = document.getElementById('aiIcon');
const aiPanel = document.getElementById('aiPanel');
const aiClose = document.getElementById('aiClose');
const aiInput = document.getElementById('aiInput');
const aiBody = document.getElementById('aiBody');

aiIcon.addEventListener('click', () => {
  aiPanel.style.display = 'flex';
});

aiClose.addEventListener('click', () => {
  aiPanel.style.display = 'none';
});

aiInput.addEventListener('keydown', (e) => {
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
      } else if (lower.includes("motivate")) {
        response = "You’re not behind. You’re building your own lane. Keep going 🐐";
      } else if (lower.includes("projects")) {
        response = "Check the Projects section — Savy Bet Live, Quiz App, and more 🔥";
      }

      aiBody.innerHTML += `<div class="ai-msg ai-msg-bot">${response}</div>`;
      aiBody.scrollTop = aiBody.scrollHeight;
    }, 500);
  }
});
