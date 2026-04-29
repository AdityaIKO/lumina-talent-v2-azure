import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { scoreRingHTML, statusBadgeHTML, toast, avatarHTML } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};
const AzureAPI = window.AzureAPI || {};

export default function Pelamar() {
  const { jobId } = useParams();
  const nav = useAppNavigate();
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [modalType, setModalType] = useState(null); // 'proposal', 'reject', 'counter'
  
  const job = (DUMMY.empJobs || []).find(j => j.id === parseInt(jobId)) || DUMMY.empJobs[0];

  useEffect(() => {
    const loadSorted = async () => {
      setLoading(true);
      // Simulate Smart Sorting
      const sorted = await AzureAPI.smartSortApplicants(DUMMY.applicants, job);
      setApplicants(sorted);
      setLoading(false);
    };
    loadSorted();
  }, [jobId, job]);

  const handleHire = (id) => {
    toast('✅ Proposal diterima! Chat dengan freelancer aktif.', 'success');
    setModalType(null);
    setTimeout(() => nav.toEscrow(), 800);
  };

  const handleReject = async (id) => {
    toast('❌ Proposal ditolak. Notifikasi terkirim ke freelancer.', 'error');
    setModalType(null);
  };

  const handleCounter = async (id) => {
    toast('🔄 Counter-offer terkirim! Menunggu respons freelancer.', 'success');
    setModalType(null);
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="employer" />
      <div className="dashboard-layout active">
        <Sidebar role="employer" activePath="/employer/pelamar" />
        
        <main className="main-content">
          <div className="page-header">
            <div className="breadcrumb">
              <span onClick={nav.toEmployerHome} style={{ cursor: 'pointer', color: 'var(--primary-light)' }}>
                {i18n.t('nav_dashboard')}
              </span>
              <span>›</span>
              <span>{job.title}</span>
            </div>
            <h2>{i18n.t('applicants_title')}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <span className="badge badge-primary">🤖 {i18n.t('ai_sorted')}</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{applicants.length} pelamar</span>
            </div>
          </div>

          <div id="applicantsList" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <div style={{ width: '24px', height: '24px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
                Azure OpenAI sedang menyortir pelamar...
              </div>
            ) : (
              applicants.map((a, idx) => (
                <div key={a.id} className="card" style={{ borderColor: a.status === 'hired' ? 'rgba(0,212,170,0.4)' : '' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>#{idx + 1}</span>
                      <div dangerouslySetInnerHTML={{ __html: scoreRingHTML(a.match, 80) }} />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <div dangerouslySetInnerHTML={{ __html: avatarHTML(a.initials, 'md') }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{a.name}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{a.title} · {a.experience}</div>
                        </div>
                        {a.verified && <span className="badge badge-accent">✅ Verified</span>}
                        <div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(a.status) }} />
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {a.skills.map((s, i) => (
                          <span key={i} className="tag">{s}</span>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', marginBottom: '12px' }}>
                        <span>💰 {a.rate}</span>
                        <span>⭐ {a.rating} ({a.reviews} reviews)</span>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', fontSize: '0.82rem', color: 'var(--text-muted)', border: '1px solid var(--border)', marginBottom: '12px', lineHeight: 1.6 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>📝 {i18n.t('applicant_proposal')}</div>
                        {a.proposal.substring(0, 200)}...
                        <span style={{ color: 'var(--primary-light)', cursor: 'pointer' }} onClick={() => { setSelectedApplicant(a); setModalType('proposal'); }}> Lihat selengkapnya</span>
                      </div>

                      {a.status !== 'hired' ? (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => handleHire(a.id)}>✅ Accept</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedApplicant(a); setModalType('proposal'); }}>👁 Lihat Proposal</button>
                          <button className="btn btn-outline btn-sm" onClick={() => { setSelectedApplicant(a); setModalType('counter'); }}>🔄 Counter-Offer</button>
                          <button className="btn btn-danger btn-sm" onClick={() => { setSelectedApplicant(a); setModalType('reject'); }}>❌ Reject</button>
                        </div>
                      ) : (
                        <div className="badge badge-accent" style={{ fontSize: '0.875rem' }}>✅ Sudah Dipekerjakan</div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Modals Mapping */}
      {selectedApplicant && modalType === 'proposal' && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedApplicant.name} — Proposal</h3>
              <button className="btn-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body" style={{ fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {selectedApplicant.proposal}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalType(null)}>Tutup</button>
              <button className="btn btn-primary" onClick={() => handleHire(selectedApplicant.id)}>✅ Accept</button>
            </div>
          </div>
        </div>
      )}

      {selectedApplicant && modalType === 'reject' && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>❌ Tolak Proposal — {selectedApplicant.name}</h3>
              <button className="btn-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Alasan Penolakan (template)</label>
                <select className="form-select">
                  <option value="budget">Budget tidak sesuai</option>
                  <option value="skills">Skill tidak cocok dengan kebutuhan</option>
                  <option value="experience">Pengalaman kurang</option>
                  <option value="filled">Posisi sudah terisi</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Feedback (opsional)</label>
                <textarea className="form-textarea" placeholder="Berikan masukan untuk freelancer ini..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalType(null)}>Batal</button>
              <button className="btn btn-danger" onClick={() => handleReject(selectedApplicant.id)}>Tolak</button>
            </div>
          </div>
        </div>
      )}

      {selectedApplicant && modalType === 'counter' && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>🔄 Kirim Counter-Offer — {selectedApplicant.name}</h3>
              <button className="btn-close" onClick={() => setModalType(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Tawarkan Budget Baru ($)</label>
                <input className="form-input" type="text" placeholder="e.g. $1,800" />
              </div>
              <div className="form-group">
                <label className="form-label">Timeline Baru</label>
                <input className="form-input" type="text" placeholder="e.g. 2 Minggu" />
              </div>
              <div className="form-group">
                <label className="form-label">Pesan Pendukung</label>
                <textarea className="form-textarea" placeholder="Jelaskan alasan counter-offer Anda..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setModalType(null)}>Batal</button>
              <button className="btn btn-accent" onClick={() => handleCounter(selectedApplicant.id)}>Kirim Counter-Offer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
