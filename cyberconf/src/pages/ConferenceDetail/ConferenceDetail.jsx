import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConference } from '../../services/api';
import './ConferenceDetail.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const ConferenceDetail = () => {
  const { id } = useParams();
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getConference(id)
      .then((data) => setConference(data.conference || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <span>Chargement...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  if (!conference) return null;

  const mainColor = conference.design?.mainColor || '#2563eb';
  const secondColor = conference.design?.secondColor || '#1d4ed8';

  return (
    <div className="detail">
      <Link to="/" className="detail__back">
        ← Retour à la liste
      </Link>

      {conference.img && (
        <div className="detail__hero">
          <img
            src={conference.img}
            alt={conference.title}
            className="detail__hero-img"
          />
        </div>
      )}

      {/* Bande couleur thème */}
      <div
        className="detail__color-bar"
        style={{ background: `linear-gradient(90deg, ${mainColor}, ${secondColor})` }}
      />

      <div className="detail__layout">
        {/* Contenu principal */}
        <div>
          <h1 className="detail__title">{conference.title}</h1>

          <p className="detail__description">{conference.description}</p>

          {conference.content && (
            <div className="detail__content">
              {conference.content.split('\n').map((paragraph, i) =>
                paragraph ? <p key={i}>{paragraph}</p> : null
              )}
            </div>
          )}

          {/* Intervenants */}
          {conference.speakers?.length > 0 && (
            <div>
              <p className="detail__section-title">Intervenants</p>
              <div className="detail__speakers">
                {conference.speakers.map((speaker, i) => (
                  <span key={i} className="detail__speaker-tag">
                    {speaker.firstname} {speaker.lastname}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Partenaires */}
          {conference.stakeholders?.length > 0 && (
            <div>
              <p className="detail__section-title">Partenaires</p>
              {conference.stakeholders.map((s, i) => (
                <div key={i} className="detail__stakeholder">
                  {s.img ? (
                    <img
                      src={s.img}
                      alt={s.firstname}
                      className="detail__stakeholder-avatar"
                    />
                  ) : (
                    <div className="detail__stakeholder-avatar">
                      {s.firstname?.[0]}{s.lastname?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="detail__stakeholder-name">
                      {s.firstname} {s.lastname}
                    </p>
                    {s.job && (
                      <p className="detail__stakeholder-job">{s.job}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="detail__sidebar">
          {/* Thème couleur */}
          <div className="detail__meta-card">
            <p className="detail__meta-label">Thème couleur</p>
            <div className="detail__palette">
              <div
                className="detail__palette-swatch"
                style={{ backgroundColor: mainColor }}
                title={mainColor}
              />
              <div
                className="detail__palette-swatch"
                style={{ backgroundColor: secondColor }}
                title={secondColor}
              />
            </div>
            <p className="detail__palette-codes">
              {mainColor} · {secondColor}
            </p>
          </div>

          {/* Date */}
          <div className="detail__meta-card">
            <p className="detail__meta-label">Date</p>
            <p className="detail__meta-value">{formatDate(conference.date)}</p>
          </div>

          {/* Durée */}
          {conference.duration && (
            <div className="detail__meta-card">
              <p className="detail__meta-label">Durée</p>
              <p className="detail__meta-value">{conference.duration}</p>
            </div>
          )}

          {/* Lieu */}
          {conference.osMap && (
            <div className="detail__meta-card">
              <p className="detail__meta-label">Lieu</p>
              <div className="detail__meta-value">
                {conference.osMap.addressl1 && (
                  <p>{conference.osMap.addressl1}</p>
                )}
                {conference.osMap.addressl2 && (
                  <p>{conference.osMap.addressl2}</p>
                )}
                {conference.osMap.postalCode && conference.osMap.city && (
                  <p>{conference.osMap.postalCode} {conference.osMap.city}</p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ConferenceDetail;
