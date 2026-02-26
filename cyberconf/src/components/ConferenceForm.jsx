import { useState, useEffect } from 'react';

const EMPTY = {
  id: '', title: '', date: '', description: '', img: '', content: '', duration: '',
  design: { mainColor: '#e8ff47', secondColor: '#ff4757' },
  speakers: [],
  stakeholders: [],
  osMap: { addressl1: '', addressl2: '', postalCode: '', city: '' },
};

export default function ConferenceForm({ conf, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [speakerInput, setSpeakerInput] = useState({ firstname: '', lastname: '' });
  const [stakeholderInput, setStakeholderInput] = useState({ firstname: '', lastname: '', job: '', img: '' });

  useEffect(() => {
    if (conf) {
      setForm({
        ...EMPTY, ...conf,
        design: conf.design || EMPTY.design,
        speakers: conf.speakers || [],
        stakeholders: conf.stakeholders || [],
        osMap: conf.osMap || EMPTY.osMap,
      });
    } else {
      setForm(EMPTY);
    }
  }, [conf]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setDesign = (key, val) => setForm(f => ({ ...f, design: { ...f.design, [key]: val } }));
  const setOsMap = (key, val) => setForm(f => ({ ...f, osMap: { ...f.osMap, [key]: val } }));

  const addSpeaker = () => {
    if (!speakerInput.firstname || !speakerInput.lastname) return;
    setForm(f => ({ ...f, speakers: [...f.speakers, { ...speakerInput }] }));
    setSpeakerInput({ firstname: '', lastname: '' });
  };

  const removeSpeaker = (i) => setForm(f => ({ ...f, speakers: f.speakers.filter((_, idx) => idx !== i) }));

  const addStakeholder = () => {
    if (!stakeholderInput.firstname || !stakeholderInput.lastname) return;
    setForm(f => ({ ...f, stakeholders: [...f.stakeholders, { ...stakeholderInput }] }));
    setStakeholderInput({ firstname: '', lastname: '', job: '', img: '' });
  };

  const removeStakeholder = (i) => setForm(f => ({ ...f, stakeholders: f.stakeholders.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.description || !form.img || !form.content) {
      setError('Veuillez remplir tous les champs obligatoires (*).');
      return;
    }
    if (!conf && !form.id) {
      setError("L'identifiant est obligatoire.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Nettoyer osMap si vide
      const cleanOsMap = Object.values(form.osMap).some(v => v)
        ? form.osMap : undefined;
      await onSave({ ...form, osMap: cleanOsMap });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {marginBottom:0};

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{maxWidth:700}}>
        <div className="modal-header">
          <h2 className="modal-title">{conf ? 'Modifier' : 'Nouvelle conférence'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {/* Infos de base */}
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'1rem'}}>Informations de base</p>

        {!conf && (
          <div className="form-group">
            <label className="form-label">ID * <span style={{color:'var(--muted)', fontWeight:400, textTransform:'none', letterSpacing:0}}>(identifiant unique, ex: conf-react-2024)</span></label>
            <input className="form-input" style={inputStyle} value={form.id} onChange={e => set('id', e.target.value)} placeholder="conf-react-2024" />
          </div>
        )}

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
          <div className="form-group">
            <label className="form-label">Titre *</label>
            <input className="form-input" style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input className="form-input" style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-input" style={{...inputStyle, minHeight:70}} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">URL Image *</label>
          <input className="form-input" style={inputStyle} value={form.img} onChange={e => set('img', e.target.value)} placeholder="https://..." />
        </div>

        <div className="form-group">
          <label className="form-label">Contenu *</label>
          <textarea className="form-input" style={{...inputStyle, minHeight:100}} value={form.content} onChange={e => set('content', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Durée</label>
          <input className="form-input" style={inputStyle} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="2h30" />
        </div>

        {/* Couleurs */}
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.1em', margin:'1rem 0'}}>Thème couleur *</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
          <div className="form-group">
            <label className="form-label">Couleur principale</label>
            <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
              <input type="color" value={form.design?.mainColor || '#e8ff47'} onChange={e => setDesign('mainColor', e.target.value)} style={{width:40, height:36, border:'1px solid #2a2a3a', borderRadius:4, background:'none', cursor:'pointer', flexShrink:0}} />
              <input className="form-input" style={inputStyle} value={form.design?.mainColor || ''} onChange={e => setDesign('mainColor', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Couleur secondaire</label>
            <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
              <input type="color" value={form.design?.secondColor || '#ff4757'} onChange={e => setDesign('secondColor', e.target.value)} style={{width:40, height:36, border:'1px solid #2a2a3a', borderRadius:4, background:'none', cursor:'pointer', flexShrink:0}} />
              <input className="form-input" style={inputStyle} value={form.design?.secondColor || ''} onChange={e => setDesign('secondColor', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Aperçu couleurs */}
        <div style={{height:6, borderRadius:3, background:`linear-gradient(90deg, ${form.design?.mainColor || '#e8ff47'}, ${form.design?.secondColor || '#ff4757'})`, marginBottom:'1.5rem'}} />

        {/* Speakers */}
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem'}}>Intervenants</p>
        {form.speakers.length > 0 && (
          <div style={{display:'flex', flexWrap:'wrap', gap:'0.4rem', marginBottom:'0.75rem'}}>
            {form.speakers.map((s, i) => (
              <span key={i} style={{display:'inline-flex', alignItems:'center', gap:'0.4rem', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:99, padding:'0.25rem 0.6rem', fontSize:'0.8rem'}}>
                {s.firstname} {s.lastname}
                <button onClick={() => removeSpeaker(i)} style={{background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:'0.9rem', lineHeight:1, padding:0}}>✕</button>
              </span>
            ))}
          </div>
        )}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'0.5rem', marginBottom:'1.5rem'}}>
          <input className="form-input" style={inputStyle} placeholder="Prénom" value={speakerInput.firstname} onChange={e => setSpeakerInput(s => ({...s, firstname: e.target.value}))} />
          <input className="form-input" style={inputStyle} placeholder="Nom" value={speakerInput.lastname} onChange={e => setSpeakerInput(s => ({...s, lastname: e.target.value}))} />
          <button className="btn btn-ghost" onClick={addSpeaker} style={{padding:'0.5rem 0.75rem'}}>+ Ajouter</button>
        </div>

        {/* Stakeholders */}
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem'}}>Partenaires</p>
        {form.stakeholders.length > 0 && (
          <div style={{marginBottom:'0.75rem'}}>
            {form.stakeholders.map((s, i) => (
              <div key={i} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.4rem 0.75rem', background:'var(--bg)', borderRadius:4, marginBottom:'0.25rem', fontSize:'0.85rem'}}>
                <span>{s.firstname} {s.lastname} {s.job && <span style={{color:'var(--muted)'}}>— {s.job}</span>}</span>
                <button onClick={() => removeStakeholder(i)} style={{background:'none', border:'none', color:'var(--muted)', cursor:'pointer'}}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.5rem'}}>
          <input className="form-input" style={inputStyle} placeholder="Prénom *" value={stakeholderInput.firstname} onChange={e => setStakeholderInput(s => ({...s, firstname: e.target.value}))} />
          <input className="form-input" style={inputStyle} placeholder="Nom *" value={stakeholderInput.lastname} onChange={e => setStakeholderInput(s => ({...s, lastname: e.target.value}))} />
          <input className="form-input" style={inputStyle} placeholder="Poste (optionnel)" value={stakeholderInput.job} onChange={e => setStakeholderInput(s => ({...s, job: e.target.value}))} />
          <input className="form-input" style={inputStyle} placeholder="URL photo (optionnel)" value={stakeholderInput.img} onChange={e => setStakeholderInput(s => ({...s, img: e.target.value}))} />
        </div>
        <button className="btn btn-ghost" onClick={addStakeholder} style={{marginBottom:'1.5rem', fontSize:'0.8rem'}}>+ Ajouter un partenaire</button>

        {/* Lieu */}
        <p style={{fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.75rem'}}>Lieu (optionnel)</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'1.5rem'}}>
          <input className="form-input" style={inputStyle} placeholder="Adresse ligne 1" value={form.osMap?.addressl1 || ''} onChange={e => setOsMap('addressl1', e.target.value)} />
          <input className="form-input" style={inputStyle} placeholder="Adresse ligne 2" value={form.osMap?.addressl2 || ''} onChange={e => setOsMap('addressl2', e.target.value)} />
          <input className="form-input" style={inputStyle} placeholder="Code postal" value={form.osMap?.postalCode || ''} onChange={e => setOsMap('postalCode', e.target.value)} />
          <input className="form-input" style={inputStyle} placeholder="Ville" value={form.osMap?.city || ''} onChange={e => setOsMap('city', e.target.value)} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}
