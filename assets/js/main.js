/*=============== MENU ===============*/
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");

function setMenu(open) {
  navMenu.classList.toggle("show-menu", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.innerHTML = open
    ? '<i class="ri-close-line"></i>'
    : '<i class="ri-menu-4-line"></i>';
}

navToggle.addEventListener("click", () =>
  setMenu(!navMenu.classList.contains("show-menu")),
);
document
  .querySelectorAll(".nav__link")
  .forEach((link) => link.addEventListener("click", () => setMenu(false)));

/*=============== THEME ===============*/
const themeButton = document.getElementById("theme-button");
const themeIcon = themeButton.querySelector("i");

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");
  themeIcon.className = theme === "dark" ? "ri-sun-line" : "ri-moon-line";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#171310" : "#faf6f0");
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("selected-theme-v2");
} catch (e) {}
applyTheme(savedTheme || "light");

themeButton.addEventListener("click", () => {
  const next = document.body.classList.contains("dark-theme")
    ? "light"
    : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("selected-theme-v2", next);
  } catch (e) {}
});

/*=============== HEADER SHADOW + ACTIVE LINK ===============*/
const header = document.getElementById("header");
window.addEventListener(
  "scroll",
  () => header.classList.toggle("is-scrolled", window.scrollY > 10),
  { passive: true },
);

const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav__link");
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle(
            "active-link",
            l.getAttribute("href") === "#" + entry.target.id,
          ),
        );
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" },
);
sections.forEach((s) => spy.observe(s));

/*=============== SCROLL REVEAL ===============*/
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
reveals.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealObserver.observe(el);
});

/*=============== COUNT-UP STATS ===============*/
const counters = document.querySelectorAll("[data-count]");
const countObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const duration = 1200;
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  },
  { threshold: 0.6 },
);
counters.forEach((c) => countObserver.observe(c));

/*=============== TYPING TITLE ===============*/
const typed = document.getElementById("typing-title");
const phrases = ["enjoy using.", "can rely on.", "actually adopt."];
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (reduceMotion) {
  typed.textContent = phrases[0];
} else {
  let p = 0,
    c = 0,
    deleting = false;
  (function type() {
    const word = phrases[p];
    typed.textContent = word.slice(0, c);
    let delay = deleting ? 35 : 70;
    if (!deleting && c === word.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && c === 0) {
      deleting = false;
      p = (p + 1) % phrases.length;
      delay = 400;
    }
    c += deleting ? -1 : 1;
    setTimeout(type, delay);
  })();
}

/*=============== PROJECT FILTER ===============*/
const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    projects.forEach((p) =>
      p.classList.toggle(
        "is-hidden",
        f !== "all" && !p.dataset.category.split(" ").includes(f),
      ),
    );
  }),
);

/*=============== CONTACT FORM ===============*/
// Opens the visitor's email app with the message pre-filled.
// To send straight from the page instead, swap this for EmailJS or a form
// service such as Formspree.
const form = document.getElementById("contact-form");
const message = document.getElementById("contact-message");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const project = document.getElementById("contact-project").value.trim();

  if (!name || !email || !project) {
    message.className = "contact__message color-red";
    message.textContent = "Please fill in every field.";
    return;
  }

  const subject = encodeURIComponent(`Project enquiry from ${name}`);
  const body = encodeURIComponent(`${project}\n\nFrom: ${name} (${email})`);
  window.location.href = `mailto:brianmtonga592@gmail.com?subject=${subject}&body=${body}`;

  message.className = "contact__message color-blue";
  message.textContent = "Opening your email app…";
  form.reset();
  setTimeout(() => (message.textContent = ""), 4000);
});

/*=============== FOOTER YEAR ===============*/
document.getElementById("year").textContent = new Date().getFullYear();
