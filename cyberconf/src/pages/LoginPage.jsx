import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import '../styles/LoginPage.css';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleLogin = async () => {
    if (!id || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');
    try {
      await login(id, password);
      navigate('/');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!id || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.signup(id, password);
      setSuccess('Compte créé ! Vous pouvez maintenant vous connecter.');
      setMode('login');
      localStorage.setItem('token', res.Token);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'login' ? handleLogin : handleSignup;

  return (
      <div className="login-page">
        <div className="login-bg"></div>
        <div className="login-card">
          <p className="login-card-subtitle">// ACCÈS PLATEFORME</p>
          <h1 className="login-card-title">{mode === 'login' ? 'Connexion' : 'Inscription'}<span className="accent">.</span></h1>
          <p className="login-card-description">
            {mode === 'login' ? 'Entrez vos identifiants pour accéder à CyberConf' : 'Créez votre compte CyberConf'}
          </p>

          {/* Toggle login/signup */}
          <div className="login-toggle">
            <button className={mode==='login'?'active':''} onClick={()=>{setMode('login'); setError(''); setSuccess('');}}>Connexion</button>
            <button className={mode==='signup'?'active':''} onClick={()=>{setMode('signup'); setError(''); setSuccess('');}}>Créer un compte</button>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <div className="form-group">
            <label>Identifiant</label>
            <input
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="votre_id"
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
            />
          </div>

          <button className="btn btn-primary login-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? '...' : mode==='login' ? '→ Se connecter' : '→ Créer le compte'}
          </button>
        </div>
      </div>
  );
}