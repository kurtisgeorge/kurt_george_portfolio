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
      : group.querySelectorAll(':scope > *');

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
