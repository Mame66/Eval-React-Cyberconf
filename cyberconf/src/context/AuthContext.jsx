import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifie le token et récupère les infos utilisateur au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedId = localStorage.getItem('userId');
    if (!token || !storedId) {
      setLoading(false);
      return;
    }

    async function fetchAdmin() {
      try {
        const admin = await api.isAdmin();
        setUser({ id: storedId });
        setIsAdmin(admin);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      } finally {
        setLoading(false);
      }
    }

    fetchAdmin();
  }, []);

  // Fonction de login
  const login = async (id, password) => {
    const res = await api.login(id, password);
    localStorage.setItem('token', res.Token);
    localStorage.setItem('userId', id);
    setUser({ id });
    const admin = await api.isAdmin();
    setIsAdmin(admin);
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAdmin(false);
  };

  return (
      <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}