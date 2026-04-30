import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut 
} from 'firebase/auth';
import { authenticateUser, registerNewUser, getUserProfile, updateUserProfile } from '../services/database';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem('lumina_role') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional profile data from Cosmos DB
        try {
          const { user: profile } = await getUserProfile(firebaseUser.uid);
          setUser({ ...firebaseUser, ...profile });
          setRole(profile.role);
        } catch (e) {
          console.warn('Profile not found in Cosmos DB, using Firebase user only.');
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    if (!fbUser.emailVerified) {
      await signOut(auth);
      throw new Error('VERIFY_EMAIL');
    }

    // Ensure session sync with Cosmos DB
    let profile;
    try {
      const result = await getUserProfile(fbUser.uid);
      profile = result.user;
      console.log('[Auth] Profile found:', profile);
    } catch (e) {
      console.warn('[Auth] Profile missing in DB, healing...', fbUser.email);
      // Self-healing: Create a basic profile if missing
      const newProfile = {
        id: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || fbUser.email.split('@')[0],
        role: 'freelancer', // Default role for healed accounts
        verified: true
      };
      const result = await registerNewUser(newProfile);
      profile = result.user;
    }

    localStorage.setItem('lumina_role', profile.role);
    localStorage.setItem('user_session', JSON.stringify({ ...fbUser, ...profile }));
    
    return { ...fbUser, ...profile };
  }

  async function signup(userData) {
    const { email, password, name, role } = userData;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // Send verification email
    await sendEmailVerification(fbUser);

    // Save metadata to Cosmos DB using Firebase UID
    const profile = await registerNewUser({
      id: fbUser.uid,
      email,
      name,
      role,
      verified: false
    });

    return { fbUser, profile };
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem('lumina_role');
    localStorage.removeItem('user_session');
  }

  async function updateProfile(data) {
    if (!user) return;
    const { user: updatedProfile } = await updateUserProfile(user.uid, data);
    const fullUser = { ...user, ...updatedProfile };
    setUser(fullUser);
    localStorage.setItem('user_session', JSON.stringify(fullUser));
    return fullUser;
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, login, signup, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
