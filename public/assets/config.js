// ============================================================================
// KONFIGURASI API KEY & CREDENTIALS
// ============================================================================
// PERHATIAN: 
// Masukkan semua API Key Anda di bawah ini ketika Anda sudah memilikinya.
// File ini digunakan secara global di seluruh aplikasi.
// ============================================================================

window.AppConfig = {
  // 1. AZURE OPENAI SERVICES
  // Digunakan untuk fitur: Matchmaking, Draft Proposal, AI Chatbot, Smart Sorting
  AZURE_OPENAI_API_KEY: "", // Masukkan API Key Azure OpenAI di sini
  AZURE_OPENAI_ENDPOINT: "", // Contoh: "https://nama-resource.openai.azure.com/"
  AZURE_OPENAI_DEPLOYMENT: "gpt-4o", // Nama model deployment Anda
  
  // 2. AZURE DOCUMENT INTELLIGENCE
  // Digunakan untuk fitur: Parse CV/Resume, KYC Verifikasi KTP/NIB
  AZURE_DOC_INTEL_KEY: "", // Masukkan API Key Document Intelligence
  AZURE_DOC_INTEL_ENDPOINT: "", // Contoh: "https://nama-resource.cognitiveservices.azure.com/"
  
  // 3. AZURE COSMOS DB
  // Digunakan untuk penyimpanan data user, pekerjaan, dan transaksi
  AZURE_COSMOS_ENDPOINT: "", // Endpoint URL Cosmos DB
  AZURE_COSMOS_KEY: "", // Primary Key Cosmos DB
  
  // 4. PAYMENT GATEWAY (ESCROW & TRANSAKSI)
  // Digunakan untuk modul keuangan, escrow, dan KYC Employer
  MIDTRANS_CLIENT_KEY: "", // Masukkan Midtrans Client Key (Untuk Lokal/Indonesia)
  STRIPE_PUBLIC_KEY: "", // Masukkan Stripe Public Key (Untuk Internasional)
  XENDIT_API_KEY: "", // Opsional: Xendit API Key
  
  // 5. OTP / SMS GATEWAY
  // Digunakan untuk verifikasi KYC (Phone Verification)
  OTP_PROVIDER_KEY: "", // Masukkan API Key provider OTP (Twilio/Qiscus/Macrokiosk)
};
