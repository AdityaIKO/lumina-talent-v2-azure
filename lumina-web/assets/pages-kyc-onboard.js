// ── KYC Verification ─────────────────────────────────────────────
Pages.renderKYC = function() {
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar(null) + `
  <div style="min-height:100vh;padding-top:68px;display:flex;align-items:center;justify-content:center;padding:100px 24px 60px">
    <div style="width:100%;max-width:560px">
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:2.5rem;margin-bottom:16px">🪪</div>
        <h2 data-i18n="kyc_title">${i18n.t('kyc_title')}</h2>
        <p style="margin-top:8px" data-i18n="kyc_sub">${i18n.t('kyc_sub')}</p>
      </div>
      <!-- Country Toggle -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:32px">
        <div class="card" id="kycID" style="cursor:pointer;border-color:var(--primary);background:rgba(108,99,255,0.08);text-align:center;padding:20px" onclick="switchKYC('id')">
          <div style="font-size:2rem;margin-bottom:8px">🇮🇩</div>
          <div style="font-weight:600" data-i18n="kyc_indonesia">${i18n.t('kyc_indonesia')}</div>
        </div>
        <div class="card" id="kycIntl" style="cursor:pointer;text-align:center;padding:20px" onclick="switchKYC('intl')">
          <div style="font-size:2rem;margin-bottom:8px">🌐</div>
          <div style="font-weight:600" data-i18n="kyc_international">${i18n.t('kyc_international')}</div>
        </div>
      </div>
      <div id="kycContent">${renderKYCIndonesia()}</div>
    </div>
  </div>`;
  UI.bindLangSwitcher();

  window.switchKYC = (type) => {
    ['ID','Intl'].forEach(t => {
      const el = document.getElementById('kyc'+t);
      const isActive = (type==='id'&&t==='ID')||(type==='intl'&&t==='Intl');
      el.style.borderColor = isActive ? 'var(--primary)' : 'var(--border)';
      el.style.background  = isActive ? 'rgba(108,99,255,0.08)' : 'var(--card)';
    });
    document.getElementById('kycContent').innerHTML = type==='id' ? renderKYCIndonesia() : renderKYCIntl();
    i18n.applyTranslations();
  };
};

function renderKYCIndonesia() {
  return `
  <div class="card-flat" style="display:flex;flex-direction:column;gap:20px">
    <div>
      <h3 data-i18n="kyc_id_title">${i18n.t('kyc_id_title')}</h3>
      <p style="font-size:0.875rem;margin-top:4px" data-i18n="kyc_id_sub">${i18n.t('kyc_id_sub')}</p>
    </div>
    <!-- Upload KTP -->
    <div>
      <div class="form-label mb-4" data-i18n="upload_ktp">${i18n.t('upload_ktp')}</div>
      <div class="upload-zone" onclick="simulateOCR('ktpStatus')">
        <div class="upload-icon">🪪</div>
        <div style="font-weight:600;margin-bottom:6px">Drop file KTP di sini</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">PNG, JPG atau PDF · Max 5MB</div>
        <div id="ktpStatus" style="margin-top:12px"></div>
      </div>
    </div>
    <!-- Upload NIB -->
    <div>
      <div class="form-label mb-4" data-i18n="upload_nib">${i18n.t('upload_nib')}</div>
      <div class="upload-zone">
        <div class="upload-icon">📄</div>
        <div style="font-weight:600;margin-bottom:6px">Drop file NIB di sini</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">PNG, JPG atau PDF · Max 5MB</div>
      </div>
    </div>
    <!-- Phone OTP -->
    <div>
      <h3 style="margin-bottom:12px" data-i18n="kyc_otp_title">${i18n.t('kyc_otp_title')}</h3>
      <p style="font-size:0.875rem;margin-bottom:16px" data-i18n="kyc_otp_sub">${i18n.t('kyc_otp_sub')}</p>
      <div style="display:flex;gap:12px">
        <input class="form-input" type="tel" placeholder="+62 812 3456 7890" style="flex:1">
        <button class="btn btn-outline" onclick="UI.toast('OTP terkirim!')" data-i18n="btn_send_otp">${i18n.t('btn_send_otp')}</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        ${[0,1,2,3,4,5].map((_,i)=>`<input class="form-input" type="text" maxlength="1" style="width:52px;text-align:center;font-size:1.2rem;font-weight:700" value="${['8','3','4','2','1','9'][i]}">`).join('')}
      </div>
    </div>
    <button class="btn btn-primary w-full" onclick="completeKYC()" data-i18n="btn_verify">${i18n.t('btn_verify')}</button>
  </div>`;
}

function renderKYCIntl() {
  return `
  <div class="card-flat" style="display:flex;flex-direction:column;gap:20px">
    <div>
      <h3 data-i18n="kyc_int_title">${i18n.t('kyc_int_title')}</h3>
      <p style="font-size:0.875rem;margin-top:4px" data-i18n="kyc_int_sub">${i18n.t('kyc_int_sub')}</p>
    </div>
    <div style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:16px;display:flex;align-items:center;gap:12px">
      <span style="font-size:1.5rem">💳</span>
      <div>
        <div style="font-weight:600;font-size:0.9rem">Stripe Identity Verification</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Powered by Stripe · Bank-grade security</div>
      </div>
      <span class="badge badge-accent" style="margin-left:auto">Secure</span>
    </div>
    <div class="form-group">
      <label class="form-label">Legal Full Name</label>
      <input class="form-input" type="text" placeholder="Sarah Mitchell" value="Sarah Mitchell">
    </div>
    <div class="form-group">
      <label class="form-label">Company / Organization</label>
      <input class="form-input" type="text" placeholder="TechCorp Solutions" value="TechCorp Solutions">
    </div>
    <div class="form-group">
      <label class="form-label">Company Tax ID (Optional)</label>
      <input class="form-input" type="text" placeholder="XX-XXXXXXX">
    </div>
    <div class="form-group">
      <label class="form-label">Country</label>
      <select class="form-select">
        <option>United States 🇺🇸</option>
        <option>United Kingdom 🇬🇧</option>
        <option>Australia 🇦🇺</option>
        <option>Germany 🇩🇪</option>
        <option>Singapore 🇸🇬</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Payment Method (Stripe)</label>
      <div style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:8px;padding:16px;font-size:0.875rem;color:var(--text-muted)">
        💳 •••• •••• •••• 4242 (Visa)
        <span style="float:right;color:var(--accent)">✅ Verified</span>
      </div>
    </div>
    <button class="btn btn-primary w-full" onclick="completeKYC()" data-i18n="btn_verify">${i18n.t('btn_verify')}</button>
  </div>`;
}

window.simulateOCR = function(statusId) {
  const el = document.getElementById(statusId);
  if (!el) return;
  el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--primary-light);font-size:0.85rem"><div style="width:14px;height:14px;border:2px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div><span data-i18n="ocr_processing">${i18n.t('ocr_processing')}</span></div>`;
  setTimeout(() => {
    el.innerHTML = `<div style="color:var(--accent);font-size:0.85rem;font-weight:600">✅ KTP berhasil diverifikasi — Andi Rizki Pratama</div>`;
  }, 2000);
};

window.completeKYC = function() {
  UI.toast(i18n.t('kyc_success'), 'success');
  const role = localStorage.getItem('lumina_role') || 'freelancer';
  setTimeout(() => Router.goTo(role === 'freelancer' ? 'freelancer-onboarding' : 'employer-dashboard'), 800);
};

// ── Freelancer Onboarding ─────────────────────────────────────────
Pages.renderOnboarding = function() {
  let step = 0;
  const totalSteps = 5;
  const steps = ['step_basic','step_skills','step_cv','step_github','step_preview'];
  const app = document.getElementById('app');

  function render() {
    app.innerHTML = UI.navbar('freelancer') + `
    <div style="min-height:100vh;padding-top:68px;padding-bottom:60px">
      <div class="container" style="max-width:700px;padding-top:48px">
        <div style="text-align:center;margin-bottom:40px">
          <h2 data-i18n="onboard_title">${i18n.t('onboard_title')}</h2>
          <p style="margin-top:8px" data-i18n="onboard_sub">${i18n.t('onboard_sub')}</p>
        </div>
        <!-- Steps -->
        <div class="steps" style="margin-bottom:40px">
          ${steps.map((s,i)=>`
            <div class="step ${i<step?'done':i===step?'active':''}">
              ${i>0?`<div class="step-line ${i<=step?'done':''}"></div>`:''}
              <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
                <div class="step-dot">${i<step?'✓':i+1}</div>
                <span class="step-name" data-i18n="${s}">${i18n.t(s)}</span>
              </div>
            </div>`).join('')}
        </div>
        <!-- Step Content -->
        <div class="card-flat">${getStepContent(step)}</div>
        <!-- Nav Buttons -->
        <div style="display:flex;justify-content:space-between;margin-top:24px">
          <button class="btn btn-ghost" ${step===0?'disabled':''} onclick="prevStep()" data-i18n="btn_prev">${i18n.t('btn_prev')}</button>
          ${step<totalSteps-1
            ? `<button class="btn btn-primary" onclick="nextStep()" data-i18n="btn_next">${i18n.t('btn_next')}</button>`
            : `<button class="btn btn-accent" onclick="finishOnboarding()" data-i18n="btn_finish">${i18n.t('btn_finish')}</button>`}
        </div>
      </div>
    </div>`;
    UI.bindLangSwitcher();
    i18n.applyTranslations();
  }

  window.nextStep = () => { if(step < totalSteps-1){ step++; render(); } };
  window.prevStep = () => { if(step > 0){ step--; render(); } };
  window.finishOnboarding = () => { UI.toast(i18n.t('success'), 'success'); setTimeout(()=>Router.goTo('freelancer-dashboard'),600); };
  window.triggerCVParse = () => {
    const el = document.getElementById('cvParseResult');
    if(!el) return;
    el.innerHTML = `<div style="display:flex;align-items:center;gap:8px;color:var(--primary-light);font-size:0.85rem;margin-top:12px"><div style="width:14px;height:14px;border:2px solid var(--primary);border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div><span data-i18n="cv_parsing">${i18n.t('cv_parsing')}</span></div>`;
    setTimeout(()=>{
      el.innerHTML = `<div style="background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:16px;margin-top:12px">
        <div style="color:var(--accent);font-weight:600;margin-bottom:8px">✅ <span data-i18n="cv_success">${i18n.t('cv_success')}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82rem">
          <div><span style="color:var(--text-muted)">Nama:</span> Rizki Pratama</div>
          <div><span style="color:var(--text-muted)">Skills:</span> React, Node.js, Python</div>
          <div><span style="color:var(--text-muted)">Pendidikan:</span> S1 Informatika UI</div>
          <div><span style="color:var(--text-muted)">Pengalaman:</span> 4 tahun</div>
        </div>
      </div>`;
      i18n.applyTranslations();
    }, 2500);
  };
  window.triggerGithub = () => {
    const btn = document.getElementById('ghBtn');
    if(btn){ btn.innerHTML='<div style="width:14px;height:14px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;margin-right:8px"></div>Connecting...'; }
    setTimeout(()=>{
      const el = document.getElementById('ghResult');
      if(el) el.innerHTML = `<div style="background:rgba(0,212,170,0.1);border:1px solid rgba(0,212,170,0.2);border-radius:12px;padding:16px;margin-top:12px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <span style="font-size:1.5rem">🐱</span>
          <div><div style="font-weight:600">rizkipratama</div><div style="font-size:0.78rem;color:var(--text-muted)">34 repos · 127 stars</div></div>
          <span class="badge badge-accent" style="margin-left:auto" data-i18n="github_connected">${i18n.t('github_connected')}</span>
        </div>
        ${['lumina-dashboard','react-ecommerce','api-gateway-node'].map(r=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-top:1px solid var(--border);font-size:0.82rem"><span>📁 ${r}</span><span class="badge badge-primary">TypeScript</span></div>`).join('')}
      </div>`;
      i18n.applyTranslations();
    }, 1800);
  };

  render();
};

function getStepContent(step) {
  const u = DUMMY.user.freelancer;
  switch(step) {
    case 0: return `
      <h3 style="margin-bottom:20px" data-i18n="step_basic">${i18n.t('step_basic')}</h3>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:8px">
          ${UI.avatar('RP','xl')}
          <div>
            <button class="btn btn-ghost btn-sm">📷 Upload Photo</button>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-top:4px">JPG, PNG · Max 2MB</div>
          </div>
        </div>
        <div class="form-group"><label class="form-label" data-i18n="label_fullname">${i18n.t('label_fullname')}</label><input class="form-input" value="${u.name}"></div>
        <div class="form-group"><label class="form-label" data-i18n="label_bio">${i18n.t('label_bio')}</label><textarea class="form-textarea" style="min-height:120px">${u.bio}</textarea></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label class="form-label" data-i18n="label_exp_level">${i18n.t('label_exp_level')}</label><select class="form-select"><option>Junior (0-2 thn)</option><option selected>Mid (2-5 thn)</option><option>Senior (5+ thn)</option></select></div>
          <div class="form-group"><label class="form-label" data-i18n="label_english">${i18n.t('label_english')}</label><select class="form-select"><option>Basic (A1-A2)</option><option>Intermediate (B1)</option><option selected>Professional (B2)</option><option>Fluent (C1-C2)</option></select></div>
        </div>
        <div class="form-group"><label class="form-label" data-i18n="label_hourly_rate">${i18n.t('label_hourly_rate')}</label><input class="form-input" value="350000" type="number"></div>
      </div>`;
    case 1: return `
      <h3 style="margin-bottom:20px" data-i18n="step_skills">${i18n.t('step_skills')}</h3>
      <div class="form-group" style="margin-bottom:16px">
        <label class="form-label" data-i18n="label_skills">${i18n.t('label_skills')}</label>
        <input class="form-input" placeholder="Tambah skill dan tekan Enter..." onkeydown="addSkillTag(event)">
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px" id="skillTags">
        ${u.skills.map(s=>`<span class="tag active">${s} <span style="cursor:pointer;margin-left:4px;opacity:0.6" onclick="this.parentElement.remove()">×</span></span>`).join('')}
      </div>
      <div style="margin-top:24px">
        <div class="form-label" style="margin-bottom:12px">Kategori Utama</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${['Web Development','Mobile Development','UI/UX Design','Data Science','DevOps','Content Writing','Digital Marketing'].map(c=>`<span class="tag ${['Web Development','UI/UX Design'].includes(c)?'active':''}" style="cursor:pointer" onclick="this.classList.toggle('active')">${c}</span>`).join('')}
        </div>
      </div>`;
    case 2: return `
      <h3 style="margin-bottom:8px" data-i18n="cv_upload_title">${i18n.t('cv_upload_title')}</h3>
      <p style="font-size:0.875rem;margin-bottom:20px" data-i18n="cv_upload_desc">${i18n.t('cv_upload_desc')}</p>
      <div class="upload-zone" onclick="triggerCVParse()" style="margin-bottom:0">
        <div class="upload-icon">📄</div>
        <div style="font-weight:600;margin-bottom:6px">Klik untuk upload CV</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">PDF · Max 10MB · <span style="color:var(--primary-light)">rizki-pratama-cv.pdf</span></div>
      </div>
      <div id="cvParseResult"></div>`;
    case 3: return `
      <h3 style="margin-bottom:8px" data-i18n="step_github">${i18n.t('step_github')}</h3>
      <p style="font-size:0.875rem;margin-bottom:20px">Portofolio GitHub dianalisis AI untuk meningkatkan Match Score kamu.</p>
      <div class="form-group" style="margin-bottom:16px">
        <label class="form-label" data-i18n="label_github_url">${i18n.t('label_github_url')}</label>
        <div style="display:flex;gap:10px">
          <input class="form-input" value="github.com/rizkipratama" style="flex:1">
          <button class="btn btn-outline" id="ghBtn" onclick="triggerGithub()" data-i18n="github_connect">${i18n.t('github_connect')}</button>
        </div>
      </div>
      <div id="ghResult"></div>`;
    case 4: return `
      <h3 style="margin-bottom:20px" data-i18n="step_preview">${i18n.t('step_preview')}</h3>
      <div style="display:flex;gap:20px;align-items:flex-start">
        ${UI.avatar('RP','xl')}
        <div style="flex:1">
          <div style="font-size:1.2rem;font-weight:700">${u.name}</div>
          <div style="color:var(--text-muted);font-size:0.875rem;margin:4px 0">${u.title}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
            <span class="badge badge-accent">✅ ${i18n.t('verified')}</span>
            <span class="badge badge-primary">⭐ 4.9</span>
            <span class="badge badge-neutral">${u.english}</span>
          </div>
        </div>
        ${UI.scoreRing(u.matchScore)}
      </div>
      <div class="divider" style="margin:20px 0"></div>
      <p style="font-size:0.875rem;line-height:1.7;color:var(--text-muted)">${u.bio}</p>
      <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:8px">
        ${u.skills.map(s=>`<span class="tag active">${s}</span>`).join('')}
      </div>
      <div style="margin-top:20px;display:flex;gap:20px;font-size:0.875rem">
        <div><span style="color:var(--text-muted)">🐱 GitHub:</span> <span style="color:var(--primary-light)">github.com/rizkipratama</span></div>
        <div><span style="color:var(--text-muted)">📍</span> ${u.location}</div>
        <div><span style="color:var(--text-muted)">💰</span> ${u.hourlyRate}/jam</div>
      </div>`;
    default: return '';
  }
}

window.addSkillTag = function(e) {
  if(e.key==='Enter' && e.target.value.trim()) {
    const container = document.getElementById('skillTags');
    const tag = document.createElement('span');
    tag.className = 'tag active';
    tag.innerHTML = `${e.target.value.trim()} <span style="cursor:pointer;margin-left:4px;opacity:0.6" onclick="this.parentElement.remove()">×</span>`;
    container.appendChild(tag);
    e.target.value = '';
  }
};
