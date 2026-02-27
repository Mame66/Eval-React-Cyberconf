import { useState } from 'react';
import { promoteUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import useUsers from '../../hooks/useUsers';
import Modal from '../../components/Modal';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const { users, loading, error, refetch } = useUsers();

  const [toPromote, setToPromote] = useState(null);
  const [promoting, setPromoting] = useState(false);

  const handlePromote = async () => {
    setPromoting(true);
    try {
      await promoteUser(toPromote.id, 'admin');
      setToPromote(null);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setPromoting(false);
    }
  };

  const adminsCount = users.filter((u) => u.type === 'admin').length;

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1 className="admin-users__title">Gestion des utilisateurs</h1>
        <p className="admin-users__stats">
          <strong>{users.length}</strong> utilisateur{users.length > 1 ? 's' : ''} dont{' '}
          <strong>{adminsCount}</strong> administrateur{adminsCount > 1 ? 's' : ''}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Chargement...</span>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span style={{ fontWeight: 500 }}>{u.id}</span>
                    {u.id === currentUser?.id && (
                      <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>
                        (vous)
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${u.type === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                      {u.type === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </span>
                  </td>
                  <td>
                    {u.type !== 'admin' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setToPromote(u)}
                      >
                        Promouvoir admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-state">
              <p>Aucun utilisateur trouvé.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal confirmation promotion */}
      {toPromote && (
        <Modal
          title="Promouvoir en administrateur"
          onClose={() => setToPromote(null)}
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setToPromote(null)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePromote}
                disabled={promoting}
              >
                {promoting ? 'En cours...' : 'Confirmer'}
              </button>
            </>
          }
        >
          <p>
            Voulez-vous accorder les droits administrateur à{' '}
            <strong>{toPromote.id}</strong> ?
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
