import { useEffect, useRef } from 'react';
import useLegacyPage from '../../hooks/useLegacyPage';
import { useParams } from 'react-router-dom';

export default function CoPilot() {
  const { jobId } = useParams();
  const ref = useLegacyPage(() => window.Pages?.renderJobDetail(jobId));
  return <div ref={ref} />;
}
