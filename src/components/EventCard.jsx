import React from "react";
import PropTypes from "prop-types";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

function EventCard({ evento, onClick }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // Formato HH:MM
  };

  const getDefaultImage = (categoria) => {
    const defaultImages = {
      'CONFERENCIA': '/images/conference-default.jpg',
      'WORKSHOP': '/images/workshop-default.jpg',
      'NETWORKING': '/images/networking-default.jpg',
      'CULTURAL': '/images/cultural-default.jpg',
      'DEPORTIVO': '/images/sports-default.jpg',
    };
    return defaultImages[categoria] || '/images/event-default.jpg';
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      {/* Imagen del evento */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={evento.imagen || getDefaultImage(evento.categoria)}
          alt={evento.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.target.src = getDefaultImage(evento.categoria);
          }}
        />
        
        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {evento.categoria}
          </span>
        </div>

        {/* Badge de precio */}
        {evento.precio && (
          <div className="absolute top-3 right-3">
            <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
              {evento.precio === 0 ? 'Gratis' : `$${evento.precio}`}
            </span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Título del evento */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {evento.nombre}
        </h3>

        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {evento.descripcion}
        </p>

        {/* Información del evento */}
        <div className="space-y-2">
          {/* Fecha y hora */}
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(evento.fecha)}
              {evento.hora && ` • ${formatTime(evento.hora)}`}
            </span>
          </div>

          {/* Ubicación */}
          {evento.ubicacion && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{evento.ubicacion}</span>
            </div>
          )}

          {/* Capacidad */}
          {evento.capacidad && (
            <div className="flex items-center text-sm text-gray-500">
              <Users className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {evento.registrados || 0} / {evento.capacidad} registrados
              </span>
            </div>
          )}

          {/* Duración */}
          {evento.duracion && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{evento.duracion}</span>
            </div>
          )}
        </div>

        {/* Estado del evento */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            {/* Organizador */}
            <div className="flex items-center">
              <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-medium text-gray-600">
                  {evento.organizador?.nombre?.charAt(0) || 'O'}
                </span>
              </div>
              <span className="text-xs text-gray-500 truncate">
                {evento.organizador?.nombre || 'Organizador'}
              </span>
            </div>

            {/* Estado */}
            <div className="flex items-center">
              {evento.estado === 'ACTIVO' ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Disponible
                </span>
              ) : evento.estado === 'LLENO' ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Lleno
                </span>
              ) : evento.estado === 'FINALIZADO' ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Finalizado
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {evento.estado}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="mt-4">
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={evento.estado === 'LLENO' || evento.estado === 'FINALIZADO'}
            onClick={(e) => {
              e.stopPropagation();
              // Lógica para registrarse al evento
              console.log('Registrarse en evento:', evento.id);
            }}
          >
            {evento.estado === 'LLENO' ? 'Evento Lleno' :
             evento.estado === 'FINALIZADO' ? 'Evento Finalizado' :
             'Ver Detalles'}
          </button>
        </div>
      </div>
    </div>
  );
}
EventCard.propTypes = {
  evento: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    fecha: PropTypes.string,
    hora: PropTypes.string,
    ubicacion: PropTypes.string,
    capacidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    registrados: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    duracion: PropTypes.string,
    categoria: PropTypes.string,
    imagen: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estado: PropTypes.string,
    organizador: PropTypes.shape({
      nombre: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func,
};

export default EventCard;