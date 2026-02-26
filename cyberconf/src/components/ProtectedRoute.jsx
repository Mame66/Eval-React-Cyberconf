import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">🔒</div>
          <div className="empty-title">Accès refusé</div>
          <div className="empty-sub">Vous n'avez pas les droits nécessaires.</div>
        </div>
      </div>
    );
  }

  return children;
}
