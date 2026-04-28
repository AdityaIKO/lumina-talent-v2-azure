// ── Dummy Data ────────────────────────────────────────────────────
const DUMMY = {
  user: {
    freelancer: {
      name: 'Rizki Pratama', email: 'rizki@email.com', phone: '+62 812 3456 7890',
      avatar: null, initials: 'RP', title: 'Full-Stack Developer & UI/UX Designer',
      bio: 'Passionate full-stack developer with 4 years of experience building scalable web applications. Specializing in React, Node.js, and cloud infrastructure. Helped 20+ clients achieve their digital goals.',
      skills: ['React.js','Node.js','TypeScript','Python','UI/UX Design','PostgreSQL','Docker','AWS'],
      english: 'Professional Working (B2)', hourlyRate: 'Rp 350.000',
      location: 'Jakarta, Indonesia', matchScore: 88, verified: true,
      stats: { matchJobs: 24, applications: 7, activeProjects: 2, earnings: 'Rp 18.500.000' },
      github: { url: 'github.com/rizkipratama', repos: 34, stars: 127 },
      balance: { available: 'Rp 4.250.000', pending: 'Rp 2.100.000', total: 'Rp 18.500.000' }
    },
    employer: {
      name: 'Sarah Mitchell', email: 'sarah@techcorp.io', company: 'TechCorp Solutions',
      avatar: null, initials: 'SM', location: 'San Francisco, USA', type: 'international',
      verified: true,
      stats: { applicants: 47, escrow: '$3,200 USD', activeJobs: 3, projects: 2 }
    }
  },

  jobs: [
    { id: 1, title: 'Senior React Developer for SaaS Dashboard', company: 'TechCorp Solutions', location: 'Remote (USA)', type: 'Full-Stack', budget: '$1,500 - $2,500 USD', duration: '2-3 Bulan', match: 92, rating: 4.9, reviews: 23, posted: 1, tags: ['React.js','TypeScript','Node.js','PostgreSQL'], verified: true, flag: '🇺🇸', desc: 'We are looking for an experienced React developer to build an enterprise SaaS dashboard. You will work closely with our design team to implement pixel-perfect UI components and integrate REST APIs.', deliverables: 'Responsive dashboard, API integration, documentation', saved: false },
    { id: 2, title: 'UI/UX Designer for Mobile App', company: 'GrowthHQ', location: 'Remote (Australia)', type: 'Design', budget: '$800 - $1,200 USD', duration: '1 Bulan', match: 85, rating: 4.7, reviews: 11, posted: 2, tags: ['Figma','UI/UX','Mobile Design','Prototyping'], verified: true, flag: '🇦🇺', desc: 'We need a talented UI/UX designer to redesign our mobile application. Deliverables include wireframes, high-fidelity mockups, and a complete design system.', deliverables: 'Wireframes, Figma file, Design System', saved: true },
    { id: 3, title: 'Python Backend Developer (FastAPI)', company: 'DataFlow Inc', location: 'Remote (Germany)', type: 'Backend', budget: '$1,200 - $2,000 USD', duration: '3 Bulan', match: 78, rating: 5.0, reviews: 8, posted: 3, tags: ['Python','FastAPI','PostgreSQL','Docker'], verified: true, flag: '🇩🇪', desc: 'Building a high-performance data pipeline API using FastAPI. Must have experience with async Python, database optimization, and containerization.', deliverables: 'REST API, Docker setup, API documentation', saved: false },
    { id: 4, title: 'WordPress Developer untuk Company Profile', company: 'CV Maju Bersama', location: 'Jakarta, Indonesia', type: 'Web Dev', budget: 'Rp 3.000.000 - Rp 5.000.000', duration: '2 Minggu', match: 72, rating: 4.5, reviews: 31, posted: 5, tags: ['WordPress','PHP','CSS','Elementor'], verified: true, flag: '🇮🇩', desc: 'Dibutuhkan developer WordPress untuk membangun website company profile yang modern dan responsif. Wajib berpengalaman dengan Elementor.', deliverables: 'Website live, training penggunaan', saved: false },
    { id: 5, title: 'Mobile App Developer (Flutter)', company: 'StartupKu', location: 'Remote (Singapore)', type: 'Mobile', budget: '$600 - $1,000 USD', duration: '6 Minggu', match: 69, rating: 4.8, reviews: 15, posted: 7, tags: ['Flutter','Dart','Firebase','REST API'], verified: false, flag: '🇸🇬', desc: 'We need a Flutter developer to build a marketplace app for Indonesia market. The app should support both iOS and Android.', deliverables: 'Flutter app (iOS + Android), Firebase setup', saved: true },
  ],

  applications: [
    { id: 1, job: 'Senior React Developer for SaaS Dashboard', company: 'TechCorp Solutions', status: 'reviewed', date: '22 Apr 2026', budget: '$2,000 USD', match: 92 },
    { id: 2, job: 'UI/UX Designer for Mobile App', company: 'GrowthHQ', status: 'pending', date: '20 Apr 2026', budget: '$1,000 USD', match: 85 },
    { id: 3, job: 'WordPress Developer', company: 'CV Maju Bersama', status: 'rejected', date: '15 Apr 2026', budget: 'Rp 4.000.000', match: 72 },
    { id: 4, job: 'Backend API Developer', company: 'Fintech Nusantara', status: 'accepted', date: '10 Apr 2026', budget: '$1,500 USD', match: 89 },
  ],

  contracts: [
    { id: 1, job: 'Backend API Developer', company: 'Fintech Nusantara', employer: 'Ahmad Fauzi', status: 'in_progress', budget: '$1,500 USD', deadline: '30 Mei 2026', progress: 65, revisions: 0, maxRevisions: 3, milestones: ['Desain API', 'Implementasi Endpoint', 'Testing & QA', 'Deployment'] },
    { id: 2, job: 'E-commerce UI Design', company: 'BatikKita', employer: 'Siti Rahayu', status: 'revision', budget: 'Rp 6.000.000', deadline: '5 Mei 2026', progress: 80, revisions: 1, maxRevisions: 3, revisionNote: 'Mohon ubah warna tombol utama menjadi lebih kontras dan perbesar ukuran font pada mobile view.', milestones: ['Wireframe', 'High-fi Design', 'Revisi', 'Final Delivery'] },
  ],

  workHistory: [
    { id: 1, job: 'Company Profile Website', company: 'PT Sinar Mandiri', status: 'completed', budget: 'Rp 5.000.000', completedDate: '1 Apr 2026', rating: 5, review: 'Excellent work! Very professional and delivered on time.' },
    { id: 2, job: 'Landing Page Redesign', company: 'Startup Agritech', status: 'completed', budget: '$800 USD', completedDate: '10 Mar 2026', rating: 4, review: 'Good work, minor revisions were handled well.' },
  ],

  transactions: [
    { id: 1, type: 'income', desc: 'Pembayaran - Backend API Developer', amount: '+Rp 14.250.000', date: '1 Apr 2026', status: 'completed' },
    { id: 2, type: 'income', desc: 'Pembayaran - Company Profile Website', amount: '+Rp 4.750.000', date: '1 Apr 2026', status: 'completed' },
    { id: 3, type: 'withdrawal', desc: 'Penarikan ke BCA - 1234****', amount: '-Rp 14.000.000', date: '3 Apr 2026', status: 'completed' },
    { id: 4, type: 'pending', desc: 'Pending - E-commerce UI Design', amount: '+Rp 5.700.000', date: '-', status: 'pending' },
    { id: 5, type: 'pending', desc: 'Pending - Backend API Developer', amount: '+Rp 5.700.000', date: '-', status: 'pending' },
  ],

  empJobs: [
    { id: 1, title: 'Senior React Developer for SaaS Dashboard', status: 'active', applicants: 18, posted: '20 Apr 2026', budget: '$1,500 - $2,500 USD', views: 234 },
    { id: 2, title: 'Content Writer (Technical)', status: 'active', applicants: 31, posted: '18 Apr 2026', budget: '$500 - $800 USD', views: 187 },
    { id: 3, title: 'DevOps Engineer - CI/CD Setup', status: 'draft', applicants: 0, posted: '-', budget: '$1,000 USD', views: 0 },
  ],

  applicants: [
    { id: 1, name: 'Rizki Pratama', title: 'Full-Stack Developer', match: 92, skills: ['React.js','Node.js','TypeScript'], rate: '$25/hr', rating: 4.9, reviews: 8, experience: '4 tahun', initials: 'RP', verified: true, proposal: 'Halo Sarah, saya sangat tertarik dengan posisi Senior React Developer ini. Dengan 4 tahun pengalaman di React dan Node.js, saya yakin bisa memberikan hasil terbaik...', status: 'pending' },
    { id: 2, name: 'Dewi Kusuma', title: 'Frontend Engineer', match: 87, skills: ['React.js','Vue.js','CSS','Figma'], rate: '$20/hr', rating: 4.7, reviews: 12, experience: '3 tahun', initials: 'DK', verified: true, proposal: 'Dear Sarah, I am excited about this opportunity to work with TechCorp Solutions. My expertise in React and modern CSS frameworks...', status: 'pending' },
    { id: 3, name: 'Budi Santoso', title: 'React & Next.js Developer', match: 81, skills: ['React.js','Next.js','TypeScript','Redux'], rate: '$18/hr', rating: 4.5, reviews: 6, experience: '2 tahun', initials: 'BS', verified: true, proposal: 'Hi, I have been working with React for 2 years and I am confident I can deliver a high-quality dashboard...', status: 'pending' },
    { id: 4, name: 'Maya Sari', title: 'JavaScript Developer', match: 74, skills: ['JavaScript','React.js','HTML/CSS'], rate: '$15/hr', rating: 4.3, reviews: 4, experience: '2 tahun', initials: 'MS', verified: false, proposal: 'Saya tertarik dengan lowongan ini dan siap untuk memberikan yang terbaik dalam pengerjaan proyek...', status: 'hired' },
  ],

  escrowProjects: [
    { id: 1, title: 'Senior React Developer for SaaS Dashboard', freelancer: 'Rizki Pratama', freelancerInitials: 'RP', amount: '$2,000 USD', status: 'in_progress', progress: 65, deadline: '30 Mei 2026', revisions: 0, maxRevisions: 3, milestone: 'Implementasi Endpoint', deposited: true },
    { id: 2, title: 'Content Writer (Technical)', freelancer: 'Sinta Wulandari', freelancerInitials: 'SW', amount: '$650 USD', status: 'submitted', progress: 100, deadline: '25 Apr 2026', revisions: 1, maxRevisions: 3, depositDate: '10 Apr 2026', deliverable: 'draft-artikel-final.zip', deposited: true },
  ],

  aiAnalysis: {
    score: 92,
    strengths: ['React.js & TypeScript sangat sesuai dengan kebutuhan utama', 'Pengalaman 4 tahun melampaui minimum 2 tahun yang diminta', 'Portfolio GitHub menunjukkan proyek SaaS yang relevan', 'Rating 4.9 dari klien sebelumnya sangat kuat'],
    improvements: ['Belum ada pengalaman spesifik dengan AWS Cognito', 'Perlu showcase proyek dashboard enterprise sebelumnya'],
    proposalID: `Halo Sarah,

Saya sangat tertarik dengan posisi Senior React Developer di TechCorp Solutions ini. Setelah membaca deskripsi proyek, saya yakin pengalaman saya sangat sesuai dengan kebutuhan tim Anda.

Selama 4 tahun terakhir, saya telah membangun berbagai dashboard enterprise menggunakan React.js dan TypeScript, termasuk proyek untuk perusahaan fintech dan e-commerce di Indonesia. Saya memiliki keahlian mendalam dalam integrasi REST API, state management dengan Redux/Zustand, dan optimasi performa.

Saya sangat antusias untuk berkontribusi pada produk SaaS TechCorp dan siap memulai dalam waktu dekat. Mari kita jadwalkan sesi diskusi untuk membahas detail teknis lebih lanjut.

Terima kasih atas kesempatannya.

Salam,
Rizki Pratama`,
    proposalEN: `Hello Sarah,

I am very interested in the Senior React Developer position at TechCorp Solutions. After reviewing the project description in detail, I am confident that my experience aligns perfectly with your team's requirements.

Over the past 4 years, I have built numerous enterprise dashboards using React.js and TypeScript, including projects for fintech and e-commerce companies. I have deep expertise in REST API integration, state management with Redux/Zustand, and performance optimization techniques.

I am genuinely enthusiastic about contributing to TechCorp's SaaS product and am available to start at your earliest convenience. I'd love to schedule a technical discussion to dive deeper into the project details.

Thank you for this opportunity.

Best regards,
Rizki Pratama`
  }
};
