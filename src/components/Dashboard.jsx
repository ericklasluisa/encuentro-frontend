import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from "../store/authStore";

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const [dashboardData, setDashboardData] = useState({
    eventosActivos: 0,
    ticketsVendidosHoy: 0,
    eventosProximos: 0,
    eventosRecientes: [],
    eventosPorCategoria: [],
    eventosPorMes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://ec2-13-59-51-70.us-east-2.compute.amazonaws.com:8000/api/v1';
  
  // TODO: Cambiar este ID por el ID del organizador logueado
  const idOrganizador = user?.id; // Cambiar por el ID real del organizador

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener todos los eventos del organizador
        const eventosRes = await fetch(`${API_BASE_URL}/eventos/dashboard/mis-eventos/${idOrganizador}`);
        
        if (!eventosRes.ok) {
          throw new Error('Error al obtener los eventos del organizador');
        }

        const eventos = await eventosRes.json();
        console.log('Eventos obtenidos:', eventos);

        // 2. Filtrar eventos activos
        const eventosActivos = eventos.filter(evento => evento.estado === 'ACTIVO');

        // 3. Calcular eventos próximos (máximo 30 días desde hoy)
        const hoy = new Date();
        const en30Dias = new Date();
        en30Dias.setDate(hoy.getDate() + 30);

        const eventosProximos = eventos.filter(evento => {
          if (evento.estado !== 'ACTIVO') return false;
          const fechaEvento = new Date(evento.fecha);
          return fechaEvento >= hoy && fechaEvento <= en30Dias;
        });

        // 4. Obtener asistentes para cada evento activo y sumar tickets vendidos
        let totalTicketsVendidos = 0;
        
        if (eventosActivos.length > 0) {
          const promesasAsistentes = eventosActivos.map(evento =>
            fetch(`${API_BASE_URL}/eventos/asistentes/${evento.idEvento}`)
              .then(res => res.ok ? res.json() : [])
              .catch(err => {
                console.error(`Error obteniendo asistentes para evento ${evento.idEvento}:`, err);
                return [];
              })
          );

          const resultadosAsistentes = await Promise.all(promesasAsistentes);
          
          // Sumar todos los asistentes
          totalTicketsVendidos = resultadosAsistentes.reduce((total, asistentes) => {
            return total + (Array.isArray(asistentes) ? asistentes.length : 0);
          }, 0);
        }

        // 5. Preparar datos para gráfico de categorías
        const categorias = ['TALLER', 'CONGRESO', 'DEPORTIVO', 'CONCIERTO'];
        const eventosPorCategoria = categorias.map(categoria => ({
          categoria: categoria,
          cantidad: eventos.filter(evento => evento.categoria === categoria).length
        }));

        // 6. Preparar datos para gráfico de eventos por mes
        const eventosPorMes = eventos.reduce((acc, evento) => {
          const fecha = new Date(evento.fecha);
          const mesAno = fecha.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short' 
          });
          
          const existente = acc.find(item => item.mes === mesAno);
          if (existente) {
            existente.cantidad += 1;
          } else {
            acc.push({ mes: mesAno, cantidad: 1 });
          }
          return acc;
        }, []);

        // Ordenar por fecha
        eventosPorMes.sort((a, b) => {
          const fechaA = new Date(a.mes + ' 01');
          const fechaB = new Date(b.mes + ' 01');
          return fechaA - fechaB;
        });

        // 7. Preparar eventos recientes (todos los eventos ordenados por fecha de creación)
        const eventosRecientes = eventos
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10) // Tomar solo los 10 más recientes
          .map(evento => ({
            id: evento.idEvento,
            nombre: evento.titulo,
            fecha: evento.fecha,
            ticketsVendidos: 0, // Se actualizará después si es necesario
            estado: evento.estado === 'ACTIVO' ? 'Activo' : 
                   evento.estado === 'PENDIENTE' ? 'Pendiente' : 
                   evento.estado,
            categoria: evento.categoria || 'Sin categoría'
          }));

        setDashboardData({
          eventosActivos: eventosActivos.length,
          ticketsVendidosHoy: totalTicketsVendidos, // Total de tickets vendidos de todos los eventos
          eventosProximos: eventosProximos.length,
          eventosRecientes: eventosRecientes,
          eventosPorCategoria: eventosPorCategoria,
          eventosPorMes: eventosPorMes
        });

      } catch (err) {
        console.error('Error en fetchDashboardData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [idOrganizador]);

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando datos del dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-1">Panel General</h2>
      <p className="text-gray-500 mb-6">Bienvenido de nuevo</p>

      {/* Tarjetas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Eventos Activos</h3>
          <p className="text-2xl font-bold">{dashboardData.eventosActivos}</p>
          <span className="text-green-500 text-sm">↑ 12% desde el mes anterior</span>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Tickets vendidos total</h3>
          <p className="text-2xl font-bold">{dashboardData.ticketsVendidosHoy.toLocaleString()}</p>
          <span className="text-green-500 text-sm">↑ 8% desde ayer</span>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Eventos Próximos</h3>
          <p className="text-2xl font-bold">{dashboardData.eventosProximos}</p>
          <span className="text-orange-500 text-sm">Próximos 30 días</span>
        </div>
      </div>

      {/* Gráficos y categorías */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="mb-4 font-semibold">Eventos por mes</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.eventosPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mes" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => `Mes: ${label}`}
                  formatter={(value) => [value, 'Eventos']}
                />
                <Bar dataKey="cantidad" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="mb-4 font-semibold">Eventos por categoría</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.eventosPorCategoria}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="categoria" 
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => `Categoría: ${label}`}
                  formatter={(value) => [value, 'Eventos']}
                />
                <Bar dataKey="cantidad" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Eventos Recientes</h3>
        {dashboardData.eventosRecientes.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Nombre</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.eventosRecientes.map((evento, index) => (
                <tr key={evento.id || index} className="border-b">
                  <td className="p-2">{evento.nombre}</td>
                  <td className="p-2">{new Date(evento.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</td>
                  <td className={`p-2 ${
                    evento.estado === 'Activo' ? 'text-green-500' :
                    evento.estado === 'Próximo' ? 'text-blue-500' :
                    'text-yellow-500'
                  }`}>
                    {evento.estado}
                  </td>
                  <td className="p-2">{evento.categoria || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay eventos disponibles
          </div>
        )}
      </div>
    </div>
  );
}