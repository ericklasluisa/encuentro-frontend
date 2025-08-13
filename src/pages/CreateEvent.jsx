import { useState } from 'react';

export default function CreateEventUnified() {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',              // yyyy-MM-dd
    aforo: '',
    precioEntrada: '',
    estado: 'PROGRAMADO',   // ejemplo de default
    categoria: '',          // DEPORTIVO | TALLER | MUSICAL | CONGRESO | ...
    direccion: '',
    ciudad: '',
    lugar: '',              // nombre del venue
    createdAt: new Date().toISOString().slice(0, 10), // yyyy-MM-dd
    idOrganizador: ''
  });

  const [errors, setErrors] = useState({});

  // —— UI helpers (mantengo tu estilo)
  const inputBase =
    'w-full rounded-xl border border-slate-300/80 bg-white/90 text-slate-900 placeholder-slate-400 shadow-sm p-2.5 mt-1 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500';
  const inputInvalid = 'border-red-500 focus:ring-red-200 focus:border-red-500';

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // normaliza números donde aplica
    const numericFields = ['aforo', 'precioEntrada', 'idOrganizador'];
    const sanitized =
      numericFields.includes(name) && value !== ''
        ? value.replace(/[^\d.]/g, '')
        : value;

    setFormData((prev) => ({ ...prev, [name]: sanitized }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const e = {};

    // requeridos
    if (!formData.titulo.trim()) e.titulo = 'El título es obligatorio';
    if (!formData.descripcion.trim()) e.descripcion = 'La descripción es obligatoria';
    if (!formData.fecha) e.fecha = 'La fecha es obligatoria';
    if (!formData.categoria) e.categoria = 'La categoría es obligatoria';
    if (!formData.estado) e.estado = 'El estado es obligatorio';
    if (!formData.direccion.trim()) e.direccion = 'La dirección es obligatoria';
    if (!formData.ciudad.trim()) e.ciudad = 'La ciudad es obligatoria';
    if (!formData.lugar.trim()) e.lugar = 'El lugar es obligatorio';
    if (!formData.createdAt) e.createdAt = 'La fecha de creación es obligatoria';
    if (formData.idOrganizador === '') {
      e.idOrganizador = 'El ID del organizador es obligatorio';
    } else if (isNaN(Number(formData.idOrganizador)) || Number(formData.idOrganizador) <= 0) {
      e.idOrganizador = 'El ID del organizador debe ser un número positivo';
    }

    // numéricos
    if (formData.aforo === '') {
      e.aforo = 'El aforo es obligatorio';
    } else if (!Number.isInteger(Number(formData.aforo)) || Number(formData.aforo) < 0) {
      e.aforo = 'El aforo debe ser un entero ≥ 0';
    }

    if (formData.precioEntrada === '') {
      e.precioEntrada = 'El precio de entrada es obligatorio';
    } else if (isNaN(Number(formData.precioEntrada)) || Number(formData.precioEntrada) < 0) {
      e.precioEntrada = 'El precio debe ser un número ≥ 0';
    }

    // formato de fechas simple (yyyy-MM-dd)
    const isYmd = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
    if (formData.fecha && !isYmd(formData.fecha)) e.fecha = 'Formato esperado: yyyy-MM-dd';
    if (formData.createdAt && !isYmd(formData.createdAt)) e.createdAt = 'Formato esperado: yyyy-MM-dd';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validateForm()) return;

    // Construimos payload exactamente como el DTO espera
    const payload = {
      ...formData,
      aforo: Number(formData.aforo),
      precioEntrada: Number(formData.precioEntrada),
      idOrganizador: Number(formData.idOrganizador)
      // fecha y createdAt ya están en yyyy-MM-dd (válidos para java.sql.Date/LocalDate)
    };

    try {
      // Ajusta la URL a tu endpoint real
      const res = await fetch('http://localhost:8000/api/v1/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Error al crear el evento');
      }

      alert('¡Evento creado exitosamente!');
      // opcional: reset
      // setFormData({ ...formData, titulo:'', descripcion:'', ... })
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-5 sm:p-6 md:p-8"
        >
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">Crear evento</h2>

          {/* fila 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <label className="block">
              <span className="text-slate-700">Título *</span>
              <input
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.titulo ? inputInvalid : ''}`}
                placeholder="Ej: Concierto de Rock"
              />
              {errors.titulo && <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">Categoría *</span>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.categoria ? inputInvalid : ''}`}
              >
                <option value="">Seleccione…</option>
                <option value="DEPORTIVO">DEPORTIVO</option>
                <option value="TALLER">TALLER</option>
                <option value="MUSICAL">MUSICAL</option>
                <option value="CONGRESO">CONGRESO</option>
              </select>
              {errors.categoria && <p className="text-red-600 text-sm mt-1">{errors.categoria}</p>}
            </label>
          </div>

          {/* fila 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <label className="block">
              <span className="text-slate-700">Fecha *</span>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.fecha ? inputInvalid : ''}`}
              />
              {errors.fecha && <p className="text-red-600 text-sm mt-1">{errors.fecha}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">Aforo *</span>
              <input
                type="number"
                name="aforo"
                value={formData.aforo}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.aforo ? inputInvalid : ''}`}
                min={0}
                placeholder="0"
              />
              {errors.aforo && <p className="text-red-600 text-sm mt-1">{errors.aforo}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">Precio de entrada *</span>
              <input
                type="number"
                step="0.01"
                name="precioEntrada"
                value={formData.precioEntrada}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.precioEntrada ? inputInvalid : ''}`}
                min={0}
                placeholder="0.00"
              />
              {errors.precioEntrada && (
                <p className="text-red-600 text-sm mt-1">{errors.precioEntrada}</p>
              )}
            </label>
          </div>

          {/* fila 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <label className="block">
              <span className="text-slate-700">Estado *</span>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.estado ? inputInvalid : ''}`}
              >
                <option value="PROGRAMADO">PROGRAMADO</option>
                <option value="CANCELADO">CANCELADO</option>
                <option value="FINALIZADO">FINALIZADO</option>
              </select>
              {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">Created At *</span>
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.createdAt ? inputInvalid : ''}`}
              />
              {errors.createdAt && <p className="text-red-600 text-sm mt-1">{errors.createdAt}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">ID Organizador *</span>
              <input
                type="number"
                name="idOrganizador"
                value={formData.idOrganizador}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.idOrganizador ? inputInvalid : ''}`}
                min={1}
                placeholder="Ej: 1001"
              />
              {errors.idOrganizador && (
                <p className="text-red-600 text-sm mt-1">{errors.idOrganizador}</p>
              )}
            </label>
          </div>

          {/* ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <label className="block">
              <span className="text-slate-700">Dirección *</span>
              <input
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.direccion ? inputInvalid : ''}`}
                placeholder="Av. Siempre Viva 123"
              />
              {errors.direccion && <p className="text-red-600 text-sm mt-1">{errors.direccion}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">Ciudad *</span>
              <input
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.ciudad ? inputInvalid : ''}`}
                placeholder="Quito"
              />
              {errors.ciudad && <p className="text-red-600 text-sm mt-1">{errors.ciudad}</p>}
            </label>

            <label className="block">
              <span className="text-slate-700">Lugar (venue) *</span>
              <input
                name="lugar"
                value={formData.lugar}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.lugar ? inputInvalid : ''}`}
                placeholder="Estadio Olímpico Atahualpa"
              />
              {errors.lugar && <p className="text-red-600 text-sm mt-1">{errors.lugar}</p>}
            </label>
          </div>

          {/* descripción */}
          <div className="mb-6">
            <label className="block">
              <span className="text-slate-700">Descripción *</span>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className={`${inputBase} ${errors.descripcion ? inputInvalid : ''}`}
                rows={4}
                placeholder="Describe el evento"
              />
              {errors.descripcion && (
                <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>
              )}
            </label>
          </div>

          <div className="mt-4 pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-200 font-semibold"
            >
              Guardar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
