import { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoteConfirm, setPromoteConfirm] = useState(null);
  const [promoting, setPromoting] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handlePromote = async (userId) => {
    setPromoting(true);
    try {
      await api.promoteUser(userId);
      setPromoteConfirm(null);
      loadUsers();
    } catch (e) {
      setError(e.message);
    } finally {
      setPromoting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      await api.deleteUser(userId);
      loadUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  const admins = users.filter(u => u.type === 'admin');
  const regular = users.filter(u => u.type !== 'admin');

  return (
      <div className="page admin-page">
        <div className="admin-header">
          <h1>Gestion des utilisateurs</h1>
          <div className="admin-stats">
            <span>{admins.length} admin{admins.length > 1 ? 's' : ''}</span>
            <span>{regular.length} utilisateur{regular.length > 1 ? 's' : ''}</span>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
            <div className="loading"><div className="spinner" /> Chargement...</div>
        ) : (
            <table className="admin-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.type === 'admin' ? 'Administrateur' : 'Utilisateur'}</td>
                    <td>
                      {u.type !== 'admin' && (
                          <button className="btn btn-ghost" onClick={() => setPromoteConfirm(u)}>↑ Promouvoir admin</button>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>🗑 Supprimer</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}

        {/* Modal promotion */}
        {promoteConfirm && (
            <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setPromoteConfirm(null)}>
              <div className="modal">
                <div className="modal-header">
                  <h2 className="modal-title">Promouvoir administrateur</h2>
                  <button className="modal-close" onClick={() => setPromoteConfirm(null)}>✕</button>
                </div>
                <p>
                  Voulez-vous accorder les droits administrateur à <strong>{promoteConfirm.id}</strong> ?
                </p>
                <div className="modal-footer">
                  <button className="btn btn-ghost" onClick={() => setPromoteConfirm(null)}>Annuler</button>
                  <button className="btn btn-primary" onClick={() => handlePromote(promoteConfirm.id)} disabled={promoting}>
                    {promoting ? 'Promotion...' : '↑ Confirmer'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}