# Frontend — MiPrimeraApi

SPA construida con **Angular 18** (componentes *standalone*) que consume la API [MiPrimeraApi](../README.md). Permite iniciar sesión y gestionar un listado de productos (listar, crear, editar y eliminar).

> Requiere que el backend esté en ejecución en `http://localhost:5283`. Consulta el [README raíz](../README.md) para configurar la API, la base de datos y las credenciales JWT.

---

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- [Angular CLI](https://angular.dev/tools/cli) 18 (`npm install -g @angular/cli`)

---

## Puesta en marcha

```bash
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200` y se recarga automáticamente al modificar los archivos fuente.

### Credenciales de prueba

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo (`ng serve`) en `http://localhost:4200`. |
| `npm run build` | Compila para producción en `dist/mi-primera-api-frontend`. |
| `npm run watch` | Compilación en modo desarrollo con observación de cambios. |
| `npm test` | Ejecuta las pruebas unitarias con Karma. |
| `npm run ng -- <cmd>` | Ejecuta comandos de Angular CLI (p. ej. generar componentes). |

---

## Estructura

```
src/
├── app/
│   ├── auth/                    # Autenticación
│   │   ├── login.component.*    #   Pantalla de inicio de sesión
│   │   ├── auth.service.ts      #   Llamada a /Auth/login y manejo del token
│   │   ├── auth.guard.ts        #   Protege rutas que requieren sesión
│   │   └── auth.interceptor.ts  #   Añade el header Bearer a las peticiones
│   ├── products/                # Productos
│   │   ├── products.component.* #   Tabla + acciones (listar/editar/eliminar)
│   │   ├── products.service.ts  #   CRUD contra /Productos
│   │   ├── add-product/         #   Modal para crear producto
│   │   └── edit-product/        #   Modal para editar producto
│   ├── app.component.*          # Componente raíz (router-outlet)
│   ├── app.config.ts            # Providers (router, http, interceptor)
│   └── app.routes.ts            # Definición de rutas
├── main.ts                      # Bootstrap de la aplicación
└── styles.css                   # Estilos globales
```

---

## Rutas

| Ruta | Componente | Protegida |
|------|------------|:---------:|
| `/login` | `LoginComponent` | No |
| `/productos` | `ProductsComponent` (carga diferida) | Sí (`authGuard`) |
| `''` | Redirige a `/login` | — |
| `**` | Redirige a `/login` | — |

---

## Servicios y comunicación con la API

La URL base de la API (`http://localhost:5283/api`) está definida en:

- `src/app/auth/auth.service.ts` → `/Auth/login`
- `src/app/products/products.service.ts` → `/Productos`
- `src/app/auth/auth.interceptor.ts` → interceptor que añade el `Bearer` token

Si cambias el puerto del backend, actualiza estos archivos.

### Autenticación

1. `AuthService.login()` envía las credenciales y guarda el `token` en `localStorage` (clave `mi-primera-api-token`).
2. `authInterceptor` añade `Authorization: Bearer <token>` en cada petición a la API.
3. `authGuard` redirige a `/login` si no hay token válido.

---

## Generar código

```bash
ng generate component ruta/nombre-componente
ng generate service ruta/nombre-servicio
```

Puedes generar directivas, pipes, guards, interfaces, enums o módulos cambiando el tipo en el comando.

---

## Más ayuda

Para más información sobre Angular CLI, usa `ng help` o consulta la [documentación oficial](https://angular.dev/tools/cli).
