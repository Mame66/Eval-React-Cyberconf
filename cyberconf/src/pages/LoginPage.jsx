import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

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
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'login' ? handleLogin : handleSignup;

  return (
    <div className="login-page">
      <div style={{position:'fixed', inset:0, backgroundImage:'radial-gradient(circle at 30% 40%, rgba(232,255,71,0.04) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,71,87,0.04) 0%, transparent 50%)', pointerEvents:'none'}} />
      <div className="login-card">
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--muted)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.75rem'}}>
          // ACCÈS PLATEFORME
        </p>
        <h1 className="login-title">
          {mode === 'login' ? 'Connexion' : 'Inscription'}
          <span style={{color:'var(--accent)'}}>.</span>
        </h1>
        <p className="login-sub">
          {mode === 'login' ? 'Entrez vos identifiants pour accéder à CyberConf' : 'Créez votre compte CyberConf'}
        </p>

        {/* Toggle */}
        <div style={{display:'flex', gap:'0.5rem', marginBottom:'1.5rem', background:'var(--bg)', borderRadius:6, padding:'0.25rem', border:'1px solid var(--border)'}}>
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            style={{flex:1, padding:'0.4rem', borderRadius:4, border:'none', background: mode==='login' ? 'var(--surface)' : 'transparent', color: mode==='login' ? 'var(--text)' : 'var(--muted)', fontFamily:'var(--font-display)', fontWeight:600, fontSize:'0.85rem', transition:'all 0.2s'}}
          >
            Connexion
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            style={{flex:1, padding:'0.4rem', borderRadius:4, border:'none', background: mode==='signup' ? 'var(--surface)' : 'transparent', color: mode==='signup' ? 'var(--text)' : 'var(--muted)', fontFamily:'var(--font-display)', fontWeight:600, fontSize:'0.85rem', transition:'all 0.2s'}}
          >
            Créer un compte
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && (
          <div style={{background:'rgba(232,255,71,0.1)', border:'1px solid rgba(232,255,71,0.3)', color:'var(--accent)', padding:'0.75rem 1rem', borderRadius:6, fontSize:'0.85rem', marginBottom:'1rem'}}>
            {success}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Identifiant</label>
          <input
            className="form-input"
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="votre_id"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{width:'100%', justifyContent:'center', padding:'0.75rem', marginTop:'0.5rem'}}
        >
          {loading ? '...' : mode === 'login' ? '→ Se connecter' : '→ Créer le compte'}
        </button>
      </div>
    </div>
  );
}
