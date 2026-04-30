import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { toast, avatarHTML, statusBadgeHTML } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};
const EscrowManager = window.EscrowManager || { confirmCompletion: async () => {}, raiseDispute: async () => {} };
const AzureAPI = window.AzureAPI || { submitRating: async () => {} };

export default function Escrow() {
  const [projects, setProjects] = useState(DUMMY.escrowProjects || []);
  const [modalType, setModalType] = useState(null); // 'revision', 'dispute'
  const [selectedProject, setSelectedProject] = useState(null);
  const [ratings, setRatings] = useState({});

  const handleConfirmCompletion = async (projectId) => {
    await EscrowManager.confirmCompletion(projectId, 'employer-1');
    toast('✅ Proyek selesai dikonfirmasi! Dana escrow sedang dicairkan ke freelancer.', 'success');
    // Update local state for demo
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: 'completed' } : p));
  };

  const handleRaiseDispute = async (projectId) => {
    await EscrowManager.raiseDispute(projectId, 'employer', 'Issue with deliverable', 'N/A');
    toast('⚖️ Sengketa berhasil diajukan. Tim mediator akan menghubungi Anda dalam 1×24 jam.', 'error');
    setModalType(null);
  };

  const setRating = (projectId, score) => {
    setRatings({ ...ratings, [projectId]: score });
  };

  const handleSubmitRating = async (projectId) => {
    const score = ratings[projectId];
    if (!score) {
      toast('Pilih rating bintang terlebih dahulu.', 'error');
      return;
    }
    await AzureAPI.submitRating(projectId, 'employer-1', 'employer', 'freelancer-1', score, 'Good work');
    toast(`⭐ Rating ${score}/5 berhasil dikirim. Terima kasih!`, 'success');
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="employer" />
      <div className="dashboard-layout active">
        <Sidebar role="employer" activePath="/employer/escrow" />
        
        <main className="main-content">
          <div className="page-header">
            <h2>{i18n.t('emp_stat_escrow')}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {projects.map(ep => (
              <div key={ep.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div dangerouslySetInnerHTML={{ __html: avatarHTML(ep.initials, 'sm') }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{ep.job}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{ep.freelancer} · Budget: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{ep.budget}</span></div>
                    </div>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(ep.status) }} />
                </div>

                <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem' }}>
                    {['Deposit', 'In Progress', 'Submitted', 'Approved', 'Released'].map((stage, i) => {
                      const stageMap = { in_progress: 1, submitted: 2, completed: 4 };
                      const cur = stageMap[ep.status] ?? 1;
                      const isActive = i <= cur;
                      return (
                        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ 
                            width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 4px', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, 
                            background: isActive ? 'linear-gradient(135deg,var(--accent),var(--primary))' : 'rgba(255,255,255,0.08)',
                            color: isActive ? '#fff' : 'var(--text-dim)' 
                          }}>{isActive ? '✓' : i + 1}</div>
                          <div style={{ color: isActive ? 'var(--text)' : 'var(--text-dim)' }}>{stage}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span>{i18n.t('project_progress')}</span><span>{ep.progress}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${ep.progress}%` }}></div></div>
                </div>

                {ep.status === 'submitted' && (
                  <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>📁 {i18n.t('work_submitted')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem' }}>
                      <span style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>📦 {ep.deliverable}</span>
                      <button className="btn btn-ghost btn-sm">⬇ Download</button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ep.status === 'in_progress' ? (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedProject(ep); setModalType('revision'); }}>✏️ Minta Revisi</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { setSelectedProject(ep); setModalType('dispute'); }}>⚖️ Ajukan Sengketa</button>
                    </>
                  ) : ep.status === 'submitted' ? (
                    <>
                      <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', width: '100%', marginBottom: '8px' }}>
                        ⏰ <strong>Window Konfirmasi:</strong> Jika tidak ada respons dalam 72 jam, proyek akan otomatis selesai dan dana dicairkan.
                      </div>
                      <button className="btn btn-accent btn-sm" onClick={() => handleConfirmCompletion(ep.id)}>✅ Konfirmasi Selesai & Cairkan Dana</button>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelectedProject(ep); setModalType('revision'); }}>✏️ Minta Revisi</button>
                      <button className="btn btn-danger btn-sm" onClick={() => { setSelectedProject(ep); setModalType('dispute'); }}>⚖️ Ajukan Sengketa</button>
                    </>
                  ) : null}
                </div>

                {ep.status === 'completed' && (
                  <div style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.2)', borderRadius: '10px', padding: '14px', marginTop: '12px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '8px' }}>⭐ Beri Rating Pengalaman Anda</div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span 
                          key={s} 
                          style={{ fontSize: '1.5rem', cursor: 'pointer' }}
                          onClick={() => setRating(ep.id, s)}
                        >
                          {ratings[ep.id] >= s ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                    <textarea className="form-textarea" placeholder="Tulis ulasan singkat..." style={{ minHeight: '80px' }} />
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '10px' }} onClick={() => handleSubmitRating(ep.id)}>Kirim Rating</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Revision Modal */}
      {selectedProject && modalType === 'revision' && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>✏️ Minta Revisi</h3>
              <button className="btn-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Catatan Revisi</label>
                <textarea className="form-textarea" placeholder="Jelaskan revisi yang dibutuhkan..." />
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Revisi ke-{selectedProject.revisions + 1} dari {selectedProject.maxRevisions}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalType(null)}>Batal</button>
              <button className="btn btn-warning" onClick={() => { toast('Permintaan revisi terkirim', 'success'); setModalType(null); }}>Kirim Revisi</button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {selectedProject && modalType === 'dispute' && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚖️ Ajukan Sengketa</h3>
              <button className="btn-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'rgba(255,94,125,0.08)', border: '1px solid rgba(255,94,125,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '0.875rem' }}>
                Mediator admin akan ditugaskan. Keputusan dalam <strong>5 hari kerja</strong>. Dana ditahan hingga sengketa diselesaikan.
              </div>
              <div className="form-group">
                <label className="form-label">Alasan Sengketa</label>
                <textarea className="form-textarea" placeholder="Jelaskan masalah secara detail..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalType(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleRaiseDispute(selectedProject.id)}>Ajukan Sengketa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
