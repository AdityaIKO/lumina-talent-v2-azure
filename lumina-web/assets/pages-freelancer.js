// ── Freelancer Dashboard ──────────────────────────────────────────
Pages.renderFreelancerDashboard = function() {
  const u = DUMMY.user.freelancer;
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('freelancer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('freelancer','freelancer-dashboard')}
    <main class="main-content">
      <div class="page-header">
        <h2><span data-i18n="dash_greeting">${i18n.t('dash_greeting')}</span>, ${u.name.split(' ')[0]} 👋</h2>
        <p style="margin-top:4px;font-size:0.875rem">Senin, 27 April 2026</p>
      </div>

      <!-- Stats -->
      <div class="grid-4" style="margin-bottom:32px">
        ${[
          ['🎯',i18n.t('dash_match_jobs'),u.stats.matchJobs,'↑ 4 baru','up'],
          ['📤',i18n.t('dash_applications'),u.stats.applications,'2 ditinjau','up'],
          ['🔄',i18n.t('dash_active_projects'),u.stats.activeProjects,'1 deadline minggu ini',''],
          ['💰',i18n.t('dash_earnings'),u.stats.earnings,'↑ Rp 4,75M bulan ini','up'],
        ].map(([icon,label,val,change,dir])=>`
        <div class="card stat-card">
          <div style="font-size:1.5rem">${icon}</div>
          <div class="stat-val">${val}</div>
          <div class="stat-label">${label}</div>
          <div class="stat-change ${dir}">${change}</div>
        </div>`).join('')}
      </div>

      <!-- Profile Completion -->
      <div class="card" style="margin-bottom:32px;background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,170,0.08))">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
          <div style="flex:1">
            <div style="font-weight:600;margin-bottom:6px">Profil ${u.matchScore}% Lengkap</div>
            <div class="progress-bar" style="max-width:400px"><div class="progress-fill" style="width:${u.matchScore}%"></div></div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:6px">Tambahkan sertifikat untuk mencapai 100%</div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="Router.goTo('freelancer-onboarding')">Lengkapi Profil →</button>
        </div>
      </div>

      <!-- Recommended Jobs -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 data-i18n="recommended_jobs">${i18n.t('recommended_jobs')}</h3>
        <button class="btn btn-ghost btn-sm" onclick="Router.goTo('freelancer-jobs')" data-i18n="see_all">${i18n.t('see_all')} →</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        ${DUMMY.jobs.slice(0,3).map(j=>UI.jobCard(j)).join('')}
      </div>
    </main>
  </div>`;
  UI.bindLangSwitcher();
};

// ── Freelancer Job Listing ────────────────────────────────────────
Pages.renderJobListing = function() {
  let activeFilter = 'all';
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('freelancer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('freelancer','freelancer-jobs')}
    <main class="main-content">
      <div class="page-header">
        <h2 data-i18n="jobs_title">${i18n.t('jobs_title')}</h2>
      </div>
      <!-- Search & Filter -->
      <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
        <div style="flex:1;position:relative;min-width:200px">
          <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-muted)">🔍</span>
          <input class="form-input" style="padding-left:40px" data-i18n-placeholder="search_placeholder" placeholder="${i18n.t('search_placeholder')}">
        </div>
        <select class="form-select" style="width:160px">
          <option data-i18n="filter_category">${i18n.t('filter_category')}</option>
          <option>Web Development</option><option>Mobile Dev</option><option>Design</option><option>Data Science</option>
        </select>
        <select class="form-select" style="width:160px">
          <option data-i18n="filter_sort">${i18n.t('filter_sort')}</option>
          <option data-i18n="sort_match">${i18n.t('sort_match')}</option>
          <option data-i18n="sort_newest">${i18n.t('sort_newest')}</option>
          <option data-i18n="sort_budget">${i18n.t('sort_budget')}</option>
        </select>
      </div>
      <!-- Tab -->
      <div style="display:flex;gap:8px;margin-bottom:20px">
        <button class="btn btn-primary btn-sm" data-i18n="all_jobs">${i18n.t('all_jobs')}</button>
        <button class="btn btn-ghost btn-sm" data-i18n="saved_jobs">${i18n.t('saved_jobs')}</button>
      </div>
      <!-- Job Cards -->
      <div style="display:flex;flex-direction:column;gap:16px">
        ${DUMMY.jobs.map(j=>UI.jobCard(j)).join('')}
      </div>
    </main>
  </div>`;
  UI.bindLangSwitcher();
};

// ── Freelancer Job Detail + AI Match ─────────────────────────────
Pages.renderJobDetail = function(jobId) {
  const job = DUMMY.jobs.find(j=>j.id==jobId) || DUMMY.jobs[0];
  const ai  = DUMMY.aiAnalysis;
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('freelancer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('freelancer','freelancer-jobs')}
    <main class="main-content">
      <div class="breadcrumb"><span onclick="Router.goTo('freelancer-jobs')" style="cursor:pointer;color:var(--primary-light)" data-i18n="nav_jobs">${i18n.t('nav_jobs')}</span><span>›</span><span>${job.title}</span></div>
      <div style="display:grid;grid-template-columns:1fr 380px;gap:24px;align-items:start">
        <!-- Left: Job Info -->
        <div>
          <div class="card" style="margin-bottom:20px">
            <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:16px">
              <div style="width:52px;height:52px;border-radius:12px;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:1.4rem">${job.flag}</div>
              <div style="flex:1">
                <h2 style="font-size:1.3rem;margin-bottom:4px">${job.title}</h2>
                <div style="font-size:0.875rem;color:var(--text-muted)">${job.company} · ${job.location}</div>
                <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
                  <span class="badge badge-primary">${job.type}</span>
                  ${job.verified?'<span class="badge badge-accent">✅ Verified Client</span>':''}
                  <span class="badge badge-neutral">⭐ ${job.rating} (${job.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;margin-bottom:16px">
              <div><div style="font-size:0.75rem;color:var(--text-muted)">Budget</div><div style="font-weight:700;color:var(--accent)">${job.budget}</div></div>
              <div><div style="font-size:0.75rem;color:var(--text-muted)">Durasi</div><div style="font-weight:700">${job.duration}</div></div>
              <div><div style="font-size:0.75rem;color:var(--text-muted)">Diposting</div><div style="font-weight:700">${job.posted} hari lalu</div></div>
            </div>
            <h3 style="margin-bottom:10px">Deskripsi</h3>
            <p style="font-size:0.9rem;line-height:1.7">${job.desc}</p>
            <div class="divider"></div>
            <h3 style="margin-bottom:10px" data-i18n="skills_needed">${i18n.t('skills_needed')}</h3>
            <div style="display:flex;flex-wrap:wrap;gap:8px">${job.tags.map(t=>`<span class="tag active">${t}</span>`).join('')}</div>
            <div class="divider"></div>
            <h3 style="margin-bottom:10px">Deliverables</h3>
            <p style="font-size:0.9rem">${job.deliverables}</p>
          </div>
        </div>

        <!-- Right: AI Panel -->
        <div style="position:sticky;top:88px">
          <!-- AI Analyze -->
          <div class="card" style="margin-bottom:16px;border-color:rgba(108,99,255,0.3)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
              <h3 data-i18n="ai_analysis_title">${i18n.t('ai_analysis_title')}</h3>
              ${UI.scoreRing(ai.score, 90)}
            </div>
            <div id="aiPanel">
              <button class="btn btn-primary w-full" onclick="runAIAnalysis()" data-i18n="btn_analyze">${i18n.t('btn_analyze')}</button>
            </div>
          </div>
          <!-- Proposal Drafter -->
          <div class="card" id="proposalCard" style="display:none">
            <h3 style="margin-bottom:12px" data-i18n="proposal_draft_title">${i18n.t('proposal_draft_title')}</h3>
            <textarea class="form-textarea" id="proposalID" style="min-height:160px;font-size:0.82rem">${ai.proposalID}</textarea>
            <button class="btn btn-accent w-full" style="margin-top:12px" onclick="translateProposal()" data-i18n="btn_translate">${i18n.t('btn_translate')}</button>
            <div id="proposalENSection" style="display:none;margin-top:16px">
              <h3 style="margin-bottom:10px" data-i18n="proposal_en_title">${i18n.t('proposal_en_title')}</h3>
              <textarea class="form-textarea" style="min-height:160px;font-size:0.82rem">${ai.proposalEN}</textarea>
              <button class="btn btn-primary w-full" style="margin-top:12px" onclick="UI.toast(i18n.t('success'),'success')" data-i18n="btn_send_proposal">${i18n.t('btn_send_proposal')}</button>
            </div>
          </div>
          <!-- Apply Button (fallback) -->
          <button class="btn btn-primary w-full" style="margin-top:12px" onclick="UI.toast(i18n.t('success'),'success')" data-i18n="btn_apply">${i18n.t('btn_apply')}</button>
        </div>
      </div>
    </main>
  </div>
  ${UI.modal('profileModal', DUMMY.user.employer.company,
    `<p style="font-size:0.875rem">TechCorp Solutions adalah perusahaan teknologi berbasis di San Francisco yang membangun produk SaaS enterprise untuk pasar global.</p>
    <div style="margin-top:16px;display:flex;gap:16px">
      <div><div style="font-size:0.75rem;color:var(--text-muted)">Rating</div><div style="font-weight:700">⭐ 4.9</div></div>
      <div><div style="font-size:0.75rem;color:var(--text-muted)">Proyek</div><div style="font-weight:700">23</div></div>
      <div><div style="font-size:0.75rem;color:var(--text-muted)">Lokasi</div><div style="font-weight:700">🇺🇸 USA</div></div>
    </div>`,
    `<button class="btn btn-ghost" onclick="UI.closeModal('profileModal')" data-i18n="close">${i18n.t('close')}</button>`
  )}`;
  UI.bindLangSwitcher();

  window.runAIAnalysis = () => {
    const panel = document.getElementById('aiPanel');
    panel.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--primary-light);margin-bottom:12px"><div style="width:16px;height:16px;border:2px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div> AI sedang menganalisis...</div>`;
    setTimeout(()=>{
      panel.innerHTML = `
        <div>
          <div style="font-size:0.82rem;font-weight:600;color:var(--accent);margin-bottom:8px" data-i18n="strengths">${i18n.t('strengths')}</div>
          ${ai.strengths.map(s=>`<div style="display:flex;gap:8px;margin-bottom:6px;font-size:0.82rem"><span style="color:var(--accent)">✓</span>${s}</div>`).join('')}
          <div class="divider" style="margin:12px 0"></div>
          <div style="font-size:0.82rem;font-weight:600;color:var(--warning);margin-bottom:8px" data-i18n="improvements">${i18n.t('improvements')}</div>
          ${ai.improvements.map(s=>`<div style="display:flex;gap:8px;margin-bottom:6px;font-size:0.82rem"><span style="color:var(--warning)">!</span>${s}</div>`).join('')}
          <div class="divider" style="margin:12px 0"></div>
          <button class="btn btn-primary w-full" onclick="showProposal()" data-i18n="btn_draft_proposal">${i18n.t('btn_draft_proposal')}</button>
        </div>`;
      i18n.applyTranslations();
    }, 2200);
  };

  window.showProposal = () => {
    document.getElementById('proposalCard').style.display = 'block';
    document.getElementById('proposalCard').scrollIntoView({behavior:'smooth'});
  };

  window.translateProposal = () => {
    const btn = event.target;
    btn.innerHTML = `<div style="width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;margin-right:8px"></div> <span data-i18n="translating">${i18n.t('translating')}</span>`;
    btn.disabled = true;
    setTimeout(()=>{ document.getElementById('proposalENSection').style.display='block'; btn.style.display='none'; i18n.applyTranslations(); }, 1800);
  };
};
