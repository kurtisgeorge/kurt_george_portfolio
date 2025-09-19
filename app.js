// main.js
const toggleBtn = document.getElementById("theme-toggle");
const root = document.documentElement; // <html>

if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    root.classList.toggle("dark");
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) Choose groups that should reveal as they appear
  const groups = document.querySelectorAll(
    'header, main > section, footer, .project-grid'
  );

  // 2) Mark children in each group and assign an index (--i) for stagger
  groups.forEach((group, gi) => {
    group.classList.add('stagger');
    // optional: add a base delay per group to create a page-level cascade
    group.style.setProperty('--stagger-base', `${gi * 120}ms`);

    // For project grids, stagger the cards; for others, stagger direct children
    const kids = group.matches('.project-grid')
      ? group.querySelectorAll(':scope > article')
      : group.querySelectorAll(':scope > *:not(.dock)');

    kids.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--i', i);
    });
  });

  // 3) Reveal a group when it enters the viewport
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.15 });

  groups.forEach(g => io.observe(g));
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const dialog = modal.querySelector('.modal-dialog');
  const content = modal.querySelector('.modal-content');
  const closeBtn = modal.querySelector('.modal-close');

  // open from any project card's play button
  document.querySelectorAll('.project-grid article').forEach(article => {
    const openBtn = article.querySelector('button'); // your thumbnail button
    const tpl = article.querySelector('template');

    if (!openBtn || !tpl) return;

    openBtn.addEventListener('click', () => {
      // inject fresh content each time
      content.innerHTML = '';
      content.appendChild(tpl.content.cloneNode(true));
      modal.classList.add('open');
      document.documentElement.style.overflow = 'hidden'; // lock scroll
      // focus the close for keyboard users
      closeBtn.focus();
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.documentElement.style.overflow = ''; // unlock scroll
    // stop video playback (remove iframes)
    const iframes = content.querySelectorAll('iframe');
    iframes.forEach(f => { f.src = f.src; });
    content.innerHTML = '';
  }

  // close interactions
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
});