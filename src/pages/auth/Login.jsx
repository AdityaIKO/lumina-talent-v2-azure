import { useState } from 'react';
import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/uiHelpers';
import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const i18n = window.i18n || { t: k => k };

export default function Login() {
  const { login } = useAuth();
  const nav = useAppNavigate();
  const [email, setEmail] = useState('rizki@email.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  // Cek apakah baru saja daftar dan butuh verifikasi
  const showVerifyBanner = nav.location.state?.info === 'VERIFY_EMAIL_SENT';

  async function handleLogin(e) {
    if (e) e.preventDefault();
    if (!email || !password) return alert('Silakan masukkan email dan password.');
    
    setLoading(true);
    try {
      // 1. Firebase Sign In
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Cek Verifikasi Email
      /*
      if (!user.emailVerified) {
        await signOut(auth); // Paksa logout jika belum verifikasi
        alert('Silakan verifikasi email Anda terlebih dahulu lewat link yang kami kirim ke kotak masuk.');
        setLoading(false);
        return;
      }
      */

      // 3. Ambil data profil & Sync (AuthContext handles this via login function)
      const profile = await login(email, password);
      
      // 4. Redirect berdasarkan Role
      toast(i18n.t('success'), 'success');
      if (profile.role === 'freelancer') {
        nav.toFreelancerHome();
      } else {
        nav.toEmployerHome();
      }

    } catch (error) {
      console.error('Login Error:', error);
      alert('Login Gagal: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  function quickLogin(role) {
    setEmail(role === 'freelancer' ? 'rizki@email.com' : 'employer@email.com');
    setPassword('password123');
    // We'll let the user click the button or just trigger it
    setTimeout(() => handleLogin(), 100);
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
          {/* Banner Verifikasi */}
          {showVerifyBanner && (
            <div style={{ 
              background: 'rgba(108,99,255,0.1)', 
              border: '1px solid var(--primary)', 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 24, 
              textAlign: 'center',
              color: 'var(--primary-light)',
              fontSize: '0.9rem'
            }}>
              <strong>📩 Registrasi Berhasil!</strong><br/>
              Kami telah mengirimkan link verifikasi ke email Anda. Silakan klik link tersebut sebelum melakukan login.
            </div>
          )}
          {/* Quick Access */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24 }}>
            <button className="btn btn-outline" onClick={() => quickLogin('freelancer')}>🧑‍💻 Login as Freelancer</button>
            <button className="btn btn-outline" onClick={() => quickLogin('employer')}>🏢 Login as Employer</button>
          </div>
          <div className="divider-text" style={{ marginBottom:24 }}><span>{i18n.t('or')}</span></div>
          {/* Form */}
          <div className="card-flat" style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <div className="form-group">
              <label className="form-label">{i18n.t('label_email')}</label>
              <input 
                className="form-input" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display:'flex',justifyContent:'space-between' }}>
                <span>{i18n.t('label_password')}</span>
                <a style={{ fontSize:'0.8rem',cursor:'pointer',color:'var(--primary-light)' }}>{i18n.t('forgot_pass')}</a>
              </label>
              <input 
                className="form-input" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button 
              className="btn btn-primary w-full" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? '...' : i18n.t('btn_signin')}
            </button>
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
