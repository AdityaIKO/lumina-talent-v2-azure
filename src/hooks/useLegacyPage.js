/**
 * useLegacyPage — mounts a vanilla Pages.renderXxx() function inside a React component.
 *
 * Strategy:
 * 1. Create a <div id="app"> inside our component's root div.
 * 2. Shim Router.goTo → React navigate.
 * 3. Call the render function — it will find #app and fill it.
 * 4. Restore after render.
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useLegacyPage(renderFn, deps = []) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;

    // ── 1. Shim Router.goTo → React Router navigate ────────────────
    if (window.Router) {
      window.Router.goTo = (page, param) => {
        const map = {
          'landing':               '/landing',
          'signin':                '/login',
          'signup':                '/daftar',
          'kyc':                   '/kyc',
          'freelancer-onboarding': '/freelancer/profil',
          'freelancer-dashboard':  '/freelancer/beranda',
          'freelancer-jobs':       `/freelancer/pekerjaan/${param || 1}`,
          'freelancer-job-detail': `/freelancer/pekerjaan/${param || 1}`,
          'freelancer-status':     '/freelancer/lamaran',
          'freelancer-finance':    '/freelancer/keuangan',
          'employer-dashboard':    '/employer/beranda',
          'employer-post-job':     '/employer/buat-lowongan',
          'employer-applicants':   param ? `/employer/pelamar/${param}` : '/employer/pelamar',
          'employer-escrow':       param ? `/employer/escrow/${param}` : '/employer/escrow',
        };
        const path = map[page];
        if (path) navigate(path);
        else navigate('/landing');
      };
      window.Router.navigate = window.Router.goTo;
    }

    // ── 2. Inject a real #app div inside our container ─────────────
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(appDiv);

    // ── 3. Call the legacy render function ─────────────────────────
    try {
      if (typeof renderFn === 'function') renderFn();
    } catch (e) {
      console.error('[useLegacyPage] render error:', e);
      if (appDiv) appDiv.innerHTML = `<div style="padding:40px;color:var(--text-muted)">⚠️ Gagal memuat halaman. Error: ${e.message}</div>`;
    }

    // ── 4. Apply i18n and lang switcher after vanilla render ───────
    window.i18n?.applyTranslations?.();
    window.UI?.bindLangSwitcher?.();

  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
