import React from "react";
import { Routes as RouterRoutes, Route, Navigate } from "react-router";
import { 
  ProtectedRoute, 
  PublicRoute, 
  OrganizerRoute, 
  AdminRoute 
} from "../components/ProtectedRoutes";

// Importar páginas
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import AdminPanel from "../pages/AdminPanel";
import NotFound from "../pages/NotFound";

function Routes() {
  return (
    <RouterRoutes>
      {/* Ruta raíz - redirige según autenticación */}
      <Route 
        path="/" 
        element={<Navigate to="/eventos" replace />} 
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
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas de administración - solo para ORGANIZADOR */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />

      {/* Ruta para organizadores específicos */}
      <Route
        path="/organizador/*"
        element={
          <OrganizerRoute>
            <RouterRoutes>
              <Route
                path="dashboard"
                element={<Dashboard />}
              />
              <Route
                path="eventos"
                element={
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Gestión de Eventos</h2>
                    <p className="text-gray-600 mt-2">Aquí irían las funcionalidades de organizador</p>
                  </div>
                }
              />
              <Route
                path="*"
                element={<Navigate to="/organizador/dashboard" replace />}
              />
            </RouterRoutes>
          </OrganizerRoute>
        }
      />

      {/* Página 404 - debe ir al final */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  );
}

export default Routes;