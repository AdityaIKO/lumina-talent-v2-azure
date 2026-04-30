import { useState } from 'react';
import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };

export default function Register() {
  const [role, setRole] = useState('freelancer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const nav = useAppNavigate();

  async function doSignup(e) {
    if (e) e.preventDefault();
    if (!name || !email || !password) return toast('Harap isi semua field', 'error');
    
    setLoading(true);
    try {
      await signup({ name, email, password, role });
      // Beri notifikasi sukses dan arahkan ke login dengan membawa state info
      toast('Registrasi Berhasil! Silakan cek email Anda.', 'success');
      setTimeout(() => nav.toLogin({ info: 'VERIFY_EMAIL_SENT' }), 1000);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
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
            <div className="form-group">
              <label className="form-label">{i18n.t('label_fullname')}</label>
              <input className="form-input" type="text" placeholder="Rizki Pratama" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{i18n.t('label_email')}</label>
              <input className="form-input" type="email" placeholder="email@contoh.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">{i18n.t('label_password')}</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary w-full" style={{ marginTop:8 }} onClick={doSignup} disabled={loading}>
              {loading ? '...' : i18n.t('btn_create_account')}
            </button>
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
