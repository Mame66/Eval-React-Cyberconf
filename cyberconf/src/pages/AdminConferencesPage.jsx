import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ConferenceForm from '../components/ConferenceForm';

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    api.getConferences()
      .then(setConferences)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSave = async (form) => {
    if (editing) {
      await api.updateConference(editing.id, form);
    } else {
      await api.createConference(form);
    }
    load();
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteConference(id);
      setDeleteConfirm(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (conf) => { setEditing(conf); setFormOpen(true); };

  return (
    <div className="page">
      <div className="admin-topbar">
        <div>
          <p style={{fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--muted)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.4rem'}}>
            ADMINISTRATION
          </p>
          <h1 className="page-title">Conférences<span>.</span></h1>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Nouvelle conférence</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading"><div className="spinner" />Chargement...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Thème</th>
                <th>Titre</th>
                <th>Date</th>
                <th>Durée</th>
                <th>Intervenants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conferences.map(conf => (
                <tr key={conf.id}>
                  <td>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: conf.design
                        ? `linear-gradient(135deg, ${conf.design.mainColor}, ${conf.design.secondColor})`
                        : 'var(--border)',
                    }} />
                  </td>
                  <td>
                    <div style={{fontWeight:600}}>{conf.title}</div>
                    <div style={{color:'var(--muted)', fontSize:'0.75rem', fontFamily:'var(--font-mono)'}}>{conf.id}</div>
                  </td>
                  <td style={{fontFamily:'var(--font-mono)', fontSize:'0.8rem', color:'var(--muted)'}}>
                    {conf.date ? new Date(conf.date).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td style={{color:'var(--muted)', fontSize:'0.85rem'}}>{conf.duration || '—'}</td>
                  <td style={{color:'var(--muted)', fontSize:'0.85rem'}}>{conf.speakers?.length || 0}</td>
                  <td>
                    <div style={{display:'flex', gap:'0.5rem'}}>
                      <button className="btn btn-ghost" style={{padding:'0.3rem 0.7rem', fontSize:'0.8rem'}} onClick={() => openEdit(conf)}>
                        Modifier
                      </button>
                      <button className="btn btn-danger" style={{padding:'0.3rem 0.7rem', fontSize:'0.8rem'}} onClick={() => setDeleteConfirm(conf)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {conferences.length === 0 && (
            <div className="empty">
              <div className="empty-icon">📋</div>
              <div className="empty-title">Aucune conférence</div>
              <div className="empty-sub">Créez votre première conférence</div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {formOpen && (
        <ConferenceForm
          conf={editing}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditing(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth: 400}}>
            <div className="modal-header">
              <h2 className="modal-title">Confirmer la suppression</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{color:'var(--muted)', lineHeight:1.6}}>
              Êtes-vous sûr de vouloir supprimer <strong style={{color:'var(--text)'}}>{deleteConfirm.title}</strong> ?<br/>
              Cette action est irréversible.
            </p>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
