// ── AZURE SERVICES (FRONTEND INTEGRATION) ─────────────────────────────────
// Catatan: Karena proyek ini adalah antarmuka web statis (HTML/JS murni), 
// pemanggilan API langsung dilakukan via REST (fetch).
// Di environment produksi, panggilan API ini harus dipindahkan ke backend (Node.js/Next.js)
// untuk mencegah tereksposnya API Key.

window.AzureConfig = {
  getOpenAIKey: () => window.AppConfig?.AZURE_OPENAI_API_KEY || localStorage.getItem('AZURE_OPENAI_API_KEY') || '',
  getOpenAIEndpoint: () => window.AppConfig?.AZURE_OPENAI_ENDPOINT || localStorage.getItem('AZURE_OPENAI_ENDPOINT') || '',
  getOpenAIDeployment: () => window.AppConfig?.AZURE_OPENAI_DEPLOYMENT || localStorage.getItem('AZURE_OPENAI_DEPLOYMENT') || 'gpt-4o',
  
  getDocIntelKey: () => window.AppConfig?.AZURE_DOC_INTEL_KEY || localStorage.getItem('AZURE_DOC_INTEL_KEY') || '',
  getDocIntelEndpoint: () => window.AppConfig?.AZURE_DOC_INTEL_ENDPOINT || localStorage.getItem('AZURE_DOC_INTEL_ENDPOINT') || '',
  
  getCosmosEndpoint: () => window.AppConfig?.AZURE_COSMOS_ENDPOINT || localStorage.getItem('AZURE_COSMOS_ENDPOINT') || '',
  getCosmosKey: () => window.AppConfig?.AZURE_COSMOS_KEY || localStorage.getItem('AZURE_COSMOS_KEY') || ''
};

window.AzureAPI = {
  // ─────────────────────────────────────────────────────────────
  // 1. AZURE OPENAI SERVICES
  // ─────────────────────────────────────────────────────────────
  
  async analyzeMatch(jobDesc, profile) {
    const key = AzureConfig.getOpenAIKey();
    if (!key) return DUMMY.aiAnalysis; // Fallback to mock data if no key
    
    try {
      const url = `${AzureConfig.getOpenAIEndpoint()}/openai/deployments/${AzureConfig.getOpenAIDeployment()}/chat/completions?api-version=2024-02-15-preview`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': key },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are an AI matchmaking assistant. Output JSON format: { \"score\": number, \"strengths\": [\"string\"], \"improvements\": [\"string\"] }" },
            { role: "user", content: `Job: ${JSON.stringify(jobDesc)}\n\nProfile: ${JSON.stringify(profile)}` }
          ],
          response_format: { type: "json_object" }
        })
      });
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (e) {
      console.error("Azure OpenAI Match Error:", e);
      return DUMMY.aiAnalysis;
    }
  },

  async generateProposal(jobDesc, profile) {
    const key = AzureConfig.getOpenAIKey();
    if (!key) return DUMMY.aiAnalysis.proposalID;
    
    try {
      const url = `${AzureConfig.getOpenAIEndpoint()}/openai/deployments/${AzureConfig.getOpenAIDeployment()}/chat/completions?api-version=2024-02-15-preview`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': key },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Buat draf proposal profesional dalam Bahasa Indonesia berdasarkan profil freelancer dan pekerjaan ini." },
            { role: "user", content: `Job: ${JSON.stringify(jobDesc)}\n\nProfile: ${JSON.stringify(profile)}` }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      console.error("Azure OpenAI Draft Error:", e);
      return DUMMY.aiAnalysis.proposalID;
    }
  },

  async translateProposal(text) {
    const key = AzureConfig.getOpenAIKey();
    if (!key) return DUMMY.aiAnalysis.proposalEN;
    
    try {
      const url = `${AzureConfig.getOpenAIEndpoint()}/openai/deployments/${AzureConfig.getOpenAIDeployment()}/chat/completions?api-version=2024-02-15-preview`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': key },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Translate the following Indonesian proposal to Professional English." },
            { role: "user", content: text }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      console.error("Azure OpenAI Translate Error:", e);
      return DUMMY.aiAnalysis.proposalEN;
    }
  },

  async smartSortApplicants(applicants, jobReq) {
    const key = AzureConfig.getOpenAIKey();
    if (!key) return applicants; // fallback
    
    // Simulate smart sort delay
    return new Promise(resolve => setTimeout(() => {
      resolve(applicants.map(app => ({...app, match: Math.floor(Math.random() * 20) + 75})));
    }, 1500));
  },

  // ─────────────────────────────────────────────────────────────
  // 2. AZURE DOCUMENT INTELLIGENCE
  // ─────────────────────────────────────────────────────────────
  
  async parseResume(file) {
    const key = AzureConfig.getDocIntelKey();
    if (!key) return { status: 'mock', parsedText: 'Mock Resume Data...' };
    // TODO: Implement actual binary POST to prebuilt-document model endpoint
    return { status: 'success', parsedText: 'Resume Data Processed...' };
  },

  async verifyKYC(file, docType) {
    const key = AzureConfig.getDocIntelKey();
    if (!key) return { verified: true, confidence: 99.5 };
    // TODO: Implement actual binary POST to prebuilt-idDocument model endpoint
    return { verified: true, confidence: 95.0 };
  },

  // ─────────────────────────────────────────────────────────────
  // 3. AZURE COSMOS DB
  // ─────────────────────────────────────────────────────────────
  
  async saveToCosmos(collection, document) {
    const key = AzureConfig.getCosmosKey();
    if (!key) {
      console.log(`Mock Save to Cosmos DB [${collection}]:`, document);
      return true;
    }
    // TODO: Implement REST API call to Azure Cosmos Document
    return true;
  }
};
