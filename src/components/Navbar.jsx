import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAppNavigate from '../hooks/useAppNavigate';
import { bindLangSwitcher } from './uiHelpers';

const DUMMY = window.DUMMY || {};

export default function Navbar({ role = null }) {
  const { logout } = useAuth();
  const nav = useAppNavigate();

  useEffect(() => { bindLangSwitcher(); });

  const isFreelancer = role === 'freelancer';
  const isEmployer   = role === 'employer';
  const user = role === 'freelancer' ? DUMMY.user?.freelancer : DUMMY.user?.employer;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="logo" onClick={nav.toLanding} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
                stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          Lumina Talent
        </div>

        {role ? (
          <div className="nav-links">
            {isFreelancer && <>
              <span className="nav-link" onClick={nav.toFreelancerHome} style={{ cursor: 'pointer' }}>Beranda</span>
              <span className="nav-link" onClick={() => nav.toJobDetail(1)} style={{ cursor: 'pointer' }}>Pekerjaan</span>
              <span className="nav-link" onClick={nav.toLamaran} style={{ cursor: 'pointer' }}>Lamaran</span>
              <span className="nav-link" onClick={nav.toKeuangan} style={{ cursor: 'pointer' }}>Keuangan</span>
            </>}
            {isEmployer && <>
              <span className="nav-link" onClick={nav.toEmployerHome} style={{ cursor: 'pointer' }}>Dashboard</span>
              <span className="nav-link" onClick={nav.toBuatLowongan} style={{ cursor: 'pointer' }}>Buat Lowongan</span>
              <span className="nav-link" onClick={() => nav.toPelamar()} style={{ cursor: 'pointer' }}>Pelamar</span>
              <span className="nav-link" onClick={() => nav.toEscrow()} style={{ cursor: 'pointer' }}>Escrow</span>
            </>}
          </div>
        ) : (
          <div className="nav-links">
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#how">How It Works</a>
          </div>
        )}

        <div className="nav-actions">
          <div className="lang-switcher">
            <button className="lang-btn" data-lang="id">🇮🇩 ID</button>
            <button className="lang-btn" data-lang="en">🇬🇧 EN</button>
          </div>
          {role ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
              onClick={() => { logout(); nav.toLanding(); }}>
              <div className={`avatar-placeholder avatar-sm`}>{user?.initials || '?'}</div>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user?.name?.split(' ')[0]}</span>
            </div>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={nav.toLogin}>Sign In</button>
              <button className="btn btn-primary btn-sm" onClick={nav.toRegister}>Daftar</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
