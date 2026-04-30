import React, { useState } from 'react';
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
  
  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [accName, setAccName] = useState('');

  const hasBank = user?.bankAccount?.accountNumber;

  const handleSaveBank = async () => {
    if (!bankName || !accNumber || !accName) return toast('Lengkapi semua data bank!', 'error');
    try {
      await updateProfile({
        bankAccount: {
          bankName,
          accountNumber: accNumber,
          accountName: accName,
          updatedAt: new Date().toISOString()
        }
      });
      toast('Rekening bank berhasil disimpan!', 'success');
      setShowBankModal(false);
    } catch (e) {
      toast('Gagal menyimpan data bank.', 'error');
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
                onClick={() => hasBank ? setShowWithdrawModal(true) : setShowBankModal(true)}
              >
                {hasBank ? i18n.t('btn_withdraw') : 'Atur Rekening'}
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
                  {hasBank ? `${user.bankAccount.bankName} • ${user.bankAccount.accountNumber}` : 'Rekening bank belum diatur.'}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowBankModal(true)}>
                {hasBank ? 'Ubah' : 'Hubungkan Bank'}
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

      {/* Withdraw Modal Mock */}
      {showWithdrawModal && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{i18n.t('btn_withdraw')}</h3>
              <button className="btn-close" onClick={() => setShowWithdrawModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'rgba(0,212,170,0.08)', borderRadius: '10px', padding: '14px', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{i18n.t('balance_available')}</span>
                  <span style={{ float: 'right', fontWeight: 700, color: 'var(--accent)' }}>{u.balance?.available}</span>
                </div>
                <div className="form-group">
                  <label className="form-label">{i18n.t('withdraw_method')}</label>
                  <select className="form-select" value={user?.bankAccount?.bankName}>
                    <option>{user?.bankAccount?.bankName} - {user?.bankAccount?.accountNumber}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Jumlah Penarikan (IDR)</label>
                  <input className="form-input" type="number" defaultValue="4250000" />
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

      {/* Bank Setup Modal */}
      {showBankModal && (
        <div className="modal open">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Pengaturan Rekening Bank</h3>
              <button className="btn-close" onClick={() => setShowBankModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
