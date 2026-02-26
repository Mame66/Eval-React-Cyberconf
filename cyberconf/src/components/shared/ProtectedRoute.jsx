import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

function ProtectedRoute({ children, adminOnly }) {
    const { user } = useContext(AuthContext)

    if (!user) return <Navigate to="/login" />

    if (adminOnly && user.type !== "admin")
        return <Navigate to="/" />

    return children
}

export default ProtectedRoute