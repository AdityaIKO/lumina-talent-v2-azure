// ── SPA Router ────────────────────────────────────────────────────
const Router = {
  currentPage: null,
  currentRole: localStorage.getItem('lumina_role') || 'freelancer',

  routes: {
    'landing': () => Pages.renderLanding(),
    'signin': () => Pages.renderSignIn(),
    'signup': () => Pages.renderSignUp(),
    'kyc': () => Pages.renderKYC(),
    'freelancer-onboarding': () => Pages.renderOnboarding(),
    'freelancer-dashboard': () => Pages.renderFreelancerDashboard(),
    'freelancer-jobs': () => Pages.renderJobListing(),
    'freelancer-job-detail': (id) => Pages.renderJobDetail(id || 1),
    'freelancer-status': () => Pages.renderStatus(),
    'freelancer-finance': () => Pages.renderFinance(),
    'employer-dashboard': () => Pages.renderEmployerDashboard(),
    'employer-post-job': () => Pages.renderPostJob(),
    'employer-applicants': (id) => Pages.renderApplicants(id || 1),
    'employer-escrow': () => Pages.renderEscrow(),
  },

  navigate(page, param = null) {
    this.currentPage = page;
    const app = document.getElementById('app');
    app.innerHTML = '';
    const fn = this.routes[page];
    if (fn) fn(param);
    else this.navigate('landing');
    window.scrollTo(0, 0);
    i18n.applyTranslations();
    UI.bindLangSwitcher();
  },

  goTo(page, param) { this.navigate(page, param); },
};

// ── UI Helpers ─────────────────────────────────────────────────────
const UI = {
  toast(msg, type = 'success') {
    let tc = document.querySelector('.toast-container');
    if (!tc) { tc = document.createElement('div'); tc.className = 'toast-container'; document.body.appendChild(tc); }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span> ${msg}`;
    tc.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  },

  avatar(initials, size = 'md', colorClass = '') {
    return `<div class="avatar-placeholder avatar-${size}" style="width:${size==='lg'?64:size==='xl'?80:size==='sm'?32:48}px;height:${size==='lg'?64:size==='xl'?80:size==='sm'?32:48}px">${initials}</div>`;
  },

  scoreRing(score, size = 120) {
    const r = 46; const c = 2 * Math.PI * r;
    const pct = (score / 100) * c;
    const color = score >= 80 ? '#00D4AA' : score >= 60 ? '#6C63FF' : '#FFB347';
    return `<div class="score-ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="8"
          stroke-dasharray="${pct} ${c}" stroke-linecap="round"/>
      </svg>
      <div class="score-text">
        <span class="score-num" style="color:${color}">${score}%</span>
        <span class="score-label">Match</span>
      </div>
    </div>`;
  },

  statusBadge(status) {
    const map = {
      pending: ['badge-warning', '⏳', i18n.t('status_pending')],
      reviewed: ['badge-primary', '👁️', i18n.t('status_reviewed')],
      accepted: ['badge-accent', '✅', i18n.t('status_accepted')],
      rejected: ['badge-danger', '❌', i18n.t('status_rejected')],
      in_progress: ['badge-primary', '🔄', i18n.t('status_in_progress')],
      submitted: ['badge-accent', '📤', i18n.t('status_submitted')],
      revision: ['badge-warning', '✏️', i18n.t('status_revision')],
      completed: ['badge-accent', '🎉', i18n.t('status_completed')],
      dispute: ['badge-danger', '⚠️', i18n.t('status_dispute')],
      active: ['badge-accent', '🟢', 'Active'],
      draft: ['badge-neutral', '📝', 'Draft'],
      hired: ['badge-accent', '✅', 'Hired'],
    };
    const [cls, icon, label] = map[status] || ['badge-neutral', '•', status];
    return `<span class="badge ${cls}">${icon} ${label}</span>`;
  },

  navbar(role = null) {
    const isFreelancer = role === 'freelancer';
    const isEmployer = role === 'employer';
    return `<nav class="navbar">
      <div class="navbar-inner">
        <div class="logo" onclick="Router.goTo('landing')">
          <div class="logo-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          Lumina Talent
        </div>
        ${role ? `<div class="nav-links">
          ${isFreelancer ? `
            <a class="nav-link" onclick="Router.goTo('freelancer-dashboard')" data-i18n="nav_home">${i18n.t('nav_home')}</a>
            <a class="nav-link" onclick="Router.goTo('freelancer-jobs')" data-i18n="nav_jobs">${i18n.t('nav_jobs')}</a>
            <a class="nav-link" onclick="Router.goTo('freelancer-status')" data-i18n="nav_status">${i18n.t('nav_status')}</a>
            <a class="nav-link" onclick="Router.goTo('freelancer-finance')" data-i18n="nav_finance">${i18n.t('nav_finance')}</a>
          ` : `
            <a class="nav-link" onclick="Router.goTo('employer-dashboard')" data-i18n="nav_dashboard">${i18n.t('nav_dashboard')}</a>
            <a class="nav-link" onclick="Router.goTo('employer-post-job')" data-i18n="nav_post_job">${i18n.t('nav_post_job')}</a>
            <a class="nav-link" onclick="Router.goTo('employer-applicants')" data-i18n="nav_applicants">${i18n.t('nav_applicants')}</a>
            <a class="nav-link" onclick="Router.goTo('employer-escrow')" data-i18n="nav_escrow">${i18n.t('nav_escrow')}</a>
          `}
        </div>` : `<div class="nav-links">
          <a class="nav-link" href="#features">Features</a>
          <a class="nav-link" href="#how">How It Works</a>
        </div>`}
        <div class="nav-actions">
          <div class="lang-switcher">
            <button class="lang-btn" data-lang="id">🇮🇩 ID</button>
            <button class="lang-btn" data-lang="en">🇬🇧 EN</button>
          </div>
          ${role ? `
            <div style="display:flex;align-items:center;gap:8px;cursor:pointer" onclick="Router.goTo('landing')">
              ${UI.avatar(role === 'freelancer' ? DUMMY.user.freelancer.initials : DUMMY.user.employer.initials, 'sm')}
              <span style="font-size:0.85rem;font-weight:500">${role === 'freelancer' ? DUMMY.user.freelancer.name.split(' ')[0] : DUMMY.user.employer.name.split(' ')[0]}</span>
            </div>
          ` : `
            <button class="btn btn-ghost btn-sm" onclick="Router.goTo('signin')" data-i18n="nav_signin">${i18n.t('nav_signin')}</button>
            <button class="btn btn-primary btn-sm" onclick="Router.goTo('signup')" data-i18n="nav_signup">${i18n.t('nav_signup')}</button>
          `}
        </div>
      </div>
    </nav>`;
  },

  sidebar(role, active) {
    const items = role === 'freelancer' ? [
      { key: 'freelancer-dashboard', icon: '🏠', label: i18n.t('nav_home') },
      { key: 'freelancer-jobs', icon: '🔍', label: i18n.t('nav_jobs') },
      { key: 'freelancer-status', icon: '📋', label: i18n.t('nav_status') },
      { key: 'freelancer-finance', icon: '💰', label: i18n.t('nav_finance') },
      { key: 'freelancer-onboarding', icon: '👤', label: i18n.t('nav_profile') },
    ] : [
      { key: 'employer-dashboard', icon: '📊', label: i18n.t('nav_dashboard') },
      { key: 'employer-post-job', icon: '➕', label: i18n.t('nav_post_job') },
      { key: 'employer-applicants', icon: '👥', label: i18n.t('nav_applicants') },
      { key: 'employer-escrow', icon: '🔒', label: i18n.t('nav_escrow') },
    ];
    return `<aside class="sidebar">
      <div class="sidebar-section">
        <div style="padding:0 8px 16px">
          ${UI.avatar(role === 'freelancer' ? DUMMY.user.freelancer.initials : DUMMY.user.employer.initials, 'md')}
          <div style="margin-top:12px">
            <div style="font-weight:600;font-size:0.9rem">${role === 'freelancer' ? DUMMY.user.freelancer.name : DUMMY.user.employer.name}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px">${role === 'freelancer' ? DUMMY.user.freelancer.title : DUMMY.user.employer.company}</div>
            ${role === 'freelancer' ? `<div class="badge badge-accent" style="margin-top:8px">✅ ${i18n.t('verified')}</div>` : `<span class="badge badge-accent" style="margin-top:8px">🌐 International</span>`}
          </div>
        </div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-section">
        ${items.map(item => `
          <button class="sidebar-item ${active === item.key ? 'active' : ''}" onclick="Router.goTo('${item.key}')">
            <span>${item.icon}</span> ${item.label}
          </button>`).join('')}
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-section">
        <button class="sidebar-item" onclick="Router.goTo('landing')" style="color:var(--danger)">
          <span>🚪</span> <span data-i18n="nav_signout">${i18n.t('nav_signout')}</span>
        </button>
      </div>
    </aside>`;
  },

  bindLangSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === i18n.currentLang);
      b.onclick = () => { i18n.setLang(b.dataset.lang); };
    });
  },

  modal(id, title, body, footer = '') {
    return `<div class="modal-overlay" id="${id}">
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close" onclick="document.getElementById('${id}').classList.remove('open')">✕</button>
        </div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    </div>`;
  },

  openModal(id) { document.getElementById(id)?.classList.add('open'); },
  closeModal(id) { document.getElementById(id)?.classList.remove('open'); },

  simulateAI(targetId, finalHTML, delay = 2000) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = `<div style="display:flex;align-items:center;gap:12px;color:var(--text-muted);padding:20px 0">
      <div style="width:20px;height:20px;border:2px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div>
      <span data-i18n="loading">${i18n.t('loading')}</span>
    </div>`;
    setTimeout(() => { el.innerHTML = finalHTML; i18n.applyTranslations(); }, delay);
  },

  jobCard(job, compact = false) {
    return `<div class="card" style="cursor:pointer" onclick="Router.goTo('freelancer-job-detail', ${job.id})">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:12px">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:1.1rem">${job.flag}</span>
            <span class="badge badge-primary">${job.type}</span>
            ${job.verified ? '<span class="badge badge-accent">✅ Verified</span>' : ''}
          </div>
          <h3 style="font-size:1rem;margin-bottom:4px">${job.title}</h3>
          <div style="font-size:0.82rem;color:var(--text-muted)">${job.company} · ${job.location}</div>
        </div>
        ${UI.scoreRing(job.match, 80)}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
        ${job.tags.slice(0,4).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:700;color:var(--accent)">${job.budget}</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">${job.duration} · <span data-i18n="posted_ago">${i18n.t('posted_ago')}</span> ${job.posted} <span data-i18n="days_ago">${i18n.t('days_ago')}</span></div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();UI.toast('${i18n.t('save_job')}')" data-i18n="save_job">${i18n.t('save_job')}</button>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();Router.goTo('freelancer-job-detail',${job.id})" data-i18n="analyze_fit">${i18n.t('analyze_fit')}</button>
        </div>
      </div>
    </div>`;
  },
};

// ── Pages ──────────────────────────────────────────────────────────
const Pages = {};
