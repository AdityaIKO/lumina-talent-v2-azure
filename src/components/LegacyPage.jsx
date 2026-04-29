import { useEffect, useRef } from 'react';

/**
 * LegacyPage — mounts a vanilla-JS render function into a div.
 * This is the bridge pattern: each page that hasn't been fully converted
 * yet uses this to call the original Pages.renderXxx() function.
 *
 * Usage:
 *   <LegacyPage render={() => Pages.renderKYC()} />
 */
export default function LegacyPage({ render, deps = [] }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    // Temporarily hijack #app to point to our div
    const originalApp = document.getElementById('app');
    ref.current.id = 'app';
    if (originalApp) originalApp.id = '_app_hidden';

    try {
      render();
    } catch(e) {
      console.error('[LegacyPage] render error:', e);
    }

    // Restore
    ref.current.id = '';
    if (originalApp) originalApp.id = 'app';

    window.UI?.bindLangSwitcher?.();
    window.i18n?.applyTranslations?.();
  }, deps);

  return <div ref={ref} />;
}
