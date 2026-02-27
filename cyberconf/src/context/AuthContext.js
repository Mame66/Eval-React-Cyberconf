import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/api';

const AuthContext = createContext(null);

// Décode la partie payload d'un token JWT
const parseJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restaurer la session depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (id, password) => {
    const data = await apiLogin(id, password);

    // L'API retourne { Token: "..." }
      const token = typeof data === 'string'
          ? data
          : data.Token || data.token || '';
    localStorage.setItem('token', token);

    // Lire le rôle depuis le payload JWT
    const payload = parseJWT(token);
    console.log('JWT payload:', payload); // debug : à retirer en production

    const type = payload?.type || 'user';
    const userInfo = { id, type };

    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const signup = async (id, password) => {
    await apiSignup(id, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.type === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
};
