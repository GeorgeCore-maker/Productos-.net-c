# MiPrimeraApi

Aplicación de ejemplo **full-stack** para practicar el consumo de una API REST con autenticación JWT. El backend es una API en **ASP.NET Core (.NET 10)** con **Entity Framework Core** y **SQL Server**; el frontend es una SPA en **Angular 18**, la cual consume la API para iniciar sesión y gestionar un listado de productos (crear, listar, editar y eliminar).

---

## Tabla de contenido

- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Backend (API .NET)](#backend-api-net)
  - [Configuración](#configuración)
  - [Base de datos](#base-de-datos)
  - [Ejecutar el backend](#ejecutar-el-backend)
- [Frontend (Angular)](#frontend-angular)
  - [Ejecutar el frontend](#ejecutar-el-frontend)
- [Credenciales de acceso](#credenciales-de-acceso)
- [Endpoints de la API](#endpoints-de-la-api)
- [Funcionamiento del frontend](#funcionamiento-del-frontend)
- [Notas](#notas)

---

## Arquitectura

```
┌──────────────────────────┐        HTTP + JWT (Bearer)        ┌────────────────────────────┐
│  Frontend Angular 18     │  ───────────────────────────────► │  API ASP.NET Core (.NET 10) │
│  http://localhost:4200   │  ◄─────────────────────────────── │  http://localhost:5283      │
└──────────────────────────┘              JSON                 └──────────────┬─────────────┘
                                                                              │ EF Core
                                                                              ▼
                                                                   ┌────────────────────┐
                                                                   │  SQL Server        │
                                                                   │  MiPrimeraApiDB     │
                                                                   └────────────────────┘
```

- El usuario inicia sesión y la API devuelve un **token JWT**.
- El frontend guarda el token y lo envía en cada petición protegida mediante un **interceptor HTTP**.
- La API valida el token y permite operar sobre los productos.

---

## Estructura del proyecto

```
MiPrimeraApi/
├── Controllers/              # Controladores de la API (Auth, Productos)
├── Data/                     # AppDbContext (EF Core)
├── DTOs/                     # Objetos de transferencia (Crear/Actualizar/Respuesta)
├── Migrations/               # Migraciones de EF Core
├── Models/                   # Entidades de dominio (Producto)
├── Properties/               # launchSettings.json (puertos de ejecución)
├── Services/                 # Lógica de negocio (ProductoService, TokenService)
├── frontend/                 # Aplicación Angular (SPA)
│   └── src/app/
│       ├── auth/             # Login + servicio, guard e interceptor de autenticación
│       └── products/         # Listado de productos + modales add/edit
├── Program.cs                # Configuración e inicio de la API
├── appsettings.json          # Configuración (cadena de conexión, logging)
└── MiPrimeraApi.csproj       # Definición del proyecto .NET
```

---

## Requisitos previos

| Herramienta | Versión sugerida |
|-------------|------------------|
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.0 |
| [Node.js](https://nodejs.org/) | 18 o superior |
| [Angular CLI](https://angular.dev/tools/cli) | 18.x (`npm install -g @angular/cli`) |
| [SQL Server](https://www.microsoft.com/sql-server) | LocalDB / Express / Developer |

---

## Backend (API .NET)

### Configuración

La cadena de conexión está en `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MiPrimeraApiDB;Integrated Security=True;TrustServerCertificate=True"
}
```

La firma del JWT se guarda en **User Secrets** (no en el repositorio). Define las claves antes de ejecutar:

```bash
cd MiPrimeraApi
dotnet user-secrets set "Jwt:Key" "una-clave-secreta-larga-y-segura-de-al-menos-32-caracteres"
dotnet user-secrets set "Jwt:Issuer" "MiPrimeraApi"
dotnet user-secrets set "Jwt:Audience" "MiPrimeraApiClient"
```

> `Jwt:Key` es obligatoria. Si falta, la aplicación lanza `InvalidOperationException` al iniciar (`Program.cs`).

### Base de datos

Crea/actualiza la base de datos aplicando las migraciones de EF Core:

```bash
cd MiPrimeraApi
dotnet ef database update
```

También puedes ejecutar herramientas de EF con:

```bash
dotnet tool install --global dotnet-ef   # solo la primera vez
```

### Ejecutar el backend

```bash
cd MiPrimeraApi
dotnet run --launch-profile http
```

- API: `http://localhost:5283`
- Swagger UI (solo en Development): `http://localhost:5283/swagger`
- Raíz: `http://localhost:5283/` → `"MiPrimeraApi está funcionando"`

---

## Frontend (Angular)

El frontend vive en la carpeta `frontend/`. Consulta [`frontend/README.md`](frontend/README.md) para el detalle de la SPA.

### Ejecutar el frontend

```bash
cd frontend
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

> El backend ya permite **CORS** desde `http://localhost:4200` (política `AngularDev` en `Program.cs`).

---

## Credenciales de acceso

Son credenciales **de práctica, definidas en código** (`Controllers/AuthController.cs`):

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |

---

## Endpoints de la API

Base: `http://localhost:5283/api`

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|:----:|-------------|
| `POST` | `/Auth/login` | No | Inicia sesión. Body: `{ "usuario": "admin", "contrasena": "admin123" }`. Devuelve `{ "token": "..." }`. |

### Productos (requieren `Authorization: Bearer <token>`)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/Productos` | Lista todos los productos. |
| `GET` | `/Productos/{id}` | Obtiene un producto por id. |
| `POST` | `/Productos` | Crea un producto. Body: `{ "nombre", "precio", "activo" }`. |
| `PUT` | `/Productos/{id}` | Actualiza un producto. Body: `{ "nombre", "precio", "activo" }`. |
| `DELETE` | `/Productos/{id}` | Elimina un producto. Devuelve `204 No Content`. |
| `GET` | `/Productos/activos-costosos` | Productos activos con precio mayor a `50000`. |
| `POST` | `/Productos/varios` | Crea varios productos de una vez. |

El token expira a los **30 minutos**.

---

## Funcionamiento del frontend

### Rutas

| Ruta | Componente | Protegida |
|------|------------|:---------:|
| `/login` | `LoginComponent` | No |
| `/productos` | `ProductsComponent` (carga diferida) | Sí (`authGuard`) |
| `''` | Redirige a `/login` | — |
| `**` | Redirige a `/login` | — |

### Flujo principal

1. **Login**: el usuario ingresa sus credenciales; `AuthService` llama a `/Auth/login` y guarda el token en `localStorage`.
2. **Interceptor**: `authInterceptor` añade automáticamente el header `Authorization: Bearer <token>` en las peticiones a la API.
3. **Guard**: `authGuard` impide el acceso a `/productos` si no hay token.
4. **Productos**: la tabla muestra los productos y ofrece dos acciones por fila:
   - **Editar** → abre el modal `EditProductComponent` con el formulario precargado (`PUT`).
   - **Eliminar** → abre un modal de confirmación (`DELETE`).
   - **Agregar producto** (botón superior) → abre el modal `AddProductComponent` (`POST`).

### Comunicación con la API

La URL base de la API está en los servicios (`http://localhost:5283/api`). Si cambias el puerto del backend, actualízala en:

- `src/app/auth/auth.service.ts`
- `src/app/products/products.service.ts`
- `src/app/auth/auth.interceptor.ts`

---

## Notas

- Proyecto **educativo**: las credenciales y la clave JWT son de ejemplo. No usar tal cual en producción.
- El token se guarda en `localStorage` (aceptable para prácticas, no recomendado para producción).
- Swagger y OpenAPI solo se exponen en el entorno **Development**.
