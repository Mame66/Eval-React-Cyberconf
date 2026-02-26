import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <NavLink to="/" className="nav-logo">// CYBER<span className="accent">CONF</span></NavLink>

            <div className="nav-links">
                <NavLink to="/" className={({isActive})=>`nav-link${isActive?' active':''}`} end>
                    Conférences
                </NavLink>

                {isAdmin && (
                    <>
                        <NavLink to="/admin/conferences" className={({isActive})=>`nav-link${isActive?' active':''}`}>
                            Gestion Conf. <span className="nav-badge">ADMIN</span>
                        </NavLink>
                        <NavLink to="/admin/users" className={({isActive})=>`nav-link${isActive?' active':''}`}>
                            Utilisateurs <span className="nav-badge">ADMIN</span>
                        </NavLink>
                    </>
                )}

                {user ? (
                    <>
                        <span className="nav-user">{user.id} {isAdmin && <span className="nav-badge">ADMIN</span>}</span>
                        <button className="btn btn-ghost logout-btn" onClick={handleLogout}>Déconnexion</button>
                    </>
                ) : (
                    <NavLink to="/login" className="btn btn-primary">Connexion</NavLink>
                )}
            </div>
        </nav>
    );
}