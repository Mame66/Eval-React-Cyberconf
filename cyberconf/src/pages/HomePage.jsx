import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function HomePage() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getConferences()
      .then(setConferences)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = conferences.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #16161f 100%)',
        borderBottom: '1px solid #2a2a3a',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232,255,71,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,71,87,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{maxWidth: 1200, margin: '0 auto', position: 'relative'}}>
          <p style={{fontFamily:'var(--font-mono)', fontSize:'0.75rem', color:'var(--muted)', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'1rem'}}>
            ▶ PROGRAMME 2024–2025
          </p>
          <h1 className="page-title" style={{marginBottom:'1.5rem'}}>
            Les meilleures<br/>
            <span>conférences</span> tech
          </h1>
          <input
            className="form-input"
            style={{maxWidth: 400}}
            placeholder="Rechercher une conférence..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="page" style={{paddingTop: '2rem'}}>
        {loading && (
          <div className="loading">
            <div className="spinner" />
            Chargement des conférences...
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div className="empty-title">Aucune conférence trouvée</div>
            <div className="empty-sub">Essayez un autre terme de recherche</div>
          </div>
        )}

        {!loading && (
          <div className="conf-grid">
            {filtered.map(conf => (
              <Link to={`/conferences/${conf.id}`} key={conf.id} className="conf-card">
                <div
                  className="conf-card-color"
                  style={{
                    background: conf.design
                      ? `linear-gradient(90deg, ${conf.design.mainColor}, ${conf.design.secondColor})`
                      : 'var(--accent)',
                  }}
                />
                {conf.img && (
                  <img src={conf.img} alt={conf.title} className="conf-card-img" onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div className="conf-card-body">
                  <div className="conf-card-date">
                    {conf.date ? new Date(conf.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                    {conf.duration && <> · {conf.duration}</>}
                  </div>
                  <div className="conf-card-title">{conf.title}</div>
                  <div className="conf-card-desc">{conf.description}</div>
                </div>
                <div className="conf-card-footer">
                  {conf.speakers?.length > 0 && (
                    <span style={{fontSize:'0.8rem', color:'var(--muted)'}}>
                      {conf.speakers.length} intervenant{conf.speakers.length > 1 ? 's' : ''}
                    </span>
                  )}
                  <span style={{
                    fontFamily:'var(--font-mono)', fontSize:'0.75rem',
                    color: conf.design?.mainColor || 'var(--accent)',
                  }}>
                    Voir →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
