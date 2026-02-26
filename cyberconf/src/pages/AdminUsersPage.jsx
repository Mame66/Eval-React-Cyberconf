import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoteConfirm, setPromoteConfirm] = useState(null);
  const [promoting, setPromoting] = useState(false);

  const load = () => {
    setLoading(true);
    api.getUsers()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handlePromote = async (userId) => {
    setPromoting(true);
    try {
      await api.promoteUser(userId);
      setPromoteConfirm(null);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setPromoting(false);
    }
  };

  const admins = users.filter(u => u.type === 'admin');
  const regular = users.filter(u => u.type !== 'admin');

  return (
    <div className="page">
      <div className="admin-topbar">
        <div>
          <p style={{fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem'}}>
            ADMINISTRATION
          </p>
          <h1 className="page-title">Utilisateurs<span style={{color:'var(--accent)'}}>.</span></h1>
        </div>
        <div style={{display:'flex', gap:'1rem', fontFamily:'var(--font-mono)', fontSize:'0.8rem', color:'var(--muted)'}}>
          <span><strong style={{color:'var(--accent)', fontSize:'1.5rem'}}>{admins.length}</strong> admin</span>
          <span><strong style={{color:'var(--text)', fontSize:'1.5rem'}}>{regular.length}</strong> utilisateur{regular.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner" />Chargement...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 6,
                        background: u.type === 'admin' ? 'rgba(232,255,71,0.15)' : 'var(--surface)',
                        border: u.type === 'admin' ? '1px solid rgba(232,255,71,0.3)' : '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.85rem',
                        color: u.type === 'admin' ? 'var(--accent)' : 'var(--muted)',
                      }}>
                        {u.id?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{fontWeight:600}}>{u.id}</div>
                        {u.id === currentUser?.id && (
                          <div style={{fontSize:'0.7rem', color:'var(--muted)', fontFamily:'var(--font-mono)'}}>vous</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${u.type === 'admin' ? 'admin' : 'user'}`}>
                      {u.type === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td>
                    {u.type !== 'admin' && u.id !== currentUser?.id && (
                      <button
                        className="btn btn-ghost"
                        style={{padding:'0.3rem 0.7rem', fontSize:'0.8rem'}}
                        onClick={() => setPromoteConfirm(u)}
                      >
                        ↑ Promouvoir admin
                      </button>
                    )}
                    {u.id === currentUser?.id && (
                      <span style={{color:'var(--muted)', fontSize:'0.8rem', fontFamily:'var(--font-mono)'}}>compte actif</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="empty">
              <div className="empty-icon">👥</div>
              <div className="empty-title">Aucun utilisateur</div>
            </div>
          )}
        </div>
      )}

      {/* Promote confirm */}
      {promoteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:420}}>
            <div className="modal-header">
              <h2 className="modal-title">Promouvoir administrateur</h2>
              <button className="modal-close" onClick={() => setPromoteConfirm(null)}>✕</button>
            </div>
            <p style={{color:'var(--muted)', lineHeight:1.6}}>
              Voulez-vous accorder les droits administrateur à <strong style={{color:'var(--accent)'}}>{promoteConfirm.id}</strong> ?
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setPromoteConfirm(null)}>Annuler</button>
              <button
                className="btn btn-primary"
                onClick={() => handlePromote(promoteConfirm.id)}
                disabled={promoting}
              >
                {promoting ? 'Promotion...' : '↑ Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
