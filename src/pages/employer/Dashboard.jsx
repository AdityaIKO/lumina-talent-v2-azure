import React from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { statusBadgeHTML } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};

export default function Dashboard() {
  const nav = useAppNavigate();
  const u = DUMMY.user?.employer || {};

  const stats = [
    { icon: '👥', label: i18n.t('emp_stat_applicants'), val: u.stats?.applicants, change: '↑ 12 baru minggu ini', dir: 'up' },
    { icon: '🔒', label: i18n.t('emp_stat_escrow'), val: u.stats?.escrow, change: '2 proyek aktif', dir: '' },
    { icon: '📋', label: i18n.t('emp_stat_active_jobs'), val: u.stats?.activeJobs, change: '1 draft', dir: '' },
    { icon: '🔄', label: i18n.t('emp_stat_projects'), val: u.stats?.projects, change: '1 menunggu review', dir: '' },
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="employer" />
      <div className="dashboard-layout active">
        <Sidebar role="employer" activePath="/employer/beranda" />

        <main className="main-content">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2>{i18n.t('emp_dash_title')}</h2>
              <p style={{ marginTop: '4px', fontSize: '0.875rem' }}>{u.company} · 🇺🇸 {u.location}</p>
            </div>
            <button className="btn btn-primary" onClick={() => nav.toBuatLowongan()}>
              {i18n.t('btn_post_job')}
            </button>
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

          {/* Active Jobs Table */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>{i18n.t('active_jobs')}</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => nav.toBuatLowongan()}>
              {i18n.t('btn_post_job')}
            </button>
          </div>

          <div className="card-flat">
            <table className="table">
              <thead>
                <tr>
                  <th>Judul Lowongan</th>
                  <th>Status</th>
                  <th>Pelamar</th>
                  <th>Budget</th>
                  <th>Diposting</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(DUMMY.empJobs || []).map(j => (
                  <tr key={j.id}>
                    <td style={{ fontWeight: 600 }}>{j.title}</td>
                    <td dangerouslySetInnerHTML={{ __html: statusBadgeHTML(j.status) }}></td>
                    <td><span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{j.applicants}</span> pelamar</td>
                    <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{j.budget}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{j.posted}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-primary btn-sm" onClick={() => nav.toPelamar(j.id)}>
                          {i18n.t('btn_view_profile')}
                        </button>
                        <button className="btn btn-ghost btn-sm">{i18n.t('edit')}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Applicants Preview */}
          <h3 style={{ margin: '32px 0 16px' }}>{i18n.t('nav_applicants')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {(DUMMY.applicants || []).slice(0, 3).map(a => (
              <div key={a.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div className="avatar-placeholder avatar-sm">{a.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match: {a.match}%</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', marginBottom: '12px', height: '40px', overflow: 'hidden' }}>
                  {a.title} · {a.experience}
                </div>
                <button className="btn btn-outline btn-sm w-full" onClick={() => nav.toPelamar(a.id)}>
                  Review
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
