import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { toast } from '../../components/uiHelpers';
import { useAuth } from '../../context/AuthContext';

const i18n = window.i18n || { t: k => k };

function normalizeExternalUrl(url) {
  const trimmed = (url || '').trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function Profil() {
  const nav = useAppNavigate();
  const { user, updateProfile } = useAuth();
  
  const profileComplete = user?.profileCompleted >= 100;
  const [isEditing, setIsEditing] = useState(!profileComplete);
  const [step, setStep] = useState(0);
  const [loadingCV, setLoadingCV] = useState(false);
  const [cvResult, setCvResult] = useState(null);
  const [cvFileName, setCvFileName] = useState(user?.cvFileName || '');
  const fileInputRef = useRef(null);

  // Form State
  const [fullName, setFullName] = useState(user?.name || user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [aiSummary, setAiSummary] = useState(user?.aiSummary || '');

  const steps = ['step_basic', 'step_skills', 'step_cv', 'step_github', 'step_preview'];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = async () => {
    try {
      const normalizedGithubUrl = normalizeExternalUrl(githubUrl);
      const updatedData = {
        name: fullName,
        bio: bio,
        skills: skills,
        githubUrl: normalizedGithubUrl,
        aiSummary: aiSummary,
        cvFileName: cvFileName,
        profileCompleted: 100,
        updatedAt: new Date().toISOString()
      };
      
      await updateProfile(updatedData);
      setGithubUrl(normalizedGithubUrl);
      toast('Profil Berhasil Disimpan!', 'success');
      setIsEditing(false);
      nav.toFreelancerHome();
    } catch (error) {
      console.error('Update Profile Error:', error);
      toast('Gagal menyimpan profil', 'error');
    }
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (s) => {
    setSkills(skills.filter(item => item !== s));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast('Hanya file PDF atau DOC yang diizinkan.', 'error');
      return;
    }
    setCvFileName(file.name);
    setLoadingCV(true);
    
    // Placeholder for future CV analysis. Do not mutate user-entered skills.
    setTimeout(() => {
      setLoadingCV(false);
      setCvResult(true);
      toast(`CV "${file.name}" berhasil diunggah.`, 'success');
    }, 1800);
  };

  // --- RENDER VIEW MODE (If Profile is Complete) ---
  if (!isEditing) {
    return (
      <div style={{ paddingTop: 68 }}>
        <Navbar role="freelancer" />
        <div className="dashboard-layout active">
          <Sidebar role="freelancer" activePath="/freelancer/profil" />
          <main className="main-content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Profil Profesional Anda</h2>
                <p style={{ marginTop: '4px', fontSize: '0.875rem' }}>Dilihat oleh klien dan sistem AI Matchmaking</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setIsEditing(true)}>Edit Profil</button>
            </div>

            <div className="grid-2" style={{ gap: '24px', marginTop: '24px' }}>
              <div className="card">
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <div className="avatar-placeholder avatar-lg" style={{ background: 'var(--primary-gradient)' }}>
                    {(user?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.5rem' }}>{user?.name}</h3>
                    <p style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{user?.title || 'Professional Freelancer'}</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <span className="badge badge-accent">✅ Verified Member</span>
                      <span className="badge" style={{ background: 'rgba(255,255,255,0.05)' }}>ID: {user?.uid?.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>Tentang Saya</h4>
                  <p style={{ lineHeight: '1.6' }}>{user?.bio || 'Belum ada bio.'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card">
                  <h4 style={{ marginBottom: '16px' }}>Keahlian & Teknologi</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {user?.skills?.map(s => <span key={s} className="tag active">{s}</span>)}
                    {(!user?.skills || user?.skills.length === 0) && <p style={{ color: 'var(--text-muted)' }}>Belum ada keahlian.</p>}
                  </div>
                </div>
                
                <div className="card">
                  <h4 style={{ marginBottom: '16px' }}>Dokumen & Tautan</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>📄</span>
                      <div style={{ fontSize: '0.9rem' }}>
                        <div style={{ fontWeight: 600 }}>{user?.cvFileName || 'CV belum diunggah'}</div>
                        {user?.cvFileName && <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Terverifikasi AI</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.2rem' }}>🐱</span>
                      {user?.githubUrl ? (
                        <a
                          href={normalizeExternalUrl(user.githubUrl)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'var(--primary-light)', textDecoration: 'none', fontSize: '0.9rem' }}
                        >
                          {user.githubUrl}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>GitHub belum terhubung</span>
                      )}
                    </div>
                  </div>
                </div>

                {user?.aiSummary && (
                  <div className="card" style={{ border: '1px solid var(--accent)', background: 'rgba(0,212,170,0.03)' }}>
                    <h4 style={{ marginBottom: '8px', color: 'var(--accent)' }}>🤖 AI Match Insights</h4>
                    <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{user.aiSummary}"</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --- RENDER EDIT MODE (Wizard) ---
  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', paddingBottom: '60px' }}>
      <Navbar role="freelancer" />
      <div className="container" style={{ maxWidth: '700px', paddingTop: '48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2>{i18n.t('onboard_title')}</h2>
          <p style={{ marginTop: '8px' }}>Lengkapi data di bawah untuk meningkatkan skor AI Match Anda.</p>
        </div>

        {/* Steps Progress Bar */}
        <div className="steps" style={{ marginBottom: '40px' }}>
          {steps.map((s, i) => (
            <div key={s} className={`step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              {i > 0 && <div className={`step-line ${i <= step ? 'done' : ''}`}></div>}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div className="step-dot">{i < step ? '✓' : i + 1}</div>
                <span className="step-name" style={{ fontSize: '0.75rem' }}>{i18n.t(s)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card-flat">
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio Singkat</label>
                <textarea className="form-textarea" style={{ minHeight: '120px' }} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan keahlian dan pengalaman Anda..." />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-group">
              <label className="form-label">Keahlian (Skills)</label>
              <input className="form-input" placeholder="Ketik keahlian (misal: React) lalu tekan Enter" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                {skills.map(s => (
                  <span key={s} className="tag active" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {s} <span style={{ cursor: 'pointer' }} onClick={() => removeSkill(s)}>×</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center' }}>
              <label className="form-label mb-4">Unggah CV / Resume (PDF / DOC)</label>
              {/* Hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                style={{ borderStyle: 'dashed', padding: '40px', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '2.5rem' }}>{cvFileName ? '✅' : '📄'}</div>
                <div style={{ fontWeight: 600, marginTop: '12px' }}>
                  {cvFileName ? cvFileName : 'Klik untuk Pilih File CV'}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {cvFileName
                    ? 'Klik untuk mengganti file CV.'
                    : 'Format: PDF atau DOC · Maks. 5MB.'}
                </p>
              </div>
              {loadingCV && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginTop: '16px', color: 'var(--primary-light)' }}>
                  <div style={{ width: '14px', height: '14px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  <span>Mengunggah CV Anda...</span>
                </div>
              )}
              {cvResult && !loadingCV && (
                <div style={{ marginTop: '16px', color: 'var(--accent)', fontWeight: 600 }}>✅ CV berhasil diunggah.</div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="form-group">
              <label className="form-label">Tautan Profil GitHub</label>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Masukkan URL profil GitHub Anda (misal: github.com/username) agar AI bisa menganalisis repositori Anda.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ background: 'var(--card)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>https://</div>
                <input 
                  className="form-input" 
                  placeholder="github.com/username" 
                  value={githubUrl} 
                  onChange={(e) => setGithubUrl(e.target.value)} 
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>Ringkasan Profil</h3>
              <div className="grid-1" style={{ gap: '12px' }}>
                <div className="card-flat" style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>NAMA LENGKAP</div>
                  <div style={{ fontWeight: 500 }}>{fullName}</div>
                </div>
                <div className="card-flat" style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>BIO</div>
                  <div style={{ fontSize: '0.9rem' }}>{bio || '-'}</div>
                </div>
                <div className="card-flat" style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>KEAHLIAN</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {skills.map(s => <span key={s} className="tag">{s}</span>)}
                    {skills.length === 0 && '-'}
                  </div>
                </div>
                <div className="card-flat" style={{ background: 'rgba(255,255,255,0.03)', textAlign: 'left' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>GITHUB</div>
                  <div style={{ fontSize: '0.9rem' }}>{githubUrl || 'Tidak disertakan'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Nav Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
          <button className="btn btn-ghost" disabled={step === 0} onClick={handlePrev}>
            Kembali
          </button>
          {step < totalSteps - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Lanjut
            </button>
          ) : (
            <button className="btn btn-accent" onClick={handleFinish}>
              Selesai & Simpan Profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
