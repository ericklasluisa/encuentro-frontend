import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const RegisterPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    correo: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    rol: "",
    empresa: "",
    ruc: "",
  });

  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para validar password
  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  // Función para validar RUC ecuatoriano
  const isValidRUC = (ruc) => {
    return /^[0-9]{13}$/.test(ruc);
  };

  // Función para validar fecha de nacimiento (mayor de 18 años)
  const isValidBirthDate = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  // Función para validar todo el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validación de nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validación de apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = "El apellido debe tener al menos 2 caracteres";
    }

    // Validación de fecha de nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = "La fecha de nacimiento es obligatoria";
    } else if (!isValidBirthDate(formData.fechaNacimiento)) {
      newErrors.fechaNacimiento = "Debes ser mayor de 18 años";
    }

    // Validación de email
    if (!formData.correo.trim()) {
      newErrors.correo = "El email es obligatorio";
    } else if (!isValidEmail(formData.correo)) {
      newErrors.correo = "Ingresa un email válido";
    }

    // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }

    // Validación de confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validación de rol
    if (!formData.rol) {
      newErrors.rol = "Selecciona un rol";
    }

    // Validaciones específicas para organizador
    if (formData.rol === "organizador") {
      if (!formData.empresa.trim()) {
        newErrors.empresa = "El nombre de la empresa es obligatorio";
      } else if (formData.empresa.trim().length < 2) {
        newErrors.empresa =
          "El nombre de la empresa debe tener al menos 2 caracteres";
      }

      if (!formData.ruc.trim()) {
        newErrors.ruc = "El RUC es obligatorio";
      } else if (!isValidRUC(formData.ruc)) {
        newErrors.ruc = "Ingresa un RUC válido (13 dígitos)";
      }
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores del campo que se está editando
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Limpiar errores de backend cuando el usuario empiece a escribir
    if (backendError) {
      setBackendError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({});
    setBackendError("");
    setShowError(false);

    // Validar formulario
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setShowError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos según el DTO del backend
      const registerData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim(),
        contrasena: formData.password,
        fechaNacimiento: formData.fechaNacimiento, // El backend espera Date, pero enviamos string ISO
        rol: formData.rol.toUpperCase(), // ASISTENTE o ORGANIZADOR
      };

      // Agregar campos opcionales solo para organizador
      if (formData.rol === "organizador") {
        registerData.empresa = formData.empresa.trim();
        registerData.ruc = formData.ruc.trim();
      }

      // Realizar petición al backend
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Registro exitoso
        toast.success("¡Registro exitoso! Bienvenido a Encuentro");
        // Limpiar formulario
        setFormData({
          correo: "",
          password: "",
          confirmPassword: "",
          nombre: "",
          apellido: "",
          fechaNacimiento: "",
          rol: "",
          empresa: "",
          ruc: "",
        });
        // Redirigir al usuario a la página de login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        // Manejar errores del backend
        let errorMessage = "Error al registrar usuario. Intenta nuevamente.";

        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (response.status === 400) {
          errorMessage =
            "Datos inválidos. Por favor revisa la información ingresada.";
        } else if (response.status === 409) {
          errorMessage = "Este email ya está registrado.";
        } else if (response.status === 500) {
          errorMessage = "Error interno del servidor. Intenta nuevamente.";
        }

        setBackendError(errorMessage);
        setShowError(true);
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Manejar errores de conexión
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setBackendError(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
      } else {
        setBackendError("Error al registrar usuario. Intenta nuevamente.");
      }
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sección izquierda - Bienvenida */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-200 to-orange-300 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <img src="/logo.png" alt="Logo" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Bienvenido a Encuentro
          </h1>
          <p className="text-gray-700 text-base">
            Tu experiencia empieza aquí.
          </p>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full space-y-4 border-2 border-gray-300 rounded-lg m-8 p-6 bg-white shadow-md ">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">
              Crear una cuenta
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              Compra tus entradas a tus eventos favoritos.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.nombre
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
                {errors.nombre && (
                  <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="apellido"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  required
                  className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.apellido
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Ingresa tu apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                />
                {errors.apellido && (
                  <p className="text-xs text-red-600 mt-1">{errors.apellido}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Fecha de Nacimiento */}
              <div>
                <label
                  htmlFor="fechaNacimiento"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Fecha de Nacimiento
                </label>
                <input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  required
                  className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.fechaNacimiento
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                />
                {errors.fechaNacimiento && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.fechaNacimiento}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="correo"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.correo
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="juan.email@example.com"
                  value={formData.correo}
                  onChange={handleInputChange}
                />
                {errors.correo && (
                  <p className="text-xs text-red-600 mt-1">{errors.correo}</p>
                )}
              </div>
            </div>

            {/* Contraseña */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password ? (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">
                    La contraseña debe tener al menos 8 caracteres.
                  </p>
                )}
              </div>

              {/* Repetir Contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Repetir contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="rol"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Rol
              </label>
              <select
                id="rol"
                name="rol"
                required
                className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                  errors.rol
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={formData.rol}
                onChange={handleInputChange}
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                <option value="asistente">Asistente</option>
                <option value="organizador">Organizador</option>
              </select>
              {errors.rol && (
                <p className="text-xs text-red-600 mt-1">{errors.rol}</p>
              )}
            </div>

            {formData.rol === "organizador" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="empresa"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Empresa
                  </label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    required
                    className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      errors.empresa
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Ingresa el nombre de tu empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                  />
                  {errors.empresa && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.empresa}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="ruc"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    RUC
                  </label>
                  <input
                    id="ruc"
                    name="ruc"
                    type="text"
                    required
                    className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-1 ${
                      errors.ruc
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                    placeholder="Ingresa el RUC de tu empresa"
                    value={formData.ruc}
                    onChange={handleInputChange}
                  />
                  {errors.ruc && (
                    <p className="text-xs text-red-600 mt-1">{errors.ruc}</p>
                  )}
                </div>
              </div>
            )}

            {/* Botón de registro */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ease-in-out ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registrando...
                  </div>
                ) : (
                  "Registrarse"
                )}
              </button>
            </div>

            {/* Mensaje de error */}
            {showError && Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-red-800 font-medium">
                      Por favor, corrige los errores en el formulario
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje de error del backend */}
            {backendError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-red-800 font-medium">
                      {backendError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enlaces */}
            <div className="text-center">
              <p className="text-xs text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
