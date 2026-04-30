import React, { useState, useRef } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { statusBadgeHTML, toast, formatIDR } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };

const INDO_BANKS = [
  'BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB Niaga', 'Permata', 'Danamon', 'Bank Jago', 'GoPay', 'OVO'
];

export default function Keuangan() {
  const { user, updateProfile } = useAuth();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  // Bank form state
  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [accName, setAccName] = useState('');

  // KYC state
  const [kycStep, setKycStep] = useState(1); // 1: upload, 2: processing, 3: otp
  const [kycType, setKycType] = useState('id');
  const [ktpFileName, setKtpFileName] = useState('');
  const [kycOtp, setKycOtp] = useState(['', '', '', '', '', '']);
  const [pendingBankModal, setPendingBankModal] = useState(false);
  const fileRef = useRef(null);

  const hasBank = user?.bankAccount?.accountNumber;
  const isKycVerified = user?.kycVerified;

  // Opens KYC first if not verified, otherwise goes straight to bank modal
  const handleConnectRekening = () => {
    if (isKycVerified) {
      setShowBankModal(true);
    } else {
      setKycStep(1);
      setKtpFileName('');
      setKycOtp(['', '', '', '', '', '']);
      setPendingBankModal(true);
      setShowKycModal(true);
    }
  };

  const handleKycFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKtpFileName(file.name);
    setKycStep(2);
    // Simulate Azure Document Intelligence OCR processing
    setTimeout(() => {
      setKycStep(3);
      toast('OCR Berhasil! Data identitas Anda telah divalidasi oleh Azure AI.', 'success');
    }, 2500);
  };

  const updateKycOtpDigit = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...kycOtp];
    next[idx] = val.slice(-1);
    setKycOtp(next);
    if (val && idx < 5) document.getElementById(`kyc-otp-${idx + 1}`)?.focus();
  };

  const handleKycVerify = async () => {
    const code = kycOtp.join('');
    if (code.length < 6) return toast('Masukkan 6 digit kode OTP.', 'error');
    try {
      await updateProfile({ kycVerified: true, kycVerifiedAt: new Date().toISOString() });
      toast('Verifikasi identitas berhasil!', 'success');
      setShowKycModal(false);
      if (pendingBankModal) {
        setPendingBankModal(false);
        setShowBankModal(true);
      }
    } catch {
      toast('Gagal menyimpan status verifikasi.', 'error');
    }
  };

  const handleSaveBank = async () => {
    if (!bankName || !accNumber || !accName) return toast('Lengkapi semua data rekening!', 'error');
    try {
      await updateProfile({
        bankAccount: {
          bankName,
          accountNumber: accNumber,
          accountName: accName,
          updatedAt: new Date().toISOString()
        }
      });
      toast('Rekening berhasil dihubungkan!', 'success');
      setShowBankModal(false);
    } catch {
      toast('Gagal menyimpan data rekening.', 'error');
    }
  };

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role="freelancer" />
      <div className="dashboard-layout active">
        <Sidebar role="freelancer" activePath="/freelancer/keuangan" />

        <main className="main-content">
          <div className="page-header">
            <h2>{i18n.t('finance_title')}</h2>
          </div>

          {/* Balance Cards */}
          <div className="grid-3" style={{ marginBottom: '32px' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg,rgba(0,212,170,0.15),rgba(0,212,170,0.05))', borderColor: 'rgba(0,212,170,0.3)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{i18n.t('balance_available')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{formatIDR(user?.balance?.available || 0)}</div>
              <button
                className="btn btn-accent btn-sm"
                style={{ marginTop: '12px' }}
                onClick={() => hasBank ? setShowWithdrawModal(true) : handleConnectRekening()}
              >
                {hasBank ? i18n.t('btn_withdraw') : 'Atur Dana Anda'}
              </button>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{i18n.t('balance_pending')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>{formatIDR(user?.balance?.pending || 0)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Proyek dalam pengerjaan</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{i18n.t('total_earned')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{formatIDR(user?.balance?.total || 0)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Total pendapatan bersih</div>
            </div>
          </div>

          {/* Bank Account Section */}
          <div className="card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ marginBottom: '4px' }}>Metode Penarikan</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {hasBank
                    ? `${user.bankAccount.bankName} • ${user.bankAccount.accountNumber}`
                    : 'Rekening bank belum diatur.'}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => hasBank ? setShowBankModal(true) : handleConnectRekening()}>
                {hasBank ? 'Ubah' : 'Hubungkan Rekening'}
              </button>
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>{i18n.t('report_tagihan')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              {[
                { key: 'income', val: 'Rp 19.000.000', color: '#00D4AA' },
                { key: 'processing_fee', val: 'Rp 950.000', color: '#FF5E7D' },
                { key: 'net_income', val: 'Rp 18.050.000', color: '#6C63FF' }
              ].map(item => (
                <div key={item.key}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{i18n.t(item.key)}</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Table */}
          <h3 style={{ marginBottom: '16px' }}>{i18n.t('transaction_history')}</h3>
          <div className="card-flat">
            <table className="table">
              <thead>
                <tr>
                  <th>Deskripsi</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(!user?.transactions || user.transactions.length === 0) ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      Belum ada riwayat transaksi.
                    </td>
                  </tr>
                ) : (
                  user.transactions.map(t => (
                    <tr key={t.id}>
                      <td>{t.desc}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{t.date}</td>
                      <td style={{ fontWeight: 700, color: t.amount.startsWith('+') ? 'var(--accent)' : 'var(--danger)' }}>
                        {t.amount}
                      </td>
                      <td><div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(t.status) }} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <h3>{i18n.t('btn_withdraw')}</h3>
              <button className="modal-close" onClick={() => setShowWithdrawModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(0,212,170,0.08)', borderRadius: '10px', padding: '14px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{i18n.t('balance_available')}</span>
                  <span style={{ float: 'right', fontWeight: 700, color: 'var(--accent)' }}>{formatIDR(user?.balance?.available || 0)}</span>
                </div>
                <div className="form-group">
                  <label className="form-label">{i18n.t('withdraw_method')}</label>
                  <select className="form-select" defaultValue={user?.bankAccount?.bankName}>
                    <option>{user?.bankAccount?.bankName} - {user?.bankAccount?.accountNumber}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah Penarikan (IDR)</label>
                  <input className="form-input" type="number" defaultValue="0" min="0" max={user?.balance?.available || 0} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowWithdrawModal(false)}>{i18n.t('cancel')}</button>
              <button className="btn btn-accent" onClick={() => { setShowWithdrawModal(false); toast(i18n.t('success'), 'success'); }}>
                {i18n.t('btn_withdraw')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Verification Modal */}
      {showKycModal && (
        <div className="modal-overlay open">
          <div className="modal" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Verifikasi Identitas (KYC)</h3>
              <button className="modal-close" onClick={() => setShowKycModal(false)}>×</button>
            </div>
            <div className="modal-body">

              {/* Step indicator */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
                {['Unggah Dokumen', 'Proses OCR', 'Verifikasi OTP'].map((label, idx) => {
                  const stepNum = idx + 1;
                  const active = kycStep === stepNum;
                  const done = kycStep > stepNum;
                  return (
                    <React.Fragment key={label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%', fontSize: '0.75rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: done ? 'var(--accent)' : active ? 'var(--primary)' : 'var(--border)',
                          color: (done || active) ? '#fff' : 'var(--text-muted)',
                          flexShrink: 0
                        }}>
                          {done ? '✓' : stepNum}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: active ? 'var(--text)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</span>
                      </div>
                      {idx < 2 && <div style={{ flex: 0, width: 24, height: 1, background: 'var(--border)' }} />}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Country type toggle — shown on step 1 only */}
              {kycStep === 1 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    {[
                      { type: 'id', flag: '🇮🇩', label: 'Indonesia (KTP)' },
                      { type: 'intl', flag: '🌐', label: 'Internasional (Passport)' }
                    ].map(opt => (
                      <div
                        key={opt.type}
                        className="card"
                        style={{
                          cursor: 'pointer', textAlign: 'center', padding: '16px',
                          borderColor: kycType === opt.type ? 'var(--primary)' : 'var(--border)',
                          background: kycType === opt.type ? 'rgba(108,99,255,0.08)' : 'var(--card)'
                        }}
                        onClick={() => setKycType(opt.type)}
                      >
                        <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{opt.flag}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{opt.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="form-label">{kycType === 'id' ? 'Upload Foto KTP' : 'Upload Passport'}</label>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleKycFileSelect} />
                    <div className="upload-zone" onClick={() => fileRef.current?.click()} style={{ cursor: 'pointer' }}>
                      <div className="upload-icon">📁</div>
                      <div style={{ fontWeight: 600, marginBottom: '6px' }}>{ktpFileName || 'Klik untuk Pilih File'}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Format: PNG, JPG atau PDF · Maks. 5MB</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                    🔒 Data identitas Anda diproses secara aman menggunakan Azure AI dan tidak disimpan secara permanen.
                  </p>
                </>
              )}

              {/* Step 2: OCR Processing */}
              {kycStep === 2 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{
                    width: '44px', height: '44px', border: '3px solid var(--primary)',
                    borderTopColor: 'transparent', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite', margin: '0 auto 20px'
                  }} />
                  <h4>Memproses Dokumen...</h4>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '0.875rem' }}>
                    Azure AI sedang menganalisis dan memvalidasi dokumen Anda.
                  </p>
                </div>
              )}

              {/* Step 3: OTP Verification */}
              {kycStep === 3 && (
                <>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📱</div>
                    <h4>Verifikasi OTP</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      Kode OTP 6 digit telah dikirimkan ke nomor HP yang terdaftar pada identitas Anda.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '16px 0 24px' }}>
                    {kycOtp.map((digit, i) => (
                      <input
                        key={i}
                        id={`kyc-otp-${i}`}
                        className="form-input"
                        style={{ width: '44px', textAlign: 'center', fontSize: '1.2rem', padding: '8px 0' }}
                        maxLength="1"
                        value={digit}
                        onChange={(e) => updateKycOtpDigit(i, e.target.value)}
                      />
                    ))}
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleKycVerify}>
                    Verifikasi &amp; Lanjutkan
                  </button>
                  <button className="btn btn-ghost w-full" style={{ marginTop: '8px' }}>
                    Kirim Ulang OTP
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bank / Rekening Setup Modal */}
      {showBankModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <h3>{hasBank ? 'Ubah Rekening' : 'Hubungkan Rekening'}</h3>
              <button className="modal-close" onClick={() => setShowBankModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isKycVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,212,170,0.08)', borderRadius: '8px', padding: '10px 14px', fontSize: '0.82rem', color: 'var(--accent)' }}>
                    ✓ Identitas Anda telah terverifikasi
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Nama Bank</label>
                  <select className="form-select" value={bankName} onChange={(e) => setBankName(e.target.value)}>
                    <option value="">Pilih Bank</option>
                    {INDO_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor Rekening</label>
                  <input className="form-input" placeholder="Masukkan nomor rekening" value={accNumber} onChange={(e) => setAccNumber(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Pemilik Rekening</label>
                  <input className="form-input" placeholder="Nama sesuai buku tabungan" value={accName} onChange={(e) => setAccName(e.target.value)} />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  * Pastikan nama pemilik rekening sama dengan nama pada profil Anda untuk kelancaran verifikasi penarikan.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowBankModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSaveBank}>Simpan Rekening</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

