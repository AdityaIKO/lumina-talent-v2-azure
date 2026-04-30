import { useEffect, useRef } from 'react';
import useLegacyPage from '../../hooks/useLegacyPage';


export default function Verifikasi() {
  
  const ref = useLegacyPage(() => window.Pages?.renderKYC());
  return <div ref={ref} />;
}
