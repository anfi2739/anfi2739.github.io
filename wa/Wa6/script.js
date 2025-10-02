

document.addEventListener('DOMContentLoaded', () => {
  /* ===== NAV TOGGLE (keeps your original logic) ===== */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelectorAll('.nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      // Toggle all nav menus on the page (multiple pages reuse same script)
      navMenu.forEach(menu => menu.classList.toggle('show'));

      // update aria-expanded for accessibility
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  /* ===== PREFERENCES: high-contrast toggle (click + persisted) ===== */
  const prefsToggle = document.getElementById('prefs-toggle');
  const PREF_KEY = 'pref-contrast';
  const applyPref = (on) => {
    if (on) document.documentElement.setAttribute('data-contrast', 'high');
    else document.documentElement.removeAttribute('data-contrast');
    if (prefsToggle) prefsToggle.setAttribute('aria-pressed', String(on));
  };
  // initialize
  const stored = localStorage.getItem(PREF_KEY);
  applyPref(stored === 'high');

  if (prefsToggle) {
    prefsToggle.addEventListener('click', () => {
      const isOn = document.documentElement.getAttribute('data-contrast') === 'high';
      const next = !isOn;
      applyPref(next);
      localStorage.setItem(PREF_KEY, next ? 'high' : 'normal');
    });
  }

  
  const searchInput = document.querySelector('#resource-search');
  const resourceList = document.querySelectorAll('.resource-item');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      resourceList.forEach(li => {
        const text = li.textContent.toLowerCase();
        if (!q || text.includes(q)) li.style.display = '';
        else li.style.display = 'none';
      });
    });
  }

  
  const applyBtn = document.querySelector('#apply-filters');
  const filterArea = document.querySelector('#filter-area');

  if (applyBtn && filterArea) {
    const applyHandler = (ev) => {
      ev.preventDefault();
      // collect checked category values
      const checkedCats = Array.from(filterArea.querySelectorAll('input[type="checkbox"][name="category"]:checked'))
        .map(cb => cb.value);
      const checkedAvail = Array.from(filterArea.querySelectorAll('input[type="checkbox"][name="avail"]:checked'))
        .map(cb => cb.value);

      // Filter logic: show item if it matches any checked category (OR show all if no category checked).
      resourceList.forEach(li => {
        const cat = li.getAttribute('data-category') || '';
        const avail = li.getAttribute('data-avail') || '';
        let catOk = !checkedCats.length || checkedCats.includes(cat);
        let availOk = !checkedAvail.length || checkedAvail.includes(avail);
        if (catOk && availOk) li.style.display = '';
        else li.style.display = 'none';
      });

      // feedback
      const original = applyBtn.textContent;
      applyBtn.textContent = 'Filters applied ✓';
      applyBtn.disabled = true;
      setTimeout(() => {
        applyBtn.textContent = original;
        applyBtn.disabled = false;
      }, 1000);
    };

    applyBtn.addEventListener('click', applyHandler);
  }

  
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p' && filterArea && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      const first = filterArea.querySelector('input, button, select');
      if (first) first.focus();
    }
    if (e.key === 'Escape') {
      // close nav menus
      document.querySelectorAll('.nav-menu.show').forEach(el => el.classList.remove('show'));
    }
  });

});
