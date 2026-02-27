import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import ConferenceDetail from './pages/ConferenceDetail';
import AdminConferences from './pages/AdminConferences';
import AdminUsers from './pages/AdminUsers';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Page de connexion sans navbar */}
          <Route path="/login" element={<Login />} />

          {/* Toutes les autres pages avec navbar */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/conferences/:id" element={<ConferenceDetail />} />

                  {/* Routes admin protégées */}
                  <Route
                    path="/admin/conferences"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminConferences />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminUsers />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
