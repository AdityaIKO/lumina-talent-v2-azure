// ── Freelancer Status ─────────────────────────────────────────────
Pages.renderStatus = function() {
  let activeTab = 'applications';
  const app = document.getElementById('app');

  function render() {
    app.innerHTML = UI.navbar('freelancer') + `
    <div class="dashboard-layout active">
      ${UI.sidebar('freelancer','freelancer-status')}
      <main class="main-content">
        <div class="page-header">
          <h2 data-i18n="status_title">${i18n.t('status_title')}</h2>
        </div>
        <!-- Tabs -->
        <div style="display:flex;gap:8px;margin-bottom:24px;border-bottom:1px solid var(--border);padding-bottom:16px">
          ${[['applications','tab_applications'],['contracts','tab_contracts'],['history','tab_history']].map(([key,label])=>`
          <button class="btn ${activeTab===key?'btn-primary':'btn-ghost'} btn-sm" onclick="switchStatusTab('${key}')" data-i18n="${label}">${i18n.t(label)}</button>`).join('')}
        </div>
        <div id="statusContent">${renderStatusContent(activeTab)}</div>
      </main>
    </div>`;
    UI.bindLangSwitcher();
    i18n.applyTranslations();
    window.switchStatusTab = (tab) => { activeTab = tab; render(); };
  }
  render();
};

function renderStatusContent(tab) {
  if (tab === 'applications') {
    return `<div style="display:flex;flex-direction:column;gap:12px">
      ${DUMMY.applications.map(a=>`
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-weight:600;margin-bottom:4px">${a.job}</div>
            <div style="font-size:0.82rem;color:var(--text-muted)">${a.company} · ${a.date}</div>
            <div style="font-size:0.82rem;color:var(--accent);margin-top:4px;font-weight:600">${a.budget}</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
            ${UI.statusBadge(a.status)}
            <div style="font-size:0.75rem;color:var(--text-muted)">Match ${a.match}%</div>
          </div>
        </div>
      </div>`).join('')}
    </div>`;
  }
  if (tab === 'contracts') {
    return `<div style="display:flex;flex-direction:column;gap:16px">
      ${DUMMY.contracts.map(c=>`
      <div class="card" style="${c.status==='revision'?'border-color:rgba(255,179,71,0.4)':''}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:16px">
          <div>
            <div style="font-weight:600;font-size:1rem;margin-bottom:4px">${c.job}</div>
            <div style="font-size:0.82rem;color:var(--text-muted)">${c.company} · Deadline: ${c.deadline}</div>
            <div style="font-size:0.875rem;color:var(--accent);font-weight:700;margin-top:4px">${c.budget}</div>
          </div>
          ${UI.statusBadge(c.status)}
        </div>
        <!-- Progress -->
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;font-size:0.78rem;color:var(--text-muted);margin-bottom:6px">
            <span data-i18n="project_progress">${i18n.t('project_progress')}</span><span>${c.progress}%</span>
          </div>
          <div class="progress-bar"><div class="progress-fill" style="width:${c.progress}%"></div></div>
        </div>
        <!-- Milestones -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
          ${c.milestones.map((m,i)=>`<span class="badge ${i<Math.ceil(c.progress/25)?'badge-accent':'badge-neutral'}">${i<Math.ceil(c.progress/25)?'✓ ':''} ${m}</span>`).join('')}
        </div>
        <!-- Revision Note -->
        ${c.status==='revision'?`
        <div style="background:rgba(255,179,71,0.08);border:1px solid rgba(255,179,71,0.2);border-radius:10px;padding:14px;margin-bottom:16px">
          <div style="font-weight:600;color:var(--warning);margin-bottom:6px;font-size:0.875rem">✏️ <span data-i18n="revision_from_client">${i18n.t('revision_from_client')}</span></div>
          <p style="font-size:0.82rem">${c.revisionNote}</p>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px">Revisi ke-${c.revisions} dari ${c.maxRevisions}</div>
        </div>` : ''}
        <!-- Actions -->
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-primary btn-sm" onclick="UI.openModal('submitWorkModal')" data-i18n="btn_submit_work">${i18n.t('btn_submit_work')}</button>
          ${c.revisions>=c.maxRevisions-1?`<button class="btn btn-danger btn-sm" onclick="UI.toast('Sengketa diajukan','success')" data-i18n="btn_open_dispute">${i18n.t('btn_open_dispute')}</button>`:''}
        </div>
      </div>`).join('')}
    </div>
    ${UI.modal('submitWorkModal', i18n.t('btn_submit_work'),
      `<div style="display:flex;flex-direction:column;gap:16px">
        <div class="upload-zone"><div class="upload-icon">📁</div><div style="font-weight:600">Upload File Hasil Kerja</div><div style="font-size:0.82rem;color:var(--text-muted)">ZIP, PDF, atau link · Max 50MB</div></div>
        <div class="form-group"><label class="form-label">Catatan untuk Klien</label><textarea class="form-textarea" placeholder="Jelaskan apa yang sudah dikerjakan...">Pekerjaan telah selesai sesuai dengan spesifikasi yang diminta. Semua endpoint telah ditest dan dokumentasi API sudah tersedia.</textarea></div>
      </div>`,
      `<button class="btn btn-ghost" onclick="UI.closeModal('submitWorkModal')" data-i18n="cancel">${i18n.t('cancel')}</button>
       <button class="btn btn-primary" onclick="UI.closeModal('submitWorkModal');UI.toast(i18n.t('success'),'success')" data-i18n="submit">${i18n.t('submit')}</button>`
    )}`;
  }
  if (tab === 'history') {
    return `<div style="display:flex;flex-direction:column;gap:12px">
      ${DUMMY.workHistory.map(w=>`
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-weight:600;margin-bottom:4px">${w.job}</div>
            <div style="font-size:0.82rem;color:var(--text-muted)">${w.company} · Selesai: ${w.completedDate}</div>
            <div style="font-size:0.875rem;color:var(--accent);font-weight:700;margin-top:4px">${w.budget}</div>
            <div style="font-size:0.82rem;margin-top:8px;color:var(--text-muted);font-style:italic">"${w.review}"</div>
          </div>
          <div style="text-align:right">
            ${UI.statusBadge(w.status)}
            <div style="font-size:1rem;margin-top:8px">${'⭐'.repeat(w.rating)}${'☆'.repeat(5-w.rating)}</div>
          </div>
        </div>
      </div>`).join('')}
    </div>`;
  }
  return '';
}

// ── Freelancer Finance ────────────────────────────────────────────
Pages.renderFinance = function() {
  const u = DUMMY.user.freelancer;
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar('freelancer') + `
  <div class="dashboard-layout active">
    ${UI.sidebar('freelancer','freelancer-finance')}
    <main class="main-content">
      <div class="page-header">
        <h2 data-i18n="finance_title">${i18n.t('finance_title')}</h2>
      </div>
      <!-- Balance Cards -->
      <div class="grid-3" style="margin-bottom:32px">
        <div class="card" style="background:linear-gradient(135deg,rgba(0,212,170,0.15),rgba(0,212,170,0.05));border-color:rgba(0,212,170,0.3)">
          <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px" data-i18n="balance_available">${i18n.t('balance_available')}</div>
          <div style="font-size:1.8rem;font-weight:800;color:var(--accent)">${u.balance.available}</div>
          <button class="btn btn-accent btn-sm" style="margin-top:12px" onclick="UI.openModal('withdrawModal')" data-i18n="btn_withdraw">${i18n.t('btn_withdraw')}</button>
        </div>
        <div class="card">
          <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px" data-i18n="balance_pending">${i18n.t('balance_pending')}</div>
          <div style="font-size:1.8rem;font-weight:800;color:var(--warning)">${u.balance.pending}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">Dari 2 proyek aktif</div>
        </div>
        <div class="card">
          <div style="font-size:0.82rem;color:var(--text-muted);margin-bottom:8px" data-i18n="total_earned">${i18n.t('total_earned')}</div>
          <div style="font-size:1.8rem;font-weight:800">${u.balance.total}</div>
          <div style="font-size:0.75rem;color:var(--accent);margin-top:4px">↑ Rp 4,75M bulan ini</div>
        </div>
      </div>
      <!-- Monthly Summary -->
      <div class="card" style="margin-bottom:24px">
        <h3 style="margin-bottom:16px" data-i18n="report_tagihan">${i18n.t('report_tagihan')}</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;text-align:center;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px">
          ${[['income','Rp 19.000.000','#00D4AA'],['processing_fee','Rp 950.000','#FF5E7D'],['net_income','Rp 18.050.000','#6C63FF']].map(([k,v,c])=>`
          <div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px" data-i18n="${k}">${i18n.t(k)}</div>
            <div style="font-size:1.3rem;font-weight:700;color:${c}">${v}</div>
          </div>`).join('')}
        </div>
      </div>
      <!-- Transactions -->
      <h3 style="margin-bottom:16px" data-i18n="transaction_history">${i18n.t('transaction_history')}</h3>
      <div class="card-flat">
        <table class="table">
          <thead><tr>
            <th>Deskripsi</th><th>Tanggal</th><th>Jumlah</th><th>Status</th>
          </tr></thead>
          <tbody>
            ${DUMMY.transactions.map(t=>`<tr>
              <td>${t.desc}</td>
              <td style="color:var(--text-muted)">${t.date}</td>
              <td style="font-weight:700;color:${t.amount.startsWith('+')?'var(--accent)':'var(--danger)'}">${t.amount}</td>
              <td>${UI.statusBadge(t.status)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </main>
  </div>
  ${UI.modal('withdrawModal', i18n.t('btn_withdraw'),
    `<div style="display:flex;flex-direction:column;gap:16px">
      <div style="background:rgba(0,212,170,0.08);border-radius:10px;padding:14px;font-size:0.875rem">
        <span style="color:var(--text-muted)" data-i18n="balance_available">${i18n.t('balance_available')}</span>
        <span style="float:right;font-weight:700;color:var(--accent)">${u.balance.available}</span>
      </div>
      <div class="form-group">
        <label class="form-label" data-i18n="withdraw_method">${i18n.t('withdraw_method')}</label>
        <select class="form-select">
          <option>BCA - 1234****</option>
          <option>Mandiri - 5678****</option>
          <option>GoPay</option>
          <option>OVO</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Jumlah Penarikan (IDR)</label>
        <input class="form-input" type="number" value="4250000">
      </div>
    </div>`,
    `<button class="btn btn-ghost" onclick="UI.closeModal('withdrawModal')" data-i18n="cancel">${i18n.t('cancel')}</button>
     <button class="btn btn-accent" onclick="UI.closeModal('withdrawModal');UI.toast(i18n.t('success'),'success')" data-i18n="btn_withdraw">${i18n.t('btn_withdraw')}</button>`
  )}`;
  UI.bindLangSwitcher();
};
