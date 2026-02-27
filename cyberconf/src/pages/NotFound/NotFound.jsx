import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <h1 style={{ fontSize: 64, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>
        404
      </h1>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
        Page introuvable
      </h2>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        La page que vous cherchez n'existe pas.
      </p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound;
