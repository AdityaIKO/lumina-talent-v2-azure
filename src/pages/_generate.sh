#!/bin/bash
# Auto-generate React page stubs bridging to vanilla Pages.renderXxx()
TARGET=/Users/adityaiko/Downloads/Lumina_Talent-main/src/pages

generate() {
  local FILE="$1"; local RENDER="$2"; local PARAM="${3:-}"
  cat > "$FILE" << EOF
import { useEffect, useRef } from 'react';
import useLegacyPage from '../../hooks/useLegacyPage';
${PARAM:+"import { useParams } from 'react-router-dom';"}

export default function $(basename $FILE .jsx)() {
  ${PARAM:+"const { $PARAM } = useParams();"}
  const ref = useLegacyPage(() => window.Pages?.${RENDER}(${PARAM:-}));
  return <div ref={ref} />;
}
EOF
}

# Freelancer
generate "$TARGET/freelancer/Beranda.jsx"         "renderFreelancerDashboard"
generate "$TARGET/freelancer/Profil.jsx"          "renderOnboarding"
generate "$TARGET/freelancer/DetailPekerjaan.jsx" "renderJobDetail"   "jobId"
generate "$TARGET/freelancer/CoPilot.jsx"         "renderJobDetail"   "jobId"
generate "$TARGET/freelancer/Pesan.jsx"           "renderFreelancerDashboard"
generate "$TARGET/freelancer/StatusLamaran.jsx"   "renderStatus"
generate "$TARGET/freelancer/Keuangan.jsx"        "renderFinance"

# Employer
generate "$TARGET/employer/Dashboard.jsx"     "renderEmployerDashboard"
generate "$TARGET/employer/Verifikasi.jsx"    "renderKYC"
generate "$TARGET/employer/BuatLowongan.jsx"  "renderPostJob"
generate "$TARGET/employer/Pelamar.jsx"       "renderApplicants"  "jobId"
generate "$TARGET/employer/Pesan.jsx"         "renderEmployerDashboard"
generate "$TARGET/employer/Escrow.jsx"        "renderEscrow"

echo "Done generating page stubs."
