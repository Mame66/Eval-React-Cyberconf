import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ConferencePage from './pages/ConferencePage';
import LoginPage from './pages/LoginPage';
import AdminConferencesPage from './pages/AdminConferencesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import NotFoundPage from './pages/NotFoundPage';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/conferences/:id" element={<ConferencePage />} />
                  <Route
                    path="/admin/conferences"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminConferencesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminUsersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
