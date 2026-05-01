# Lumina Talent 🌟

> **An AI-powered freelance marketplace connecting Indonesian freelancers with local and international employers — built on Azure.**

[![Azure](https://img.shields.io/badge/Azure-OpenAI%20%7C%20Cosmos%20DB%20%7C%20Document%20Intelligence-0078D4?logo=microsoftazure)](https://azure.microsoft.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React%20Router-v6-CA4245?logo=reactrouter)](https://reactrouter.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 Overview

Lumina Talent is a two-sided freelance marketplace platform designed for the Indonesian market with international reach. It bridges the gap between skilled freelancers and employers — from local SMEs (UMKM) to global companies through AI-powered matchmaking, automated proposal drafting, and a secure escrow payment ecosystem.

The platform features two distinct user dashboards:
- **Freelancer Dashboard** — Find jobs, build a portfolio, apply with AI-generated proposals, and manage earnings.
- **Employer Dashboard** — Post jobs, review applicants with AI smart sorting, accept proposals, and manage project payments via escrow.

---

## ✨ Key Features

### 🤖 AI-Powered (Azure OpenAI + Document Intelligence)
- **Matchmaking Co-Pilot** — AI analyzes a job posting against a freelancer's profile and generates a tailored, professional proposal draft automatically.
- **Auto-Draft Proposal** — One-click proposal generation with an optional *Translate to Professional English* feature.
- **AI Smart Sorting** — Employers receive an AI-computed match score for every applicant, ranked by fit.
- **CV/Resume Parser** — Azure AI Document Intelligence extracts and structures content from uploaded CVs/resumes.
- **KYC Document Verification** — Automated OCR validation of KTP/NIB identity documents for both freelancers and employers.
- **Financial Report Generator** — AI-assisted report drafting for employer escrow and transaction summaries.

### 👤 Freelancer Modules
| Module | Description |
|--------|-------------|
| Sign-up & Auth | Email/OAuth registration with secure session management |
| Profile Builder | Skills, education, certifications, English proficiency, GitHub integration |
| Job Search | Filter & sort by relevance, recency, or client rating |
| Co-Pilot | AI matchmaking and proposal generation per job |
| Messages | Encrypted real-time chat, activated after proposal acceptance |
| Application Status | Track proposal status: Pending → Accepted / Rejected |
| Contract Status | Monitor project lifecycle: Hired → In Progress → Completed |
| Finance Dashboard | Earnings, invoices, transactions, and withdrawal management |
| Post-Project Rating | Rate employers after project completion |

### 🏢 Employer Modules
| Module | Description |
|--------|-------------|
| Sign-up & KYC | Identity verification via OTP + KTP/NIB document upload |
| Payment Verification | Link accounts via Midtrans, Xendit, QRIS, Stripe, or Wise |
| Dashboard Overview | Live stats: active jobs, escrow status, incoming applicants |
| Job Posting | Create, draft, and publish job listings (verified accounts only) |
| Applicant Management | Review profiles, portfolios, and AI-scored proposals |
| Accept / Reject | Accept proposals (opens chat), reject with feedback, or counter-offer |
| Escrow System | Secure fund holding: deposit → in progress → release on completion |
| Dispute Resolution | Admin-mediated dispute system with 5-day SLA |
| Finance & Reports | AI-generated transaction reports and payment history |

### 🔔 Platform-Wide
- **Event-Driven Notifications** — Push, email, and in-app alerts for all key events (proposal accepted/rejected, payment received, KYC status, rating requests)
- **AI Fallback** — If Azure AI is unavailable, documents enter a manual admin review queue
- **3-Tier Database Architecture** — Primary (profiles/jobs), Financial (isolated & encrypted), Archive (chat logs/cold storage)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router v6 | Client-side routing with full back/forward navigation |
| CSS3 | Styling (dark theme, responsive layout) |

### Backend & Cloud (Azure)
| Service | Purpose |
|---------|---------|
| Azure OpenAI (GPT-4o) | Matchmaking Co-Pilot, proposal drafting, smart sorting, translation |
| Azure AI Document Intelligence | CV parsing, KYC OCR verification, report generation |
| Azure Cosmos DB (Primary) | Profiles, job postings, applications, match scores |
| Azure Cosmos DB (Financial) | Transactions, escrow records, audit logs — isolated & encrypted |
| Azure Blob Storage | Chat history, conversation logs — cold storage |
| Azure Service Bus | Event-driven notification triggers |

### Payment Gateways
| Gateway | Region |
|---------|--------|
| Midtrans | Indonesia (local) |
| Xendit | Indonesia (alternative) |
| QRIS | Indonesia (QR-based) |
| Stripe | International |
| Wise API | International transfers |

### Communication
| Service | Purpose |
|---------|---------|
| Twilio / Qiscus / Zenziva | OTP SMS/WhatsApp for phone verification |
| SendGrid / Azure Communication Services | Transactional email notifications |
| Firebase Cloud Messaging | Mobile push notifications |

---

## 🏗 Project Structure

```
lumina-talent/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          # Global auth state (role, verified)
│   ├── routes/
│   │   ├── AppRouter.jsx            # All route definitions
│   │   └── ProtectedRoute.jsx       # Auth + role + verified guards
│   ├── hooks/
│   │   └── useAppNavigate.js        # Typed navigation helpers
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── shared/
│   │   │   ├── Landing.jsx
│   │   │   ├── KYC.jsx
│   │   │   └── NotFound.jsx
│   │   ├── freelancer/
│   │   │   ├── Beranda.jsx          # Job search home
│   │   │   ├── Profil.jsx           # Profile dashboard
│   │   │   ├── DetailPekerjaan.jsx  # Job detail page
│   │   │   ├── CoPilot.jsx          # AI matchmaking & proposal
│   │   │   ├── Pesan.jsx            # Chat (post-acceptance)
│   │   │   ├── StatusLamaran.jsx    # Application & contract status
│   │   │   └── Keuangan.jsx         # Finance dashboard
│   │   └── employer/
│   │       ├── Dashboard.jsx        # Employer home & stats
│   │       ├── Verifikasi.jsx       # KYC & payment verification
│   │       ├── BuatLowongan.jsx     # Job posting form
│   │       ├── Pelamar.jsx          # Applicant management
│   │       ├── Pesan.jsx            # Chat (post-acceptance)
│   │       └── Escrow.jsx           # Escrow & finance
│   ├── components/
│   │   ├── layout/                  # Navbar, Sidebar, etc.
│   │   └── ui/                      # Buttons, Cards, Modals, etc.
│   ├── App.jsx
│   └── main.jsx
├── assets/
│   ├── config.js                    # API keys (see Configuration)
│   ├── azure-api.js                 # Azure service integrations
│   ├── data.js                      # Static/seed data
│   ├── i18n.js                      # Internationalization
│   └── style.css                    # Global styles
├── ROUTING.md                       # Routing guide & migration docs
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher
- An active [Azure account](https://azure.microsoft.com/free) (free $200 credit for 30 days)


---

## ⚙️ Configuration

All API keys are stored in `assets/config.js`. Fill in the following:

### 🔴 Required Now (AI features)
```js
AZURE_OPENAI_API_KEY      = "your-key"
AZURE_OPENAI_ENDPOINT     = "https://your-resource.openai.azure.com/"
AZURE_OPENAI_DEPLOYMENT   = "gpt-4o"
```

### 🟡 Required for Production (KYC & Database)
```js
AZURE_DOC_INTEL_KEY       = "your-key"
AZURE_DOC_INTEL_ENDPOINT  = "https://your-resource.cognitiveservices.azure.com/"
AZURE_COSMOS_ENDPOINT     = "https://your-account.documents.azure.com:443/"
AZURE_COSMOS_KEY          = "your-primary-key"
// Financial DB (isolated tier)
AZURE_COSMOS_FINANCIAL_ENDPOINT = "https://your-financial-account.documents.azure.com:443/"
AZURE_COSMOS_FINANCIAL_KEY      = "your-financial-key"
// Cold storage (chat/archive)
AZURE_BLOB_CONNECTION_STRING    = "DefaultEndpointsProtocol=https;..."
```

### 🟢 Required for Payments
```js
MIDTRANS_CLIENT_KEY       = "your-key"   // Indonesian users
STRIPE_PUBLIC_KEY         = "your-key"   // International users
```

### ⚪ Optional
```js
XENDIT_API_KEY            = "your-key"
OTP_PROVIDER_KEY          = "your-key"   // Twilio / Qiscus / Zenziva
```

---

## 🗺 Route Map

| URL | Page | Access |
|-----|------|--------|
| `/landing` | Landing page | Public |
| `/login` | Login | Public |
| `/daftar` | Register | Public |
| `/kyc` | KYC verification | Public |
| `/freelancer/beranda` | Job search home | Freelancer only |
| `/freelancer/profil` | Profile dashboard | Freelancer only |
| `/freelancer/pekerjaan/:jobId` | Job detail | Freelancer only |
| `/freelancer/co-pilot/:jobId` | AI Co-Pilot | Freelancer only |
| `/freelancer/pesan/:chatId?` | Chat | Freelancer only |
| `/freelancer/lamaran` | Application status | Freelancer only |
| `/freelancer/keuangan` | Finance | Freelancer only |
| `/employer/beranda` | Employer dashboard | Employer only |
| `/employer/verifikasi` | KYC & payment verify | Employer only |
| `/employer/buat-lowongan` | Post a job | Employer + Verified |
| `/employer/pelamar/:jobId?` | Applicant management | Employer only |
| `/employer/pesan/:chatId?` | Chat | Employer only |
| `/employer/escrow/:projectId?` | Escrow management | Employer only |

For full routing documentation, see [ROUTING.md](./ROUTING.md).

---

## 🔒 Security & Architecture Notes

- **Role-based route guards** — Freelancer and employer routes are strictly separated; accessing the wrong role redirects to your own dashboard.
- **Verified guard** — Employers must complete KYC and payment verification before posting jobs.
- **3-tier database separation** — Financial data is stored in an isolated Cosmos DB instance with full encryption. Chat history uses Azure Blob cold storage. Profile and matching data use the primary Cosmos DB.
- **Escrow protection** — Funds are held in escrow until both parties confirm project completion, with a 3×24-hour auto-release safeguard.
- **Dispute system** — Admin-mediated resolution with 5-day SLA for employer/freelancer conflicts.
- **AI fallback** — If Azure AI services are unavailable, KYC documents enter a manual admin review queue rather than failing outright.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code structure and add your page components under the correct `src/pages/freelancer/` or `src/pages/employer/` directory.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ for the Indonesian freelance ecosystem<br/>
  Powered by <strong>Microsoft Azure</strong> · <strong>React</strong> · <strong>Gemini API</strong>
</div>