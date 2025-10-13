//  VARIABLES 
const THEME_KEY = 'userTheme_v1';
const PREF_KEY = 'pref-contrast';
const EXPIRY_DAYS = 60;

//  FUNCTIONS 

// Save data with expiry
function setWithExpiry(key, valueObj) {
  const payload = { ts: Date.now(), data: valueObj };
  localStorage.setItem(key, JSON.stringify(payload));
}

// Read + auto-remove expired data
function getWithExpiry(key, maxAgeDays = EXPIRY_DAYS) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  const ageMs = Date.now() - parsed.ts;
  const maxMs = maxAgeDays * 24 * 60 * 60 * 1000;
  if (ageMs > maxMs) {
    localStorage.removeItem(key);
    return null;
  }
  return parsed.data;
}

// Apply theme
function applyTheme(theme, persist = true) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  if (persist && !userOptOut()) setWithExpiry(THEME_KEY, theme);
}

// Apply contrast mode
function applyContrast(mode, persist = true) {
  if (mode === 'high') document.documentElement.setAttribute('data-contrast', 'high');
  else document.documentElement.removeAttribute('data-contrast');

  if (persist && !userOptOut()) setWithExpiry(PREF_KEY, mode);
}

// Opt-out checker
const userOptOut = () => {
  const optOut = document.getElementById('opt-out');
  return optOut && optOut.checked;
};

//  PAGE SETUP 
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved theme
  const savedTheme = getWithExpiry(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme, false);

  // Apply saved contrast
  const savedContrast = getWithExpiry(PREF_KEY);
  if (savedContrast === 'high') applyContrast('high', false);

  // Handle nav toggle (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelectorAll('.nav-menu');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu.forEach(menu => menu.classList.toggle('show'));
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Detect if on preferences page
  const onPreferencesPage = document.querySelector('.user-controls');
  if (onPreferencesPage) {
    const btnLight = document.getElementById('theme-light');
    const btnDark = document.getElementById('theme-dark');
    const prefsToggle = document.getElementById('prefs-toggle');
    const clearBtn = document.getElementById('clear-data');

    //Theme Buttons (instant change + save) 
    if (btnLight) {
      btnLight.addEventListener('click', () => applyTheme('light'));
    }
    if (btnDark) {
      btnDark.addEventListener('click', () => applyTheme('dark'));
    }

    // Contrast Toggle (instant change + save) 
    if (prefsToggle) {
      prefsToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-contrast');
        const next = current === 'high' ? 'normal' : 'high';
        applyContrast(next);
      });
    }

    // Clear All Preferences 
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear all stored preferences and reload the page?')) {
          localStorage.clear();
          location.reload();
        }
      });
    }
  }

  //  Filtering + Search only on main page 
  const searchInput = document.querySelector('#resource-search');
  const resourceList = document.querySelectorAll('.resource-item');
  const applyBtn = document.querySelector('#apply-filters');
  const filterArea = document.querySelector('#filter-area');

  if (searchInput && resourceList.length) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      resourceList.forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = !q || text.includes(q) ? '' : 'none';
      });
    });
  }

  if (applyBtn && filterArea) {
    applyBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const checkedCats = Array.from(filterArea.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
      const checkedAvail = Array.from(filterArea.querySelectorAll('input[name="avail"]:checked')).map(cb => cb.value);
      resourceList.forEach(li => {
        const cat = li.dataset.category;
        const avail = li.dataset.avail;
        const show = (!checkedCats.length || checkedCats.includes(cat)) &&
                     (!checkedAvail.length || checkedAvail.includes(avail));
        li.style.display = show ? '' : 'none';
      });
      const original = applyBtn.textContent;
      applyBtn.textContent = 'Filters applied ✓';
      applyBtn.disabled = true;
      setTimeout(() => {
        applyBtn.textContent = original;
        applyBtn.disabled = false;
      }, 1000);
    });
  }
});
// FORM PERSISTENCE: save as user types, restore on load (respects opt-out)
const filtersForm = document.getElementById('filters-form');
const FORM_KEY = 'filtersData_v1';

if (filtersForm) {
  // restore saved form values
  const saved = (function() {
    try { return JSON.parse(localStorage.getItem(FORM_KEY) || 'null'); } catch { return null; }
  })();
  if (saved) {
    Object.keys(saved).forEach(name => {
      const els = filtersForm.querySelectorAll(`[name="${name}"]`);
      els.forEach(el => {
        if (el.type === 'checkbox') {
          el.checked = Array.isArray(saved[name]) ? saved[name].includes(el.value) : saved[name] === el.value;
        } else {
          el.value = saved[name];
        }
      });
    });
  }

  filtersForm.addEventListener('input', () => {
    if (userOptOut()) return;
    const fd = {};
    new FormData(filtersForm).forEach((v,k) => {
      if (fd[k]) {
        // convert to array if multiple values
        fd[k] = Array.isArray(fd[k]) ? fd[k].concat(v) : [fd[k], v];
      } else fd[k] = v;
    });
    // store with a timestamp object (or reuse your setWithExpiry helper)
    setWithExpiry(FORM_KEY, fd);
  });
}

