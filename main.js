// ── Year in footer ──────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Mobile nav toggle ───────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// ── Theme toggle ─────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const docEl       = document.documentElement;
const THEME_KEY   = 'preferred-theme';
const saved       = localStorage.getItem(THEME_KEY);
if (saved) docEl.setAttribute('data-theme', saved);
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = docEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    docEl.setAttribute('data-theme', current);
    localStorage.setItem(THEME_KEY, current);
  });
}

// ── Reveal on scroll ─────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach((el) => io.observe(el));

// ── 3D Tilt ───────────────────────────────────────────────────
function handleTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 10;
  const rotateX = -((y / rect.height) - 0.5) * 10;
  card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}
function resetTilt(event) {
  event.currentTarget.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
}
document.querySelectorAll('.tilt').forEach((el) => {
  el.addEventListener('mousemove', handleTilt);
  el.addEventListener('mouseleave', resetTilt);
});

// ── GitHub Repos ──────────────────────────────────────────────
const LANG_COLORS = {
  javascript: '#f1e05a',
  typescript: '#3178c6',
  html: '#e34c26',
  css: '#563d7c',
  scss: '#c6538c',
  c: '#555555',
};

const REPO_DESCRIPTIONS = {
  'web-portfolio':     'Modern personal portfolio with dark mode, animations, chatbot & responsive design.',
  'restorent-website': 'Responsive restaurant landing page with dynamic menus and call-to-action sections.',
  'ExpenseForcast':    'Smart expense forecasting & budgeting system to track, predict, and manage finances.',
  'ridlegamev2':       'Alphanumerical Riddle Challenge v2 — Firebase-powered with leaderboard & auth.',
  'mathRiddle-main':   'TypeScript-powered interactive math riddle game with challenge modes.',
  'mathRiddle':        'Interactive math riddles mini-app demonstrating TypeScript & game state logic.',
  'simple-riddle-game':'Beginner-friendly riddle game showcasing DOM manipulation & JS state management.',
  'DSA_Visualizer_in_C':'Step-by-step visualizer for classic data structures & algorithms written in C.',
};

const REPO_EMOJIS = {
  'web-portfolio':     '🌐',
  'restorent-website': '🍽️',
  'ExpenseForcast':    '💰',
  'ridlegamev2':       '🧩',
  'mathRiddle-main':   '🔢',
  'mathRiddle':        '🔢',
  'simple-riddle-game':'🎮',
  'DSA_Visualizer_in_C':'🔬',
};

let allRepos = [];

function getLangColor(lang) {
  return LANG_COLORS[(lang || '').toLowerCase()] || '#8b949e';
}

function buildRepoCard(repo) {
  const desc    = REPO_DESCRIPTIONS[repo.name] || repo.description || 'A GitHub repository by Vinayak Asole.';
  const emoji   = REPO_EMOJIS[repo.name] || '📁';
  const lang    = repo.language || 'Code';
  const liveUrl = `https://vinayakasole.github.io/${repo.name}/`;
  return `
    <article class="repo-card" data-lang="${(repo.language || '').toLowerCase()}">
      <div class="repo-card-top">
        <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener" title="${repo.name}">
          ${emoji} ${repo.name}
        </a>
        ${repo.stargazers_count > 0 ? `<span class="repo-stars">⭐ ${repo.stargazers_count}</span>` : ''}
      </div>
      <p class="repo-desc">${desc}</p>
      <div class="repo-lang">
        <span class="repo-lang-dot" style="background:${getLangColor(repo.language)}"></span>
        ${lang}
        <span style="margin-left:auto;font-size:11px;color:var(--muted)">${new Date(repo.updated_at).toLocaleDateString('en-IN',{year:'numeric',month:'short'})}</span>
      </div>
      <div class="repo-actions">
        ${repo.has_pages ? `<a class="button small primary" href="${liveUrl}" target="_blank" rel="noopener">🚀 Live</a>` : ''}
        <a class="button small ghost" href="${repo.html_url}" target="_blank" rel="noopener">{ Code }</a>
      </div>
    </article>`;
}

function renderRepos(repos) {
  const grid = document.getElementById('repoGrid');
  if (!grid) return;
  if (!repos.length) { grid.innerHTML = '<p class="repo-error">No repositories match this filter.</p>'; return; }
  grid.innerHTML = repos.map(buildRepoCard).join('');
}

async function loadGitHubRepos() {
  const grid = document.getElementById('repoGrid');
  if (!grid) return;
  try {
    const res = await fetch('https://api.github.com/users/VinayakAsole/repos?sort=updated&per_page=20');
    if (!res.ok) throw new Error('GitHub API error');
    allRepos = await res.json();
    renderRepos(allRepos);
  } catch (_) {
    grid.innerHTML = `<p class="repo-error">⚠️ Could not load repositories. <a class="inline-link" href="https://github.com/VinayakAsole?tab=repositories" target="_blank">View on GitHub →</a></p>`;
  }
}

document.querySelectorAll('.repo-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.repo-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    renderRepos(f === 'all' ? allRepos : allRepos.filter(r => (r.language || '').toLowerCase() === f.toLowerCase()));
  });
});

loadGitHubRepos();

// ── Contact Form ──────────────────────────────────────────────
(function setupContactForm() {
  const form = document.querySelector('form.contact');
  if (!form) return;
  const EMAIL_TO          = 'vinayakasole1@gmail.com';
  const EMAILJS_PUBLIC_KEY  = 'uT_C_YZTAU5VXiYBq';
  const EMAILJS_SERVICE_ID  = 'service_i38v07n';
  const EMAILJS_TEMPLATE_ID = 'template_xy0fay9';

  function loadEmailJs(cb) {
    if (window.emailjs) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    s.onload = cb;
    document.head.appendChild(s);
  }

  function sendWithMailto(name, fromEmail, location, message) {
    const subject = `New Contact Form Message from ${name} (${fromEmail})`;
    let body = `Contact Form Submission%0D%0A%0D%0AName: ${name}%0D%0AEmail: ${fromEmail}%0D%0A`;
    if (location) body += `Location: ${location}%0D%0A`;
    body += `%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data      = new FormData(form);
    const name      = String(data.get('name') || '').trim();
    const fromEmail = String(data.get('email') || '').trim();
    const location  = String(data.get('location') || '').trim();
    const message   = String(data.get('message') || '').trim();
    if (!name || !fromEmail || !message) { alert('Please fill in all required fields.'); return; }
    if (!EMAILJS_PUBLIC_KEY) { sendWithMailto(name, fromEmail, location, message); return; }
    loadEmailJs(() => {
      try {
        // eslint-disable-next-line no-undef
        emailjs.init(EMAILJS_PUBLIC_KEY);
        // eslint-disable-next-line no-undef
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_email: EMAIL_TO, from_name: name, from_email: fromEmail,
          reply_to: fromEmail, location: location || 'Not provided', message,
          subject: `New Contact Form Message from ${name} (${fromEmail})`,
        }).then(() => { alert('Thanks! Your message has been sent.'); form.reset(); })
          .catch(() => sendWithMailto(name, fromEmail, location, message));
      } catch (_) { sendWithMailto(name, fromEmail, location, message); }
    });
  });
})();

// ── Chatbot (Smart Local — No API needed) ────────────────────
(function setupChatbot() {
  const toggle   = document.getElementById('chatbotToggle');
  const panel    = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const input    = document.getElementById('chatbotInput');
  const sendBtn  = document.getElementById('chatbotSend');
  const msgs     = document.getElementById('chatbotMessages');
  if (!toggle || !panel) return;

  // ── Open / Close ──
  function openPanel() {
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    input.focus();
  }
  function closePanel() {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () =>
    panel.classList.contains('is-open') ? closePanel() : openPanel()
  );
  closeBtn.addEventListener('click', closePanel);

  // ── DOM helpers ──
  function appendMsg(role, html) {
    const d = document.createElement('div');
    d.className = `chat-msg ${role}`;
    d.innerHTML = `<div class="chat-bubble">${html}</div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const d = document.createElement('div');
    d.className = 'chat-msg bot chat-typing';
    d.innerHTML = `<div class="chat-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  // ── Quick replies ──
  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      appendMsg('user', msg);
      btn.closest('.chat-quick-replies')?.remove();
      respond(msg);
    });
  });

  // ── Intent knowledge base ──
  const INTENTS = [
    {
      tags: ['project','work','built','make','portfolio','app','website','site','show','demo'],
      replies: [
        `Here are Vinayak's projects 🚀<br><br>
         🌐 <b>web-portfolio</b> — This site! Dark mode, chatbot & animations<br>
         🔬 <b>DSA Visualizer in C</b> — Algo animations &nbsp;<a href="https://vinayakasole.github.io/DSA_Visualizer_in_C/" target="_blank">Live ↗</a><br>
         🍽️ <b>restorent-website</b> — Restaurant landing page &nbsp;<a href="https://vinayakasole.github.io/restorent-website/" target="_blank">Live ↗</a><br>
         💰 <b>ExpenseForcast</b> — Budget tracker &nbsp;<a href="https://vinayakasole.github.io/ExpenseForcast/" target="_blank">Live ↗</a><br>
         🧩 <b>ridlegamev2</b> — Firebase riddle game &nbsp;<a href="https://vinayakasole.github.io/ridlegamev2/" target="_blank">Live ↗</a><br>
         ☕ <b>Lazeez Kitchen's</b> — Cafe management system (in progress)`,

        `Vinayak has built <b>8+ projects</b>! 💪<br>
         Scroll to the <b>GitHub Repos</b> section to see all live links.<br><br>
         Top picks:<br>
         • <a href="https://vinayakasole.github.io/DSA_Visualizer_in_C/" target="_blank">DSA Visualizer</a> — algorithm animations<br>
         • <a href="https://vinayakasole.github.io/ridlegamev2/" target="_blank">Riddle Game v2</a> — Firebase leaderboard<br>
         • <a href="https://vinayakasole.github.io/ExpenseForcast/" target="_blank">ExpenseForcast</a> — smart budgeting`,
      ]
    },
    {
      tags: ['skill','tech','language','stack','know','use','framework','tool','technology','learn'],
      replies: [
        `💡 Vinayak's tech stack:<br><br>
         <b>Frontend:</b> HTML5, CSS3/SCSS, JavaScript, TypeScript, React<br>
         <b>Backend:</b> Node.js, Express, MongoDB, PostgreSQL, Firebase<br>
         <b>Tools:</b> Git & GitHub, C/DSA, Testing, Accessibility`,

        `Vinayak is strongest in <b>JavaScript & web development</b> 🧑‍💻<br><br>
         He works with React on frontend, Node.js + Express on backend, and databases like MongoDB, PostgreSQL & Firebase.<br>
         He also has solid <b>C language & DSA</b> skills from his engineering coursework.`,
      ]
    },
    {
      tags: ['contact','email','phone','reach','message','mail','call','connect','linkedin','instagram'],
      replies: [
        `📬 Reach Vinayak here:<br><br>
         ✉️ <a href="mailto:vinayakasole1@gmail.com">vinayakasole1@gmail.com</a><br>
         📞 <a href="tel:+919373997279">+91 93739 97279</a><br>
         💼 <a href="https://www.linkedin.com/in/vinayak-asole-b1212625a" target="_blank">LinkedIn</a><br>
         🐙 <a href="https://github.com/VinayakAsole" target="_blank">GitHub</a><br><br>
         Or use the <a href="#contact">contact form</a> on this page!`,

        `Best way to contact Vinayak is by email: <a href="mailto:vinayakasole1@gmail.com">vinayakasole1@gmail.com</a> 📧<br>
         You can also connect on <a href="https://www.linkedin.com/in/vinayak-asole-b1212625a" target="_blank">LinkedIn</a> or call <a href="tel:+919373997279">+91 93739 97279</a>.`,
      ]
    },
    {
      tags: ['education','college','study','degree','diploma','course','university','school','polytechnic','engineering','qualification'],
      replies: [
        `🎓 Vinayak's education:<br><br>
         <b>Diploma in CSE</b><br>Govt. Polytechnic, Yavatmal (2022–2025)<br><br>
         <b>B.E./B.Tech in Engineering</b><br>JAGADAMBA College of Engineering & Tech., Yavatmal (2025–2028)<br><br>
         <i>Coursework: DSA, DBMS, OS, Networks, Algorithms</i>`,

        `Vinayak completed his <b>Diploma in Computer Science</b> from Govt. Polytechnic Yavatmal and is now pursuing his <b>B.Tech</b> at JAGADAMBA College of Engineering, Yavatmal. 🏛️`,
      ]
    },
    {
      tags: ['experience','internship','job','role','lead','company','work history'],
      replies: [
        `💼 Vinayak's experience:<br><br>
         <b>Student Developer</b> — Academic Projects (2023–Present)<br>
         Built web apps, collaborated on planning & testing.<br><br>
         <b>Project Lead</b> — Lazeez Kitchen's Cafe Management (Current)<br>
         Designing order flow, menu CRUD, billing & daily reports.`,

        `Vinayak has been an active <b>Student Developer</b> since 2023. He currently leads the <b>Lazeez Kitchen's</b> cafe management system as Project Lead. 🚀`,
      ]
    },
    {
      tags: ['github','repo','repository','open source','code','source','git'],
      replies: [
        `🐙 All public repos at <a href="https://github.com/VinayakAsole" target="_blank">github.com/VinayakAsole</a><br><br>
         This page has a live <b>GitHub Repositories</b> section — scroll down to see all repos with filters!`,

        `Vinayak has 8+ public repos on <a href="https://github.com/VinayakAsole" target="_blank">GitHub ↗</a> — games, tools, visualizers & this very portfolio!`,
      ]
    },
    {
      tags: ['hire','available','opportunity','freelance','open to work','recruit','position','vacancy','job'],
      replies: [
        `🚀 Yes! Vinayak is open to <b>internships & full-time roles</b>!<br><br>
         Reach out via the <a href="#contact">contact form</a> or email <a href="mailto:vinayakasole1@gmail.com">vinayakasole1@gmail.com</a>.`,

        `Vinayak is looking for opportunities in web / software development. 💼<br>
         Connect on <a href="https://www.linkedin.com/in/vinayak-asole-b1212625a" target="_blank">LinkedIn</a> or email <a href="mailto:vinayakasole1@gmail.com">vinayakasole1@gmail.com</a>!`,
      ]
    },
    {
      tags: ['dsa','data structure','algorithm','visualizer','c language','visualize'],
      replies: [
        `🔬 <b>DSA_Visualizer_in_C</b> is one of Vinayak's most unique projects!<br>
         It visually animates data structures & algorithms step-by-step.<br>
         <a href="https://vinayakasole.github.io/DSA_Visualizer_in_C/" target="_blank">Try it live ↗</a>`,
      ]
    },
    {
      tags: ['riddle','game','ridlegame','firebase','leaderboard','quiz'],
      replies: [
        `🧩 <b>ridlegamev2</b> — Alphanumerical Riddle Challenge with Firebase auth & real-time leaderboard!<br>
         <a href="https://vinayakasole.github.io/ridlegamev2/" target="_blank">Play it live ↗</a>`,
      ]
    },
    {
      tags: ['expense','budget','money','finance','forecast','forcast'],
      replies: [
        `💰 <b>ExpenseForcast</b> is a smart expense forecasting & budgeting system to track, predict, and manage your finances.<br>
         <a href="https://vinayakasole.github.io/ExpenseForcast/" target="_blank">Try it live ↗</a>`,
      ]
    },
    {
      tags: ['hello','hi','hey','sup','greet','morning','evening','howdy','yo','hii','helo'],
      replies: [
        `Hey there! 👋 I'm Vinayak's portfolio assistant.<br>Ask me about his <b>projects, skills, education, or how to hire him!</b>`,
        `Hi! 😊 Welcome to Vinayak's portfolio!<br>What would you like to know? Try: <b>projects</b>, <b>skills</b>, or <b>contact info</b>.`,
        `Hello! Great to meet you 👋<br>I can tell you all about Vinayak — his work, skills, and how to reach him. Ask away!`,
      ]
    },
    {
      tags: ['who','vinayak','about','yourself','person','developer','you','he','him','name'],
      replies: [
        `Vinayak Asole is a <b>Software Developer & Engineering Student</b> from Yavatmal, India 🇮🇳<br><br>
         He builds modern web apps with clean code & thoughtful design. He has <b>8+ projects</b> on GitHub and is actively looking for internships & roles.<br><br>
         <a href="https://github.com/VinayakAsole" target="_blank">GitHub</a> · <a href="https://www.linkedin.com/in/vinayak-asole-b1212625a" target="_blank">LinkedIn</a>`,

        `Vinayak is a passionate web developer currently pursuing B.Tech at JAGADAMBA College, Yavatmal. He loves solving real problems — from cafe management systems to algorithm visualizers! 💻`,
      ]
    },
    {
      tags: ['thank','thanks','good','great','awesome','nice','cool','wow','perfect','helpful'],
      replies: [
        `You're welcome! 😊 Feel free to ask anything else about Vinayak.`,
        `Happy to help! 🙌 Is there anything else you'd like to know?`,
        `Glad I could help! 😄 Ask me anything else anytime.`,
      ]
    },
  ];

  const FALLBACKS = [
    `Hmm, I'm not sure about that 🤔<br>Try asking me about:<br><b>🚀 Projects &nbsp;·&nbsp; 💡 Skills &nbsp;·&nbsp; 📬 Contact &nbsp;·&nbsp; 🎓 Education &nbsp;·&nbsp; 💼 Hiring</b>`,
    `I didn't quite get that 😅 — I'm best at questions about Vinayak's <b>projects, skills, education</b>, or <b>contact info</b>. Give one a try!`,
    `That's a bit outside my knowledge! 🙂<br>Try asking: <i>"What projects has Vinayak built?"</i> or <i>"How can I contact him?"</i>`,
  ];

  // Round-robin cursor per intent to vary responses
  const cursors = new Map();
  function pick(arr, key) {
    const i = (cursors.get(key) || 0) % arr.length;
    cursors.set(key, i + 1);
    return arr[i];
  }

  function matchIntent(text) {
    const t = text.toLowerCase();
    let best = null, bestScore = 0;
    for (const intent of INTENTS) {
      let score = 0;
      for (const tag of intent.tags) {
        if (t.includes(tag)) score += tag.length; // longer tag = more specific
      }
      if (score > bestScore) { bestScore = score; best = intent; }
    }
    return bestScore > 0 ? best : null;
  }

  function respond(text) {
    const intent = matchIntent(text);
    const reply  = intent ? pick(intent.replies, intent) : pick(FALLBACKS, 'fallback');
    const typingEl = showTyping();
    setTimeout(() => {
      typingEl.remove();
      appendMsg('bot', reply);
    }, 500 + Math.random() * 600);
  }

  // ── Send ──
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    appendMsg('user', text);
    input.value = '';
    respond(text);
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
})();
