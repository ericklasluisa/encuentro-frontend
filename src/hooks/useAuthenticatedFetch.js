import useAuthStore from "../store/authStore";

// Hook personalizado para realizar peticiones autenticadas
export const useAuthenticatedFetch = () => {
  const getToken = useAuthStore((state) => state.getToken);
  const logout = useAuthStore((state) => state.logout);

  const authenticatedFetch = async (url, options = {}) => {
    const token = getToken();
    const apiUrl = import.meta.env.VITE_API_URL;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
    };

    const response = await fetch(`${apiUrl}${url}`, config);

    // Si recibimos un 401, significa que el token expiró
    if (response.status === 401) {
      logout(); // Cerrar sesión automáticamente
      window.location.href = "/login"; // Redirigir al login
      throw new Error("Sesión expirada");
    }

    return response;
  };

  return authenticatedFetch;
};

// Función utilitaria para hacer peticiones sin autenticación
export const publicFetch = async (endpoint, options = {}) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  return fetch(`${apiUrl}${endpoint}`, config);
};
