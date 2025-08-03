import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";
import { publicFetch } from "../hooks/useAuthenticatedFetch";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  // Función para validar el formulario
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({});

    // Validar formulario
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar
      const loginData = {
        correo: email.trim(),
        contrasena: password,
      };

      // Realizar petición al backend
      const response = await publicFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Login exitoso
        login(responseData); // Guardar datos en el store
        toast.success("¡Inicio de sesión exitoso!");

        // Limpiar formulario
        setEmail("");
        setPassword("");

        // Redirigir según el rol del usuario
        console.log("Usuario autenticado:", responseData);
        if (responseData.rol === "ORGANIZADOR") {
          navigate("/admin");
        } else {
          navigate("/eventos");
        }
      } else {
        // Manejar errores del backend
        let errorMessage = "Error al iniciar sesión. Intenta nuevamente.";

        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);

      // Manejar errores de conexión
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "No se pudo conectar con el servidor. Verifica tu conexión a internet."
        );
      } else {
        toast.error("Error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto h-14 w-14 bg-orange-100 rounded-md flex items-center justify-center mb-4">
              <img src="/logo.png" alt="Logo" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Iniciar Sesión
            </h2>
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="usuario@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Botón de envío */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition duration-150 ease-in-out ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar sesión"
                )}
              </button>
            </div>

            {/* Enlaces */}
            <div className="text-center space-y-2">
              <div>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div>
                <span className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <Link 
                    to="/register" 
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Regístrate aquí
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
