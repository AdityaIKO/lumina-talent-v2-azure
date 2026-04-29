// ── Employer Dashboard ────────────────────────────────────────────
Pages.renderEmployerDashboard = function() {
  const u = DUMMY.user.employer;
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('employer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('employer','employer-dashboard')}
    <main class="main-content">
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:16px">
        <div>
          <h2 data-i18n="emp_dash_title">${i18n.t('emp_dash_title')}</h2>
          <p style="margin-top:4px;font-size:0.875rem">${u.company} · 🇺🇸 ${u.location}</p>
        </div>
        <button class="btn btn-primary" onclick="Router.goTo('employer-post-job')" data-i18n="btn_post_job">${i18n.t('btn_post_job')}</button>
      </div>
      <!-- Stats -->
      <div class="grid-4" style="margin-bottom:32px">
        ${[
          ['👥',i18n.t('emp_stat_applicants'),u.stats.applicants,'↑ 12 baru minggu ini','up'],
          ['🔒',i18n.t('emp_stat_escrow'),u.stats.escrow,'2 proyek aktif',''],
          ['📋',i18n.t('emp_stat_active_jobs'),u.stats.activeJobs,'1 draft',''],
          ['🔄',i18n.t('emp_stat_projects'),u.stats.projects,'1 menunggu review',''],
        ].map(([icon,label,val,change,dir])=>`
        <div class="card stat-card">
          <div style="font-size:1.5rem">${icon}</div>
          <div class="stat-val">${val}</div>
          <div class="stat-label">${label}</div>
          <div class="stat-change ${dir}">${change}</div>
        </div>`).join('')}
      </div>
      <!-- Active Jobs -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3 data-i18n="active_jobs">${i18n.t('active_jobs')}</h3>
        <button class="btn btn-ghost btn-sm" onclick="Router.goTo('employer-post-job')" data-i18n="btn_post_job">${i18n.t('btn_post_job')}</button>
      </div>
      <div class="card-flat">
        <table class="table">
          <thead><tr>
            <th>Judul Lowongan</th><th>Status</th><th>Pelamar</th><th>Budget</th><th>Diposting</th><th>Aksi</th>
          </tr></thead>
          <tbody>
            ${DUMMY.empJobs.map(j=>`<tr>
              <td style="font-weight:600">${j.title}</td>
              <td>${UI.statusBadge(j.status)}</td>
              <td><span style="font-weight:700;color:var(--primary-light)">${j.applicants}</span> pelamar</td>
              <td style="color:var(--accent);font-weight:700">${j.budget}</td>
              <td style="color:var(--text-muted)">${j.posted}</td>
              <td>
                <div style="display:flex;gap:6px">
                  <button class="btn btn-primary btn-sm" onclick="Router.goTo('employer-applicants',${j.id})" data-i18n="btn_view_profile">${i18n.t('btn_view_profile')}</button>
                  <button class="btn btn-ghost btn-sm" data-i18n="edit">${i18n.t('edit')}</button>
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <!-- Recent Applicants Preview -->
      <h3 style="margin:32px 0 16px" data-i18n="nav_applicants">${i18n.t('nav_applicants')}</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        ${DUMMY.applicants.slice(0,3).map(a=>`
        <div class="card" style="cursor:pointer" onclick="Router.goTo('employer-applicants')">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            ${UI.avatar(a.initials,'md')}
            <div>
              <div style="font-weight:600;font-size:0.9rem">${a.name}</div>
              <div style="font-size:0.78rem;color:var(--text-muted)">${a.title}</div>
            </div>
            ${UI.scoreRing(a.match,64)}
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:12px">
            ${a.skills.slice(0,3).map(s=>`<span class="tag">${s}</span>`).join('')}
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-primary btn-sm w-full" onclick="event.stopPropagation();UI.toast('Diproses','success')" data-i18n="btn_accept">${i18n.t('btn_accept')}</button>
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation()" data-i18n="btn_reject">${i18n.t('btn_reject')}</button>
          </div>
        </div>`).join('')}
      </div>
    </main>
  </div>`;
  UI.bindLangSwitcher();
};

// ── Employer Post Job ─────────────────────────────────────────────
Pages.renderPostJob = function() {
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('employer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('employer','employer-post-job')}
    <main class="main-content">
      <div class="page-header">
        <h2 data-i18n="post_job_title">${i18n.t('post_job_title')}</h2>
      </div>
      <div style="max-width:720px">
        <div class="card-flat" style="display:flex;flex-direction:column;gap:20px">
          <div class="form-group">
            <label class="form-label" data-i18n="label_job_title">${i18n.t('label_job_title')}</label>
            <input class="form-input" placeholder="e.g. Senior React Developer for SaaS Dashboard" value="Senior React Developer for SaaS Dashboard">
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="label_job_desc">${i18n.t('label_job_desc')}</label>
            <textarea class="form-textarea" style="min-height:160px">We are looking for an experienced React developer to build an enterprise SaaS dashboard. You will work closely with our design team to implement pixel-perfect UI components and integrate REST APIs.</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="label_skills_req">${i18n.t('label_skills_req')}</label>
            <input class="form-input" placeholder="e.g. React.js, TypeScript, Node.js" value="React.js, TypeScript, Node.js, PostgreSQL, AWS">
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">
              ${['React.js','TypeScript','Node.js','PostgreSQL','AWS'].map(s=>`<span class="tag active">${s} <span style="cursor:pointer;margin-left:4px;opacity:0.6">×</span></span>`).join('')}
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label" data-i18n="label_budget_type">${i18n.t('label_budget_type')}</label>
              <select class="form-select">
                <option data-i18n="budget_fixed">${i18n.t('budget_fixed')}</option>
                <option data-i18n="budget_hourly">${i18n.t('budget_hourly')}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="label_budget_amount">${i18n.t('label_budget_amount')}</label>
              <input class="form-input" placeholder="e.g. $1,500 - $2,500" value="$1,500 - $2,500 USD">
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
            <div class="form-group">
              <label class="form-label" data-i18n="label_duration">${i18n.t('label_duration')}</label>
              <select class="form-select">
                <option>< 1 Minggu</option><option>1-2 Minggu</option><option selected>1-3 Bulan</option><option>3-6 Bulan</option><option>> 6 Bulan</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" data-i18n="label_location">${i18n.t('label_location')}</label>
              <select class="form-select">
                <option>Remote</option><option selected>USA</option><option>Europe</option><option>Asia</option><option>Indonesia</option>
              </select>
            </div>
          </div>
          <div style="background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:12px;padding:16px">
            <div style="font-weight:600;margin-bottom:6px">🤖 AI Prediction</div>
            <p style="font-size:0.875rem">Berdasarkan deskripsi ini, estimasi pelamar dengan match ≥80%: <strong style="color:var(--accent)">12-18 freelancer</strong>. Tambahkan lebih banyak detail untuk meningkatkan kualitas pelamar.</p>
          </div>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <button class="btn btn-ghost" onclick="UI.toast('Draft tersimpan','success')" data-i18n="btn_save_draft">${i18n.t('btn_save_draft')}</button>
            <button class="btn btn-primary" onclick="publishJob()" data-i18n="btn_publish">${i18n.t('btn_publish')}</button>
          </div>
        </div>
      </div>
    </main>
  </div>`;
  UI.bindLangSwitcher();
  window.publishJob = () => { UI.toast(i18n.t('success'), 'success'); setTimeout(()=>Router.goTo('employer-dashboard'),800); };
};

// ── Employer Applicants ───────────────────────────────────────────
Pages.renderApplicants = function(jobId) {
  const job = DUMMY.empJobs.find(j=>j.id==jobId) || DUMMY.empJobs[0];
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('employer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('employer','employer-applicants')}
    <main class="main-content">
      <div class="page-header">
        <div class="breadcrumb"><span onclick="Router.goTo('employer-dashboard')" style="cursor:pointer;color:var(--primary-light)" data-i18n="nav_dashboard">${i18n.t('nav_dashboard')}</span><span>›</span><span>${job.title}</span></div>
        <h2 data-i18n="applicants_title">${i18n.t('applicants_title')}</h2>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
          <span class="badge badge-primary">🤖 <span data-i18n="ai_sorted">${i18n.t('ai_sorted')}</span></span>
          <span style="font-size:0.82rem;color:var(--text-muted)">${DUMMY.applicants.length} pelamar</span>
        </div>
      </div>
      <div id="applicantsList" style="display:flex;flex-direction:column;gap:16px">
        <div style="text-align:center;padding:40px;color:var(--text-muted)">
           <div style="width:24px;height:24px;border:3px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px"></div>
           Azure OpenAI sedang menyortir pelamar...
        </div>
      </div>
    </main>
  </div>`;
  UI.bindLangSwitcher();
  window.hireApplicant = (id) => { UI.toast(i18n.t('success'), 'success'); setTimeout(()=>Router.goTo('employer-escrow'),800); };
  
  // Asynchronous Azure API call for Smart Sorting
  setTimeout(async () => {
    const sortedApplicants = await AzureAPI.smartSortApplicants(DUMMY.applicants, job);
    const listEl = document.getElementById('applicantsList');
    if (!listEl) return;
    
    listEl.innerHTML = sortedApplicants.map((a,idx)=>`
        <div class="card ${a.status==='hired'?'border-color:rgba(0,212,170,0.4);':''}" style="${a.status==='hired'?'border-color:rgba(0,212,170,0.4)':''}">
          <div style="display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap">
            <div style="display:flex;align-items:center;gap:3px;flex-shrink:0;flex-direction:column">
              <span style="font-size:0.7rem;color:var(--text-muted);font-weight:700">#${idx+1}</span>
              ${UI.scoreRing(a.match, 80)}
            </div>
            <div style="flex:1;min-width:200px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">
                ${UI.avatar(a.initials,'md')}
                <div>
                  <div style="font-weight:700;font-size:1rem">${a.name}</div>
                  <div style="font-size:0.82rem;color:var(--text-muted)">${a.title} · ${a.experience}</div>
                </div>
                ${a.verified?'<span class="badge badge-accent">✅ Verified</span>':''}
                ${UI.statusBadge(a.status)}
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
                ${a.skills.map(s=>`<span class="tag">${s}</span>`).join('')}
              </div>
              <div style="display:flex;gap:16px;font-size:0.82rem;margin-bottom:12px">
                <span>💰 ${a.rate}</span>
                <span>⭐ ${a.rating} (${a.reviews} reviews)</span>
              </div>
              <!-- Proposal Preview -->
              <div style="background:rgba(255,255,255,0.03);border-radius:10px;padding:14px;font-size:0.82rem;color:var(--text-muted);border:1px solid var(--border);margin-bottom:12px;line-height:1.6">
                <div style="font-weight:600;color:var(--text);margin-bottom:6px">📝 <span data-i18n="applicant_proposal">${i18n.t('applicant_proposal')}</span></div>
                ${a.proposal.substring(0,200)}...
                <span style="color:var(--primary-light);cursor:pointer" onclick="UI.openModal('proposalModal${a.id}')"> Lihat selengkapnya</span>
              </div>
              ${a.status !== 'hired' ? `
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary btn-sm" onclick="hireApplicant(${a.id})" data-i18n="btn_accept">${i18n.t('btn_accept')}</button>
                <button class="btn btn-ghost btn-sm" onclick="UI.openModal('proposalModal${a.id}')" data-i18n="btn_view_profile">${i18n.t('btn_view_profile')}</button>
                <button class="btn btn-danger btn-sm" onclick="UI.toast('Pelamar ditolak','error')" data-i18n="btn_reject">${i18n.t('btn_reject')}</button>
              </div>` : `<div class="badge badge-accent" style="font-size:0.875rem">✅ Sudah Dipekerjakan</div>`}
            </div>
          </div>
        </div>
        ${UI.modal('proposalModal'+a.id, a.name+' — Proposal',
          `<div style="font-size:0.875rem;line-height:1.8;white-space:pre-line">${a.proposal}</div>`,
          `<button class="btn btn-ghost" onclick="UI.closeModal('proposalModal${a.id}')" data-i18n="close">${i18n.t('close')}</button>
           <button class="btn btn-primary" onclick="hireApplicant(${a.id});UI.closeModal('proposalModal${a.id}')" data-i18n="btn_accept">${i18n.t('btn_accept')}</button>`
        )}`).join('');
    UI.bindLangSwitcher();
  }, 100);
};

// ── Employer Escrow ───────────────────────────────────────────────
Pages.renderEscrow = function() {
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('employer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('employer','employer-escrow')}
    <main class="main-content">
      <div class="page-header">
        <h2 data-i18n="escrow_title">${i18n.t('escrow_title')}</h2>
      </div>
      <div style="display:flex;flex-direction:column;gap:20px">
        ${DUMMY.escrowProjects.map(ep=>`
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px">
            <div>
              <div style="font-weight:700;font-size:1rem;margin-bottom:4px">${ep.title}</div>
              <div style="display:flex;align-items:center;gap:10px;font-size:0.82rem;color:var(--text-muted)">
                ${UI.avatar(ep.freelancerInitials,'sm')} <span>${ep.freelancer}</span>
                <span>·</span><span>Deadline: ${ep.deadline}</span>
              </div>
            </div>
            <div style="text-align:right">
              ${UI.statusBadge(ep.status)}
              <div style="font-size:1.3rem;font-weight:800;color:var(--accent);margin-top:6px">${ep.amount}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)" data-i18n="escrow_held">${i18n.t('escrow_held')}</div>
            </div>
          </div>
          <!-- Escrow Status Bar -->
          <div style="background:rgba(0,212,170,0.08);border:1px solid rgba(0,212,170,0.15);border-radius:10px;padding:14px;margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:8px">
              <span style="font-weight:600;color:var(--accent)">🔒 <span data-i18n="escrow_status">${i18n.t('escrow_status')}</span></span>
              <span style="color:var(--text-muted)">Revisi ${ep.revisions}/${ep.maxRevisions}</span>
            </div>
            <div style="display:flex;gap:8px;font-size:0.78rem">
              ${['Deposit','In Progress','Submitted','Approved','Released'].map((stage,i)=>{
                const stageMap = {in_progress:1, submitted:2, completed:4};
                const cur = stageMap[ep.status] ?? 1;
                return `<div style="flex:1;text-align:center">
                  <div style="width:28px;height:28px;border-radius:50%;margin:0 auto 4px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;background:${i<=cur?'linear-gradient(135deg,var(--accent),var(--primary))':'rgba(255,255,255,0.08)'};color:${i<=cur?'#fff':'var(--text-dim)'}">${i<=cur?'✓':i+1}</div>
                  <div style="color:${i<=cur?'var(--text)':'var(--text-dim)'}">${stage}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
          <!-- Progress -->
          <div style="margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);margin-bottom:6px">
              <span data-i18n="project_progress">${i18n.t('project_progress')}</span><span>${ep.progress}%</span>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${ep.progress}%"></div></div>
          </div>
          ${ep.status==='submitted'?`
          <div style="background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:10px;padding:14px;margin-bottom:16px">
            <div style="font-weight:600;margin-bottom:8px;font-size:0.875rem">📁 <span data-i18n="work_submitted">${i18n.t('work_submitted')}</span></div>
            <div style="display:flex;align-items:center;gap:10px;font-size:0.82rem">
              <span style="background:rgba(255,255,255,0.06);padding:6px 12px;border-radius:6px;border:1px solid var(--border)">📦 ${ep.deliverable}</span>
              <button class="btn btn-ghost btn-sm">⬇ Download</button>
            </div>
          </div>`:``}
          <!-- Actions -->
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${ep.status==='in_progress'?`
              <button class="btn btn-ghost btn-sm" data-i18n="btn_request_revision">${i18n.t('btn_request_revision')}</button>
              <button class="btn btn-danger btn-sm" onclick="UI.openModal('disputeModal${ep.id}')" data-i18n="btn_dispute">${i18n.t('btn_dispute')}</button>
            `:ep.status==='submitted'?`
              <button class="btn btn-accent btn-sm" onclick="UI.toast(i18n.t('escrow_released'),'success')" data-i18n="btn_approve_work">${i18n.t('btn_approve_work')}</button>
              <button class="btn btn-outline btn-sm" onclick="UI.openModal('revisionModal${ep.id}')" data-i18n="btn_request_revision">${i18n.t('btn_request_revision')}</button>
              <button class="btn btn-danger btn-sm" onclick="UI.openModal('disputeModal${ep.id}')" data-i18n="btn_dispute">${i18n.t('btn_dispute')}</button>
            `:''}
          </div>
        </div>
        ${UI.modal('revisionModal'+ep.id, i18n.t('btn_request_revision'),
          `<div class="form-group"><label class="form-label">Catatan Revisi</label><textarea class="form-textarea" placeholder="Jelaskan revisi yang dibutuhkan..."></textarea></div>
           <div style="font-size:0.82rem;color:var(--text-muted);margin-top:8px">Revisi ke-${ep.revisions+1} dari ${ep.maxRevisions} (sisa ${ep.maxRevisions-ep.revisions-1})</div>`,
          `<button class="btn btn-ghost" onclick="UI.closeModal('revisionModal${ep.id}')" data-i18n="cancel">${i18n.t('cancel')}</button>
           <button class="btn btn-warning" onclick="UI.closeModal('revisionModal${ep.id}');UI.toast('Permintaan revisi terkirim','success')" data-i18n="btn_request_revision">${i18n.t('btn_request_revision')}</button>`
        )}
        ${UI.modal('disputeModal'+ep.id, '⚠️ '+i18n.t('btn_dispute'),
          `<div style="background:rgba(255,94,125,0.08);border:1px solid rgba(255,94,125,0.2);border-radius:10px;padding:14px;margin-bottom:16px;font-size:0.875rem" data-i18n="dispute_info">${i18n.t('dispute_info')}</div>
           <div class="form-group"><label class="form-label">Alasan Sengketa</label><textarea class="form-textarea" placeholder="Jelaskan masalah yang terjadi..."></textarea></div>`,
          `<button class="btn btn-ghost" onclick="UI.closeModal('disputeModal${ep.id}')" data-i18n="cancel">${i18n.t('cancel')}</button>
           <button class="btn btn-danger" onclick="UI.closeModal('disputeModal${ep.id}');UI.toast('Sengketa diajukan','success')" data-i18n="btn_dispute">${i18n.t('btn_dispute')}</button>`
        )}`).join('')}
      </div>
    </main>
  </div>`;
  UI.bindLangSwitcher();
};
