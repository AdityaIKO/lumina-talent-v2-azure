import useAppNavigate from '../../hooks/useAppNavigate';

export default function NotFound() {
  const nav = useAppNavigate();
  return (
    <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,textAlign:'center',padding:40 }}>
      <div style={{ fontSize:'5rem' }}>404</div>
      <h2>Halaman Tidak Ditemukan</h2>
      <p style={{ color:'var(--text-muted)',maxWidth:400 }}>Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <button className="btn btn-primary" onClick={nav.toLanding}>← Kembali ke Beranda</button>
    </div>
  );
}
