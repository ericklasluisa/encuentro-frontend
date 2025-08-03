import React from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router";

function EventosPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Bienvenido, {user?.nombre}
        </h2>
        <p className="text-gray-600 mb-4">
          Rol: <span className="font-semibold">{user?.rol}</span>
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-150 ease-in-out"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default EventosPage;
