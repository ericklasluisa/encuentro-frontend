import { Navigate } from "react-router";
import useAuthStore from "../store/authStore";

// Componente para proteger rutas que requieren autenticación
export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Componente para proteger rutas de organizador
export function OrganizerRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.rol !== "ORGANIZADOR") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Componente para proteger rutas públicas (redirigir si ya está autenticado)
export function PublicRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Componente para rutas de admin (asumiendo que admin es un rol específico o ORGANIZADOR con permisos especiales)
export function AdminRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Por ahora, consideramos que ORGANIZADOR tiene acceso a rutas admin
  // Puedes ajustar esta lógica según tus necesidades
  if (user?.rol !== "ORGANIZADOR") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
