import { useState } from 'react';
import { createConference, updateConference, deleteConference } from '../../services/api';
import useConferences from '../../hooks/useConferences';
import Modal from '../../components/Modal';
import './AdminConferences.css';

// Valeurs initiales du formulaire
const FORM_INITIAL = {
  id: '',
  title: '',
  date: '',
  description: '',
  img: '',
  content: '',
  duration: '',
  design: { mainColor: '#2563eb', secondColor: '#1d4ed8' },
  speakers: [],
  stakeholders: [],
  osMap: { addressl1: '', addressl2: '', postalCode: '', city: '' },
};

const AdminConferences = () => {
  const { conferences, loading, error, refetch } = useConferences();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = création
  const [form, setForm] = useState(FORM_INITIAL);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Inputs temporaires pour speakers et stakeholders
  const [speakerInput, setSpeakerInput] = useState({ firstname: '', lastname: '' });
  const [stakeholderInput, setStakeholderInput] = useState({
    firstname: '', lastname: '', job: '', img: '',
  });

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const setDesignField = (key, value) =>
    setForm((prev) => ({ ...prev, design: { ...prev.design, [key]: value } }));

  const setOsMapField = (key, value) =>
    setForm((prev) => ({ ...prev, osMap: { ...prev.osMap, [key]: value } }));

  //  Ouverture / fermeture formulaire

  const openCreate = () => {
    setEditing(null);
    setForm(FORM_INITIAL);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (conf) => {
    setEditing(conf);
    setForm({
      ...FORM_INITIAL,
      ...conf,
      design: conf.design || FORM_INITIAL.design,
      speakers: conf.speakers || [],
      stakeholders: conf.stakeholders || [],
      osMap: conf.osMap || FORM_INITIAL.osMap,
    });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const addSpeaker = () => {
    if (!speakerInput.firstname || !speakerInput.lastname) return;
    setForm((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { ...speakerInput }],
    }));
    setSpeakerInput({ firstname: '', lastname: '' });
  };

  const removeSpeaker = (index) => {
    setForm((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index),
    }));
  };


  const addStakeholder = () => {
    if (!stakeholderInput.firstname || !stakeholderInput.lastname) return;
    setForm((prev) => ({
      ...prev,
      stakeholders: [...prev.stakeholders, { ...stakeholderInput }],
    }));
    setStakeholderInput({ firstname: '', lastname: '', job: '', img: '' });
  };

  const removeStakeholder = (index) => {
    setForm((prev) => ({
      ...prev,
      stakeholders: prev.stakeholders.filter((_, i) => i !== index),
    }));
  };

  //  Sauvegarde

  const handleSave = async () => {
    if (!form.title || !form.date || !form.description || !form.img || !form.content) {
      setFormError('Les champs marqués * sont obligatoires.');
      return;
    }
    if (!editing && !form.id) {
      setFormError("L'identifiant est obligatoire.");
      return;
    }

    setSaving(true);
    setFormError('');

    // Nettoyer osMap si vide
    const cleanOsMap = Object.values(form.osMap).some((v) => v)
      ? form.osMap
      : undefined;

    const payload = { ...form, osMap: cleanOsMap };

    try {
      if (editing) {
        await updateConference(editing.id, payload);
      } else {
        await createConference(payload);
      }
      closeForm();
      refetch();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  //  Suppression

  const openDelete = (conf) => {
    setToDelete(conf);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteConference(toDelete.id);
      setShowDeleteModal(false);
      setToDelete(null);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  //  Rendu

  return (
    <div className="admin-conferences">
      <div className="admin-conferences__header">
        <h1 className="admin-conferences__title">Gestion des conférences</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + Nouvelle conférence
        </button>
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
                <th>Thème</th>
                <th>Titre</th>
                <th>Date</th>
                <th>Durée</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conferences.map((conf) => (
                <tr key={conf.id}>
                  <td>
                    <div
                      className="table__color-dot"
                      style={{
                        background: conf.design
                          ? `linear-gradient(135deg, ${conf.design.mainColor}, ${conf.design.secondColor})`
                          : '#e2e8f0',
                      }}
                    />
                  </td>
                  <td>
                    <p className="table__title">{conf.title}</p>
                    <p className="table__id">{conf.id}</p>
                  </td>
                  <td>
                    {conf.date
                      ? new Date(conf.date).toLocaleDateString('fr-FR')
                      : '—'}
                  </td>
                  <td>{conf.duration || '—'}</td>
                  <td>
                    <div className="table__actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(conf)}
                      >
                        Modifier
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => openDelete(conf)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {conferences.length === 0 && (
            <div className="empty-state">
              <p>Aucune conférence. Créez-en une !</p>
            </div>
          )}
        </div>
      )}

      {/* ── Modal formulaire ── */}
      {showForm && (
        <Modal
          title={editing ? 'Modifier la conférence' : 'Nouvelle conférence'}
          onClose={closeForm}
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeForm}>
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </>
          }
        >
          {formError && <div className="alert alert-error">{formError}</div>}

          {/* ID (uniquement à la création) */}
          {!editing && (
            <div className="form-group">
              <label className="form-label" htmlFor="conf-id">
                Identifiant <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                id="conf-id"
                type="text"
                className="form-control"
                value={form.id}
                onChange={(e) => setField('id', e.target.value)}
                placeholder="ex: conf-react-2024"
              />
            </div>
          )}

          <div className="conf-form__row">
            <div className="form-group">
              <label className="form-label">
                Titre <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={form.date}
                onChange={(e) => setField('date', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Description <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              className="form-control"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              URL de l'image <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={form.img}
              onChange={(e) => setField('img', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contenu <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              className="form-control"
              style={{ minHeight: 100 }}
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Durée</label>
            <input
              type="text"
              className="form-control"
              value={form.duration}
              onChange={(e) => setField('duration', e.target.value)}
              placeholder="ex: 2h30"
            />
          </div>

          {/* Couleurs */}
          <p className="conf-form__section">Thème couleur</p>
          <div className="conf-form__colors">
            <div className="form-group">
              <label className="form-label">Couleur principale</label>
              <div className="conf-form__color-input">
                <input
                  type="color"
                  className="conf-form__color-picker"
                  value={form.design.mainColor}
                  onChange={(e) => setDesignField('mainColor', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  value={form.design.mainColor}
                  onChange={(e) => setDesignField('mainColor', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Couleur secondaire</label>
              <div className="conf-form__color-input">
                <input
                  type="color"
                  className="conf-form__color-picker"
                  value={form.design.secondColor}
                  onChange={(e) => setDesignField('secondColor', e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  value={form.design.secondColor}
                  onChange={(e) => setDesignField('secondColor', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Aperçu bande couleur */}
          <div
            className="conf-form__preview-bar"
            style={{
              background: `linear-gradient(90deg, ${form.design.mainColor}, ${form.design.secondColor})`,
            }}
          />

          {/* Intervenants */}
          <p className="conf-form__section">Intervenants</p>
          <div className="conf-form__tags">
            {form.speakers.map((s, i) => (
              <span key={i} className="conf-form__tag">
                {s.firstname} {s.lastname}
                <button
                  className="conf-form__tag-remove"
                  onClick={() => removeSpeaker(i)}
                  type="button"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="conf-form__add-row">
            <input
              type="text"
              className="form-control"
              placeholder="Prénom"
              value={speakerInput.firstname}
              onChange={(e) =>
                setSpeakerInput((prev) => ({ ...prev, firstname: e.target.value }))
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Nom"
              value={speakerInput.lastname}
              onChange={(e) =>
                setSpeakerInput((prev) => ({ ...prev, lastname: e.target.value }))
              }
            />
            <button className="btn btn-secondary" onClick={addSpeaker} type="button">
              Ajouter
            </button>
          </div>

          {/* Partenaires */}
          <p className="conf-form__section">Partenaires</p>
          {form.stakeholders.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #e2e8f0', fontSize: 14 }}>
              <span>{s.firstname} {s.lastname}{s.job ? ` — ${s.job}` : ''}</span>
              <button
                className="conf-form__tag-remove"
                onClick={() => removeStakeholder(i)}
                type="button"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="conf-form__add-row-4" style={{ marginTop: 10 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Prénom *"
              value={stakeholderInput.firstname}
              onChange={(e) =>
                setStakeholderInput((prev) => ({ ...prev, firstname: e.target.value }))
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Nom *"
              value={stakeholderInput.lastname}
              onChange={(e) =>
                setStakeholderInput((prev) => ({ ...prev, lastname: e.target.value }))
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="Poste"
              value={stakeholderInput.job}
              onChange={(e) =>
                setStakeholderInput((prev) => ({ ...prev, job: e.target.value }))
              }
            />
            <input
              type="text"
              className="form-control"
              placeholder="URL photo"
              value={stakeholderInput.img}
              onChange={(e) =>
                setStakeholderInput((prev) => ({ ...prev, img: e.target.value }))
              }
            />
            <button className="btn btn-secondary" onClick={addStakeholder} type="button">
              Ajouter
            </button>
          </div>

          {/* Lieu */}
          <p className="conf-form__section">Lieu (optionnel)</p>
          <div className="conf-form__row">
            <div className="form-group">
              <label className="form-label">Adresse</label>
              <input
                type="text"
                className="form-control"
                value={form.osMap.addressl1}
                onChange={(e) => setOsMapField('addressl1', e.target.value)}
                placeholder="Ligne 1"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Complément</label>
              <input
                type="text"
                className="form-control"
                value={form.osMap.addressl2}
                onChange={(e) => setOsMapField('addressl2', e.target.value)}
                placeholder="Ligne 2"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Code postal</label>
              <input
                type="text"
                className="form-control"
                value={form.osMap.postalCode}
                onChange={(e) => setOsMapField('postalCode', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ville</label>
              <input
                type="text"
                className="form-control"
                value={form.osMap.city}
                onChange={(e) => setOsMapField('city', e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal suppression ── */}
      {showDeleteModal && toDelete && (
        <Modal
          title="Confirmer la suppression"
          onClose={() => setShowDeleteModal(false)}
          footer={
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </>
          }
        >
          <p>
            Voulez-vous vraiment supprimer la conférence{' '}
            <strong>{toDelete.title}</strong> ? Cette action est irréversible.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default AdminConferences;
