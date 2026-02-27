import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Déjà connecté → rediriger
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        await login(id, password);
        navigate('/');
      } else {
        await signup(id, password);
        setSuccess('Compte créé ! Vous pouvez maintenant vous connecter.');
        setMode('login');
        setId('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">CyberConf</h1>
        <p className="login-card__subtitle">
          Plateforme de gestion des conférences
        </p>

        {/* Onglets connexion / inscription */}
        <div className="login-card__tabs">
          <button
            className={`login-card__tab ${mode === 'login' ? 'login-card__tab--active' : ''}`}
            onClick={() => switchMode('login')}
            type="button"
          >
            Connexion
          </button>
          <button
            className={`login-card__tab ${mode === 'signup' ? 'login-card__tab--active' : ''}`}
            onClick={() => switchMode('signup')}
            type="button"
          >
            Créer un compte
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="id">
              Identifiant <span>*</span>
            </label>
            <input
              id="id"
              type="text"
              className="form-control"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Votre identifiant"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mot de passe <span>*</span>
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-card__submit"
            disabled={loading}
          >
            {loading
              ? 'Chargement...'
              : mode === 'login'
              ? 'Se connecter'
              : 'Créer le compte'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
