import React from "react";
import useAuthStore from "../store/authStore";

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    // La navegación será manejada por PublicRoute
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard - Encuentro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenido, {user?.nombre}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user?.rol}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-150 ease-in-out"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Bienvenido a tu Dashboard!
              </h2>
              <p className="text-gray-600 mb-4">
                Rol: <span className="font-semibold">{user?.rol}</span>
              </p>
              {user?.rol === "ORGANIZADOR" && (
                <div className="space-y-2">
                  <p className="text-green-600 font-medium">
                    ✓ Tienes acceso a funciones de organizador
                  </p>
                  <p className="text-blue-600 font-medium">
                    ✓ Tienes acceso a rutas de administración
                  </p>
                </div>
              )}
              {user?.rol === "ASISTENTE" && (
                <p className="text-blue-600 font-medium">
                  ✓ Tienes acceso a funciones de asistente
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
