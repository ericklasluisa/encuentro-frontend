import React from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router";

function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Organizador: {user?.nombre}</h2>
        <p className="mb-6">
          Área restringida para administradores del sistema
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

export default AdminPage;
