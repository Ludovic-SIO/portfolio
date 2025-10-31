// -----------------------------
// Navbar shadow on scroll
// -----------------------------
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("shadow");
  } else {
    nav.classList.remove("shadow");
  }
});

// -----------------------------
// Ajustement padding-top pour main
// -----------------------------
window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("nav");
  const mainElements = document.querySelectorAll("main");
  const navHeight = nav.offsetHeight;
  mainElements.forEach(main => {
    main.style.paddingTop = navHeight + 20 + "px"; // 20px d'espace
  });

  // -----------------------------
  // Initialisation EmailJS (si présent) — protéger l'appel pour éviter les erreurs si la lib n'est pas chargée
  // -----------------------------
  try {
    if (typeof emailjs !== 'undefined' && emailjs && typeof emailjs.init === 'function') {
      emailjs.init("z0cmbUGcTGsl_6977"); // 🔑 Remplace par ta clé publique exacte
    } else {
      // EmailJS non chargé sur cette page (par exemple page d'accueil) — on skip
      // console.warn('EmailJS not present — skipping init');
    }
  } catch (e) {
    console.warn('Error while initializing EmailJS:', e);
  }

  const form = document.getElementById('contact-form');

  // -----------------------------
  // Création de l'alertBox personnalisée
  // -----------------------------
  const alertBox = document.createElement('div');
  alertBox.id = 'contact-alert';
  Object.assign(alertBox.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    backgroundColor: '#0d6efd',
    color: '#fff',
    display: 'none',
    zIndex: '9999',
    fontWeight: '500',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
  });
  document.body.appendChild(alertBox);

  function showAlert(message, success = true) {
    alertBox.textContent = message;
    alertBox.style.backgroundColor = success ? '#0d6efd' : '#dc3545';
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 4000);
  }

  // -----------------------------
  // Gestion du formulaire avec EmailJS
  // -----------------------------
  if(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      emailjs.sendForm('service_i9qujao', 'template_5twpb0n', this)
        .then(() => {
          showAlert('✅ Message envoyé avec succès !');
          form.reset();
        })
        .catch((error) => {
          showAlert('❌ Erreur lors de l\'envoi. Veuillez réessayer.', false);
          console.error(error);
        });
    });
  }
  // Animation machine à écrire pour l'en-tête d'accueil
  const heroTitleEl = document.getElementById('hero-title');
  const heroSubtitleEl = document.getElementById('hero-subtitle');
  const heroActionsEl = document.getElementById('hero-actions');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  if (heroTitleEl && heroSubtitleEl) {
    const subtitleOriginal = heroSubtitleEl.innerText.trim();

    function typeText(element, text, speed = 30) {
      return new Promise(resolve => {
        let index = 0;
        const interval = setInterval(() => {
          element.textContent += text.charAt(index);
          index++;
          if (index >= text.length) {
            clearInterval(interval);
            resolve();
          }
        }, speed);
      });
    }

    async function runTypewriter() {
      // Reset affichage
      heroTitleEl.style.opacity = '1';
      heroSubtitleEl.style.opacity = '1';
      heroTitleEl.textContent = '';
      heroSubtitleEl.textContent = '';
      if (heroActionsEl) {
        heroActionsEl.style.display = 'none';
      }

      // Titre avec mot "Portfolio" en bleu tapé dans un <span>
      const titleParts = [
        { text: 'Bonjour, Bienvenue sur mon ' },
        { text: 'Portfolio', spanClass: 'text-primary' }
      ];

      for (const part of titleParts) {
        if (part.spanClass) {
          const span = document.createElement('span');
          span.className = part.spanClass;
          heroTitleEl.appendChild(span);
          await typeText(span, part.text, 32);
        } else {
          await typeText(heroTitleEl, part.text, 32);
        }
      }

      // Afficher les boutons dès que le titre est terminé
      if (heroActionsEl) {
        heroActionsEl.style.display = 'block';
        // animation douce d'apparition
        heroActionsEl.classList.remove('fade-in-up');
        // forcer reflow pour rejouer l'anim
        // eslint-disable-next-line no-unused-expressions
        heroActionsEl.offsetHeight;
        heroActionsEl.classList.add('fade-in-up');
      }

      await new Promise(r => setTimeout(r, 150));
      await typeText(heroSubtitleEl, subtitleOriginal, 22);
    }

    // Lancer au chargement
    runTypewriter();

    // (Le replay au clic a été retiré)
  }

  // Effet parallax sur le header
  const heroHeader = document.querySelector('.hero-header');
  if (heroHeader) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY * 0.3;
      heroHeader.style.backgroundPosition = `center calc(50% + ${-y}px)`;
    });
  }

  // Toggle thème clair/sombre avec préférence stockée
  (function initThemeToggle(){
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = stored || (prefersLight ? 'light' : 'dark');
    if (initial === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    function setIconForCurrentTheme(){
      const isLight = root.getAttribute('data-theme') === 'light';
      if (themeToggleIcon) {
        themeToggleIcon.classList.remove('fa-sun', 'fa-moon');
        themeToggleIcon.classList.add(isLight ? 'fa-moon' : 'fa-sun');
      }
    }
    setIconForCurrentTheme();

    function toggleTheme(){
      if (root.getAttribute('data-theme') === 'light') {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      setIconForCurrentTheme();
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }
  })();

});
