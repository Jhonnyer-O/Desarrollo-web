import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { profile, user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  // Verificamos si el rol es ADMIN en el perfil o en el objeto user
  const isAdmin = profile?.role === "ADMIN" || user?.role === "ADMIN";

  if (!isAdmin) {
    // Si no es admin, lo redirigimos al dashboard general por seguridad
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;