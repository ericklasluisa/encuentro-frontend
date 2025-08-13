import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Panel", to: "/admin/dashboard" },
    { name: "Crear Evento", to: "/admin/crear-evento" },
  ];

  return (
    <aside
      className="
        fixed inset-y-0 left-0 w-64
        bg-white/90 backdrop-blur border-r border-slate-200
        shadow-lg
        overflow-y-auto
        p-5 flex flex-col
      "
    >
      {/* Logo */}
      <div className="mx-auto h-14 w-14 rounded-md flex items-center justify-center mb-4">
        <img src="/logo.png" alt="Logo" className="max-h-14" />
      </div>

      {/* Encabezado */}
      <h1 className="text-xl font-bold mb-6 text-gray-800 text-center">
        Encuentro Admin
      </h1>

      {/* Navegación */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center rounded-lg px-3 py-2 text-base transition-colors
                  ${isActive
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-2 h-2 rounded-sm mr-3 transition-colors
                        ${isActive ? "bg-orange-500" : "bg-gray-300 group-hover:bg-orange-300"}`}
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Cerrar Sesión */}
      <div className="mt-auto pt-4 border-t">
        <NavLink
          to="/login"
          className="flex items-center justify-center rounded-xl px-4 py-3 text-base font-medium
                     transition-colors bg-red-500 text-white hover:bg-red-600"
        >
          Cerrar Sesión
        </NavLink>
      </div>
    </aside>
  );
}
