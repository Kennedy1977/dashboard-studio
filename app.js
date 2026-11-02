const data = { revenue: [22000, 18000, 24000, 31000, 27000, 36000, 41000, 39000, 47000, 44000], traffic: { organic: 42, direct: 28, social: 18, referral: 12 }, activity: { sessions: [45,62,55,78,68,35,52], signups: [64,40,72,52,86,48,68] } };

const $ = (s, root = document) => root.querySelector(s);
const modal = $('#modal');
document.querySelector('[data-modal-open]')?.addEventListener('click', () => { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); });
document.querySelector('[data-modal-close]')?.addEventListener('click', () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); });
modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

$('#theme-toggle')?.addEventListener('click', () => document.body.classList.toggle('dark-mode'));
document.querySelector('[data-open-sidebar]')?.addEventListener('click', () => $('#sidebar').classList.remove('-translate-x-full'));
document.querySelector('[data-close-sidebar]')?.addEventListener('click', () => $('#sidebar').classList.add('-translate-x-full'));

if (window.Lenis) { const lenis = new Lenis({ duration: 1.1, smoothWheel: true }); const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
if (window.gsap) { gsap.from('.reveal', { y: 18, opacity: 0, duration: .7, stagger: .07, ease: 'power3.out', delay: .1 }); }

document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach((n) => n.classList.remove('active')); item.classList.add('active'); }));
document.addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector('.sm\\:flex')?.classList.add('ring-2','ring-violet'); } if (e.key === 'Escape') modal?.classList.remove('open'); });
