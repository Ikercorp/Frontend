# Salsa de Tomate Frontend

Aplicacion React + Vite para consumir la API ASP.NET Core de Salsa de Tomate.

## Requisitos

- Node.js 18 o superior
- npm
- Backend ASP.NET ejecutandose en `http://localhost:8000`
- MariaDB con la base del backend configurada

## Instalacion

Desde la carpeta `Frontend`:

```bash
npm install
```

Crea o revisa el archivo `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Luego ejecuta el frontend:

```bash
npm run dev
```

La aplicacion queda disponible normalmente en:

```txt
http://localhost:5173
```

Para probar compilacion de produccion:

```bash
npm run build
```

## Backend Necesario

Desde la carpeta `Backend`:

```bash
dotnet restore
dotnet build
dotnet run
```

Swagger:

```txt
http://localhost:8000/swagger
```

Credenciales demo del backend:

```txt
admin@salsadetomate.test
password123

chef@salsadetomate.test
password123
```

## Novedades Agregadas

### Perfil publico y propio

- Vista `/profile/{userId}` para ver el perfil de cualquier usuario.
- Bio publica del usuario.
- Avatar del usuario.
- Conteo de seguidores y siguiendo.
- Recetas publicadas del usuario.
- Colecciones del usuario.
- Boton de seguir/dejar de seguir cuando se visita otro perfil.

### Edicion de perfil

Cuando el usuario visualiza su propio perfil puede:

- Modificar su nombre.
- Crear o modificar su BIO.
- Subir avatar desde una imagen de su computadora.

### Colecciones

- En la vista de perfil solo se muestran colecciones.
- La administracion de colecciones se mueve a la vista de receta.
- Desde una receta publicada el usuario puede:
  - Guardarla en una coleccion existente.
  - Crear una coleccion nueva.
  - Guardar la receta actual sin escribir IDs manuales.
  - Elegir si la coleccion nueva sera publica en el perfil.

### Boton Mi Perfil

El boton `Mi perfil` se agrego en las cabeceras principales para que el usuario pueda volver a su perfil desde las vistas del proyecto cuando esta autenticado.

### Rating con niveles

El backend calcula niveles permanentes para usuarios segun el rendimiento de sus recetas:

- `MAESTRO`: al menos 5 recetas con 100 o mas ratings y promedio superior a 4.
- `CHEF`: al menos 5 recetas con 100 o mas ratings y promedio superior a 4.5.
- `KING CHEF`: al menos 5 recetas con 100 o mas ratings y promedio exactamente 5.

El nivel no retrocede aunque cambien los ratings despues.

## Endpoints Usados Por El Frontend

### Auth

| Metodo | Endpoint | Uso |
|---|---|---|
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Usuario autenticado |
| POST | `/api/auth/logout` | Cerrar sesion |

### Perfil

| Metodo | Endpoint | Uso |
|---|---|---|
| GET | `/api/users/{userId}/profile` | Perfil publico |
| PATCH | `/api/profile` | Editar nombre, bio y avatar actual |
| POST | `/api/profile/avatar` | Subir avatar desde archivo |
| POST | `/api/users/{userId}/follow` | Seguir usuario |
| DELETE | `/api/users/{userId}/follow` | Dejar de seguir usuario |

### Colecciones

| Metodo | Endpoint | Uso |
|---|---|---|
| GET | `/api/profile/collections` | Mis colecciones |
| POST | `/api/profile/collections` | Crear coleccion |
| PATCH | `/api/profile/collections/{collectionId}` | Renombrar/editar coleccion |
| POST | `/api/profile/collections/{collectionId}/publish` | Publicar coleccion |
| POST | `/api/profile/collections/{collectionId}/unpublish` | Hacer privada la coleccion |
| POST | `/api/profile/collections/{collectionId}/recipes` | Guardar receta en coleccion |
| DELETE | `/api/profile/collections/{collectionId}/recipes/{recipeId}` | Quitar receta de coleccion |

### Recetas

| Metodo | Endpoint | Uso |
|---|---|---|
| GET | `/api/recipes` | Feed y busqueda |
| GET | `/api/recipes/{id}` | Detalle de receta |
| POST | `/api/recipes` | Crear receta |
| PUT | `/api/recipes/{id}` | Editar receta |
| DELETE | `/api/recipes/{id}` | Eliminar receta |
| POST | `/api/recipes/{id}/publish` | Publicar receta |
| POST | `/api/recipes/{id}/unpublish` | Despublicar receta |
| POST | `/api/recipes/{id}/ratings` | Calificar receta |
| POST | `/api/recipes/{id}/comments` | Comentar receta |
| GET | `/api/recipes/{id}/comments` | Listar comentarios |

### Media

| Metodo | Endpoint | Uso |
|---|---|---|
| POST | `/api/recipes/{recipeId}/media` | Subir imagen o video |
| PATCH | `/api/recipes/{recipeId}/media/{mediaId}/primary` | Marcar imagen principal |
| DELETE | `/api/recipes/{recipeId}/media/{mediaId}` | Eliminar media |

## Notas

- El frontend guarda el token en `localStorage` como `access_token`.
- Las rutas protegidas redirigen a `/login` si no hay token.
- La subida de avatar usa `multipart/form-data`.
- Los archivos subidos se sirven desde el backend por `/storage/...`.
