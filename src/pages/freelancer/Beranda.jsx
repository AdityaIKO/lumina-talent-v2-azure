import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import JobCard from '../../components/JobCard';
import useAppNavigate from '../../hooks/useAppNavigate';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};

export default function Beranda() {
  const nav = useAppNavigate();
  const u = DUMMY.user?.freelancer || {};

  // Mock stats from original code
  const stats = [
    { icon: '🎯', label: i18n.t('dash_match_jobs'), val: u.stats?.matchJobs, change: '↑ 4 baru', dir: 'up' },
    { icon: '📤', label: i18n.t('dash_applications'), val: u.stats?.applications, change: '2 ditinjau', dir: 'up' },
    { icon: '🔄', label: i18n.t('dash_active_projects'), val: u.stats?.activeProjects, change: '1 deadline minggu ini', dir: '' },
    { icon: '💰', label: i18n.t('dash_earnings'), val: u.stats?.earnings, change: '↑ Rp 4,75M bulan ini', dir: 'up' },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="freelancer" />
      <div className="dashboard-layout active">
        <Sidebar role="freelancer" activePath="/freelancer/beranda" />
        
        <main className="main-content">
          <div className="page-header">
            <h2>
              <span>{i18n.t('dash_greeting')}</span>, {u.name?.split(' ')[0]} 👋
            </h2>
            <p style={{ marginTop: '4px', fontSize: '0.875rem' }}>Senin, 27 April 2026</p>
          </div>

          {/* Stats Grid */}
          <div className="grid-4" style={{ marginBottom: '32px' }}>
            {stats.map((s, i) => (
              <div key={i} className="card stat-card">
                <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-label">{s.label}</div>
                <div className={`stat-change ${s.dir}`}>{s.change}</div>
              </div>
            ))}
          </div>

          {/* Profile Completion */}
          <div className="card" style={{ 
            marginBottom: '32px', 
            background: 'linear-gradient(135deg,rgba(108,99,255,0.15),rgba(0,212,170,0.08))' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '6px' }}>
                  Profil {u.matchScore}% Lengkap
                </div>
                <div className="progress-bar" style={{ maxWidth: '400px' }}>
                  <div className="progress-fill" style={{ width: `${u.matchScore}%` }}></div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Tambahkan sertifikat untuk mencapai 100%
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => nav.toProfil()}>
                Lengkapi Profil →
              </button>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>{i18n.t('recommended_jobs')}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => nav.toJobDetail(1)}>
              {i18n.t('see_all')} →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(DUMMY.jobs || []).slice(0, 3).map(j => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
