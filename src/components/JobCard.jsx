import React from 'react';
import useAppNavigate from '../hooks/useAppNavigate';
import { toast } from './uiHelpers';

const i18n = window.i18n || { t: k => k };
const UI = window.UI || { scoreRing: () => '' };

export default function JobCard({ job }) {
  const nav = useAppNavigate();

  const handleCardClick = () => {
    nav.toJobDetail(job.id);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    toast(i18n.t('save_job'));
  };

  const handleAnalyze = (e) => {
    e.stopPropagation();
    nav.toJobDetail(job.id);
  };

  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.1rem' }}>{job.flag}</span>
            <span className="badge badge-primary">{job.type}</span>
            {job.verified && <span className="badge badge-accent">✅ Verified</span>}
          </div>
          <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>{job.title}</h3>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {job.company} · {job.location}
          </div>
        </div>
        {/* Score Ring Bridge */}
        <div 
          dangerouslySetInnerHTML={{ __html: UI.scoreRing(job.match, 80) }} 
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {job.tags.slice(0, 4).map((t, idx) => (
          <span key={idx} className="tag">{t}</span>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{job.budget}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {job.duration} · {i18n.t('posted_ago')} {job.posted} {i18n.t('days_ago')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleSave}>
            {i18n.t('save_job')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleAnalyze}>
            {i18n.t('analyze_fit')}
          </button>
        </div>
      </div>
    </div>
  );
}
