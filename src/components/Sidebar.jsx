import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_ITEMS = {
  freelancer: [
    { path: '/freelancer/beranda',     icon: '🏠', label: 'Beranda' },
    { path: '/freelancer/pekerjaan/1', icon: '🔍', label: 'Pekerjaan' },
    { path: '/freelancer/lamaran',     icon: '📋', label: 'Lamaran' },
    { path: '/freelancer/keuangan',    icon: '💰', label: 'Keuangan' },
    { path: '/freelancer/profil',      icon: '👤', label: 'Profil' },
  ],
  employer: [
    { path: '/employer/beranda',       icon: '📊', label: 'Dashboard' },
    { path: '/employer/buat-lowongan', icon: '➕', label: 'Buat Lowongan' },
    { path: '/employer/pelamar',       icon: '👥', label: 'Pelamar' },
    { path: '/employer/escrow',        icon: '🔒', label: 'Escrow' },
  ],
};

export default function Sidebar({ role, activePath }) {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const items = SIDEBAR_ITEMS[role] || [];
  
  // Use authenticated user or fallback to dummy (for preview)
  const user = authUser || {};
  
  // Perbaiki logika inisial agar lebih cerdas
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };
  
  const initials = getInitials(user.name);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div style={{ padding: '0 8px 16px' }}>
          <div className="avatar-placeholder avatar-md" style={{ background: 'var(--primary-gradient)' }}>
            {initials}
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {role === 'freelancer' 
                ? (user?.title || 'Professional Freelancer') 
                : (user?.company || 'Company Administrator')}
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        {items.map(item => (
          <button
            key={item.path}
            className={`sidebar-item ${activePath === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
      <div className="sidebar-divider" />
      <div className="sidebar-section">
        <button className="sidebar-item" style={{ color: 'var(--danger)' }}
          onClick={() => { logout(); navigate('/landing'); }}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
