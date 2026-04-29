// ── Landing Page ──────────────────────────────────────────────────
Pages.renderLanding = function() {
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar(null) + `
  <main style="padding-top:68px">
    <!-- Hero -->
    <section style="position:relative;min-height:90vh;display:flex;align-items:center;overflow:hidden">
      <div class="hero-bg">
        <div class="hero-blob hero-blob-1"></div>
        <div class="hero-blob hero-blob-2"></div>
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 70% 50%,rgba(108,99,255,0.08) 0%,transparent 70%)"></div>
      </div>
      <div class="container" style="position:relative;z-index:1;padding-top:60px;padding-bottom:60px">
        <div style="max-width:700px">
          <div class="badge badge-primary" style="margin-bottom:24px;font-size:0.9rem;padding:8px 16px">
            <span data-i18n="hero_badge">${i18n.t('hero_badge')}</span>
          </div>
          <h1 style="margin-bottom:24px;white-space:pre-line" data-i18n="hero_title">${i18n.t('hero_title')}</h1>
          <p style="font-size:1.15rem;max-width:560px;margin-bottom:40px;color:var(--text-muted)" data-i18n="hero_sub">${i18n.t('hero_sub')}</p>
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <button class="btn btn-primary btn-lg" onclick="Router.goTo('signup')" data-i18n="hero_cta_primary">${i18n.t('hero_cta_primary')}</button>
            <button class="btn btn-ghost btn-lg" onclick="Router.goTo('signup')" data-i18n="hero_cta_secondary">${i18n.t('hero_cta_secondary')}</button>
          </div>
          <div style="display:flex;gap:40px;margin-top:56px;flex-wrap:wrap">
            ${[['12.000+','hero_stat_1'],['850+','hero_stat_2'],['28.000+','hero_stat_3'],['Rp 4,2M','hero_stat_4']].map(([v,k])=>`
            <div>
              <div style="font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#6C63FF,#00D4AA);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${v}</div>
              <div style="font-size:0.82rem;color:var(--text-muted);margin-top:2px" data-i18n="${k}">${i18n.t(k)}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="section" style="background:var(--bg2)">
      <div class="container">
        <div style="text-align:center;max-width:560px;margin:0 auto 56px">
          <h2 data-i18n="features_title">${i18n.t('features_title')}</h2>
          <p style="margin-top:12px" data-i18n="features_sub">${i18n.t('features_sub')}</p>
        </div>
        <div class="grid-3">
          ${[
            ['🤖','feat_1_title','feat_1_desc','#6C63FF'],
            ['✍️','feat_2_title','feat_2_desc','#00D4AA'],
            ['📄','feat_3_title','feat_3_desc','#FF6B9D'],
            ['🔒','feat_4_title','feat_4_desc','#FFB347'],
            ['🪪','feat_5_title','feat_5_desc','#6C63FF'],
            ['🐱','feat_6_title','feat_6_desc','#00D4AA'],
          ].map(([icon,tk,dk,color])=>`
          <div class="card" style="transition:all 0.3s">
            <div style="width:52px;height:52px;border-radius:14px;background:${color}22;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:16px">${icon}</div>
            <h3 style="margin-bottom:8px" data-i18n="${tk}">${i18n.t(tk)}</h3>
            <p style="font-size:0.875rem" data-i18n="${dk}">${i18n.t(dk)}</p>
          </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how" class="section">
      <div class="container">
        <div style="text-align:center;max-width:500px;margin:0 auto 48px">
          <h2 data-i18n="how_title">${i18n.t('how_title')}</h2>
        </div>
        <div style="display:flex;gap:16px;justify-content:center;margin-bottom:40px">
          <button class="btn btn-primary" id="tabFree" onclick="switchHowTab('freelancer')" data-i18n="tab_freelancer">${i18n.t('tab_freelancer')}</button>
          <button class="btn btn-ghost" id="tabEmp" onclick="switchHowTab('employer')" data-i18n="tab_employer">${i18n.t('tab_employer')}</button>
        </div>
        <div id="howContent">
          ${renderHowSteps('freelancer')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section" style="background:linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,170,0.08));border-top:1px solid var(--border);border-bottom:1px solid var(--border)">
      <div class="container" style="text-align:center">
        <h2 data-i18n="cta_title">${i18n.t('cta_title')}</h2>
        <p style="margin:16px auto 32px;max-width:500px" data-i18n="cta_sub">${i18n.t('cta_sub')}</p>
        <button class="btn btn-primary btn-lg" onclick="Router.goTo('signup')" data-i18n="cta_btn">${i18n.t('cta_btn')}</button>
      </div>
    </section>

    <!-- Footer -->
    <footer style="background:var(--bg2);border-top:1px solid var(--border);padding:40px 0">
      <div class="container" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
        <div class="logo"><div class="logo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Lumina Talent</div>
        <div style="font-size:0.82rem;color:var(--text-muted)">© 2026 Lumina Talent. All rights reserved.</div>
      </div>
    </footer>
  </main>`;
  UI.bindLangSwitcher();
};

function renderHowSteps(role) {
  const steps = role === 'freelancer'
    ? [['how_free_1','📋'],['how_free_2','👤'],['how_free_3','🤖'],['how_free_4','💰']]
    : [['how_emp_1','🪪'],['how_emp_2','📝'],['how_emp_3','👥'],['how_emp_4','🔒']];
  return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px">
    ${steps.map(([k,icon],i)=>`
    <div style="text-align:center">
      <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-size:1.6rem;margin:0 auto 16px">${icon}</div>
      <div style="font-size:0.75rem;font-weight:700;color:var(--primary-light);margin-bottom:6px">STEP ${i+1}</div>
      <div style="font-size:0.9rem;font-weight:600" data-i18n="${k}">${i18n.t(k)}</div>
    </div>`).join('')}
  </div>`;
}

function switchHowTab(role) {
  document.getElementById('howContent').innerHTML = renderHowSteps(role);
  document.getElementById('tabFree').className = `btn ${role==='freelancer'?'btn-primary':'btn-ghost'}`;
  document.getElementById('tabEmp').className  = `btn ${role==='employer'?'btn-primary':'btn-ghost'}`;
  i18n.applyTranslations();
}

// ── Sign Up ────────────────────────────────────────────────────────
Pages.renderSignUp = function() {
  let selectedRole = 'freelancer';
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar(null) + `
  <div style="min-height:100vh;padding-top:68px;display:flex;align-items:center;justify-content:center;padding:100px 24px 60px">
    <div style="width:100%;max-width:520px">
      <div style="text-align:center;margin-bottom:32px">
        <h2 data-i18n="signup_title">${i18n.t('signup_title')}</h2>
        <p style="margin-top:8px" data-i18n="signup_sub">${i18n.t('signup_sub')}</p>
      </div>
      <!-- Role Selector -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:28px" id="rolePicker">
        <div class="card" id="roleFreelancer" style="cursor:pointer;border-color:var(--primary);background:rgba(108,99,255,0.08);text-align:center;padding:20px" onclick="selectRole('freelancer')">
          <div style="font-size:2rem;margin-bottom:8px">💻</div>
          <div style="font-weight:600;margin-bottom:4px" data-i18n="role_freelancer">${i18n.t('role_freelancer')}</div>
          <div style="font-size:0.78rem;color:var(--text-muted)" data-i18n="role_freelancer_desc">${i18n.t('role_freelancer_desc')}</div>
        </div>
        <div class="card" id="roleEmployer" style="cursor:pointer;text-align:center;padding:20px" onclick="selectRole('employer')">
          <div style="font-size:2rem;margin-bottom:8px">🏢</div>
          <div style="font-weight:600;margin-bottom:4px" data-i18n="role_employer">${i18n.t('role_employer')}</div>
          <div style="font-size:0.78rem;color:var(--text-muted)" data-i18n="role_employer_desc">${i18n.t('role_employer_desc')}</div>
        </div>
      </div>
      <!-- Form -->
      <div class="card-flat" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-group">
          <label class="form-label" data-i18n="label_fullname">${i18n.t('label_fullname')}</label>
          <input class="form-input" type="text" placeholder="Rizki Pratama">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="label_email">${i18n.t('label_email')}</label>
          <input class="form-input" type="email" placeholder="email@contoh.com">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="label_phone">${i18n.t('label_phone')}</label>
          <input class="form-input" type="tel" placeholder="+62 8xx xxxx xxxx">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="label_password">${i18n.t('label_password')}</label>
          <input class="form-input" type="password" placeholder="••••••••">
        </div>
        <div class="form-group">
          <label class="form-label" data-i18n="label_confirm_pass">${i18n.t('label_confirm_pass')}</label>
          <input class="form-input" type="password" placeholder="••••••••">
        </div>
        <button class="btn btn-primary w-full" style="margin-top:8px" onclick="doSignup()">
          <span data-i18n="btn_create_account">${i18n.t('btn_create_account')}</span>
        </button>
      </div>
      <div style="text-align:center;margin-top:20px;font-size:0.875rem;color:var(--text-muted)">
        <span data-i18n="have_account">${i18n.t('have_account')}</span>
        <a onclick="Router.goTo('signin')" style="cursor:pointer;margin-left:4px;color:var(--primary-light)" data-i18n="signin_link">${i18n.t('signin_link')}</a>
      </div>
    </div>
  </div>`;
  UI.bindLangSwitcher();

  window.selectRole = (role) => {
    selectedRole = role;
    ['freelancer','employer'].forEach(r => {
      const el = document.getElementById('role' + r.charAt(0).toUpperCase() + r.slice(1));
      el.style.borderColor = r === role ? 'var(--primary)' : 'var(--border)';
      el.style.background  = r === role ? 'rgba(108,99,255,0.08)' : 'var(--card)';
    });
  };

  window.doSignup = () => {
    localStorage.setItem('lumina_role', selectedRole);
    Router.currentRole = selectedRole;
    UI.toast(i18n.t('success'), 'success');
    setTimeout(() => Router.goTo('kyc'), 600);
  };
};

// ── Sign In ────────────────────────────────────────────────────────
Pages.renderSignIn = function() {
  const app = document.getElementById('app');
  app.innerHTML = UI.navbar(null) + `
  <div style="min-height:100vh;padding-top:68px;display:flex;align-items:center;justify-content:center;padding:100px 24px 60px">
    <div style="width:100%;max-width:420px">
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:2.5rem;margin-bottom:16px">✨</div>
        <h2 data-i18n="signin_title">${i18n.t('signin_title')}</h2>
        <p style="margin-top:8px" data-i18n="signin_sub">${i18n.t('signin_sub')}</p>
      </div>
      <!-- Quick Access Buttons -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px">
        <button class="btn btn-outline" onclick="quickLogin('freelancer')">🧑‍💻 Login as Freelancer</button>
        <button class="btn btn-outline" onclick="quickLogin('employer')">🏢 Login as Employer</button>
      </div>
      <div class="divider-text" style="margin-bottom:24px"><span data-i18n="or">${i18n.t('or')}</span></div>
      <div class="card-flat" style="display:flex;flex-direction:column;gap:16px">
        <div class="form-group">
          <label class="form-label" data-i18n="label_email">${i18n.t('label_email')}</label>
          <input class="form-input" type="email" placeholder="email@contoh.com" value="rizki@email.com">
        </div>
        <div class="form-group">
          <label class="form-label" style="display:flex;justify-content:space-between">
            <span data-i18n="label_password">${i18n.t('label_password')}</span>
            <a style="font-size:0.8rem;cursor:pointer;color:var(--primary-light)" data-i18n="forgot_pass">${i18n.t('forgot_pass')}</a>
          </label>
          <input class="form-input" type="password" placeholder="••••••••" value="••••••••">
        </div>
        <button class="btn btn-primary w-full" onclick="quickLogin('freelancer')">
          <span data-i18n="btn_signin">${i18n.t('btn_signin')}</span>
        </button>
      </div>
      <div style="text-align:center;margin-top:20px;font-size:0.875rem;color:var(--text-muted)">
        <span data-i18n="no_account">${i18n.t('no_account')}</span>
        <a onclick="Router.goTo('signup')" style="cursor:pointer;margin-left:4px;color:var(--primary-light)" data-i18n="signup_link">${i18n.t('signup_link')}</a>
      </div>
    </div>
  </div>`;
  UI.bindLangSwitcher();

  window.quickLogin = (role) => {
    localStorage.setItem('lumina_role', role);
    Router.currentRole = role;
    UI.toast(i18n.t('success'), 'success');
    setTimeout(() => Router.goTo(role === 'freelancer' ? 'freelancer-dashboard' : 'employer-dashboard'), 600);
  };
};
