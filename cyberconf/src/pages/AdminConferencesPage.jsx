import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ConferenceForm from '../components/ConferenceForm';

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editConf, setEditConf] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadConferences = async () => {
    setLoading(true);
    try {
      const data = await api.getConferences();
      setConferences(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  const handleSave = async (conf) => {
    try {
      if (editConf) {
        await api.updateConference(editConf.id, conf);
      } else {
        await api.createConference(conf);
      }
      loadConferences();
      setShowForm(false);
      setEditConf(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette conférence ?")) return;
    try {
      await api.deleteConference(id);
      loadConferences();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
      <div className="page admin-page">
        <div className="admin-header">
          <h1>Gestion des conférences</h1>
          <button className="btn btn-primary" onClick={() => { setEditConf(null); setShowForm(true); }}>
            + Nouvelle conférence
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
            <div className="loading"><div className="spinner" /> Chargement...</div>
        ) : (
            <table className="admin-table">
              <thead>
              <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {conferences.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.title}</td>
                    <td>{c.date ? new Date(c.date).toLocaleDateString('fr-FR') : '—'}</td>
                    <td>
                      <button className="btn btn-ghost" onClick={() => { setEditConf(c); setShowForm(true); }}>✎ Modifier</button>
                      <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>🗑 Supprimer</button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
        )}

        {showForm && (
            <ConferenceForm
                conf={editConf}
                onSave={handleSave}
                onClose={() => { setShowForm(false); setEditConf(null); }}
            />
        )}
      </div>
  );
}