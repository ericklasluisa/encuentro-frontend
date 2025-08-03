import React from "react";
import { Link } from "react-router";

function NotAuthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="h-16 w-16 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white text-2xl font-bold">!</span>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        No tienes permiso para acceder a esta página
      </h2>

      <div className="space-x-4">
        <Link
          to="/"
          className="items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
        >
          Regresar
        </Link>
      </div>
    </div>
  );
}

export default NotAuthorizedPage;
