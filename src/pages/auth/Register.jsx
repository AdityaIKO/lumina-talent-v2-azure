import { useState } from 'react';
import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };

export default function Register() {
  const [role, setRole] = useState('freelancer');
  const { login } = useAuth();
  const nav = useAppNavigate();

  function doSignup() {
    login(role);
    toast(i18n.t('success'), 'success');
    setTimeout(() => nav.toKYC(), 600);
  }

  return (
    <div style={{ minHeight:'100vh',paddingTop:68 }}>
      <Navbar role={null} />
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',padding:'100px 24px 60px' }}>
        <div style={{ width:'100%',maxWidth:520 }}>
          <div style={{ textAlign:'center',marginBottom:32 }}>
            <h2>{i18n.t('signup_title')}</h2>
            <p style={{ marginTop:8 }}>{i18n.t('signup_sub')}</p>
          </div>
          {/* Role Selector */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:28 }}>
            {['freelancer','employer'].map(r => (
              <div key={r} className="card" onClick={() => setRole(r)} style={{
                cursor:'pointer',textAlign:'center',padding:20,
                borderColor: role===r ? 'var(--primary)' : 'var(--border)',
                background: role===r ? 'rgba(108,99,255,0.08)' : 'var(--card)',
              }}>
                <div style={{ fontSize:'2rem',marginBottom:8 }}>{r==='freelancer'?'💻':'🏢'}</div>
                <div style={{ fontWeight:600,marginBottom:4 }}>{i18n.t(`role_${r}`)}</div>
                <div style={{ fontSize:'0.78rem',color:'var(--text-muted)' }}>{i18n.t(`role_${r}_desc`)}</div>
              </div>
            ))}
          </div>
          {/* Form */}
          <div className="card-flat" style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <div className="form-group"><label className="form-label">{i18n.t('label_fullname')}</label><input className="form-input" type="text" placeholder="Rizki Pratama" /></div>
            <div className="form-group"><label className="form-label">{i18n.t('label_email')}</label><input className="form-input" type="email" placeholder="email@contoh.com" /></div>
            <div className="form-group"><label className="form-label">{i18n.t('label_phone')}</label><input className="form-input" type="tel" placeholder="+62 8xx xxxx xxxx" /></div>
            <div className="form-group"><label className="form-label">{i18n.t('label_password')}</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">{i18n.t('label_confirm_pass')}</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <button className="btn btn-primary w-full" style={{ marginTop:8 }} onClick={doSignup}>{i18n.t('btn_create_account')}</button>
          </div>
          <div style={{ textAlign:'center',marginTop:20,fontSize:'0.875rem',color:'var(--text-muted)' }}>
            {i18n.t('have_account')}
            <span onClick={nav.toLogin} style={{ cursor:'pointer',marginLeft:4,color:'var(--primary-light)' }}>{i18n.t('signin_link')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
