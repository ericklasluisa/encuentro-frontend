export default function Dashboard() {
  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-1">Panel General</h2>
      <p className="text-gray-500 mb-6">Bienvenido de nuevo</p>

      {/* Tarjetas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Eventos Activos</h3>
          <p className="text-2xl font-bold">24</p>
          <span className="text-green-500 text-sm">↑ 12% desde el mes anterior</span>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Tickets vendidos hoy</h3>
          <p className="text-2xl font-bold">1,247</p>
          <span className="text-green-500 text-sm">↑ 8% desde ayer</span>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500">Eventos Próximos</h3>
          <p className="text-2xl font-bold">18</p>
          <span className="text-orange-500 text-sm">Próximos 30 días</span>
        </div>
      </div>

      {/* Gráficos y categorías */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="mb-4 font-semibold">Ventas por mes</h3>
          <div className="h-40 bg-orange-200 flex items-center justify-center rounded">
            📊 Gráfico
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="mb-4 font-semibold">Categorías</h3>
          <div className="h-40 bg-purple-200 flex items-center justify-center rounded">
            🥧 Gráfico
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="mb-4 font-semibold">Eventos Recientes</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nombre</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Tickets Vendidos</th>
              <th className="p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Summer Music Festival</td>
              <td className="p-2">Jul 15, 2024</td>
              <td className="p-2">2,450</td>
              <td className="p-2 text-green-500">Activo</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Tech Conference 2024</td>
              <td className="p-2">Aug 22, 2024</td>
              <td className="p-2">890</td>
              <td className="p-2 text-blue-500">Próximo</td>
            </tr>
            <tr>
              <td className="p-2">Broadway Show</td>
              <td className="p-2">Sep 5, 2024</td>
              <td className="p-2">1,200</td>
              <td className="p-2 text-yellow-500">Pendiente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
