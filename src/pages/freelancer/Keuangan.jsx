import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { statusBadgeHTML, toast } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};

export default function Keuangan() {
  const u = DUMMY.user?.freelancer || {};
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

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
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent)' }}>{u.balance?.available}</div>
              <button className="btn btn-accent btn-sm" style={{ marginTop: '12px' }} onClick={() => setShowWithdrawModal(true)}>
                {i18n.t('btn_withdraw')}
              </button>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{i18n.t('balance_pending')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)' }}>{u.balance?.pending}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Dari 2 proyek aktif</div>
            </div>
            <div className="card">
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{i18n.t('total_earned')}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{u.balance?.total}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>↑ Rp 4,75M bulan ini</div>
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
                {(DUMMY.transactions || []).map(t => (
                  <tr key={t.id}>
                    <td>{t.desc}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{t.date}</td>
                    <td style={{ fontWeight: 700, color: t.amount.startsWith('+') ? 'var(--accent)' : 'var(--danger)' }}>
                      {t.amount}
                    </td>
                    <td><div dangerouslySetInnerHTML={{ __html: statusBadgeHTML(t.status) }} /></td>
                  </tr>
                ))}
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
                  <select className="form-select">
                    <option>BCA - 1234****</option>
                    <option>Mandiri - 5678****</option>
                    <option>GoPay</option>
                    <option>OVO</option>
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
    </div>
  );
}
