import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      isAuthenticated: false,
      user: null,
      token: null,

      // Acciones
      login: (authData) => {
        set({
          isAuthenticated: true,
          user: {
            id: authData.idUsuario,
            nombre: authData.usuario,
            rol: authData.rol,
          },
          token: authData.token,
        });
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
        // Limpiar localStorage también
        localStorage.removeItem("auth-storage");
      },

      // Verificar si el usuario está autenticado
      checkAuth: () => {
        const state = get();
        return state.isAuthenticated && state.token;
      },

      // Obtener el token para las peticiones
      getToken: () => {
        const state = get();
        return state.token;
      },

      // Obtener información del usuario
      getUser: () => {
        const state = get();
        return state.user;
      },

      // Verificar si el usuario es organizador
      isOrganizer: () => {
        const state = get();
        return state.user?.rol === "ORGANIZADOR";
      },

      // Verificar si el usuario es asistente
      isAttendee: () => {
        const state = get();
        return state.user?.rol === "ASISTENTE";
      },
    }),
    {
      name: "auth-storage", // nombre para localStorage
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
