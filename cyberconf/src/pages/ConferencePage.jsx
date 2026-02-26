import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function ConferencePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conf, setConf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getConference(id)
      .then(setConf)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" />Chargement...</div>;
  if (error) return <div className="page"><div className="error-msg">{error}</div></div>;
  if (!conf) return null;

  const mainColor = conf.design?.mainColor || '#e8ff47';
  const secondColor = conf.design?.secondColor || '#ff4757';

  return (
    <>
      {/* Hero */}
      <div className="detail-hero">
        {conf.img && <img src={conf.img} alt={conf.title} />}
        <div className="detail-hero-overlay">
          <div>
            <Link to="/" style={{fontFamily:'var(--font-mono)', fontSize:'0.75rem', color:'rgba(255,255,255,0.5)', letterSpacing:'0.1em', display:'block', marginBottom:'1rem'}}>
              ← Retour aux conférences
            </Link>
            <h1 className="detail-hero-title">{conf.title}</h1>
          </div>
        </div>
      </div>

      {/* Theme color bar */}
      <div style={{
        height: '6px',
        background: `linear-gradient(90deg, ${mainColor}, ${secondColor})`,
      }} />

      <div className="detail-body">
        {/* Main content */}
        <div>
          <p style={{color:'var(--muted)', fontSize:'1.05rem', lineHeight:'1.7', marginBottom:'2rem', fontStyle:'italic', borderLeft:`3px solid ${mainColor}`, paddingLeft:'1rem'}}>
            {conf.description}
          </p>

          {conf.content && (
            <div className="detail-content" style={{marginBottom:'2rem'}}>
              {conf.content.split('\n').map((p, i) => p ? <p key={i} style={{marginBottom:'1rem'}}>{p}</p> : null)}
            </div>
          )}

          {/* Speakers */}
          {conf.speakers?.length > 0 && (
            <div style={{marginBottom:'2rem'}}>
              <h3 style={{fontWeight:700, marginBottom:'1rem', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)'}}>
                Intervenants
              </h3>
              <div style={{display:'flex', flexWrap:'wrap'}}>
                {conf.speakers.map((s, i) => (
                  <span key={i} className="speaker-chip">
                    <span style={{width:8, height:8, borderRadius:'50%', background: mainColor, display:'inline-block'}} />
                    {s.firstname} {s.lastname}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stakeholders */}
          {conf.stakeholders?.length > 0 && (
            <div>
              <h3 style={{fontWeight:700, marginBottom:'1rem', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--muted)'}}>
                Partenaires
              </h3>
              {conf.stakeholders.map((s, i) => (
                <div key={i} className="stakeholder-card">
                  {s.img ? (
                    <img src={s.img} alt={s.firstname} className="stakeholder-avatar" />
                  ) : (
                    <div className="stakeholder-avatar" style={{background:`linear-gradient(135deg, ${mainColor}33, ${secondColor}33)`, display:'flex', alignItems:'center', justifyContent:'center', color: mainColor, fontWeight:700}}>
                      {s.firstname?.[0]}{s.lastname?.[0]}
                    </div>
                  )}
                  <div className="stakeholder-info">
                    <div className="name">{s.firstname} {s.lastname}</div>
                    {s.job && <div className="job">{s.job}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Color theme */}
          <div className="detail-meta-card">
            <div className="detail-meta-label">Thème couleur</div>
            <div style={{display:'flex', gap:'0.5rem', marginBottom:'0.75rem'}}>
              <div style={{flex:1, height:40, borderRadius:4, background:mainColor}} title={mainColor} />
              <div style={{flex:1, height:40, borderRadius:4, background:secondColor}} title={secondColor} />
            </div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'0.7rem', color:'var(--muted)'}}>
              {mainColor} · {secondColor}
            </div>
          </div>

          {/* Meta */}
          <div className="detail-meta-card">
            <div className="detail-meta-label">Date</div>
            <div className="detail-meta-value" style={{color: mainColor}}>
              {conf.date ? new Date(conf.date).toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) : '—'}
            </div>
          </div>

          {conf.duration && (
            <div className="detail-meta-card">
              <div className="detail-meta-label">Durée</div>
              <div className="detail-meta-value">{conf.duration}</div>
            </div>
          )}

          {conf.osMap && (
            <div className="detail-meta-card">
              <div className="detail-meta-label">Lieu</div>
              <div className="detail-meta-value" style={{fontSize:'0.9rem'}}>
                {conf.osMap.addressl1 && <div>{conf.osMap.addressl1}</div>}
                {conf.osMap.addressl2 && <div>{conf.osMap.addressl2}</div>}
                {conf.osMap.postalCode && conf.osMap.city && (
                  <div>{conf.osMap.postalCode} {conf.osMap.city}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
