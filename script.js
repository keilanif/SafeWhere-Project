const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const navLinks = [...document.querySelectorAll('nav a')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.removeAttribute('aria-current'));
    const active = navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`);
    if (active) active.setAttribute('aria-current', 'true');
  });
}, { rootMargin: '-25% 0px -65% 0px' });

sections.forEach((section) => navObserver.observe(section));
