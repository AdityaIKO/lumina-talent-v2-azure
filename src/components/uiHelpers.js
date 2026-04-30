/**
 * Shared UI helpers — React equivalents of the global UI object in app.js.
 * These are pure functions that return JSX or strings (for dangerouslySetInnerHTML compat).
 */

// Toast — self-contained, no external dependency
export function toast(msg, type = 'success') {
  if (window.UI?.toast) { window.UI.toast(msg, type); return; }

  const palette = {
    success: { bg: '#00D4AA', icon: '✓' },
    error:   { bg: '#FF5E7D', icon: '✗' },
    info:    { bg: '#6C63FF', icon: 'ℹ' },
    warning: { bg: '#FFB300', icon: '⚠' },
  };
  const { bg, icon } = palette[type] || palette.info;

  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed', 'top:24px', 'right:24px', 'z-index:99999',
    'display:flex', 'align-items:center', 'gap:10px',
    `background:${bg}`, 'color:#fff',
    'padding:12px 18px', 'border-radius:10px',
    'font-size:0.875rem', 'font-weight:600',
    'box-shadow:0 4px 20px rgba(0,0,0,0.3)',
    'max-width:360px', 'word-break:break-word',
    'opacity:1', 'transition:opacity 0.3s',
  ].join(';');
  el.innerHTML = `<span style="font-size:1rem">${icon}</span><span>${msg}</span>`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; }, 2700);
  setTimeout(() => { el.remove(); }, 3000);
}

// Score ring — returns raw HTML string (used with dangerouslySetInnerHTML)
export function scoreRingHTML(score, size = 80) {
  if (window.UI?.scoreRing) return window.UI.scoreRing(score, size);
  return `<div>${score}%</div>`;
}

// Avatar — returns raw HTML string
export function avatarHTML(initials, size = 'md') {
  if (window.UI?.avatar) return window.UI.avatar(initials, size);
  return `<div class="avatar-placeholder avatar-${size}">${initials}</div>`;
}

// Status badge — returns raw HTML string
export function statusBadgeHTML(status) {
  if (window.UI?.statusBadge) return window.UI.statusBadge(status);
  return `<span class="badge">${status}</span>`;
}

// i18n translation helper
export function t(key) {
  if (window.i18n?.t) return window.i18n.t(key);
  return key;
}

// Bind language switcher after render
export function bindLangSwitcher() {
  if (window.UI?.bindLangSwitcher) window.UI.bindLangSwitcher();
}

// Currency formatter
export function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
}
