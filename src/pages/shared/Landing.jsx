import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';

const i18n = window.i18n || { t: k => k };

function renderHowSteps(role) {
  const steps = role === 'freelancer'
    ? [['how_free_1','📋'],['how_free_2','👤'],['how_free_3','🤖'],['how_free_4','💰']]
    : [['how_emp_1','🪪'],['how_emp_2','📝'],['how_emp_3','👥'],['how_emp_4','🔒']];
  return steps.map(([k, icon], i) => (
    <div key={k} style={{ textAlign: 'center' }}>
      <div style={{ width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,var(--primary),var(--accent))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',margin:'0 auto 16px' }}>{icon}</div>
      <div style={{ fontSize:'0.75rem',fontWeight:700,color:'var(--primary-light)',marginBottom:6 }}>STEP {i+1}</div>
      <div style={{ fontSize:'0.9rem',fontWeight:600 }}>{i18n.t(k)}</div>
    </div>
  ));
}

const FEATURES = [
  ['🤖','feat_1_title','feat_1_desc','#6C63FF'],
  ['✍️','feat_2_title','feat_2_desc','#00D4AA'],
  ['📄','feat_3_title','feat_3_desc','#FF6B9D'],
  ['🔒','feat_4_title','feat_4_desc','#FFB347'],
  ['🪪','feat_5_title','feat_5_desc','#6C63FF'],
  ['🐱','feat_6_title','feat_6_desc','#00D4AA'],
];

const STATS = [['12.000+','hero_stat_1'],['850+','hero_stat_2'],['28.000+','hero_stat_3'],['Rp 4,2M','hero_stat_4']];

export default function Landing() {
  const nav = useAppNavigate();
  const [howTab, setHowTab] = useState('freelancer');

  useEffect(() => { window.UI?.bindLangSwitcher?.(); });

  return (
    <main style={{ paddingTop: 68 }}>
      <Navbar role={null} />
      {/* Hero */}
      <section style={{ position:'relative',minHeight:'90vh',display:'flex',alignItems:'center',overflow:'hidden' }}>
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 70% 50%,rgba(108,99,255,0.08) 0%,transparent 70%)' }} />
        </div>
        <div className="container" style={{ position:'relative',zIndex:1,paddingTop:60,paddingBottom:60 }}>
          <div style={{ maxWidth:700 }}>
            <div className="badge badge-primary" style={{ marginBottom:24,fontSize:'0.9rem',padding:'8px 16px' }}>
              {i18n.t('hero_badge')}
            </div>
            <h1 style={{ marginBottom:24,whiteSpace:'pre-line' }}>{i18n.t('hero_title')}</h1>
            <p style={{ fontSize:'1.15rem',maxWidth:560,marginBottom:40,color:'var(--text-muted)' }}>{i18n.t('hero_sub')}</p>
            <div style={{ display:'flex',gap:16,flexWrap:'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={nav.toRegister}>{i18n.t('hero_cta_primary')}</button>
              <button className="btn btn-ghost btn-lg" onClick={nav.toRegister}>{i18n.t('hero_cta_secondary')}</button>
            </div>
            <div style={{ display:'flex',gap:40,marginTop:56,flexWrap:'wrap' }}>
              {STATS.map(([v,k]) => (
                <div key={k}>
                  <div style={{ fontSize:'1.8rem',fontWeight:800,background:'linear-gradient(135deg,#6C63FF,#00D4AA)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{v}</div>
                  <div style={{ fontSize:'0.82rem',color:'var(--text-muted)',marginTop:2 }}>{i18n.t(k)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section" style={{ background:'var(--bg2)' }}>
        <div className="container">
          <div style={{ textAlign:'center',maxWidth:560,margin:'0 auto 56px' }}>
            <h2>{i18n.t('features_title')}</h2>
            <p style={{ marginTop:12 }}>{i18n.t('features_sub')}</p>
          </div>
          <div className="grid-3">
            {FEATURES.map(([icon,tk,dk,color]) => (
              <div key={tk} className="card" style={{ transition:'all 0.3s' }}>
                <div style={{ width:52,height:52,borderRadius:14,background:`${color}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',marginBottom:16 }}>{icon}</div>
                <h3 style={{ marginBottom:8 }}>{i18n.t(tk)}</h3>
                <p style={{ fontSize:'0.875rem' }}>{i18n.t(dk)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="section">
        <div className="container">
          <div style={{ textAlign:'center',maxWidth:500,margin:'0 auto 48px' }}>
            <h2>{i18n.t('how_title')}</h2>
          </div>
          <div style={{ display:'flex',gap:16,justifyContent:'center',marginBottom:40 }}>
            <button className={`btn ${howTab==='freelancer'?'btn-primary':'btn-ghost'}`} onClick={() => setHowTab('freelancer')}>{i18n.t('tab_freelancer')}</button>
            <button className={`btn ${howTab==='employer'?'btn-primary':'btn-ghost'}`} onClick={() => setHowTab('employer')}>{i18n.t('tab_employer')}</button>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24 }}>
            {renderHowSteps(howTab)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background:'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,170,0.08))',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <h2>{i18n.t('cta_title')}</h2>
          <p style={{ margin:'16px auto 32px',maxWidth:500 }}>{i18n.t('cta_sub')}</p>
          <button className="btn btn-primary btn-lg" onClick={nav.toRegister}>{i18n.t('cta_btn')}</button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'var(--bg2)',borderTop:'1px solid var(--border)',padding:'40px 0' }}>
        <div className="container" style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
          <div className="logo">
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Lumina Talent
          </div>
          <div style={{ fontSize:'0.82rem',color:'var(--text-muted)' }}>© 2026 Lumina Talent. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
