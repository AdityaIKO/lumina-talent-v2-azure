import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import useAppNavigate from '../../hooks/useAppNavigate';
import useAzureAI from '../../hooks/useAzureAI';
import { scoreRingHTML, toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};

export default function DetailPekerjaan() {
  const { jobId } = useParams();
  const nav = useAppNavigate();
  const { loading, analysis, translation, runAnalysis, runTranslation } = useAzureAI();
  
  const job = (DUMMY.jobs || []).find(j => j.id === parseInt(jobId)) || DUMMY.jobs[0];
  const aiData = DUMMY.aiAnalysis || {};
  
  const [showProposal, setShowProposal] = useState(false);
  const [proposalText, setProposalText] = useState(aiData.proposalID || '');
  const [showEnglish, setShowEnglish] = useState(false);

  const handleStartAnalysis = () => {
    runAnalysis(job.desc, DUMMY.user.freelancer);
  };

  const handleTranslate = async () => {
    await runTranslation(proposalText);
    setShowEnglish(true);
  };

  const handleSendProposal = () => {
    toast(i18n.t('success'), 'success');
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="freelancer" />
      <div className="dashboard-layout active">
        <Sidebar role="freelancer" activePath="/freelancer/pekerjaan/1" />
        
        <main className="main-content">
          <div className="breadcrumb">
            <span onClick={nav.toFreelancerHome} style={{ cursor: 'pointer', color: 'var(--primary-light)' }}>
              {i18n.t('nav_jobs')}
            </span>
            <span>›</span>
            <span>{job.title}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
            {/* Left Column: Job Details */}
            <div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'linear-gradient(135deg,var(--primary),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    {job.flag}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{job.title}</h2>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                      {job.company} · {job.location}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-primary">{job.type}</span>
                      {job.verified && <span className="badge badge-accent">✅ Verified Client</span>}
                      <span className="badge badge-neutral">⭐ {job.rating} ({job.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Budget</div>
                    <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{job.budget}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Durasi</div>
                    <div style={{ fontWeight: 700 }}>{job.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Diposting</div>
                    <div style={{ fontWeight: 700 }}>{job.posted} hari lalu</div>
                  </div>
                </div>

                <h3 style={{ marginBottom: '10px' }}>Deskripsi</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>{job.desc}</p>
                
                <div className="divider" style={{ margin: '20px 0' }}></div>
                
                <h3 style={{ marginBottom: '10px' }}>{i18n.t('skills_needed')}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(job.tags || []).map((t, idx) => (
                    <span key={idx} className="tag active">{t}</span>
                  ))}
                </div>

                <div className="divider" style={{ margin: '20px 0' }}></div>
                
                <h3 style={{ marginBottom: '10px' }}>Deliverables</h3>
                <p style={{ fontSize: '0.9rem' }}>{job.deliverables}</p>
              </div>
            </div>

            {/* Right Column: AI Co-Pilot Panel */}
            <div style={{ position: 'sticky', top: '88px' }}>
              <div className="card" style={{ marginBottom: '16px', borderColor: 'rgba(108,99,255,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3>{i18n.t('ai_analysis_title')}</h3>
                  <div dangerouslySetInnerHTML={{ __html: scoreRingHTML(job.match, 90) }} />
                </div>

                <div id="aiPanel">
                  {!analysis ? (
                    <button 
                      className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} 
                      onClick={handleStartAnalysis}
                      disabled={loading}
                    >
                      {loading ? i18n.t('loading') : i18n.t('btn_analyze')}
                    </button>
                  ) : (
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '8px' }}>
                        {i18n.t('strengths')}
                      </div>
                      {(analysis.strengths || aiData.strengths).map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--accent)' }}>✓</span> {s}
                        </div>
                      ))}
                      
                      <div className="divider" style={{ margin: '12px 0' }}></div>
                      
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--warning)', marginBottom: '8px' }}>
                        {i18n.t('improvements')}
                      </div>
                      {(analysis.improvements || aiData.improvements).map((s, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--warning)' }}>!</span> {s}
                        </div>
                      ))}
                      
                      <div className="divider" style={{ margin: '12px 0' }}></div>
                      
                      <button className="btn btn-primary w-full" onClick={() => setShowProposal(true)}>
                        {i18n.t('btn_draft_proposal')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Proposal Drafter Card */}
              {showProposal && (
                <div className="card" style={{ marginBottom: '16px' }}>
                  <h3 style={{ marginBottom: '12px' }}>{i18n.t('proposal_draft_title')}</h3>
                  <textarea 
                    className="form-textarea" 
                    style={{ minHeight: '160px', fontSize: '0.82rem' }}
                    value={proposalText}
                    onChange={(e) => setProposalText(e.target.value)}
                  />
                  <button 
                    className={`btn btn-accent w-full ${loading ? 'loading' : ''}`}
                    style={{ marginTop: '12px' }}
                    onClick={handleTranslate}
                    disabled={loading}
                  >
                    {loading ? i18n.t('loading') : i18n.t('btn_translate')}
                  </button>

                  {showEnglish && (
                    <div style={{ marginTop: '16px' }}>
                      <h3 style={{ marginBottom: '10px' }}>{i18n.t('proposal_en_title')}</h3>
                      <textarea 
                        className="form-textarea" 
                        style={{ minHeight: '160px', fontSize: '0.82rem' }}
                        value={translation || aiData.proposalEN}
                        readOnly
                      />
                      <button className="btn btn-primary w-full" style={{ marginTop: '12px' }} onClick={handleSendProposal}>
                        {i18n.t('btn_send_proposal')}
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {!showProposal && (
                <button className="btn btn-primary w-full" onClick={handleSendProposal}>
                  {i18n.t('btn_apply')}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
