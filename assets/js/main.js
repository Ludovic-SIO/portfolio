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
  // Initialisation EmailJS
  // -----------------------------
  emailjs.init("z0cmbUGcTGsl_6977"); // 🔑 Remplace par ta clé publique exacte

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
});
