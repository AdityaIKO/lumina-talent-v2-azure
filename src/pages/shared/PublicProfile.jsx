import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import useAppNavigate from '../../hooks/useAppNavigate';

export default function PublicProfile() {
  const { userId } = useParams();
  const { user: authUser, role } = useAuth();
  const nav = useAppNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) {
          const res = await fetch(`${apiUrl}/users/${userId}`);
          const data = await res.json();
          if (data.user) {
            setProfileData(data.user);
          }
        }
      } catch (e) {
        console.warn('Could not fetch public profile:', e);
      } finally {
        setLoading(false);
      }
    };

    // If viewing own profile, use current user data
    if (userId === authUser?.uid) {
      setProfileData(authUser);
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [userId, authUser]);

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar role={role} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '68px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar role={role} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👤</div>
          <h2>Profil Tidak Ditemukan</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Profil freelancer ini tidak tersedia atau sudah dihapus.</p>
          <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => nav.toEmployerHome()}>Kembali ke Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '68px', paddingBottom: '60px' }}>
      <Navbar role={role} />
      <div className="container" style={{ maxWidth: '900px', paddingTop: '48px' }}>

        {/* Back button */}
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: '24px' }} onClick={() => window.history.back()}>
          ← Kembali
        </button>

        {/* Header Card */}
        <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,170,0.06))' }}>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div className="avatar-placeholder" style={{
              width: '80px', height: '80px', fontSize: '2rem', flexShrink: 0,
              background: 'var(--primary-gradient)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
            }}>
              {getInitials(profileData.name)}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{profileData.name}</h2>
              <p style={{ color: 'var(--primary-light)', fontWeight: 600, marginBottom: '12px' }}>
                {profileData.title || 'Professional Freelancer'}
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">✅ Verified Member</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  Profil {profileData.profileCompleted || 0}% Lengkap
                </span>
              </div>
            </div>
            {/* Contact button only visible to employers */}
            {role === 'employer' && (
              <button className="btn btn-primary">
                💬 Hubungi Freelancer
              </button>
            )}
          </div>
        </div>

        <div className="grid-2" style={{ gap: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Bio */}
            <div className="card">
              <h3 style={{ marginBottom: '12px' }}>Tentang Saya</h3>
              <p style={{ lineHeight: '1.7', color: profileData.bio ? 'inherit' : 'var(--text-muted)' }}>
                {profileData.bio || 'Freelancer ini belum menambahkan bio.'}
              </p>
            </div>

            {/* Skills */}
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Keahlian & Teknologi</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profileData.skills?.map(s => (
                  <span key={s} className="tag active">{s}</span>
                ))}
                {(!profileData.skills || profileData.skills.length === 0) && (
                  <p style={{ color: 'var(--text-muted)' }}>Belum ada keahlian yang dicantumkan.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stats */}
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Statistik</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '✅', label: 'Proyek Selesai', val: profileData.stats?.completedProjects || 0 },
                  { icon: '⭐', label: 'Rating', val: profileData.stats?.rating ? `${profileData.stats.rating}/5.0` : '-' },
                  { icon: '⏱️', label: 'Waktu Respons', val: '< 24 jam' },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{s.icon} {s.label}</span>
                    <span style={{ fontWeight: 600 }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Tautan Eksternal</h3>
              {profileData.githubUrl ? (
                <a
                  href={profileData.githubUrl.startsWith('http') ? profileData.githubUrl : `https://${profileData.githubUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-light)', textDecoration: 'none' }}
                >
                  <span>🐱</span> {profileData.githubUrl}
                </a>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>Tidak ada tautan yang dicantumkan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
