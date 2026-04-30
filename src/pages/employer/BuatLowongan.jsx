import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { toast } from '../../components/uiHelpers';
import { useAuth } from '../../context/AuthContext';
import { createJob } from '../../services/database';

const i18n = window.i18n || { t: k => k };

export default function BuatLowongan() {
  const nav = useAppNavigate();
  const { user } = useAuth();
  const [publishing, setPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    skills: [],
    budgetType: 'fixed',
    budget: '',
    duration: '1-3 Bulan',
    location: 'Remote',
  });
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !formData.skills.includes(s)) {
      setFormData(f => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  };

  const handlePublish = async () => {
    if (!formData.title.trim()) return toast('Judul lowongan tidak boleh kosong.', 'error');
    if (!formData.desc.trim()) return toast('Deskripsi pekerjaan tidak boleh kosong.', 'error');
    if (!formData.budget.trim()) return toast('Budget harus diisi.', 'error');
    setPublishing(true);
    try {
      await createJob(formData, user);
      toast('Lowongan berhasil dipublikasikan!', 'success');
      setTimeout(() => nav.toEmployerHome(), 800);
    } catch (err) {
      console.error('[Job]', err);
      toast('Gagal mempublikasikan lowongan. Coba lagi.', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="employer" />
      <div className="dashboard-layout active">
        <Sidebar role="employer" activePath="/employer/buat-lowongan" />
        
        <main className="main-content">
          <div className="page-header">
            <h2>{i18n.t('post_job_title')}</h2>
          </div>
          
          <div style={{ maxWidth: '720px' }}>
            <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">{i18n.t('label_job_title')}</label>
                <input 
                  className="form-input" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{i18n.t('label_job_desc')}</label>
                <textarea 
                  className="form-textarea" 
                  style={{ minHeight: '160px' }}
                  value={formData.desc}
                  onChange={(e) => setFormData({...formData, desc: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{i18n.t('label_skills_req')}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="form-input"
                    placeholder="e.g. React.js, TypeScript — tekan Enter untuk tambah"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addSkill}>+ Tambah</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                  {formData.skills.map((s, i) => (
                    <span key={i} className="tag active" style={{ cursor: 'default' }}>
                      {s}
                      <span
                        style={{ cursor: 'pointer', marginLeft: '6px', opacity: 0.7 }}
                        onClick={() => removeSkill(s)}
                      >×</span>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{i18n.t('label_budget_type')}</label>
                  <select 
                    className="form-select"
                    value={formData.budgetType}
                    onChange={(e) => setFormData({...formData, budgetType: e.target.value})}
                  >
                    <option value="fixed">{i18n.t('budget_fixed')}</option>
                    <option value="hourly">{i18n.t('budget_hourly')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{i18n.t('label_budget_amount')}</label>
                  <input 
                    className="form-input" 
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{i18n.t('label_duration')}</label>
                  <select 
                    className="form-select"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option>&lt; 1 Minggu</option>
                    <option>1-2 Minggu</option>
                    <option>1-3 Bulan</option>
                    <option>3-6 Bulan</option>
                    <option>&gt; 6 Bulan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">{i18n.t('label_location')}</label>
                  <select 
                    className="form-select"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option>Remote</option>
                    <option>USA</option>
                    <option>Europe</option>
                    <option>Asia</option>
                    <option>Indonesia</option>
                  </select>
                </div>
              </div>

              <div style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontWeight: 600, marginBottom: '6px' }}>🤖 AI Prediction</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Berdasarkan deskripsi, estimasi pelamar berkualitas: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>15-25 orang</span> dalam 48 jam pertama.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button className="btn btn-primary flex-1" onClick={handlePublish} disabled={publishing}>
                  {publishing ? 'Mempublikasikan...' : i18n.t('btn_publish')}
                </button>
                <button className="btn btn-ghost flex-1" disabled={publishing}>{i18n.t('btn_save_draft')}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
