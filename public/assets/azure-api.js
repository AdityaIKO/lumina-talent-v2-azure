// ── AZURE SERVICES (FRONTEND INTEGRATION) — V2.0 ─────────────────────────
// Arsitektur v2.0: Menerapkan AI Fallback, DB Tier Separation, dan Escrow Flow
// yang telah direvisi sesuai dokumen Master Architecture v2.0.
//
// ⚠ CATATAN KEAMANAN: File ini berjalan di sisi klien (browser).
// Untuk produksi, pindahkan semua pemanggilan API ke backend (Node.js / Next.js)
// agar API Key tidak terekspos.

// ─────────────────────────────────────────────────────────────────────────────
// KONFIGURASI — Membaca dari window.AppConfig (assets/config.js)
// ─────────────────────────────────────────────────────────────────────────────
window.AzureConfig = {
  getOpenAIKey:       () => window.AppConfig?.AZURE_OPENAI_API_KEY       || localStorage.getItem('AZURE_OPENAI_API_KEY')       || '',
  getOpenAIEndpoint:  () => window.AppConfig?.AZURE_OPENAI_ENDPOINT      || localStorage.getItem('AZURE_OPENAI_ENDPOINT')      || '',
  getOpenAIDeployment:() => window.AppConfig?.AZURE_OPENAI_DEPLOYMENT    || localStorage.getItem('AZURE_OPENAI_DEPLOYMENT')    || 'gpt-4o',
  getDocIntelKey:     () => window.AppConfig?.AZURE_DOC_INTEL_KEY        || localStorage.getItem('AZURE_DOC_INTEL_KEY')        || '',
  getDocIntelEndpoint:() => window.AppConfig?.AZURE_DOC_INTEL_ENDPOINT   || localStorage.getItem('AZURE_DOC_INTEL_ENDPOINT')   || '',
  getCosmosEndpoint:  () => window.AppConfig?.AZURE_COSMOS_ENDPOINT      || localStorage.getItem('AZURE_COSMOS_ENDPOINT')      || '',
  getCosmosKey:       () => window.AppConfig?.AZURE_COSMOS_KEY           || localStorage.getItem('AZURE_COSMOS_KEY')           || '',
};

// ─────────────────────────────────────────────────────────────────────────────
// [B#02 FIX] DATABASE TIER SEPARATION SIMULATOR
// Arsitektur V2 mewajibkan 3 tier DB yang terpisah:
// - Tier 1 (Primary)  : Profil, Job, Match Score → Azure Cosmos DB
// - Tier 2 (Financial): Transaksi, Escrow, Tagihan → Isolated Cosmos DB (encrypted)
// - Tier 3 (Archive)  : Chat History, Log → Azure Blob Storage (cold)
// ─────────────────────────────────────────────────────────────────────────────
window.DB = {
  // Tier 1 — Primary DB (Profil, Job Posting, Match Score)
  async savePrimary(collection, document) {
    const key = AzureConfig.getCosmosKey();
    if (!key) {
      console.log(`[DB-T1 PRIMARY] Mock Write → ${collection}:`, document);
      return { success: true, tier: 'primary', id: document.id || 'mock-' + Date.now() };
    }
    // TODO: POST ke Primary Cosmos DB endpoint
    return { success: true, tier: 'primary' };
  },

  // Tier 2 — Financial DB (Transaksi, Escrow) — Isolated & Encrypted
  async saveFinancial(collection, document) {
    const key = AzureConfig.getCosmosKey();
    if (!key) {
      console.log(`[DB-T2 FINANCIAL 🔒] Mock Write → ${collection}:`, document);
      return { success: true, tier: 'financial', encrypted: true, auditLog: true };
    }
    // TODO: POST ke Financial Cosmos DB endpoint (instance terpisah, access control ketat)
    return { success: true, tier: 'financial', encrypted: true };
  },

  // Tier 3 — Cold Storage / Archive (Chat history, Log lama)
  async saveArchive(collection, document) {
    const key = AzureConfig.getCosmosKey();
    if (!key) {
      console.log(`[DB-T3 ARCHIVE ❄️] Mock Write → ${collection}:`, document);
      return { success: true, tier: 'archive', storage: 'blob' };
    }
    // TODO: POST ke Azure Blob Storage (cold tier)
    return { success: true, tier: 'archive' };
  },

  // Helper umum — routing otomatis ke tier yang benar
  async save(tier, collection, document) {
    if (tier === 'financial') return this.saveFinancial(collection, document);
    if (tier === 'archive')   return this.saveArchive(collection, document);
    return this.savePrimary(collection, document);
  },

  // Untuk backward-compatibility (kode lama memanggil AzureAPI.saveToCosmos)
  async saveToCosmos(collection, document) {
    return this.savePrimary(collection, document);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// [B#03 FIX] ESCROW CONFIRMATION & DISPUTE RESOLUTION SYSTEM
// Arsitektur V2: Alur konfirmasi selesai yang jelas + sistem dispute.
// ─────────────────────────────────────────────────────────────────────────────
window.EscrowManager = {
  CONFIRMATION_WINDOW_HOURS: 72,  // 3×24 jam auto-complete jika employer tidak respons
  DISPUTE_SLA_DAYS: 5,            // Keputusan dispute dalam 5 hari kerja

  // Freelancer klik "Mark as Done" → trigger konfirmasi ke employer
  async markAsDone(projectId, freelancerId) {
    const payload = {
      projectId,
      freelancerId,
      status: 'awaiting_confirmation',
      markedDoneAt: new Date().toISOString(),
      autoCompleteAt: new Date(Date.now() + this.CONFIRMATION_WINDOW_HOURS * 3600000).toISOString(),
    };
    await DB.saveFinancial('Escrow', payload);
    NotificationService.trigger('ESCROW_MARKED_DONE', { projectId, recipientRole: 'employer' });
    console.log(`[ESCROW] Project ${projectId} marked as done. Employer has ${this.CONFIRMATION_WINDOW_HOURS}h to respond.`);
    return payload;
  },

  // Employer klik "Confirm Completion" → cairkan dana
  async confirmCompletion(projectId, employerId) {
    const payload = {
      projectId,
      employerId,
      status: 'completed',
      confirmedAt: new Date().toISOString(),
      fundsReleased: true,
    };
    await DB.saveFinancial('Escrow', payload);
    NotificationService.trigger('ESCROW_RELEASED', { projectId, recipientRole: 'freelancer' });
    NotificationService.trigger('RATING_REQUEST',  { projectId, recipientRole: 'both', deadline: '7_days' });
    console.log(`[ESCROW] Project ${projectId} confirmed. Funds released. Rating request sent.`);
    return payload;
  },

  // Auto-complete jika tidak ada respons setelah CONFIRMATION_WINDOW_HOURS
  async autoComplete(projectId) {
    const payload = {
      projectId,
      status: 'auto_completed',
      autoCompletedAt: new Date().toISOString(),
      reason: `No employer response within ${this.CONFIRMATION_WINDOW_HOURS}h`,
      fundsReleased: true,
    };
    await DB.saveFinancial('Escrow', payload);
    NotificationService.trigger('ESCROW_AUTO_COMPLETED', { projectId, recipientRole: 'both' });
    return payload;
  },

  // Employer / Freelancer mengajukan sengketa
  async raiseDispute(projectId, raisedBy, reason, evidence) {
    const payload = {
      projectId,
      raisedBy,          // 'employer' | 'freelancer'
      reason,
      evidence,          // URL dokumen bukti
      status: 'dispute_open',
      raisedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + this.DISPUTE_SLA_DAYS * 86400000).toISOString(),
    };
    await DB.saveFinancial('Disputes', payload);
    NotificationService.trigger('DISPUTE_RAISED', { projectId, recipientRole: 'both' });
    NotificationService.trigger('DISPUTE_RAISED', { projectId, recipientRole: 'admin' });
    console.log(`[DISPUTE] Dispute opened for project ${projectId}. Admin SLA: ${this.DISPUTE_SLA_DAYS} business days.`);
    return payload;
  },

  // Admin memutuskan sengketa
  async resolveDispute(projectId, adminId, decision, fundsTo) {
    const payload = {
      projectId,
      adminId,
      decision,           // teks keputusan
      fundsTo,            // 'employer' | 'freelancer' | 'split'
      status: 'dispute_resolved',
      resolvedAt: new Date().toISOString(),
    };
    await DB.saveFinancial('Disputes', payload);
    NotificationService.trigger('DISPUTE_RESOLVED', { projectId, recipientRole: 'both' });
    return payload;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// [MISSING #06 NEW] NOTIFICATION SERVICE — Event-Driven Layer
// Trigger notifikasi pada event penting di seluruh platform.
// ─────────────────────────────────────────────────────────────────────────────
window.NotificationService = {
  // Daftar event yang memicu notifikasi
  EVENTS: {
    PROPOSAL_ACCEPTED:       '🎉 Proposal Diterima',
    PROPOSAL_REJECTED:       '❌ Proposal Ditolak',
    PROPOSAL_COUNTER:        '🔄 Counter-Offer Diterima',
    PAYMENT_RECEIVED:        '💰 Pembayaran Masuk',
    KYC_APPROVED:            '✅ KYC Diverifikasi',
    KYC_FAILED:              '⚠️ KYC Gagal — Re-submit Diperlukan',
    KYC_MANUAL_REVIEW:       '🔍 KYC Sedang Review Manual (1×24 jam)',
    CONTRACT_STATUS_CHANGED: '📋 Status Kontrak Berubah',
    ESCROW_RELEASED:         '💵 Dana Escrow Dicairkan',
    ESCROW_MARKED_DONE:      '📦 Freelancer Menandai Proyek Selesai',
    ESCROW_AUTO_COMPLETED:   '⏰ Proyek Auto-Selesai (tidak ada respons 72 jam)',
    DISPUTE_RAISED:          '⚖️ Sengketa Dibuka',
    DISPUTE_RESOLVED:        '✅ Sengketa Diselesaikan',
    RATING_REQUEST:          '⭐ Beri Rating Pengalaman Anda',
    NEW_APPLICANT:           '👤 Pelamar Baru Masuk',
    NEW_MESSAGE:             '💬 Pesan Baru',
  },

  // Trigger notifikasi — menampilkan in-app alert dan mencatat ke DB
  trigger(eventKey, context = {}) {
    const label = this.EVENTS[eventKey] || eventKey;
    console.log(`[NOTIF] ${label}`, context);

    // In-App: Tampilkan toast / bell badge
    if (typeof UI !== 'undefined' && UI.toast) {
      UI.toast(label, 'info');
    }

    // Simpan notifikasi ke DB (Primary tier — agar bisa ditampilkan di bell icon)
    DB.savePrimary('Notifications', {
      id: `notif-${Date.now()}`,
      event: eventKey,
      label,
      context,
      read: false,
      createdAt: new Date().toISOString(),
    });

    // Email & Push — akan dipanggil via backend/Azure Service Bus di produksi
    this._mockEmailDispatch(label, context);
  },

  _mockEmailDispatch(label, context) {
    console.log(`[EMAIL/PUSH MOCK] → "${label}" dikirim ke:`, context.recipientRole || 'user');
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// [B#01 FIX] AZURE AI SERVICES — dengan Fallback Mechanism
// Level 1: Rule-based fallback (data DUMMY)
// Level 2: Manual Review queue (jika AI down)
// ─────────────────────────────────────────────────────────────────────────────
window.AzureAPI = {
  AI_TIMEOUT_MS: 10000, // 10 detik — threshold sesuai arsitektur V2

  // Helper: fetch dengan timeout + fallback otomatis
  async _fetchWithFallback(url, options, fallbackFn, fallbackLabel) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.AI_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      clearTimeout(timer);
      if (e.name === 'AbortError') {
        console.warn(`[AI FALLBACK] ${fallbackLabel} → Timeout setelah ${this.AI_TIMEOUT_MS}ms. Masuk antrian manual.`);
      } else {
        console.warn(`[AI FALLBACK] ${fallbackLabel} → Error: ${e.message}. Menggunakan fallback.`);
      }
      return fallbackFn ? fallbackFn() : null;
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1. MATCHMAKING CO-PILOT (Azure OpenAI)
  // ─────────────────────────────────────────────────────────────────────────
  async analyzeMatch(jobDesc, profile) {
    const key = AzureConfig.getOpenAIKey();

    // Level 1 Fallback: Tidak ada API Key → pakai rule-based dummy
    if (!key) {
      console.log('[AI FALLBACK L1] analyzeMatch → Rule-based mock data.');
      return DUMMY.aiAnalysis;
    }

    const url = `${AzureConfig.getOpenAIEndpoint()}/openai/deployments/${AzureConfig.getOpenAIDeployment()}/chat/completions?api-version=2024-02-15-preview`;
    const data = await this._fetchWithFallback(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': key },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are an AI matchmaking assistant. Output JSON: { \"score\": number, \"strengths\": [\"string\"], \"improvements\": [\"string\"] }" },
            { role: "user", content: `Job: ${JSON.stringify(jobDesc)}\n\nProfile: ${JSON.stringify(profile)}` }
          ],
          response_format: { type: "json_object" }
        })
      },
      () => DUMMY.aiAnalysis, // Level 1 fallback
      'analyzeMatch'
    );

    try {
      return JSON.parse(data.choices[0].message.content);
    } catch {
      return DUMMY.aiAnalysis;
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. AUTO-DRAFT PROPOSAL (Azure OpenAI)
  // ─────────────────────────────────────────────────────────────────────────
  async generateProposal(jobDesc, profile) {
    const key = AzureConfig.getOpenAIKey();
    if (!key) return DUMMY.aiAnalysis?.proposalID || 'Proposal draft tidak tersedia (API Key belum diisi).';

    const url = `${AzureConfig.getOpenAIEndpoint()}/openai/deployments/${AzureConfig.getOpenAIDeployment()}/chat/completions?api-version=2024-02-15-preview`;
    const data = await this._fetchWithFallback(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': key },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Buat draf proposal profesional dalam Bahasa Indonesia berdasarkan profil freelancer dan pekerjaan ini." },
            { role: "user", content: `Job: ${JSON.stringify(jobDesc)}\n\nProfile: ${JSON.stringify(profile)}` }
          ]
        })
      },
      () => ({ choices: [{ message: { content: DUMMY.aiAnalysis?.proposalID || '' } }] }),
      'generateProposal'
    );

    return data?.choices?.[0]?.message?.content || DUMMY.aiAnalysis?.proposalID || '';
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. TRANSLATE PROPOSAL (Azure OpenAI)
  // ─────────────────────────────────────────────────────────────────────────
  async translateProposal(text) {
    const key = AzureConfig.getOpenAIKey();
    if (!key) return DUMMY.aiAnalysis?.proposalEN || '[Translation not available — API Key not set]';

    const url = `${AzureConfig.getOpenAIEndpoint()}/openai/deployments/${AzureConfig.getOpenAIDeployment()}/chat/completions?api-version=2024-02-15-preview`;
    const data = await this._fetchWithFallback(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': key },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Translate the following Indonesian proposal to Professional English." },
            { role: "user", content: text }
          ]
        })
      },
      () => ({ choices: [{ message: { content: DUMMY.aiAnalysis?.proposalEN || '' } }] }),
      'translateProposal'
    );

    return data?.choices?.[0]?.message?.content || '';
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SMART SORTING APPLICANTS (Azure OpenAI)
  // ─────────────────────────────────────────────────────────────────────────
  async smartSortApplicants(applicants, jobReq) {
    const key = AzureConfig.getOpenAIKey();
    // Fallback: Tanpa AI → urutkan berdasarkan match score yang ada
    if (!key) {
      return [...applicants].sort((a, b) => (b.match || 0) - (a.match || 0));
    }
    // Simulasi smart sort (di produksi, kirim ke Azure OpenAI untuk re-scoring)
    return new Promise(resolve => setTimeout(() => {
      const sorted = [...applicants]
        .map(app => ({ ...app, match: Math.floor(Math.random() * 20) + 75 }))
        .sort((a, b) => b.match - a.match);
      resolve(sorted);
    }, 1500));
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. PARSE RESUME / CV (Azure Document Intelligence)
  // dengan Fallback Level 2 → Manual Review Queue
  // ─────────────────────────────────────────────────────────────────────────
  async parseResume(file) {
    const key = AzureConfig.getDocIntelKey();

    if (!key) {
      // Level 1 fallback — rule-based (tidak ada key)
      return { status: 'mock', parsedText: 'Mock Resume — API Key belum diisi.', fallbackLevel: 1 };
    }

    // TODO: Implementasikan fetch() POST binary ke prebuilt-document endpoint
    // Sementara ini simulasi timeout → masuk Level 2 Fallback
    const simulateDown = false; // Ubah ke true untuk test fallback
    if (simulateDown) {
      // Level 2 fallback → masuk antrian manual review admin
      NotificationService.trigger('KYC_MANUAL_REVIEW', { docType: 'CV', recipientRole: 'user' });
      await DB.savePrimary('ManualReviewQueue', {
        id: `review-cv-${Date.now()}`,
        docType: 'CV',
        status: 'pending_manual',
        queuedAt: new Date().toISOString(),
      });
      return { status: 'manual_review', parsedText: 'Dokumen masuk antrian review manual (estimasi 1×24 jam).', fallbackLevel: 2 };
    }

    return { status: 'success', parsedText: 'Resume Data Processed via Azure Doc Intelligence.' };
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VERIFY KYC DOCUMENT (Azure Document Intelligence)
  // dengan Re-verification States & AI Fallback
  // ─────────────────────────────────────────────────────────────────────────
  async verifyKYC(file, docType, attemptCount = 1) {
    const key = AzureConfig.getDocIntelKey();
    const MAX_RESUBMIT = 3; // Batas re-submission sebelum masuk manual review

    if (!key) {
      // Level 1 fallback — rule-based (tidak ada key, anggap valid untuk dev)
      return { verified: true, confidence: 99.5, status: 'mock', fallbackLevel: 1 };
    }

    // Simulasi Azure Doc Intel (ganti dengan fetch() nyata di produksi)
    const simulateDown = false;     // Simulasi AI down
    const simulateFailed = false;   // Simulasi dokumen gagal diverifikasi

    if (simulateDown) {
      // AI Down → Level 2 Fallback: manual review
      NotificationService.trigger('KYC_MANUAL_REVIEW', { docType, recipientRole: 'user' });
      await DB.savePrimary('ManualReviewQueue', {
        id: `review-kyc-${Date.now()}`,
        docType,
        status: 'pending_manual',
        reason: 'AI service unavailable',
        queuedAt: new Date().toISOString(),
      });
      return {
        verified: false,
        status: 'manual_review',
        message: `Dokumen ${docType} sedang diproses manual oleh tim kami (estimasi 1×24 jam).`,
        fallbackLevel: 2
      };
    }

    if (simulateFailed) {
      if (attemptCount >= MAX_RESUBMIT) {
        // Melebihi batas → auto-masuk manual review
        NotificationService.trigger('KYC_MANUAL_REVIEW', { docType, recipientRole: 'user' });
        return {
          verified: false,
          status: 'max_attempts_reached',
          message: `Batas upload ulang (${MAX_RESUBMIT}x) tercapai. Dokumen masuk antrian review manual.`,
          fallbackLevel: 2
        };
      }
      // KYC gagal → beri tahu user untuk upload ulang
      NotificationService.trigger('KYC_FAILED', { docType, recipientRole: 'user', attemptCount });
      return {
        verified: false,
        status: 'failed',
        message: `Dokumen ${docType} gagal diverifikasi (percobaan ${attemptCount}/${MAX_RESUBMIT}). Silakan upload ulang dokumen yang lebih jelas.`,
        attemptCount,
        canResubmit: true
      };
    }

    // Sukses
    NotificationService.trigger('KYC_APPROVED', { docType, recipientRole: 'user' });
    return { verified: true, confidence: 95.0, status: 'verified', docType };
  },

  // ─────────────────────────────────────────────────────────────────────────
  // [MISSING #04 NEW] REJECT PROPOSAL — Employer
  // ─────────────────────────────────────────────────────────────────────────
  async rejectProposal(applicantId, jobId, reason, feedback = '') {
    const payload = {
      id: `reject-${applicantId}-${Date.now()}`,
      applicantId,
      jobId,
      status: 'rejected',
      reason,         // Template alasan atau teks bebas
      feedback,       // Opsional: komentar tambahan dari employer
      rejectedAt: new Date().toISOString(),
    };
    await DB.savePrimary('Applications', payload);
    NotificationService.trigger('PROPOSAL_REJECTED', { applicantId, jobId, reason, recipientRole: 'freelancer' });
    return payload;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // [MISSING #04 NEW] COUNTER-OFFER — Employer mengajukan negosiasi
  // ─────────────────────────────────────────────────────────────────────────
  async sendCounterOffer(applicantId, jobId, counterBudget, counterTimeline, note = '') {
    const payload = {
      id: `counter-${applicantId}-${Date.now()}`,
      applicantId,
      jobId,
      status: 'counter_offer_sent',
      counterBudget,
      counterTimeline,
      note,
      sentAt: new Date().toISOString(),
    };
    await DB.savePrimary('Applications', payload);
    NotificationService.trigger('PROPOSAL_COUNTER', { applicantId, jobId, counterBudget, recipientRole: 'freelancer' });
    return payload;
  },

  // Freelancer menerima / menolak counter-offer
  async respondToCounterOffer(applicantId, jobId, accept) {
    const status = accept ? 'counter_accepted' : 'counter_declined';
    const payload = { applicantId, jobId, status, respondedAt: new Date().toISOString() };
    await DB.savePrimary('Applications', payload);
    const event = accept ? 'PROPOSAL_ACCEPTED' : 'PROPOSAL_REJECTED';
    NotificationService.trigger(event, { applicantId, jobId, recipientRole: 'employer' });
    return payload;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // [MISSING #07 NEW] RATING & REVIEW — Post-Project Flow
  // ─────────────────────────────────────────────────────────────────────────
  async submitRating(projectId, raterId, raterRole, targetId, score, review) {
    if (score < 1 || score > 5) throw new Error('Rating harus antara 1–5.');
    const payload = {
      id: `rating-${projectId}-${raterId}-${Date.now()}`,
      projectId,
      raterId,
      raterRole,    // 'freelancer' | 'employer'
      targetId,
      score,        // 1–5
      review,       // Teks ulasan
      submittedAt: new Date().toISOString(),
    };
    // Simpan di Primary DB (mempengaruhi AI match score)
    await DB.savePrimary('Ratings', payload);
    console.log(`[RATING] ${raterRole} ${raterId} → rated ${targetId}: ${score}/5`);
    return payload;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Backward-compatibility: saveToCosmos → routing ke DB.save
  // ─────────────────────────────────────────────────────────────────────────
  async saveToCosmos(collection, document) {
    return DB.savePrimary(collection, document);
  }
};
