import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    role: localStorage.getItem('lumina_role') || null,
    verified: localStorage.getItem('lumina_verified') === 'true',
  });

  function login(role) {
    localStorage.setItem('lumina_role', role);
    setAuth({ role, verified: false });
  }

  function verify() {
    localStorage.setItem('lumina_verified', 'true');
    setAuth(a => ({ ...a, verified: true }));
  }

  function logout() {
    localStorage.removeItem('lumina_role');
    localStorage.removeItem('lumina_verified');
    setAuth({ role: null, verified: false });
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, verify, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
