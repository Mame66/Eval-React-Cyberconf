import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/ConferencePage.css';

export default function ConferencePage() {
  const { id } = useParams();
  const [conf, setConf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getConference(id)
        .then(setConf)
        .catch(e=>setError(e.message))
        .finally(()=>setLoading(false));
  }, [id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!conf) return null;

  const mainColor = conf.design?.mainColor || '#e8ff47';
  const secondColor = conf.design?.secondColor || '#ff4757';

  return (
      <div className="conf-detail-page">
        <div className="conf-hero" style={{backgroundImage:`url(${conf.img || ''})`}}>
          <div className="conf-hero-overlay">
            <Link to="/" className="back-link">← Retour aux conférences</Link>
            <h1>{conf.title}</h1>
          </div>
        </div>

        <div className="conf-color-bar" style={{background:`linear-gradient(90deg, ${mainColor}, ${secondColor})`}} />

        <div className="conf-body">
          <p className="conf-description">{conf.description}</p>

          {conf.content && conf.content.split('\n').map((p,i)=>p?<p key={i}>{p}</p>:null)}

          {conf.speakers?.length>0 && (
              <div className="conf-section">
                <h3>Intervenants</h3>
                <div className="conf-speakers">
                  {conf.speakers.map((s,i)=>(
                      <span key={i} className="speaker-chip">{s.firstname} {s.lastname}</span>
                  ))}
                </div>
              </div>
          )}

          {conf.stakeholders?.length>0 && (
              <div className="conf-section">
                <h3>Partenaires</h3>
                <div className="conf-stakeholders">
                  {conf.stakeholders.map((s,i)=>(
                      <div key={i} className="stakeholder-card">
                        {s.img ? <img src={s.img} alt={s.firstname} className="stakeholder-avatar"/> :
                            <div className="stakeholder-avatar">{s.firstname?.[0]}{s.lastname?.[0]}</div>}
                        <div className="stakeholder-info">
                          <div>{s.firstname} {s.lastname}</div>
                          {s.job && <div className="job">{s.job}</div>}
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </div>

        <div className="conf-sidebar">
          <div className="meta-card">
            <div>Thème couleur</div>
            <div className="color-boxes">
              <div style={{background:mainColor}} />
              <div style={{background:secondColor}} />
            </div>
            <div className="color-values">{mainColor} · {secondColor}</div>
          </div>

          <div className="meta-card">
            <div>Date</div>
            <div>{conf.date ? new Date(conf.date).toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) : '—'}</div>
          </div>

          {conf.duration && (
              <div className="meta-card">
                <div>Durée</div>
                <div>{conf.duration}</div>
              </div>
          )}

          {conf.osMap && (
              <div className="meta-card">
                <div>Lieu</div>
                <div>
                  {conf.osMap.addressl1 && <div>{conf.osMap.addressl1}</div>}
                  {conf.osMap.addressl2 && <div>{conf.osMap.addressl2}</div>}
                  {conf.osMap.postalCode && conf.osMap.city && <div>{conf.osMap.postalCode} {conf.osMap.city}</div>}
                </div>
              </div>
          )}
        </div>
      </div>
  );
}