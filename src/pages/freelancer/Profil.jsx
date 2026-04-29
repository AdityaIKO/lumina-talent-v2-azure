import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };

export default function Profil() {
  const nav = useAppNavigate();
  const [step, setStep] = useState(0);
  const [loadingCV, setLoadingCV] = useState(false);
  const [cvResult, setCvResult] = useState(null);
  const [githubConnected, setGithubConnected] = useState(false);
  const [connectingGithub, setConnectingGithub] = useState(false);

  const steps = ['step_basic', 'step_skills', 'step_cv', 'step_github', 'step_preview'];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = () => {
    toast(i18n.t('success'), 'success');
    setTimeout(() => nav.toFreelancerHome(), 600);
  };

  const triggerCVParse = () => {
    setLoadingCV(true);
    // Simulate Azure Document Intelligence OCR
    setTimeout(() => {
      setLoadingCV(false);
      setCvResult({
        name: 'Rizki Pratama',
        skills: 'React, Node.js, Python',
        edu: 'S1 Informatika UI',
        exp: '4 tahun'
      });
    }, 2500);
  };

  const triggerGithub = () => {
    setConnectingGithub(true);
    setTimeout(() => {
      setConnectingGithub(false);
      setGithubConnected(true);
    }, 1800);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', paddingBottom: '60px' }}>
      <Navbar role="freelancer" />
      <div className="container" style={{ maxWidth: '700px', paddingTop: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2>{i18n.t('onboard_title')}</h2>
          <p style={{ marginTop: '8px' }}>{i18n.t('onboard_sub')}</p>
        </div>

        {/* Steps Progress Bar */}
        <div className="steps" style={{ marginBottom: '40px' }}>
          {steps.map((s, i) => (
            <div key={s} className={`step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              {i > 0 && <div className={`step-line ${i <= step ? 'done' : ''}`}></div>}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div className="step-dot">{i < step ? '✓' : i + 1}</div>
                <span className="step-name">{i18n.t(s)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card-flat">
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{i18n.t('label_fullname')}</label>
                <input className="form-input" defaultValue="Rizki Pratama" />
              </div>
              <div className="form-group">
                <label className="form-label">{i18n.t('label_bio')}</label>
                <textarea className="form-textarea" style={{ minHeight: '100px' }} defaultValue="Passionate developer..." />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-group">
              <label className="form-label">{i18n.t('label_skills')}</label>
              <input className="form-input" placeholder="e.g. React.js, Node.js" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {['React.js', 'Node.js', 'Azure', 'Python'].map(s => (
                  <span key={s} className="tag active">{s} <span style={{ opacity: 0.6 }}>×</span></span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="form-label mb-4">{i18n.t('cv_upload_title')}</label>
              <div className="upload-zone" onClick={triggerCVParse}>
                <div className="upload-icon">📄</div>
                <div style={{ fontWeight: 600 }}>{i18n.t('cv_upload_desc')}</div>
              </div>

              {loadingCV && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', fontSize: '0.85rem', marginTop: '12px' }}>
                  <div style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  <span>Azure Doc Intelligence mengekstrak CV...</span>
                </div>
              )}

              {cvResult && (
                <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
                  <div style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '8px' }}>✅ {i18n.t('cv_success')}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Nama:</span> {cvResult.name}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Skills:</span> {cvResult.skills}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Pendidikan:</span> {cvResult.edu}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Pengalaman:</span> {cvResult.exp}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <button 
                className={`btn btn-outline w-full ${connectingGithub ? 'loading' : ''}`}
                onClick={triggerGithub}
                disabled={githubConnected}
              >
                {githubConnected ? i18n.t('github_connected') : i18n.t('github_connect')}
              </button>

              {githubConnected && (
                <div style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: '12px', padding: '16px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🐱</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>rizkipratama</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>34 repos · 127 stars</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <h3>Siap dipublish!</h3>
              <p style={{ marginTop: '8px' }}>Semua informasi telah tersimpan dengan aman.</p>
            </div>
          )}
        </div>

        {/* Nav Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button className="btn btn-ghost" disabled={step === 0} onClick={handlePrev}>
            {i18n.t('btn_prev')}
          </button>
          {step < totalSteps - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              {i18n.t('btn_next')}
            </button>
          ) : (
            <button className="btn btn-accent" onClick={handleFinish}>
              {i18n.t('btn_finish')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
