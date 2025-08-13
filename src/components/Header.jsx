import React from "react";

export default function Header({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      {/* Buscador */}
      <div className="flex items-center gap-2 w-full max-w-lg">
        <input
          type="text"
          placeholder="Buscar evento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => setSearchTerm("")}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Limpiar
        </button>
      </div>

      {/* Botón Crear Evento */}
      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        Crear Evento
      </button>
    </div>
  );
}
