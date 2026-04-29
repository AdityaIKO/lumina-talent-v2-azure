import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { statusBadgeHTML, toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};

export default function StatusLamaran() {
  const [activeTab, setActiveTab] = useState('applications');
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="freelancer" />
      <div className="dashboard-layout active">
        <Sidebar role="freelancer" activePath="/freelancer/lamaran" />
        
        <main className="main-content">
          <div className="page-header">
            <h2>{i18n.t('status_title')}</h2>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
            {[
              { key: 'applications', label: 'tab_applications' },
              { key: 'contracts', label: 'tab_contracts' },
              { key: 'history', label: 'tab_history' }
            ].map(tab => (
              <button 
                key={tab.key}
                className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                onClick={() => setActiveTab(tab.key)}
              >
                {i18n.t(tab.label)}
              </button>
            ))}
          </div>

          <div id="statusContent">
            {activeTab === 'applications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(DUMMY.applications || []).map(a => (
                  <div key={a.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{a.job}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{a.company} · {a.date}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--accent)', marginTop: '4px', fontWeight: 600 }}>{a.budget}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(a.status) }} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Match {a.match}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contracts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(DUMMY.contracts || []).map(c => (
                  <div key={c.id} className="card" style={{ borderColor: c.status === 'revision' ? 'rgba(255,179,71,0.4)' : '' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{c.job}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{c.company} · Deadline: {c.deadline}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 700, marginTop: '4px' }}>{c.budget}</div>
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(c.status) }} />
                    </div>
                    
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        <span>{i18n.t('project_progress')}</span><span>{c.progress}%</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.progress}%` }}></div></div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {c.milestones.map((m, i) => (
                        <span key={i} className={`badge ${i < Math.ceil(c.progress / 25) ? 'badge-accent' : 'badge-neutral'}`}>
                          {i < Math.ceil(c.progress / 25) ? '✓ ' : ''} {m}
                        </span>
                      ))}
                    </div>

                    {c.status === 'revision' && (
                      <div style={{ background: 'rgba(255,179,71,0.08)', border: '1px solid rgba(255,179,71,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--warning)', marginBottom: '6px', fontSize: '0.875rem' }}>
                          ✏️ {i18n.t('revision_from_client')}
                        </div>
                        <p style={{ fontSize: '0.82rem' }}>{c.revisionNote}</p>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                          Revisi ke-{c.revisions} dari {c.maxRevisions}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
                        {i18n.t('btn_submit_work')}
                      </button>
                      {c.revisions >= c.maxRevisions - 1 && (
                        <button className="btn btn-danger btn-sm" onClick={() => toast('Sengketa diajukan', 'success')}>
                          {i18n.t('btn_open_dispute')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {(DUMMY.workHistory || []).map(w => (
                  <div key={w.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{w.job}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{w.company} · Selesai: {w.completedDate}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--accent)', fontWeight: 700, marginTop: '4px' }}>{w.budget}</div>
                        <div style={{ fontSize: '0.82rem', marginTop: '8px', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{w.review}"</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(w.status) }} />
                        <div style={{ fontSize: '1rem', marginTop: '8px' }}>
                          {'⭐'.repeat(w.rating)}{'☆'.repeat(5 - w.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Submit Work Modal Mock */}
      {showModal && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{i18n.t('btn_submit_work')}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="upload-zone">
                  <div className="upload-icon">📁</div>
                  <div style={{ fontWeight: 600 }}>Upload File Hasil Kerja</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>ZIP, PDF, atau link · Max 50MB</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Catatan untuk Klien</label>
                  <textarea className="form-textarea" placeholder="Jelaskan apa yang sudah dikerjakan..." defaultValue="Pekerjaan telah selesai sesuai dengan spesifikasi yang diminta. Semua endpoint telah ditest dan dokumentasi API sudah tersedia." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>{i18n.t('cancel')}</button>
              <button className="btn btn-primary" onClick={() => { setShowModal(false); toast(i18n.t('success'), 'success'); }}>
                {i18n.t('submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
