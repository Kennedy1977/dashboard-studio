const data = { revenue: [22000, 18000, 24000, 31000, 27000, 36000, 41000, 39000, 47000, 44000], traffic: { organic: 42, direct: 28, social: 18, referral: 12 }, activity: { sessions: [45,62,55,78,68,35,52], signups: [64,40,72,52,86,48,68] } };

const $ = (s, root = document) => root.querySelector(s);
document.querySelectorAll('[data-heatmap]').forEach((map) => {
  map.innerHTML = Array.from({ length: 35 }, (_, i) => `<i class="heat-${(i * 7) % 5 + 1}"></i>`).join('');
});
const modal = $('#modal');
document.querySelector('[data-modal-open]')?.addEventListener('click', () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); });
document.querySelector('[data-modal-close]')?.addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); });
modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

$('#theme-toggle')?.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
document.querySelector('[data-open-sidebar]')?.addEventListener('click', () => $('#sidebar').classList.remove('-translate-x-full'));
document.querySelector('[data-close-sidebar]')?.addEventListener('click', () => $('#sidebar').classList.add('-translate-x-full'));

if (window.Lenis) { const lenis = new Lenis({ duration: 1.1, smoothWheel: true }); const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
if (window.gsap) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const chartMotion = prefersReducedMotion ? { duration: 0 } : { duration: 1.15, ease: 'power3.out' };
  const revealed = new WeakSet();
  const reveal = (element) => {
    if (revealed.has(element)) return;
    revealed.add(element);
    gsap.from(element, { y: prefersReducedMotion ? 0 : 14, opacity: 0, duration: prefersReducedMotion ? 0 : .55, ease: 'power3.out' });
  };
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); } }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else document.querySelectorAll('.reveal').forEach(reveal);

  document.querySelectorAll('.main-line').forEach((line) => {
    const length = line.getTotalLength();
    gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(line, { strokeDashoffset: 0, ...chartMotion, delay: .55 });
  });
  gsap.from('.area-fill', { opacity: 0, duration: prefersReducedMotion ? 0 : .65, delay: .8, ease: 'power2.out' });
  gsap.from('.target-line', { opacity: 0, duration: prefersReducedMotion ? 0 : .5, delay: 1, ease: 'power2.out' });
  gsap.from('.chart-point', { scale: 0, transformOrigin: 'center', duration: prefersReducedMotion ? 0 : .45, delay: 1.35, ease: 'back.out(2)' });
  gsap.from('.bar-pair i', { scaleY: 0, transformOrigin: 'bottom', duration: prefersReducedMotion ? 0 : .7, stagger: prefersReducedMotion ? 0 : .045, delay: .65, ease: 'back.out(1.5)' });
  gsap.from('.spark i', { scaleY: 0, transformOrigin: 'bottom', duration: prefersReducedMotion ? 0 : .45, stagger: prefersReducedMotion ? 0 : .035, delay: .5, ease: 'power2.out' });
  gsap.from('.donut', { rotation: -130, scale: .72, opacity: 0, duration: prefersReducedMotion ? 0 : 1, delay: .65, ease: 'back.out(1.4)' });
  document.querySelectorAll('[data-progress]').forEach((bar) => {
    const target = Number(bar.dataset.progress || 0);
    gsap.to(bar, { width: `${target}%`, duration: prefersReducedMotion ? 0 : 1.2, delay: .55, ease: 'power3.out' });
  });

  document.querySelectorAll('.panel').forEach((panel) => {
    panel.addEventListener('mouseenter', () => { if (!prefersReducedMotion) gsap.to(panel, { y: -3, duration: .25, ease: 'power2.out' }); });
    panel.addEventListener('mouseleave', () => { if (!prefersReducedMotion) gsap.to(panel, { y: 0, duration: .35, ease: 'power2.out' }); });
  });
}

document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active')); item.classList.add('active'); }));
document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector('.sm\\:flex')?.classList.add('ring-2','ring-violet'); } if (e.key === 'Escape') modal?.classList.remove('open'); });
document.querySelector('[data-export]')?.addEventListener('click', () => {
  const csv = 'Metric,Value\nRevenue,42389\nActive users,18294\nConversion rate,6.84%';
  const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'orbit-dashboard-export.csv'; link.click(); URL.revokeObjectURL(url);
});
document.querySelector('[data-share]')?.addEventListener('click', async (e) => { const button = e.currentTarget; try { await navigator.clipboard.writeText(window.location.href); button.textContent = 'Copied ✓'; setTimeout(() => { button.textContent = 'Share view ↗'; }, 1600); } catch { button.textContent = 'Copy unavailable'; } });
