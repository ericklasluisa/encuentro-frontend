import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router";

function EventosPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Función para generar imagen placeholder local
  const getPlaceholderImage = (width = 300, height = 150, text = "Evento") => {
    // Create a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" 
              fill="#6b7280" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Función para manejar errores de imagen
  const handleImageError = (e) => {
    e.target.src = getPlaceholderImage(300, 150, "Imagen no disponible");
  };

  // Traer eventos del backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:8000/api/v1/eventos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Eventos recibidos:", data); // Para debug
        setEvents(data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtrado en frontend
  const filteredEvents = events.filter((event) => {
    const matchSearch = event.titulo
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Ajustar según el campo real del backend (tipoEvento en lugar de categoria)
    const matchType =
      selectedTypes.length === 0 || selectedTypes.includes(event.categoria);

    const matchLocation = locationFilter
      ? event.ciudad?.toLowerCase().includes(locationFilter.toLowerCase()) ||
        event.direccion?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    const matchDate = (() => {
      if (!selectedDate) return true;
      const today = new Date();
      const eventDate = new Date(event.fecha);
      console.log("Comparando fechas", eventDate, "con", today);

      if (selectedDate === "Hoy") {
        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth() &&
          eventDate.getDate() === today.getDate()
        );
      }

      if (selectedDate === "Esta semana") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }

      if (selectedDate === "Este mes") {
        return (
          eventDate.getFullYear() === today.getFullYear() &&
          eventDate.getMonth() === today.getMonth()
        );
      }

      if (selectedDate === "Este año") {
        return (
          eventDate.getFullYear() === today.getFullYear()
        );
      }

      return true;
    })();

    return matchSearch && matchType && matchLocation && matchDate;
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleVerMas = (evento) => {
    // Navegar a la página de detalle del evento
    navigate(`/eventos/${evento.idEvento}`);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando eventos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar eventos
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Bienvenido, {user?.nombre}
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition duration-150 ease-in-out"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Filtros de búsqueda */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar evento
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de evento
            </label>
            <select
              value={selectedTypes.length > 0 ? selectedTypes[0] : ""}
              onChange={(e) => setSelectedTypes(e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="CONGRESO">Congreso</option>
              <option value="EVENTO MUSICAL">Musical</option>
              <option value="TALLER">Taller</option>
              <option value="EVENTO DEPORTIVO">Deportivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las fechas</option>
              <option value="Hoy">Hoy</option>
              <option value="Esta semana">Esta semana</option>
              <option value="Este mes">Este mes</option>
              <option value="Este año">Este año</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Buscar por ciudad..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="mb-4">
        <p className="text-gray-600">
          Mostrando {filteredEvents.length} de {events.length} eventos
        </p>
      </div>

      {/* Lista de eventos */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay eventos</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron eventos que coincidan con los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.idEvento || event.id} // Usar idEvento (del backend) como fallback a id
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={event.imagen || getPlaceholderImage(300, 150, "Evento")}
                alt={event.titulo}
                className="w-full h-40 object-cover"
                onError={handleImageError}
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.titulo}</h3>
                <p className="text-gray-500 text-sm mb-1">
                  📅 {formatFecha(event.fecha)}
                </p>
                <p className="text-gray-500 text-sm mb-3">
                  📍 {event.direccion}, {event.ciudad}
                </p>
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    {event.tipoEvento}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    event.estado === 'ACTIVO' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.estado}
                  </span>
                </div>
                <button 
                  onClick={() => handleVerMas(event)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-200 font-medium"
                >
                  Ver Más
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventosPage;