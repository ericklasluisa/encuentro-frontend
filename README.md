# Encuentro Frontend

## Descripción del Proyecto

Frontend de la plataforma Encuentro, diseñado para ofrecer una experiencia web interactiva, fluida y accesible, facilitando tanto a organizadores como a asistentes la gestión integral de eventos. A través de una interfaz intuitiva, los organizadores pueden crear, configurar y monitorear eventos en tiempo real, mientras que los usuarios acceden fácilmente a información detallada, disponibilidad de cupos y funcionalidades para gestionar su participación. Además, el sistema incluye notificaciones automáticas, actualizaciones dinámicas y control de acceso por roles, garantizando una interacción eficaz, moderna y adaptada a las necesidades actuales en la organización de eventos.

## Tecnologías Utilizadas

Este proyecto está construido con las siguientes tecnologías:

- **[React](https://reactjs.org/)** - Biblioteca de JavaScript para construir interfaces de usuario
- **[Vite](https://vitejs.dev/)** - Build tool rápido para desarrollo frontend moderno
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utilitario para diseño rápido
- **[React Router](https://reactrouter.com/)** - Enrutamiento declarativo para aplicaciones React
- **[Zustand](https://github.com/pmndrs/zustand)** - Gestión de estado simple y escalable para React
- **[ESLint](https://eslint.org/)** - Herramienta de análisis estático de código para identificar patrones problemáticos

## Configuración del Entorno de Desarrollo

### Prerrequisitos

Asegúrate de tener instalado en tu sistema:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn** (npm viene incluido con Node.js)

### Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/ericklasluisa/encuentro-frontend.git
   cd encuentro-frontend
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

### Comandos Disponibles

- **Iniciar servidor de desarrollo:**

  ```bash
  npm run dev
  ```

  Esto iniciará el servidor de desarrollo en `http://localhost:5173`

- **Construir para producción:**

  ```bash
  npm run build
  ```

- **Previsualizar la build de producción:**

  ```bash
  npm run preview
  ```

- **Ejecutar linter:**
  ```bash
  npm run lint
  ```

### Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas/vistas de la aplicación
├── store/         # Configuración de Zustand
├── utils/         # Funciones utilitarias
├── App.jsx        # Componente principal
├── main.jsx       # Punto de entrada
└── index.css      # Estilos globales
```

## Desarrollo

Para comenzar a desarrollar:

1. Ejecuta `npm run dev` para iniciar el servidor de desarrollo
2. Abre tu navegador en `http://localhost:5173`
3. Los cambios se reflejarán automáticamente gracias a Hot Module Replacement (HMR)
