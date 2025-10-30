// Consentement aux cookies simple conforme CNIL (frontend)
(function(){
  const CONSENT_KEY = 'site_consent_v1';

  function getConsent(){
    try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch(e){ return null; }
  }

  function setConsent(value){
    localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
    dispatchConsentChange();
  }

  function dispatchConsentChange(){
    window.dispatchEvent(new CustomEvent('consentChanged', { detail: getConsent() }));
  }

  function createBanner(){
    if (getConsent()) return; // déjà choisi

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="consent-inner">
        <div class="consent-text">Ce site utilise des cookies et stocke des données localement pour améliorer votre expérience. Vous pouvez accepter ou gérer vos choix. Pour en savoir plus, consultez notre <a href="/privacy.html">Politique de confidentialité</a>.</div>
        <div class="consent-actions">
          <button id="consent-accept" class="btn btn-primary btn-sm">Accepter</button>
          <button id="consent-decline" class="btn btn-outline-light btn-sm">Refuser</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('consent-accept').addEventListener('click', () => setConsent({analytics: true, timestamp: Date.now()}));
    document.getElementById('consent-decline').addEventListener('click', () => setConsent({analytics: false, timestamp: Date.now()}));
  }

  // Create a persistent 'Manage cookies' button and modal
  function createManageButtonAndModal(){
    // avoid duplication
    if (document.getElementById('manage-cookies-btn')) return;

    // create button and append to footer if exists, otherwise to body fixed
    const btn = document.createElement('button');
    btn.id = 'manage-cookies-btn';
    btn.className = 'btn btn-link text-light';
    btn.textContent = 'Gérer les cookies';
    btn.style.marginLeft = '10px';

    const footer = document.querySelector('footer');
    if (footer) {
      footer.appendChild(btn);
    } else {
      btn.style.position = 'fixed';
      btn.style.left = '12px';
      btn.style.bottom = '12px';
      btn.style.zIndex = '10000';
      document.body.appendChild(btn);
    }

    // create modal HTML
    const modal = document.createElement('div');
    modal.id = 'cookie-preferences-modal';
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <div class="cookie-modal-backdrop" style="display:none"></div>
      <div class="cookie-modal-panel" role="dialog" aria-modal="true" style="display:none">
        <h3>Préférences cookies</h3>
        <p>Gérez vos préférences concernant les cookies et outils de mesure d'audience.</p>
        <div style="margin:10px 0">
          <label><input type="checkbox" id="pref-analytics"> Autoriser les cookies analytiques (statistiques anonymes)</label>
        </div>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
          <button id="pref-cancel" class="btn btn-outline-secondary btn-sm">Annuler</button>
          <button id="pref-save" class="btn btn-primary btn-sm">Enregistrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // style modal via injected stylesheet for simplicity
    const css = `
      .cookie-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998}
      .cookie-modal-panel{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#111;padding:16px;border-radius:8px;color:#fff;z-index:9999;max-width:420px;width:90%;box-shadow:0 8px 24px rgba(0,0,0,0.6)}
      #manage-cookies-btn{font-size:0.95rem}
    `;
    const s = document.createElement('style'); s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);

    function openModal(){
      const m = document.getElementById('cookie-preferences-modal');
      m.querySelector('.cookie-modal-backdrop').style.display = 'block';
      m.querySelector('.cookie-modal-panel').style.display = 'block';
      // set checkbox state from consent
      const consent = getConsent();
      document.getElementById('pref-analytics').checked = consent?.analytics === true;
    }

    function closeModal(){
      const m = document.getElementById('cookie-preferences-modal');
      m.querySelector('.cookie-modal-backdrop').style.display = 'none';
      m.querySelector('.cookie-modal-panel').style.display = 'none';
    }

    btn.addEventListener('click', openModal);
    document.getElementById('pref-cancel').addEventListener('click', closeModal);
    document.getElementById('pref-save').addEventListener('click', () => {
      const analytics = document.getElementById('pref-analytics').checked;
      setConsent({analytics: !!analytics, timestamp: Date.now()});
      closeModal();
      // hide banner if present
      const banner = document.getElementById('cookie-consent-banner');
      if (banner) banner.remove();
    });
  }

  // Expose helpers
  window.cookieConsent = {
    get: getConsent,
    set: setConsent
  };

  // Styling minimal, utilisera le style global si présent
  function injectStyles(){
    const css = `#cookie-consent-banner{position:fixed;left:0;right:0;bottom:0;background:rgba(13,13,13,0.95);color:#fff;padding:12px 16px;z-index:9999}#cookie-consent-banner .consent-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px}#cookie-consent-banner a{color:#0d6efd;text-decoration:underline}`;
    const s = document.createElement('style'); s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }

  // Au chargement
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    createBanner();
    createManageButtonAndModal();
    // déclencher un événement pour que d'autres scripts adaptent leur comportement
    dispatchConsentChange();
  });
  

})();

