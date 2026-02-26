import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"

import Home from "./pages/Home"
import ConferenceDetail from "./pages/ConferenceDetail"
import Login from "./pages/Login"
import AdminConferences from "./pages/AdminConferences"
import AdminUsers from "./pages/AdminUsers"
import ProtectedRoute from "./components/shared/ProtectedRoute"

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/conference/:id" element={<ConferenceDetail />} />
                    <Route path="/login" element={<Login />} />

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
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App