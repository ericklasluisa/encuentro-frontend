import { useState } from 'react';

export default function CreateEvent() {
  const [tipoEvento, setTipoEvento] = useState('');
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    direccion: '',
    ciudad: '',
    pais: '',
    precio: '',
    // Campos específicos por tipo de evento
    deporte: '',
    participantes: '',
    aforo: '',
    nombreInstructor: '',
    materialesNecesarios: '',
    sesiones: [{ horaInicio: '', horaFin: '', aforo: '' }],
    artista: '',
    generoMusical: '',
    zonas: [{ nombreZona: '', precio: '', aforo: '' }],
    programa: [{ nombrePonente: '', salaAsignada: '', aforo: '' }]
  });

  const [errors, setErrors] = useState({});

  // —— UI helpers
  const inputBase =
    'w-full rounded-xl border border-slate-300/80 bg-white/90 text-slate-900 placeholder-slate-400 shadow-sm p-2.5 mt-1 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500';
  const inputInvalid = 'border-red-500 focus:ring-red-200 focus:border-red-500';
  const sectionCard =
    'border rounded-2xl p-4 md:p-5 bg-slate-50/70 border-slate-200/80 shadow-sm';
  const smallBtn =
    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTipoEventoChange = (e) => {
    const tipo = e.target.value;
    setTipoEvento(tipo);
    setErrors({});

    // Reset campos específicos
    setFormData((prev) => ({
      ...prev,
      deporte: '',
      participantes: '',
      aforo: '',
      nombreInstructor: '',
      materialesNecesarios: '',
      sesiones: [{ horaInicio: '', horaFin: '', aforo: '' }],
      artista: '',
      generoMusical: '',
      zonas: [{ nombreZona: '', precio: '', aforo: '' }],
      programa: [{ nombrePonente: '', salaAsignada: '', aforo: '' }]
    }));
  };

  const addSession = () => {
    setFormData((prev) => ({
      ...prev,
      sesiones: [...prev.sesiones, { horaInicio: '', horaFin: '', aforo: '' }]
    }));
  };

  const removeSession = (index) => {
    setFormData((prev) => ({
      ...prev,
      sesiones: prev.sesiones.filter((_, i) => i !== index)
    }));
  };

  const updateSession = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sesiones: prev.sesiones.map((sesion, i) =>
        i === index ? { ...sesion, [field]: value } : sesion
      )
    }));
  };

  const addZona = () => {
    setFormData((prev) => ({
      ...prev,
      zonas: [...prev.zonas, { nombreZona: '', precio: '', aforo: '' }]
    }));
  };

  const removeZona = (index) => {
    setFormData((prev) => ({
      ...prev,
      zonas: prev.zonas.filter((_, i) => i !== index)
    }));
  };

  const updateZona = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      zonas: prev.zonas.map((zona, i) => (i === index ? { ...zona, [field]: value } : zona))
    }));
  };

  const addPonente = () => {
    setFormData((prev) => ({
      ...prev,
      programa: [...prev.programa, { nombrePonente: '', salaAsignada: '', aforo: '' }]
    }));
  };

  const removePonente = (index) => {
    setFormData((prev) => ({
      ...prev,
      programa: prev.programa.filter((_, i) => i !== index)
    }));
  };

  const updatePonente = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      programa: prev.programa.map((ponente, i) =>
        i === index ? { ...ponente, [field]: value } : ponente
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validaciones comunes
    if (!formData.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    if (!formData.fecha) newErrors.fecha = 'La fecha es obligatoria';
    if (!formData.horaInicio) newErrors.horaInicio = 'La hora de inicio es obligatoria';
    if (!formData.horaFin) newErrors.horaFin = 'La hora de fin es obligatoria';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es obligatoria';
    if (!formData.pais.trim()) newErrors.pais = 'El país es obligatorio';

    // Validar precio (número positivo)
    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio';
    } else if (isNaN(formData.precio) || parseFloat(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser un número positivo';
    }

    // Validar horas
    if (formData.horaInicio && formData.horaFin && formData.horaInicio >= formData.horaFin) {
      newErrors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
    }

    // Validaciones específicas por tipo de evento
    switch (tipoEvento) {
      case 'DEPORTIVO':
        if (!formData.deporte.trim()) newErrors.deporte = 'El deporte es obligatorio';
        if (!formData.participantes.trim()) newErrors.participantes = 'Los participantes son obligatorios';
        if (!formData.aforo) {
          newErrors.aforo = 'El aforo es obligatorio';
        } else if (isNaN(formData.aforo) || parseInt(formData.aforo) <= 0) {
          newErrors.aforo = 'El aforo debe ser un número entero positivo';
        }
        break;

      case 'TALLER':
        if (!formData.nombreInstructor.trim()) newErrors.nombreInstructor = 'El nombre del instructor es obligatorio';
        if (!formData.materialesNecesarios.trim()) newErrors.materialesNecesarios = 'Los materiales necesarios son obligatorios';

        formData.sesiones.forEach((sesion, index) => {
          if (!sesion.horaInicio) newErrors[`sesion_${index}_horaInicio`] = 'Hora de inicio requerida';
          if (!sesion.horaFin) newErrors[`sesion_${index}_horaFin`] = 'Hora de fin requerida';
          if (!sesion.aforo) {
            newErrors[`sesion_${index}_aforo`] = 'Aforo requerido';
          } else if (isNaN(sesion.aforo) || parseInt(sesion.aforo) <= 0) {
            newErrors[`sesion_${index}_aforo`] = 'Aforo debe ser un número positivo';
          }
          if (sesion.horaInicio && sesion.horaFin && sesion.horaInicio >= sesion.horaFin) {
            newErrors[`sesion_${index}_horaFin`] = 'Hora de fin debe ser posterior a hora de inicio';
          }
        });
        break;

      case 'MUSICAL':
        if (!formData.artista.trim()) newErrors.artista = 'El artista es obligatorio';
        if (!formData.generoMusical.trim()) newErrors.generoMusical = 'El género musical es obligatorio';

        formData.zonas.forEach((zona, index) => {
          if (!zona.nombreZona.trim()) newErrors[`zona_${index}_nombre`] = 'Nombre de zona requerido';
          if (!zona.precio) {
            newErrors[`zona_${index}_precio`] = 'Precio requerido';
          } else if (isNaN(zona.precio) || parseFloat(zona.precio) < 0) {
            newErrors[`zona_${index}_precio`] = 'Precio debe ser un número positivo';
          }
          if (!zona.aforo) {
            newErrors[`zona_${index}_aforo`] = 'Aforo requerido';
          } else if (isNaN(zona.aforo) || parseInt(zona.aforo) <= 0) {
            newErrors[`zona_${index}_aforo`] = 'Aforo debe ser un número positivo';
          }
        });
        break;

      case 'CONGRESO':
        formData.programa.forEach((ponente, index) => {
          if (!ponente.nombrePonente.trim()) newErrors[`ponente_${index}_nombre`] = 'Nombre del ponente requerido';
          if (!ponente.salaAsignada.trim()) newErrors[`ponente_${index}_sala`] = 'Sala asignada requerida';
          if (!ponente.aforo) {
            newErrors[`ponente_${index}_aforo`] = 'Aforo requerido';
          } else if (isNaN(ponente.aforo) || parseInt(ponente.aforo) <= 0) {
            newErrors[`ponente_${index}_aforo`] = 'Aforo debe ser un número positivo';
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Datos del evento:', { ...formData, tipoEvento });
      alert('Evento creado exitosamente!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-200/70 p-5 sm:p-6 md:p-8"
        >
          {/* Selector de tipo de evento */}
          <div className="mb-6">
            <label className="block mb-2 font-medium text-slate-800">
              Tipo de evento *
              <select
                value={tipoEvento}
                onChange={handleTipoEventoChange}
                className={`${inputBase} mt-2`}
                required
              >
                <option value="">Selecciona un tipo de evento</option>
                <option value="DEPORTIVO">Evento Deportivo</option>
                <option value="TALLER">Taller</option>
                <option value="MUSICAL">Concierto</option>
                <option value="CONGRESO">Congreso</option>
              </select>
            </label>
          </div>

          {tipoEvento && (
            <>
              {/* Campos comunes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-1.5 text-slate-700">
                    Título *
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.titulo ? inputInvalid : ''}`}
                      placeholder="Ej: Concierto de Rock"
                    />
                    {errors.titulo && (
                      <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">
                    Fecha *
                    <input
                      type="date"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.fecha ? inputInvalid : ''}`}
                    />
                    {errors.fecha && (
                      <p className="text-red-600 text-sm mt-1">{errors.fecha}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">
                    Hora de inicio *
                    <input
                      type="time"
                      name="horaInicio"
                      value={formData.horaInicio}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.horaInicio ? inputInvalid : ''}`}
                    />
                    {errors.horaInicio && (
                      <p className="text-red-600 text-sm mt-1">{errors.horaInicio}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">
                    Hora de fin *
                    <input
                      type="time"
                      name="horaFin"
                      value={formData.horaFin}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.horaFin ? inputInvalid : ''}`}
                    />
                    {errors.horaFin && (
                      <p className="text-red-600 text-sm mt-1">{errors.horaFin}</p>
                    )}
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-1.5 text-slate-700">
                  Descripción *
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block mb-1.5 text-slate-700">
                    Dirección *
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.direccion ? inputInvalid : ''}`}
                      placeholder="Ej: Estadio Olímpico"
                    />
                    {errors.direccion && (
                      <p className="text-red-600 text-sm mt-1">{errors.direccion}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">
                    Ciudad *
                    <input
                      type="text"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.ciudad ? inputInvalid : ''}`}
                      placeholder="Ej: Quito"
                    />
                    {errors.ciudad && (
                      <p className="text-red-600 text-sm mt-1">{errors.ciudad}</p>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block mb-1.5 text-slate-700">
                    País *
                    <input
                      type="text"
                      name="pais"
                      value={formData.pais}
                      onChange={handleInputChange}
                      className={`${inputBase} ${errors.pais ? inputInvalid : ''}`}
                      placeholder="Ej: Ecuador"
                    />
                    {errors.pais && (
                      <p className="text-red-600 text-sm mt-1">{errors.pais}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Campos específicos según tipo de evento */}
              {tipoEvento === 'DEPORTIVO' && (
                <div className="mt-2 space-y-4">
                  <div className="relative">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-3">
                      Información Deportiva
                    </h3>
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${sectionCard}`}>
                    <div>
                      <label className="block text-slate-700">
                        Deporte *
                        <input
                          type="text"
                          name="deporte"
                          value={formData.deporte}
                          onChange={handleInputChange}
                          className={`${inputBase} ${errors.deporte ? inputInvalid : ''}`}
                          placeholder="Ej: Fútbol"
                        />
                        {errors.deporte && (
                          <p className="text-red-600 text-sm mt-1">{errors.deporte}</p>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-slate-700">
                        Aforo *
                        <input
                          type="number"
                          name="aforo"
                          value={formData.aforo}
                          onChange={handleInputChange}
                          className={`${inputBase} ${errors.aforo ? inputInvalid : ''}`}
                          placeholder="Ej: 5000"
                          min={1}
                        />
                        {errors.aforo && (
                          <p className="text-red-600 text-sm mt-1">{errors.aforo}</p>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-slate-700">
                        Precio *
                        <input
                          type="number"
                          name="precio"
                          value={formData.precio}
                          onChange={handleInputChange}
                          step="0.01"
                          className={`${inputBase} ${errors.precio ? inputInvalid : ''}`}
                          placeholder="Ej: 10.50"
                          min={0}
                        />
                        {errors.precio && (
                          <p className="text-red-600 text-sm mt-1">{errors.precio}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className={sectionCard}>
                    <label className="block text-slate-700">
                      Participantes *
                      <textarea
                        name="participantes"
                        value={formData.participantes}
                        onChange={handleInputChange}
                        className={`${inputBase} ${errors.participantes ? inputInvalid : ''}`}
                        placeholder="Ej: Colegio A, Colegio B, Colegio C"
                        rows={2}
                      />
                      {errors.participantes && (
                        <p className="text-red-600 text-sm mt-1">{errors.participantes}</p>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {tipoEvento === 'TALLER' && (
                <div className="mt-2 space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800">Información del Taller</h3>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${sectionCard}`}>
                    <div>
                      <label className="block text-slate-700">
                        Instructor *
                        <input
                          type="text"
                          name="nombreInstructor"
                          value={formData.nombreInstructor}
                          onChange={handleInputChange}
                          className={`${inputBase} ${errors.nombreInstructor ? inputInvalid : ''}`}
                          placeholder="Ej: Sheylee Enriquez"
                        />
                        {errors.nombreInstructor && (
                          <p className="text-red-600 text-sm mt-1">{errors.nombreInstructor}</p>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-slate-700">
                        Precio *
                        <input
                          type="number"
                          name="precio"
                          value={formData.precio}
                          onChange={handleInputChange}
                          step="0.01"
                          className={`${inputBase} ${errors.precio ? inputInvalid : ''}`}
                          placeholder="Ej: 12.99"
                          min={0}
                        />
                        {errors.precio && (
                          <p className="text-red-600 text-sm mt-1">{errors.precio}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className={sectionCard}>
                    <label className="block text-slate-700">
                      Materiales necesarios *
                      <textarea
                        name="materialesNecesarios"
                        value={formData.materialesNecesarios}
                        onChange={handleInputChange}
                        className={`${inputBase} ${errors.materialesNecesarios ? inputInvalid : ''}`}
                        placeholder="Ej: cámara, trípode"
                        rows={2}
                      />
                      {errors.materialesNecesarios && (
                        <p className="text-red-600 text-sm mt-1">{errors.materialesNecesarios}</p>
                      )}
                    </label>
                  </div>

                  <div className={sectionCard}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-slate-800">Sesiones *</h4>
                      <button
                        type="button"
                        onClick={addSession}
                        className={`${smallBtn} bg-blue-600 text-white hover:bg-blue-700`}
                      >
                        Agregar Sesión
                      </button>
                    </div>

                    {formData.sesiones.map((sesion, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-3 md:p-4 mb-3 bg-white/70">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-slate-800">Sesión {index + 1}</h5>
                          {formData.sesiones.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSession(index)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-slate-700">
                              Hora inicio *
                              <input
                                type="time"
                                value={sesion.horaInicio}
                                onChange={(e) => updateSession(index, 'horaInicio', e.target.value)}
                                className={`${inputBase} ${errors[`sesion_${index}_horaInicio`] ? inputInvalid : ''}`}
                              />
                              {errors[`sesion_${index}_horaInicio`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`sesion_${index}_horaInicio`]}</p>
                              )}
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-700">
                              Hora fin *
                              <input
                                type="time"
                                value={sesion.horaFin}
                                onChange={(e) => updateSession(index, 'horaFin', e.target.value)}
                                className={`${inputBase} ${errors[`sesion_${index}_horaFin`] ? inputInvalid : ''}`}
                              />
                              {errors[`sesion_${index}_horaFin`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`sesion_${index}_horaFin`]}</p>
                              )}
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-700">
                              Aforo *
                              <input
                                type="number"
                                value={sesion.aforo}
                                onChange={(e) => updateSession(index, 'aforo', e.target.value)}
                                className={`${inputBase} ${errors[`sesion_${index}_aforo`] ? inputInvalid : ''}`}
                                min={1}
                                placeholder="30"
                              />
                              {errors[`sesion_${index}_aforo`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`sesion_${index}_aforo`]}</p>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tipoEvento === 'MUSICAL' && (
                <div className="mt-2 space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800">Información del Concierto</h3>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${sectionCard}`}>
                    <div>
                      <label className="block text-slate-700">
                        Artista *
                        <input
                          type="text"
                          name="artista"
                          value={formData.artista}
                          onChange={handleInputChange}
                          className={`${inputBase} ${errors.artista ? inputInvalid : ''}`}
                          placeholder="Ej: Reik"
                        />
                        {errors.artista && (
                          <p className="text-red-600 text-sm mt-1">{errors.artista}</p>
                        )}
                      </label>
                    </div>

                    <div>
                      <label className="block text-slate-700">
                        Género Musical *
                        <input
                          type="text"
                          name="generoMusical"
                          value={formData.generoMusical}
                          onChange={handleInputChange}
                          className={`${inputBase} ${errors.generoMusical ? inputInvalid : ''}`}
                          placeholder="Ej: Pop"
                        />
                        {errors.generoMusical && (
                          <p className="text-red-600 text-sm mt-1">{errors.generoMusical}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className={sectionCard}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-slate-800">Zonas *</h4>
                      <button
                        type="button"
                        onClick={addZona}
                        className={`${smallBtn} bg-blue-600 text-white hover:bg-blue-700`}
                      >
                        Agregar Zona
                      </button>
                    </div>

                    {formData.zonas.map((zona, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-3 md:p-4 mb-3 bg-white/70">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-slate-800">Zona {index + 1}</h5>
                          {formData.zonas.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeZona(index)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-slate-700">
                              Nombre zona *
                              <input
                                type="text"
                                value={zona.nombreZona}
                                onChange={(e) => updateZona(index, 'nombreZona', e.target.value)}
                                className={`${inputBase} ${errors[`zona_${index}_nombre`] ? inputInvalid : ''}`}
                                placeholder="Normal"
                              />
                              {errors[`zona_${index}_nombre`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`zona_${index}_nombre`]}</p>
                              )}
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-700">
                              Precio *
                              <input
                                type="number"
                                step="0.01"
                                value={zona.precio}
                                onChange={(e) => updateZona(index, 'precio', e.target.value)}
                                className={`${inputBase} ${errors[`zona_${index}_precio`] ? inputInvalid : ''}`}
                                min={0}
                                placeholder="12.00"
                              />
                              {errors[`zona_${index}_precio`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`zona_${index}_precio`]}</p>
                              )}
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-700">
                              Aforo *
                              <input
                                type="number"
                                value={zona.aforo}
                                onChange={(e) => updateZona(index, 'aforo', e.target.value)}
                                className={`${inputBase} ${errors[`zona_${index}_aforo`] ? inputInvalid : ''}`}
                                min={1}
                                placeholder="30"
                              />
                              {errors[`zona_${index}_aforo`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`zona_${index}_aforo`]}</p>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tipoEvento === 'CONGRESO' && (
                <div className="mt-2 space-y-4">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800">Información del Congreso</h3>

                  <div className={sectionCard}>
                    <label className="block text-slate-700">
                      Precio *
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleInputChange}
                        step="0.01"
                        className={`${inputBase} ${errors.precio ? inputInvalid : ''}`}
                        placeholder="Ej: 34.00"
                        min={0}
                      />
                      {errors.precio && (
                        <p className="text-red-600 text-sm mt-1">{errors.precio}</p>
                      )}
                    </label>
                  </div>

                  <div className={sectionCard}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-slate-800">Programa *</h4>
                      <button
                        type="button"
                        onClick={addPonente}
                        className={`${smallBtn} bg-blue-600 text-white hover:bg-blue-700`}
                      >
                        Agregar Ponente
                      </button>
                    </div>

                    {formData.programa.map((ponente, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-3 md:p-4 mb-3 bg-white/70">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-slate-800">Ponente {index + 1}</h5>
                          {formData.programa.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePonente(index)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm text-slate-700">
                              Nombre del ponente *
                              <input
                                type="text"
                                value={ponente.nombrePonente}
                                onChange={(e) => updatePonente(index, 'nombrePonente', e.target.value)}
                                className={`${inputBase} ${errors[`ponente_${index}_nombre`] ? inputInvalid : ''}`}
                                placeholder="Julio Ramirez"
                              />
                              {errors[`ponente_${index}_nombre`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`ponente_${index}_nombre`]}</p>
                              )}
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-700">
                              Sala asignada *
                              <input
                                type="text"
                                value={ponente.salaAsignada}
                                onChange={(e) => updatePonente(index, 'salaAsignada', e.target.value)}
                                className={`${inputBase} ${errors[`ponente_${index}_sala`] ? inputInvalid : ''}`}
                                placeholder="Sala B2"
                              />
                              {errors[`ponente_${index}_sala`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`ponente_${index}_sala`]}</p>
                              )}
                            </label>
                          </div>

                          <div>
                            <label className="block text-sm text-slate-700">
                              Aforo *
                              <input
                                type="number"
                                value={ponente.aforo}
                                onChange={(e) => updatePonente(index, 'aforo', e.target.value)}
                                className={`${inputBase} ${errors[`ponente_${index}_aforo`] ? inputInvalid : ''}`}
                                min={1}
                                placeholder="30"
                              />
                              {errors[`ponente_${index}_aforo`] && (
                                <p className="text-red-600 text-xs mt-1">{errors[`ponente_${index}_aforo`]}</p>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3.5 rounded-2xl shadow-md hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-200 font-semibold"
                >
                  Guardar Evento
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
