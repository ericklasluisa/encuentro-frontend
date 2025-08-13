import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router";
import {
  PublicRoute,
  OrganizerRoute,
  AsistenteRoute,
} from "../routes/ProtectedRoutes";

// Importar páginas
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminPage from "../pages/AdminPage";
import NotFound from "../pages/NotFound";
import useAuthStore from "../store/authStore";
import EventosPage from "../pages/EventosPage";

function Routes() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  return (
    <RouterRoutes>
      {/* Ruta raíz - redirige según autenticación */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            user.rol === "ORGANIZADOR" ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/eventos" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Rutas públicas - solo accesibles si NO está autenticado */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Rutas protegidas - requieren autenticación */}
      <Route
        path="/eventos"
        element={
          <AsistenteRoute>
            <EventosPage />
          </AsistenteRoute>
        }
      />

      {/* Rutas de administración - solo para ORGANIZADOR */}
      <Route
        path="/admin/*"
        element={
          <OrganizerRoute>
            <AdminPage />
          </OrganizerRoute>
        }
      />

      {/* Página 404 - debe ir al final */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
}

export default Routes;
