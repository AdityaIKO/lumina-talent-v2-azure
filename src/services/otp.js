import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase';

let recaptchaVerifier = null;
let confirmationResult = null;

function normalizePhone(phone) {
  const digits = phone.replace(/[\s\-]/g, '');
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('62')) return '+' + digits;
  if (digits.startsWith('0')) return '+62' + digits.slice(1);
  return '+62' + digits;
}

function clearVerifier() {
  if (recaptchaVerifier) {
    try { recaptchaVerifier.clear(); } catch (_) {}
    recaptchaVerifier = null;
  }
}

export async function sendOtp(rawPhone) {
  clearVerifier();

  // Attach to document.body so no modal/CSS can interfere with the widget
  recaptchaVerifier = new RecaptchaVerifier(auth, document.body, {
    size: 'invisible',
    callback: () => {},
    'expired-callback': clearVerifier,
  });

  await recaptchaVerifier.render();

  const phone = normalizePhone(rawPhone);
  confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
  return phone;
}

export async function verifyOtp(code) {
  if (!confirmationResult) throw new Error('Belum ada OTP yang dikirim.');
  return confirmationResult.confirm(code);
}

export function resetOtp() {
  confirmationResult = null;
  clearVerifier();
}
