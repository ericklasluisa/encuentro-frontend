import React from "react";

export default function SidebarAsistente({
  selectedTypes,
  setSelectedTypes,
  selectedDate,
  setSelectedDate,
  locationFilter,
  setLocationFilter,
}) {
  const eventTypes = [
    "EVENTO MUSICAL",
    "EVENTO DEPORTIVO",
    "TALLER",
    "CONGRESO",
  ];
  const dateOptions = ["Hoy", "Esta semana", "Este mes"];

  const toggleType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedDate("");
    setLocationFilter("");
  };

  return (
    <aside className="w-64 bg-white shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Filtros</h2>

      {/* Tipos */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Tipo de Evento</h3>
        {eventTypes.map((tipo) => (
          <label key={tipo} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedTypes.includes(tipo)}
              onChange={() => toggleType(tipo)}
            />
            {tipo}
          </label>
        ))}
      </div>

      {/* Fecha */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Fecha</h3>
        {dateOptions.map((fecha) => (
          <label key={fecha} className="flex items-center gap-2">
            <input
              type="radio"
              name="fecha"
              checked={selectedDate === fecha}
              onChange={() => setSelectedDate(fecha)}
            />
            {fecha}
          </label>
        ))}
      </div>

      {/* Lugar */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Lugar</h3>
        <input
          type="text"
          placeholder="Lugar"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full border border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Limpiar */}
      <button
        onClick={clearFilters}
        className="bg-gray-200 px-3 py-2 rounded w-full"
      >
        Limpiar Filtros
      </button>
    </aside>
  );
}
