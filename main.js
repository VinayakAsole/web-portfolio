// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Theme toggle with localStorage
const themeToggle = document.getElementById('themeToggle');
const docEl = document.documentElement;
const THEME_KEY = 'preferred-theme';
const saved = localStorage.getItem(THEME_KEY);
if (saved) {
  docEl.setAttribute('data-theme', saved);
}
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = docEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    docEl.setAttribute('data-theme', current);
    localStorage.setItem(THEME_KEY, current);
  });
}

// Reveal on scroll (IntersectionObserver)
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

// Subtle 3D tilt on hover for .tilt elements
function handleTilt(event) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 10; // deg
  const rotateX = -((y / rect.height) - 0.5) * 10; // deg
  card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}
function resetTilt(event) {
  event.currentTarget.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg)';
}
document.querySelectorAll('.tilt').forEach((el) => {
  el.addEventListener('mousemove', handleTilt);
  el.addEventListener('mouseleave', resetTilt);
});

// Contact form → send via EmailJS (if configured), else fallback to mailto
(function setupContactForm() {
  const form = document.querySelector('form.contact');
  if (!form) return;

  const EMAIL_TO = 'vinayakasole1@gmail.com';
  const EMAILJS_PUBLIC_KEY = 'uT_C_YZTAU5VXiYBq';
  const EMAILJS_SERVICE_ID = 'service_i38v07n';
  const EMAILJS_TEMPLATE_ID = 'template_xy0fay9';

  function loadEmailJs(callback) {
    if (window.emailjs) { callback(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
    s.onload = callback;
    document.head.appendChild(s);
  }

  function sendWithMailto(name, fromEmail, location, message) {
    const subject = `New message from ${name}`;
    let body = `Contact Form Submission%0D%0A%0D%0A`;
    body += `From: ${name}%0D%0A`;
    body += `Email: ${fromEmail}%0D%0A`;
    if (location) {
      body += `Location: ${location}%0D%0A`;
    }
    body += `%0D%0A--- Message ---%0D%0A${encodeURIComponent(message)}`;
    window.location.href = `mailto:${EMAIL_TO}?subject=${encodeURIComponent(subject)}&body=${body}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const fromEmail = String(data.get('email') || '').trim();
    const location = String(data.get('location') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !fromEmail || !message) { alert('Please fill in all required fields.'); return; }

    const emailJsConfigured = EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID;
    if (!emailJsConfigured) { sendWithMailto(name, fromEmail, location, message); return; }

    loadEmailJs(() => {
      try {
        // eslint-disable-next-line no-undef
        emailjs.init(EMAILJS_PUBLIC_KEY);
        const params = {
          to_email: EMAIL_TO,
          from_name: name,
          from_email: fromEmail,
          reply_to: fromEmail,
          location: location || 'Not provided',
          message,
          // Formatted message with all sender details
          formatted_message: `Contact Form Submission\n\nFrom: ${name}\nEmail: ${fromEmail}\nLocation: ${location || 'Not provided'}\n\n--- Message ---\n${message}`,
        };
        // eslint-disable-next-line no-undef
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
          .then(() => {
            alert('Thanks! Your message has been sent.');
            form.reset();
          })
          .catch(() => {
            alert('Could not send via EmailJS. Opening your email app...');
            sendWithMailto(name, fromEmail, location, message);
          });
      } catch (_err) {
        alert('Could not send via EmailJS. Opening your email app...');
        sendWithMailto(name, fromEmail, location, message);
      }
    });
  });
})();


