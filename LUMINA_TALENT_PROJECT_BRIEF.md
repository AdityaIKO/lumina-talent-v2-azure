# Lumina Talent — Project Brief untuk Developer

> Dokumen ini dibuat sebagai panduan bagi developer (Antigravity) untuk memahami konteks, tujuan, dan struktur project Lumina Talent sebelum memulai eksekusi.

> **Tentang Nama:** *Lumina* berarti cahaya/pencerahan — merepresentasikan misi platform untuk menyoroti talenta tersembunyi Indonesia agar terlihat dan diakui oleh klien global.

---

## 1. Gambaran Umum Project

**Lumina Talent** adalah sebuah platform talent marketplace yang menghubungkan **freelancer digital Indonesia** dengan **klien global**, dilengkapi sistem pembayaran lintas negara (cross-border payment).

Platform ini dibangun untuk menyelesaikan tiga hambatan utama yang dihadapi talenta lokal:
- Kendala bahasa dalam menulis proposal profesional berbahasa Inggris
- Kurangnya kepercayaan diri bersaing di pasar global (imposter syndrome)
- Tidak adanya sistem escrow lintas negara yang mudah diakses

**Analogi singkat:** Lumina Talent adalah Upwork versi Indonesia-first, dengan AI yang secara aktif membantu freelancer lokal mengatasi hambatan bahasa dan kepercayaan diri.

---

## 2. Target Pengguna

| Tipe Pengguna | Deskripsi |
|---|---|
| **Freelancer Lokal** | Talenta digital Indonesia yang ingin mengekspor jasa ke pasar global |
| **Employer Lokal** | Pelaku UMKM atau perusahaan Indonesia yang mencari freelancer lokal |
| **Employer Internasional** | Klien global yang mencari talenta digital dari Indonesia |

---

## 3. Fitur Utama Platform

### 3.1 AI Match Score & Matchmaking
- AI menganalisis portofolio freelancer dan mencocokkannya dengan kebutuhan lowongan
- Menghasilkan **Match Score (%)** sebagai indikator kecocokan
- Employer menerima daftar pelamar yang sudah diurutkan berdasarkan skor tertinggi (AI Smart Sorting)
- Teknologi: Azure OpenAI (GPT-4o) dengan metode RAG

### 3.2 Cross-Lingual Proposal Drafter
- Freelancer menulis draf proposal dalam **Bahasa Indonesia**
- AI menerjemahkan secara otomatis ke **Bahasa Inggris bisnis profesional**
- Alur: Tulis (ID) → Edit → Setujui → Terjemahkan (EN) → Kirim
- Teknologi: Azure OpenAI Service

### 3.3 Dynamic KYC (Know Your Customer)
- Verifikasi identitas yang berbeda berdasarkan lokasi klien:
  - **Indonesia:** OCR otomatis dokumen KTP/NIB via Azure AI Document Intelligence
  - **Internasional:** Financial KYC terintegrasi dengan Stripe API
- Verifikasi kontak via OTP (SMS/WhatsApp Gateway)

### 3.4 CV Auto-Fill (Smart Resume Parser)
- Freelancer upload CV dalam format **PDF**
- Azure AI Document Intelligence mengekstrak teks dari PDF
- Azure OpenAI mem-parsing data terstruktur secara otomatis
- Data yang diekstrak langsung mengisi form profil:
  - Nama lengkap
  - Summary / deskripsi diri
  - Skills & keahlian
  - Riwayat pendidikan
  - Pengalaman kerja
  - Sertifikat & pencapaian
- Freelancer tinggal **review dan edit** jika ada yang perlu disesuaikan
- Teknologi: Azure AI Document Intelligence + Azure OpenAI Service

> **Catatan untuk developer:** Pada tahap mockup, tampilkan UI upload PDF dan form profil yang sudah terisi dummy data seolah-olah sudah di-parse. Integrasi API dilakukan pada tahap MVP.

### 3.5 GitHub Portfolio Integration
- Freelancer dapat memasukkan link repositori GitHub sebagai portofolio
- Platform otomatis mengambil data via GitHub REST API:
  - Nama & deskripsi repo
  - Konten README.md
  - Bahasa pemrograman yang digunakan
  - Topics/tags, stars, forks
- README.md dianalisis oleh AI untuk memperkuat Match Score

### 3.6 Cross-Border Escrow Ecosystem
- Dana klien ditahan dalam sistem escrow sebelum proyek dimulai
- Pencairan otomatis ke rekening freelancer setelah hasil kerja disetujui
- **Lokal:** Midtrans / Xendit API (IDR)
- **Internasional:** Stripe & Wise API (USD → IDR otomatis)

---

## 4. Alur Penggunaan

### 4.1 Alur Freelancer
```
Daftar & Verifikasi (No HP + KTP)
        ↓
Lengkapi Profil (Portofolio, Skills, CV, GitHub, English Proficiency)
        ↓
Beranda → Cari Lowongan
        ↓
Klik "Analyze Fit (AI Co-Pilot)" pada lowongan
        ↓
Baca Match Score & Analisis AI
        ↓
Klik "Auto-Draft Proposal"
        ↓
Edit draf (Bahasa Indonesia) → Setujui → Terjemahkan ke Inggris
        ↓
Kirim Lamaran
        ↓
[Jika diterima] → Contract Accepted → Project In Progress
        ↓
Submit Work Result (Upload deliverable)
        ↓
[Approved] → Payment Released → Work History Updated
[Revision] → Receive Revision Request → Fix & Resubmit (loop)
[Max Revisi Tercapai] → Manual Dispute (Tim Lumina Talent mediasi)
```

### 4.2 Alur Employer
```
Daftar & Verifikasi KYC
├── Indonesia: Upload KTP/NIB → OCR → Link rekening via Midtrans
└── Internasional: Financial KYC via Stripe → Company Tax ID (opsional)
        ↓
Verifikasi OTP
        ↓
[Is account fully verified?]
├── NO → Halaman verifikasi (wajib sebelum posting)
└── YES → Employer Dashboard
        ↓
Buat Lowongan Baru (Job Details Form) → Save Draft / Publish
        ↓
Lihat Pelamar (AI Smart Sorting by Match Score)
        ↓
Accept & Hire → Deposit Escrow Fund
        ↓
Project In Progress
        ↓
Review Work Result
        ↓
[Approved] → Release Escrow → Dana cair ke freelancer (IDR)
[Request Revision] → Kirim feedback → Freelancer revisi (loop)
[Max Revisi Tercapai] → Manual Dispute (Tim Lumina Talent mediasi)
```

### 4.3 Alur Manual Dispute
```
[Freelancer ajukan] ──→ Manual Dispute ←── [Employer ajukan]
                               ↓
                  Tim Lumina Talent mediasi kedua pihak
                  (review log chat + bukti kerja)
                         /            \
                  Freelancer wins   Employer wins
                        ↓                ↓
                  Release Escrow    Escrow Refund
                  ke Freelancer     ke Employer
```

> **Catatan:** Fitur AI Smart Dispute Resolution (otomatis via Azure OpenAI) adalah rencana pengembangan ke depan dan **belum termasuk dalam scope MVP**.

---

## 5. Hierarki Halaman (Sitemap)

```
Lumina Talent
├── Landing Page
├── Auth
│   ├── Sign Up (pilih role: Freelancer / Employer)
│   ├── Sign In
│   └── Sign Out
│
├── Freelancer
│   ├── Onboarding & Verifikasi
│   │   ├── Verifikasi No HP (OTP)
│   │   └── Verifikasi KTP (OCR)
│   ├── Buat Profil
│   │   ├── Profile Picture
│   │   ├── Summary & Deskripsi
│   │   ├── Skills
│   │   ├── Education & Sertifikat
│   │   ├── Languages & English Proficiency
│   │   ├── CV / Resume Upload
│   │   │   └── Auto-Fill Profil dari PDF (Smart Resume Parser)
│   │   └── GitHub & Portfolio Integration
│   └── Dashboard
│       ├── Beranda
│       │   ├── Cari Pekerjaan (Tombol cari, Rekomendasi, Tersimpan)
│       │   ├── Sidebar (Small Profile Preview)
│       │   └── Hasil Pencarian (Sort: Paling Cocok, Paling Baru, Client Rating)
│       ├── Detail Lowongan
│       │   ├── Matchmaking Co-Pilot (AI Match Score)
│       │   ├── Output Analysis
│       │   ├── Auto-Draft Proposal
│       │   └── Translate to Professional English
│       ├── Pesan
│       ├── Status Pekerjaan & Lamaran
│       │   ├── Status Lamaran
│       │   ├── Status Kontrak Kerja
│       │   │   ├── Project In Progress
│       │   │   ├── Submit Work Result
│       │   │   ├── Receive Revision Request
│       │   │   ├── Max Revisions Reached → Manual Dispute
│       │   │   └── Payment Released
│       │   └── Riwayat Kerja
│       ├── Keuangan
│       │   ├── Report & Tagihan
│       │   ├── Transaksi
│       │   ├── Penarikan
│       │   └── Metode Penarikan
│       └── Profile Settings
│
└── Employer
    ├── Onboarding & Verifikasi (The Gatekeeper)
    │   ├── Indonesia: Upload KTP/NIB + Link Rekening Midtrans
    │   └── Internasional: Financial KYC via Stripe + Company Tax ID
    └── Dashboard
        ├── Ringkasan Statistik
        │   ├── Jumlah Lamaran Masuk
        │   ├── Status Dana Escrow
        │   └── Lowongan Aktif
        ├── Buat Lowongan Baru
        │   ├── Job Details Form
        │   ├── Save & Draft
        │   └── Save & Publish
        ├── Manajemen Lowongan
        │   ├── Active Jobs
        │   └── Jobs History
        ├── Manajemen Pelamar
        │   ├── View Applicants (AI Smart Sorting)
        │   ├── Accept & Hire
        │   └── Reject
        ├── Ekosistem Escrow & Proyek
        │   ├── Deposit Escrow Fund
        │   ├── Project In Progress
        │   ├── Review Work Result
        │   ├── Release Escrow
        │   ├── Request Revision
        │   ├── Max Revisions Reached → Manual Dispute
        │   └── Escrow Refund
        ├── Pesan
        └── Keuangan
            ├── Report & Transaksi
            └── Payment Verified
```

---

## 6. Teknologi yang Direncanakan

| Kategori | Teknologi |
|---|---|
| Frontend | Belum ditentukan (rekomendasi: Next.js + Tailwind CSS) |
| Backend | Belum ditentukan |
| AI / ML | Azure OpenAI Service (GPT-4o) |
| OCR | Azure AI Document Intelligence |
| Database | Azure Cosmos DB |
| Hosting | Azure App Service |
| Payment (Lokal) | Midtrans / Xendit API |
| Payment (Global) | Stripe & Wise API |
| Portfolio | GitHub REST API |

---

## 7. Scope Mockup (Tahap Pertama)

Fokus saat ini adalah pembuatan **mockup visual** (belum terintegrasi dengan backend, Azure, atau GitHub). Data yang ditampilkan menggunakan **data dummy**.

### Halaman yang harus dibuat:

| No | Halaman | Role |
|---|---|---|
| 1 | Landing Page | Public |
| 2 | Sign Up (pilih role) | Public |
| 3 | Sign In | Public |
| 4 | KYC Verification | Freelancer & Employer |
| 5 | Freelancer - Buat Profil | Freelancer |
| 6 | Freelancer - Dashboard / Beranda | Freelancer |
| 7 | Freelancer - Job Listing & Detail | Freelancer |
| 8 | Freelancer - AI Match Score & Proposal Drafter | Freelancer |
| 9 | Freelancer - Status Pekerjaan | Freelancer |
| 10 | Freelancer - Keuangan | Freelancer |
| 11 | Employer - Dashboard | Employer |
| 12 | Employer - Buat Lowongan | Employer |
| 13 | Employer - Manajemen Pelamar | Employer |
| 14 | Employer - Ekosistem Escrow & Proyek | Employer |

### Ketentuan mockup:
- Semua data menggunakan **data dummy** (nama, foto, angka, dll)
- Belum perlu integrasi API apapun (Azure, GitHub, Stripe, dll)
- Fokus pada **tampilan UI dan alur navigasi** antar halaman
- Gunakan desain yang **bersih, profesional, dan modern**
- Pastikan alur antar halaman mengikuti sitemap di atas

---

## 8. Rencana Pengembangan ke Depan (Di Luar Scope MVP)

Fitur-fitur berikut **tidak perlu diimplementasikan** pada tahap mockup maupun MVP awal:

- **AI Real-Time Chat Translator** — terjemahan otomatis pesan antara freelancer dan klien
- **Lumina Talent Desktop App (Proof of Work)** — time tracker dengan screenshot acak 6x/jam
- **Manual Time & Offline Logging** — input jam kerja manual dengan persetujuan klien
- **AI Upskilling Path** — rekomendasi roadmap belajar dari Microsoft Learn
- **AI Smart Dispute Resolution** — penyelesaian konflik otomatis via Azure OpenAI

---

## 9. Catatan Penting untuk Developer

1. **Dispute saat ini bersifat manual** — ketika terjadi konflik, tim Lumina Talent yang akan memediasi kedua pihak secara langsung. Tidak ada otomasi di tahap ini.
2. **KYC bersifat dinamis** — tampilan halaman verifikasi harus berbeda antara pengguna Indonesia dan Internasional.
3. **Employer wajib terverifikasi** sebelum bisa posting lowongan — pastikan ada gate/redirect jika akun belum terverifikasi.
4. **GitHub integration** — pada tahap mockup, tampilkan preview portofolio GitHub sebagai UI statis dengan data dummy. Integrasi API GitHub dilakukan pada tahap MVP.
5. **Dua mata uang** — semua tampilan keuangan freelancer menggunakan IDR, sedangkan employer internasional menggunakan USD.

---

*Dokumen ini dibuat berdasarkan Project Brief Hackathon Microsoft Elevate Training Center.*
*Versi: 1.1 — Fokus Mockup | Nama diperbarui: Lumina Talent | Ditambahkan: CV Auto-Fill Feature*
