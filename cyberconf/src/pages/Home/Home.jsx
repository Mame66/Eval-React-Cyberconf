import { useState } from 'react';
import useConferences from '../../hooks/useConferences';
import ConferenceCard from '../../components/ConferenceCard';
import './Home.css';

const Home = () => {
  const { conferences, loading, error } = useConferences();
  const [search, setSearch] = useState('');

  const filtered = conferences.filter((c) =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="home">
      <div className="home__header">
        <h1 className="home__title">Les conférences</h1>
        <p className="home__subtitle">
          Retrouvez l'ensemble des conférences disponibles
        </p>
        <div className="home__search">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher une conférence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner" />
          <span>Chargement...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <p>Aucune conférence trouvée.</p>
        </div>
      )}

      {!loading && (
        <div className="home__grid">
          {filtered.map((conference) => (
            <ConferenceCard key={conference.id} conference={conference} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
