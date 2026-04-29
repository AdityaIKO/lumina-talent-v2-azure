/**
 * Shared UI helpers — React equivalents of the global UI object in app.js.
 * These are pure functions that return JSX or strings (for dangerouslySetInnerHTML compat).
 */

// Toast (uses the existing global UI.toast from app.js loaded via <script>)
export function toast(msg, type = 'success') {
  if (window.UI?.toast) window.UI.toast(msg, type);
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
