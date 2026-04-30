import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import useAppNavigate from '../../hooks/useAppNavigate';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };

export default function KYC() {
  const nav = useAppNavigate();
  const { role, verify } = useAuth();
  const [kycType, setKycType] = useState('id'); // 'id' or 'intl'
  const [step, setStep] = useState(1); // 1: upload, 2: processing, 3: otp
  const [ktpFileName, setKtpFileName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const fileRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setKtpFileName(file.name);
      setStep(2);
      // Simulate Azure Document Intelligence OCR
      setTimeout(() => {
        setStep(3);
        toast('OCR Berhasil! Data KTP Anda telah divalidasi oleh Azure AI.', 'success');
      }, 2000);
    }
  };

  const updateOtpDigit = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    // Auto focus next
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next?.focus();
    }
  };

  const handleVerifyOTP = () => {
    verify();
    toast(i18n.t('kyc_success'), 'success');
    setTimeout(() => {
      role === 'employer' ? nav.toEmployerHome() : nav.toFreelancerHome();
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px' }}>
      <Navbar role={null} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🪪</div>
            <h2>{i18n.t('kyc_title')}</h2>
            <p style={{ marginTop: '8px' }}>{i18n.t('kyc_sub')}</p>
          </div>

          {/* Country Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
            <div 
              className="card" 
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center', 
                padding: '20px',
                borderColor: kycType === 'id' ? 'var(--primary)' : 'var(--border)',
                background: kycType === 'id' ? 'rgba(108,99,255,0.08)' : 'var(--card)'
              }}
              onClick={() => setKycType('id')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🇮🇩</div>
              <div style={{ fontWeight: 600 }}>{i18n.t('kyc_indonesia')}</div>
            </div>
            <div 
              className="card" 
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center', 
                padding: '20px',
                borderColor: kycType === 'intl' ? 'var(--primary)' : 'var(--border)',
                background: kycType === 'intl' ? 'rgba(108,99,255,0.08)' : 'var(--card)'
              }}
              onClick={() => setKycType('intl')}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌐</div>
              <div style={{ fontWeight: 600 }}>{i18n.t('kyc_international')}</div>
            </div>
          </div>

          <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {step === 1 && (
              <>
                <div>
                  <h3>{kycType === 'id' ? i18n.t('kyc_id_title') : i18n.t('kyc_int_title')}</h3>
                  <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                    {kycType === 'id' ? i18n.t('kyc_id_sub') : i18n.t('kyc_int_sub')}
                  </p>
                </div>
                
                <div className="form-group">
                  <label className="form-label">{kycType === 'id' ? i18n.t('upload_ktp') : 'Upload Passport'}</label>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleFileSelect} />
                  <div className="upload-zone" onClick={() => fileRef.current.click()}>
                    <div className="upload-icon">📁</div>
                    <div style={{ fontWeight: 600, marginBottom: '6px' }}>{ktpFileName || 'Klik untuk Pilih File KTP'}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Format: PNG, JPG atau PDF · Max 5MB</div>
                  </div>
                </div>

                {kycType === 'id' && (
                  <div className="form-group">
                    <label className="form-label">{i18n.t('upload_nib')}</label>
                    <div className="upload-zone">
                      <div className="upload-icon">📄</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Opsional untuk verifikasi bisnis</div>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ 
                  width: '40px', height: '40px', border: '3px solid var(--primary)', 
                  borderTopColor: 'transparent', borderRadius: '50%', 
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' 
                }}></div>
                <h3>{i18n.t('ocr_processing')}</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Azure AI sedang menganalisis dokumen Anda...</p>
              </div>
            )}

            {step === 3 && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <h3>{i18n.t('kyc_otp_title')}</h3>
                  <p style={{ marginTop: '8px' }}>{i18n.t('kyc_otp_sub')}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
                  {otp.map((digit, i) => (
                    <input 
                      key={i} 
                      id={`otp-${i}`}
                      className="form-input" 
                      style={{ width: '45px', textAlign: 'center', fontSize: '1.2rem' }} 
                      maxLength="1" 
                      value={digit}
                      onChange={(e) => updateOtpDigit(i, e.target.value)}
                    />
                  ))}
                </div>
                <button className="btn btn-primary w-full" onClick={handleVerifyOTP}>
                  {i18n.t('btn_verify_otp')}
                </button>
                <button className="btn btn-ghost w-full" style={{ marginTop: '8px' }}>{i18n.t('btn_send_otp')}</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
