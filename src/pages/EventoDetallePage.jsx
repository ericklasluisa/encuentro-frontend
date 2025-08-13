import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

function EventoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [evento, setEvento] = useState(null);
  const [cantidadBoletos, setCantidadBoletos] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comprando, setComprando] = useState(false);

  // Función para formatear la fecha completa
  const formatFechaCompleta = (fecha) => {
    const date = new Date(fecha);
    return {
      dia: date.toLocaleDateString("es-ES", { weekday: "long" }),
      fecha: date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
      hora: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };
  };

  // Función para generar imagen placeholder
  const getPlaceholderImage = (width = 400, height = 250, text = "Evento") => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e5e7eb"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="18" 
              fill="#6b7280" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Función para manejar errores de imagen
  const handleImageError = (e) => {
    e.target.src = getPlaceholderImage(400, 250, "Imagen no disponible");
  };

  // Obtener detalles del evento
  useEffect(() => {
    const fetchEvento = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8000/api/v1/eventos/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Evento recibido:", data);
        setEvento(data);
      } catch (error) {
        console.error("Error al obtener evento:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvento();
    }
  }, [id]);

  // Función para manejar la compra
  const handleComprar = async () => {
    if (!user?.id) {
      alert("Debes estar logueado para comprar boletos");
      navigate("/login");
      return;
    }

    if (cantidadBoletos < 1) {
      alert("Debes seleccionar al menos 1 boleto");
      return;
    }

    try {
      setComprando(true);
      
      const compraData = {
        idAsistente: user.id,
        idEvento: parseInt(id),
        cantidadBoletos: cantidadBoletos
      };

      console.log("Enviando datos de compra:", compraData);

      const response = await fetch("http://localhost:8000/api/v1/boletos/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Compra exitosa:", result);
      
      // Mostrar mensaje de éxito
      alert(`¡Compra exitosa! Has adquirido ${cantidadBoletos} boleto(s) para ${evento.titulo}`);
      
      // Redirigir a la página de eventos
      navigate("/eventos");

    } catch (error) {
      console.error("Error al comprar boletos:", error);
      alert(`Error al procesar la compra: ${error.message}`);
    } finally {
      setComprando(false);
    }
  };

  // Calcular precio total (asumiendo un precio base)
  const precioBase = 25.00; // Puedes ajustar esto según tu lógica
  const precioServicios = 2.50;
  const total = (precioBase + precioServicios) * cantidadBoletos;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando evento...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al cargar el evento
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4 space-x-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Intentar nuevamente
                  </button>
                  <button
                    onClick={() => navigate("/eventos")}
                    className="bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
                  >
                    Volver a eventos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Evento no encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">El evento que buscas no existe.</p>
          <button
            onClick={() => navigate("/eventos")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Volver a eventos
          </button>
        </div>
      </div>
    );
  }

  const fechaInfo = formatFechaCompleta(evento.fecha);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/eventos")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a eventos
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Detalles del Evento</h1>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del evento */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Imagen del evento */}
              <img
                src={evento.imagen || getPlaceholderImage(800, 400, evento.titulo)}
                alt={evento.titulo}
                className="w-full h-64 md:h-80 object-cover"
                onError={handleImageError}
              />
              
              {/* Información del evento */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{evento.titulo}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
                        evento.tipoEvento === 'CONGRESO' ? 'bg-purple-100 text-purple-800' :
                        evento.tipoEvento === 'EVENTO MUSICAL' ? 'bg-pink-100 text-pink-800' :
                        evento.tipoEvento === 'TALLER' ? 'bg-green-100 text-green-800' :
                        evento.tipoEvento === 'EVENTO DEPORTIVO' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {evento.tipoEvento}
                      </span>
                      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                        evento.estado === 'ACTIVO' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {evento.estado}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fecha y hora */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-semibold capitalize">{fechaInfo.dia}</p>
                      <p className="text-sm">{fechaInfo.fecha} a las {fechaInfo.hora}</p>
                    </div>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start text-gray-700">
                    <svg className="w-5 h-5 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold">{evento.direccion}</p>
                      <p className="text-sm text-gray-600">{evento.ciudad}</p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                {evento.descripcion && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                    <p className="text-gray-700 leading-relaxed">{evento.descripcion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Seleccionar Asientos</h2>
              
              {/* Selector de cantidad */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <select
                  value={cantidadBoletos}
                  onChange={(e) => setCantidadBoletos(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={comprando}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Resumen del pedido */}
              <div className="mb-6 border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen del Orden</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Boleto General x{cantidadBoletos}</span>
                    <span>${(precioBase * cantidadBoletos).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Servicios</span>
                    <span>${(precioServicios * cantidadBoletos).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Botón de compra */}
              <button
                onClick={handleComprar}
                disabled={comprando || evento.estado !== 'ACTIVO'}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
                  comprando || evento.estado !== 'ACTIVO'
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {comprando ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : evento.estado !== 'ACTIVO' ? (
                  'Evento no disponible'
                ) : (
                  'Comprar'
                )}
              </button>

              {/* Información adicional */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Los boletos se enviarán por correo electrónico</p>
                <p className="mt-1">Cancelación gratuita hasta 24 horas antes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventoDetallePage;