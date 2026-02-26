import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="page notfound-page">
            <h1>404</h1>
            <h2>Page introuvable</h2>
            <p>Cette page n'existe pas.</p>
            <Link to="/" className="btn btn-primary">← Retour à l'accueil</Link>
        </div>
    );
}