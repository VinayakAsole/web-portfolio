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

// Basic client-side validation feedback for contact form
const form = document.querySelector('form.contact');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }
    alert('Thanks! Your message has been prepared. Connect via email: you@example.com');
    form.reset();
  });
}


