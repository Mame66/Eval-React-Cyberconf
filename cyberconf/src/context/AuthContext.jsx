import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async (id, password) => {
    const data = await api.login(id, password);
    const token = data.Token || data.token || '';
    localStorage.setItem('token', token);

    // On utilise /isadmin pour déterminer le rôle de façon fiable
    let type = 'user';
    try {
      const isAdminRes = await api.isAdmin();
      type = isAdminRes ? 'admin' : 'user';
    } catch (_) {
      // Fallback : essayer de décoder le JWT
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        type = payload.type || payload.role || 'user';
      } catch (_) {}
    }

    const userInfo = { id, type };
    localStorage.setItem('user', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.type === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
