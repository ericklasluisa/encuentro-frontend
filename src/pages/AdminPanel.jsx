import React from "react";
import useAuthStore from "../store/authStore";

function AdminPanel() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">
                Panel de Administración - Encuentro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">
                Admin: {user?.nombre}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                ADMIN
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🔧 Panel de Administración
              </h2>
              <p className="text-gray-300 mb-6">
                Área restringida para administradores del sistema
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Gestión de Usuarios
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Administrar usuarios registrados
                  </p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Gestión de Eventos
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Supervisar y moderar eventos
                  </p>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Reportes y Analytics
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Ver estadísticas del sistema
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  ⚠️ Solo usuarios con rol ORGANIZADOR pueden acceder a esta
                  área
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
