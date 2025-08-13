import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import CrearEvento from "./CreateEvent";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido desplazado */}
      <div className="flex-1 pl-64">
        <div className="min-h-screen overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="crear-evento" element={<CrearEvento />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
