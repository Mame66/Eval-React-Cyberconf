import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/HomePage.css';

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
            <div className="home-hero">
                <div className="home-hero-content">
                    <p className="program-label">▶ PROGRAMME 2024–2025</p>
                    <h1 className="home-title">Les meilleures <span>conférences</span> tech</h1>
                    <input
                        className="search-input"
                        placeholder="Rechercher une conférence..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="page">
                {loading && <div className="loading">Chargement des conférences...</div>}
                {error && <div className="error-msg">{error}</div>}

                {!loading && !error && filtered.length === 0 && (
                    <div className="empty">Aucune conférence trouvée</div>
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
                                {conf.img && <img src={conf.img} alt={conf.title} className="conf-card-img" />}
                                <div className="conf-card-body">
                                    <div className="conf-card-date">
                                        {conf.date ? new Date(conf.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric'}) : ''}
                                        {conf.duration && <> · {conf.duration}</>}
                                    </div>
                                    <div className="conf-card-title">{conf.title}</div>
                                    <div className="conf-card-desc">{conf.description}</div>
                                </div>
                                <div className="conf-card-footer">
                                    {conf.speakers?.length > 0 && (
                                        <span>{conf.speakers.length} intervenant{conf.speakers.length > 1 ? 's' : ''}</span>
                                    )}
                                    <span className="see-more">Voir →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}