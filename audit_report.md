# Auditoría Técnica de Software: APP_TURISMO

**Fecha del Reporte:** 2026-02-04
**Estado Actual:** Mantenimiento / Reestructuración de Autenticación

## 1. Resumen Ejecutivo
La aplicación es una plataforma de turismo ("SelvaWasi") construida con una arquitectura moderna de **Monorepo** (Nx-style) separando `client` (Frontend) y `server` (Backend).

*   **Backend:** Robusto, basado en NestJS y PostgreSQL. Conserva toda la lógica de negocio y seguridad.
*   **Frontend:** React/Next.js. **Actualmente en estado "Inerte" respecto a la lógica de usuarios**, tras una solicitud explícita de desmantelar la autenticación visual.
*   **Base de Datos:** Estructurada y relacional, lista para soportar operaciones complejas de reservas y roles.

---

## 2. Auditoría de Backend (Servidor)

### Tecnologías Clave
*   **Framework:** NestJS (Modular, TypeScript).
*   **ORM:** Prisma.
*   **Base de Datos:** PostgreSQL.
*   **Seguridad:** Passport, JWT, BCrypt.

### Estructura de Módulos (Active Modules)
El backend está correctamente modularizado en `AppModule`:
1.  **AuthModule**: Manejo de Login/Registro y JWT (Funcional a nivel de código).
2.  **UsersModule**: Gestión de perfiles de usuario.
3.  **BoatsModule**: Gestión de embarcaciones.
4.  **RoutesModule / SchedulesModule**: Logística de transporte fluvial.
5.  **ExperiencesModule**: Ecoturismo y paquetes.
6.  **RestaurantsModule**: Gastronomía.
7.  **BookingsModule**: Sistema central de reservas (Relaciona Usuarios con Horarios).
8.  **AiModule**: Módulo de Inteligencia Artificial (probablemente chatbots o recomendaciones).

### Base de Datos (Schema Analysis)
El esquema (`prisma/schema.prisma`) está bien normalizado:

*   **User**: Soporta roles (`ADMIN`, `OPERATOR`, `TOURIST`, `RESTAURANT_OWNER`, `AGENCY_OWNER`).
*   **Relaciones**:
    *   `Operator` linkeado a `User` (1:1).
    *   `Experience` y `Boat` linkeados a `Operator` (1:N).
    *   `Booking` linkeado a `User` y `Schedule`.
    *   `Review` linkeado a `User` y `Restaurant`.
*   **Logística**: Modelo detallado con `Route`, `Schedule`, y `Price` (soporta tipos de asiento y monedas).

**Veredicto Backend:** ✅ **Saludable**. La infraestructura es sólida y está lista para reconectarse a cualquier frontend.

---

## 3. Auditoría de Frontend (Cliente)

### Tecnologías Clave
*   **Framework:** Next.js (App Router).
*   **Estilos:** Tailwind CSS (Diseño "Jungle/Glassmorphism").
*   **Lenguaje:** TypeScript.

### Estado Actual: "Modo Inerte"
Se ha ejecutado un protocolo de limpieza profunda en la capa de interacción de usuario:

1.  **Autenticación**:
    *   **Navbar**: Botones visuales presentes pero sin lógica (`console.log` únicamente). Modales eliminados.
    *   **Contexto**: `useAuth` y `AuthModal` removidos de las vistas principales.
2.  **Reservas**:
    *   **Experiencias / Barcos**: Los botones de acción ("Reservar") son estáticos. No verifican sesión ni disparan flujos de compra.
    *   **Perfil**: Página estática informativa ("Perfil Desactivado").
3.  **Visual**:
    *   El diseño UI/UX se mantiene intacto (colores, tipografías, maquetación). Solo la *lógica* ha sido desconectada.

**Veredicto Frontend:** ⚠️ **Desconectado**. Visualmente funcional, pero operativamente desconectado del backend en cuanto a flujos de usuario.

---

## 4. Recomendaciones para Reactivación
Para restaurar la operatividad completa del software:

1.  **Reconexión de APIs**: Volver a integrar `auth.service.ts` en los componentes UI.
2.  **Estado Global**: Reactivar un `AuthProvider` para manejar la sesión del usuario.
3.  **Protección de Rutas**: Implementar Guards o Middleware en Next.js para proteger `/profile` o `/checkout`.
4.  **Validación de Datos**: Asegurar que los formularios de frontend coincidan con los DTOs de NestJS (especialmente `fullName` vs `name`).

---

**Fin del Reporte.**
*Este documento refleja el estado del código al momento de la solicitud.*
