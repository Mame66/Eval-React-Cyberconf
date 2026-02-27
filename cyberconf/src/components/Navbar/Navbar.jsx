import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__logo">
        CyberConf
      </NavLink>

      <div className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
          }
        >
          Conférences
        </NavLink>

        {isAdmin && (
          <>
            <NavLink
              to="/admin/conferences"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              Gérer les conférences
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
              }
            >
              Gérer les utilisateurs
            </NavLink>
          </>
        )}

        {user ? (
          <>
            <span className="navbar__user">
              {user.id}
              {isAdmin && (
                <span className="badge badge-admin">Admin</span>
              )}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
              Déconnexion
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Connexion
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
