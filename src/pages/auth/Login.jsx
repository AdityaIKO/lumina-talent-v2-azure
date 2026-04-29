import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };

export default function Login() {
  const { login } = useAuth();
  const nav = useAppNavigate();

  function quickLogin(role) {
    login(role);
    toast(i18n.t('success'), 'success');
    setTimeout(() => role === 'freelancer' ? nav.toFreelancerHome() : nav.toEmployerHome(), 600);
  }

  return (
    <div style={{ minHeight:'100vh',paddingTop:68 }}>
      <Navbar role={null} />
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',padding:'100px 24px 60px' }}>
        <div style={{ width:'100%',maxWidth:420 }}>
          <div style={{ textAlign:'center',marginBottom:32 }}>
            <div style={{ fontSize:'2.5rem',marginBottom:16 }}>✨</div>
            <h2>{i18n.t('signin_title')}</h2>
            <p style={{ marginTop:8 }}>{i18n.t('signin_sub')}</p>
          </div>
          {/* Quick Access */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24 }}>
            <button className="btn btn-outline" onClick={() => quickLogin('freelancer')}>🧑‍💻 Login as Freelancer</button>
            <button className="btn btn-outline" onClick={() => quickLogin('employer')}>🏢 Login as Employer</button>
          </div>
          <div className="divider-text" style={{ marginBottom:24 }}><span>{i18n.t('or')}</span></div>
          {/* Form */}
          <div className="card-flat" style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <div className="form-group"><label className="form-label">{i18n.t('label_email')}</label><input className="form-input" type="email" defaultValue="rizki@email.com" /></div>
            <div className="form-group">
              <label className="form-label" style={{ display:'flex',justifyContent:'space-between' }}>
                <span>{i18n.t('label_password')}</span>
                <a style={{ fontSize:'0.8rem',cursor:'pointer',color:'var(--primary-light)' }}>{i18n.t('forgot_pass')}</a>
              </label>
              <input className="form-input" type="password" defaultValue="••••••••" />
            </div>
            <button className="btn btn-primary w-full" onClick={() => quickLogin('freelancer')}>{i18n.t('btn_signin')}</button>
          </div>
          <div style={{ textAlign:'center',marginTop:20,fontSize:'0.875rem',color:'var(--text-muted)' }}>
            {i18n.t('no_account')}
            <span onClick={nav.toRegister} style={{ cursor:'pointer',marginLeft:4,color:'var(--primary-light)' }}>{i18n.t('signup_link')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
