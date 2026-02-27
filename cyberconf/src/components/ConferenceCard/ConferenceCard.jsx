import { Link } from 'react-router-dom';
import './ConferenceCard.css';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const ConferenceCard = ({ conference }) => {
  const { id, title, date, description, img, speakers, design } = conference;

  const colorBar = design
    ? `linear-gradient(90deg, ${design.mainColor}, ${design.secondColor})`
    : '#2563eb';

  return (
    <article className="conference-card">
      <div
        className="conference-card__color-bar"
        style={{ background: colorBar }}
      />

      {img && (
        <img
          src={img}
          alt={title}
          className="conference-card__image"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <div className="conference-card__body">
        <p className="conference-card__date">{formatDate(date)}</p>
        <h2 className="conference-card__title">{title}</h2>
        <p className="conference-card__description">{description}</p>
      </div>

      <div className="conference-card__footer">
        <span className="conference-card__speakers">
          {speakers?.length > 0
            ? `${speakers.length} intervenant${speakers.length > 1 ? 's' : ''}`
            : 'Pas d\'intervenant'}
        </span>
        <Link to={`/conferences/${id}`} className="conference-card__link">
          Voir le détail →
        </Link>
      </div>
    </article>
  );
};

export default ConferenceCard;
