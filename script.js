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

const projectFolder = document.querySelector('#project-folder');
const folderToggle = document.querySelector('.folder-toggle');

folderToggle?.addEventListener('click', () => {
  const isOpen = projectFolder.classList.toggle('is-open');
  folderToggle.setAttribute('aria-expanded', String(isOpen));
  folderToggle.firstChild.textContent = isOpen ? 'Close the folder ' : 'Open the folder ';
});

const planDialog = document.querySelector('#business-plan-dialog');
const planImage = document.querySelector('#plan-page');
const planCurrent = document.querySelector('#plan-current');
const planPrev = document.querySelector('[data-plan-prev]');
const planNext = document.querySelector('[data-plan-next]');
const planTotal = 10;
let planPage = 1;
let touchStartX = 0;

function renderPlanPage() {
  const pageName = String(planPage).padStart(2, '0');
  planImage.src = `assets/business-plan/page-${pageName}.jpg`;
  planImage.alt = `SafeWhere business plan page ${planPage} of ${planTotal}`;
  planCurrent.textContent = String(planPage);
  planPrev.disabled = planPage === 1;
  planNext.disabled = planPage === planTotal;
}

function movePlanPage(direction) {
  planPage = Math.min(planTotal, Math.max(1, planPage + direction));
  renderPlanPage();
}

document.querySelectorAll('[data-open-plan]').forEach((button) => {
  button.addEventListener('click', () => {
    planPage = 1;
    renderPlanPage();
    planDialog.showModal();
    document.body.style.overflow = 'hidden';
  });
});

document.querySelector('[data-close-plan]')?.addEventListener('click', () => planDialog.close());
planPrev?.addEventListener('click', () => movePlanPage(-1));
planNext?.addEventListener('click', () => movePlanPage(1));

planDialog?.addEventListener('close', () => { document.body.style.overflow = ''; });
planDialog?.addEventListener('click', (event) => { if (event.target === planDialog) planDialog.close(); });
planDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') movePlanPage(-1);
  if (event.key === 'ArrowRight') movePlanPage(1);
});

document.querySelector('.plan-page-wrap')?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.querySelector('.plan-page-wrap')?.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 45) movePlanPage(distance < 0 ? 1 : -1);
}, { passive: true });
