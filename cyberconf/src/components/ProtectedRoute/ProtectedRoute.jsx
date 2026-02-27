import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Protège une route : redirige vers /login si non connecté
// Si adminOnly=true, affiche une erreur si pas admin
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
        <h2>Accès refusé</h2>
        <p>Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
