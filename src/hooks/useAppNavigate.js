import { useNavigate, useLocation } from 'react-router-dom';

/**
 * useAppNavigate — typed navigation helpers replacing Router.goTo() calls.
 */
export default function useAppNavigate() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    back:              ()          => navigate(-1),
    forward:           ()          => navigate(1),

    // Public
    toLanding:         ()          => navigate('/landing'),
    toLogin:           ()          => navigate('/login'),
    toRegister:        ()          => navigate('/daftar'),
    toKYC:             ()          => navigate('/kyc'),

    // Freelancer
    toFreelancerHome:  ()          => navigate('/freelancer/beranda'),
    toProfil:          ()          => navigate('/freelancer/profil'),
    toJobDetail:       (jobId)     => navigate(`/freelancer/pekerjaan/${jobId}`),
    toCoPilot:         (jobId)     => navigate(`/freelancer/co-pilot/${jobId}`),
    toFreelancerChat:  (chatId)    => chatId
                                        ? navigate(`/freelancer/pesan/${chatId}`)
                                        : navigate('/freelancer/pesan'),
    toLamaran:         ()          => navigate('/freelancer/lamaran'),
    toKeuangan:        ()          => navigate('/freelancer/keuangan'),

    // Employer
    toEmployerHome:    ()          => navigate('/employer/beranda'),
    toVerifikasi:      ()          => navigate('/employer/verifikasi'),
    toBuatLowongan:    ()          => navigate('/employer/buat-lowongan'),
    toPelamar:         (jobId)     => jobId
                                        ? navigate(`/employer/pelamar/${jobId}`)
                                        : navigate('/employer/pelamar'),
    toEmployerChat:    (chatId)    => chatId
                                        ? navigate(`/employer/pesan/${chatId}`)
                                        : navigate('/employer/pesan'),
    toEscrow:          (projectId) => projectId
                                        ? navigate(`/employer/escrow/${projectId}`)
                                        : navigate('/employer/escrow'),

    location,
  };
}
