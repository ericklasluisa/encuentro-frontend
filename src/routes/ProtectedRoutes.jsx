import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";
import NotAuthorizedPage from "../pages/NotAuthorizedPage";

// Componente para proteger rutas de organizador
export function OrganizerRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated || user?.rol !== "ORGANIZADOR") {
    return <NotAuthorizedPage />;
  }

  return children;
}

// Componente para proteger rutas públicas (redirigir si ya está autenticado)
export function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AsistenteRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== "ASISTENTE") {
    return <Navigate to="/" replace />;
  }

  return children;
}
