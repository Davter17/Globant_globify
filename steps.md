# Globify - Plan de Desarrollo Paso a Paso

## 📋 Fase 0: Preparación Inicial

### Step 0.1: Estructura del Proyecto
- [x] Crear estructura de carpetas:
  ```
  ex00/
  ├── src/
  │   ├── index.html
  │   ├── styles/
  │   │   └── main.css
  │   ├── scripts/
  │   │   ├── main.js (o main.ts)
  │   │   ├── auth.js
  │   │   ├── api.js
  │   │   ├── player.js
  │   │   ├── router.js
  │   │   └── components/
  │   │       ├── header.js
  │   │       ├── footer.js
  │   │       ├── menu.js
  │   │       └── player-bar.js
  │   └── assets/
  │       └── icons/
  ├── Dockerfile
  ├── docker-compose.yml
  ├── .gitignore
  ├── README.md
  └── nginx.conf (para servir archivos estáticos)
  ```

### Step 0.2: Configurar Spotify API
- [x] Ir a https://developer.spotify.com/dashboard
- [x] Crear una nueva aplicación
- [x] Obtener Client ID
- [x] Configurar Redirect URI (ej: `https://localhost:8080/callback`)
- [x] Guardar credenciales (NO subir a git)

---

## 📋 Fase 1: Docker Setup

### Step 1.1: Crear Dockerfile
- [x] Crear `Dockerfile` básico con nginx para servir archivos estáticos
- [x] Configurar puerto 8080

### Step 1.2: Crear docker-compose.yml
- [x] Configurar servicio web
- [x] Mapear puertos
- [x] Configurar volúmenes para desarrollo

### Step 1.3: Crear nginx.conf
- [x] Configurar servidor para SPA
- [x] Redirigir todas las rutas a index.html

---

## 📋 Fase 2: HTML Base y Estructura

### Step 2.1: Crear index.html
- [x] Estructura HTML5 básica
- [x] Meta tags responsive
- [x] Contenedor principal `<div id="app">`
- [x] Enlaces a CSS y JS
- [x] Secciones: header, main, footer, menu lateral

### Step 2.2: Estructura de Componentes
- [x] Header (logo, botón logout, perfil)
- [x] Menu lateral (Home, Favorites, Playlists)
- [x] Main content (área dinámica)
- [x] Player bar (reproductor en la parte inferior)
- [x] Footer (solo móvil - botón menú)

---

## 📋 Fase 3: CSS - Estilos Base

### Step 3.1: Variables CSS y Reset
- [x] Definir variables de colores (fuertes y llamativos)
- [x] CSS Reset básico
- [x] Tipografía base

### Step 3.2: Layout Principal
- [x] Grid/Flexbox para layout general
- [x] Header fijo en top
- [x] Footer fijo en bottom
- [x] Menu lateral fijo (desktop)
- [x] Player bar fijo en bottom

### Step 3.3: Responsive Design
- [x] Media query en 430px
- [x] Menu overlay en móvil
- [x] Ajustes de spacing
- [x] Botón hamburguesa en footer móvil

### Step 3.4: Componentes Individuales
- [x] Estilos de cards (categorías, playlists, tracks)
- [x] Estilos del player
- [x] Estilos del menú
- [x] Estilos de listas

---

## 📋 Fase 4: JavaScript - Configuración Base

### Step 4.1: Configuración y Constantes
- [x] Archivo config.js con Client ID y Redirect URI
- [x] Endpoints de Spotify API
- [x] Constantes globales

### Step 4.2: Router Simple
- [x] Sistema de routing básico (hash-based)
- [x] Rutas: #home, #favorites, #playlists, #playlist/:id, #profile
- [x] Función para renderizar vistas

### Step 4.3: Utilidades
- [x] Función para crear elementos DOM
- [x] Función para mostrar/ocultar loading
- [x] Función para manejar errores

---

## 📋 Fase 5: Autenticación (OAuth 2.0)

### Step 5.1: Login Flow
- [x] Crear función `login()` que redirija a Spotify OAuth
- [x] Scopes necesarios: user-read-private, user-read-email, user-library-read, user-top-read, playlist-read-private, streaming, user-read-playback-state, user-modify-playback-state
- [x] Botón de login en página inicial

### Step 5.2: Callback Handler
- [x] Capturar authorization code de la URL después del redirect
- [x] Implementar backend Node.js para token exchange (PKCE)
- [x] Guardar access token en localStorage
- [x] Redirigir a home después de login exitoso
- [x] Docker multi-stage con nginx + node + supervisor

### Step 5.3: Logout
- [x] Función `logout()` que limpie localStorage
- [x] Redirigir a página de login
- [x] Conectar con botón de logout en header

### Step 5.4: Check de Autenticación
- [x] Verificar si hay token válido al cargar la app
- [x] Redirigir a login si no hay token
- [x] Refresh token si es necesario (opcional)

---

## 📋 Fase 6: API - Funciones de Spotify

### Step 6.1: Función Base para Fetch
- [x] Crear función `spotifyFetch()` que incluya el token en headers
- [x] Manejar errores 401 (token expirado)
- [x] Manejar rate limiting

### Step 6.2: User API
- [x] `getUserProfile()` - Obtener datos del usuario
- [x] `getSavedTracks()` - Obtener canciones guardadas (limit 50)

### Step 6.3: Browse API
- [x] `getCategories()` - Obtener categorías (limit 50)
- [x] `getCategoryPlaylists(categoryId)` - Playlists de una categoría (limit 50)

### Step 6.4: Playlists API
- [x] `getUserPlaylists()` - Obtener playlists del usuario (limit 50)
- [x] `getPlaylist(playlistId)` - Detalles de una playlist
- [x] `getPlaylistTracks(playlistId)` - Tracks de una playlist (limit 50)

### Step 6.5: Search API
- [x] `searchTracks(query)` - Buscar canciones (limit 50)

### Step 6.6: Player API
- [x] `playTrack(uri)` - Reproducir una canción
- [x] `pauseTrack()` - Pausar reproducción
- [x] `getCurrentPlayback()` - Estado actual del player
- [x] Funciones helper: formatDuration, getArtistName, getArtistNames

---

## 📋 Fase 7: Componentes - Header y Menu

### Step 7.1: Header Component
- [x] Renderizar nombre de usuario y foto
- [x] Botón de logout funcional
- [x] Link a perfil (clickeable)
- [x] Estilos hover para user profile

### Step 7.2: Menu Component
- [x] Renderizar opciones: Home, Favorites, Playlists, Search, Profile
- [x] Navegación funcional con router
- [x] Toggle para móvil
- [x] Auto-cerrar en móvil después de selección
- [x] Actualizar item activo según ruta
- [x] Soporte para contadores (preparado para Fase 9-10)

---

## 📋 Fase 8: Vista - Home

### Step 8.1: Cargar Categorías
- [x] Llamar a `getCategories()` al entrar en home
- [x] Renderizar lista de categorías en grid

### Step 8.2: Destacar Primeras 3 (Desktop)
- [x] CSS especial para primeras 3 categorías (class highlight)
- [x] Grid responsive con auto-fill

### Step 8.3: Click en Categoría
- [x] Al hacer click, cargar playlists de esa categoría
- [x] Renderizar playlists con imágenes y overlay
- [x] Botón "volver" a categorías funcional
- [x] Navegación a playlist detail (#playlist/:id)

---

## 📋 Fase 9: Vista - Profile

### Step 9.1: Mostrar Datos del Usuario
- [x] Nombre, email, foto de perfil grande
- [x] País, producto (free/premium)
- [x] Seguidores (si disponible)
- [x] Diseño de tarjeta centrado con stats

---

## 📋 Fase 10: Vista - My Favorites

### Step 10.1: Cargar Canciones Guardadas
- [x] Llamar a `getSavedTracks()`
- [x] Header de tabla: #, Title, Album, Duration
- [x] Renderizar lista en formato de tracks con grid (5 columnas)
- [x] Mostrar número, imagen, nombre, artista, álbum, duración
- [x] Empty state si no hay favoritos
- [x] Click handlers con alert temporal (preparado para Fase 14)

### Step 10.2: Click en Track
- [ ] Al hacer click, iniciar reproducción
- [ ] Actualizar player bar

---

## 📋 Fase 11: Vista - Playlists

### Step 11.1: Listar Playlists del Usuario
- [x] Llamar a `getUserPlaylists()`
- [x] Renderizar como cards con imagen y overlay
- [x] Empty state si no hay playlists

### Step 11.2: Click en Playlist
- [x] Navegar a página de detalles (#playlist/:id)

---

## 📋 Fase 12: Vista - Playlist Page

### Step 12.1: Hero Section
- [x] Imagen de la playlist (232x232px)
- [x] Nombre, tipo (Playlist), descripción
- [x] Owner, número de tracks, likes
- [x] Botón "Play All"
- [x] Botón "Back" para volver
- [x] Gradient background

### Step 12.2: Lista de Tracks
- [x] Cargar tracks de la playlist con getPlaylist()
- [x] Header de tabla: #, Title, Album, Duration
- [x] Renderizar lista grid con: número, imagen, nombre, artista, álbum, duración
- [x] Empty state si no hay tracks

### Step 12.3: Reproducción
- [x] Click en track individual → preparado para play (Fase 14)
- [x] Botón "Play All" → preparado para play (Fase 14)
- [x] Alert temporal indicando que se implementará en Fase 14

---

## 📋 Fase 13: Vista - Search

### Step 13.1: Input de Búsqueda
- [x] Input con botón de buscar
- [x] Enter key para buscar

### Step 13.2: Resultados
- [x] Llamar a `searchTracks(query)`
- [x] Header de tabla: #, Title, Album, Duration
- [x] Renderizar resultados en formato lista (track items con grid 5 columnas)
- [x] Mensaje si no hay resultados
- [x] Placeholder inicial
- [x] Click handlers con alert temporal (preparado para Fase 14)

### Step 13.3: Click en Resultado
- [ ] Iniciar reproducción
- [ ] Actualizar player bar

---

## 📋 Fase 14: Player Component

### Step 14.1: UI del Player
- [ ] Información del track actual (izquierda): imagen, nombre, artista
- [ ] Controles en el centro: solo Play/Pause
- [ ] Tiempo actual / duración (opcional)

### Step 14.2: Estado del Player
- [ ] Variable global para track actual
- [ ] Estado play/pause
- [ ] Sincronizar con Spotify Web Playback SDK o API

### Step 14.3: Funcionalidad Play/Pause
- [ ] Botón play → `playTrack(uri)`
- [ ] Botón pause → `pauseTrack()`
- [ ] Actualizar icono según estado

### Step 14.4: Actualizar al Reproducir
- [ ] Al hacer click en cualquier track, actualizar player bar
- [ ] Mostrar info del nuevo track

---

## 📋 Fase 15: Integración y Testing

### Step 15.1: Testing Manual
- [ ] Probar login/logout
- [ ] Navegar por todas las vistas
- [ ] Verificar reproducción desde diferentes vistas
- [ ] Probar en móvil (430px y menos)
- [ ] Probar en desktop

### Step 15.2: Pulir Detalles
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states (sin playlists, sin resultados, etc)
- [ ] Transiciones CSS

### Step 15.3: Responsive Final
- [ ] Verificar todos los breakpoints
- [ ] Menu overlay funcional en móvil
- [ ] Header/footer fijos

---

## 📋 Fase 16: Documentación

### Step 16.1: README.md
- [ ] Descripción del proyecto
- [ ] Requisitos previos
- [ ] Instrucciones de instalación
- [ ] Cómo configurar Spotify API
- [ ] Cómo ejecutar con Docker
- [ ] Capturas de pantalla (opcional)

### Step 16.2: Comentarios en Código
- [ ] Comentar funciones importantes
- [ ] Documentar API endpoints usados

---

## 📋 Fase 17: Docker Final y Deployment

### Step 17.1: Verificar Docker
- [ ] `docker-compose up` funciona correctamente
- [ ] App accesible en http://localhost:8080
- [ ] Variables de entorno configuradas

### Step 17.2: .gitignore
- [ ] Ignorar node_modules (si usas TypeScript)
- [ ] Ignorar archivos de configuración con tokens
- [ ] Ignorar .env si se usa

### Step 17.3: Limpieza Final
- [ ] Solo archivos necesarios en el repo
- [ ] No subir tokens ni secrets
- [ ] Verificar que todo funcione desde cero con Docker

---

## 📋 Fase 18: Submission

### Step 18.1: Repository
- [ ] Crear/verificar repo en Github
- [ ] Push de todos los archivos
- [ ] Verificar que ex00/ contenga todo lo necesario

### Step 18.2: Envío
- [ ] Copiar link del repositorio
- [ ] Enviar mediante formulario de Google

---

## 🎯 Prioridades para Hacerlo Rápido

### MVP (Mínimo Viable)
1. **Docker setup** (Fase 1)
2. **HTML básico** (Fase 2)
3. **CSS funcional** (Fase 3 - no pixel-perfect)
4. **Auth funcionando** (Fase 5)
5. **API básica** (Fase 6)
6. **Home con categorías** (Fase 8)
7. **Player básico** (Fase 14 - solo play/pause)
8. **README** (Fase 16.1)

### Features Extra (si hay tiempo)
- Profile completo
- Search avanzado
- Playlists detalladas
- UI mejorada

---

## ⚡ Tips para Desarrollo Rápido

1. **Usa plantillas**: Crea funciones para generar HTML repetitivo
2. **Copy-paste inteligente**: Reutiliza código de listas y cards
3. **Prioriza funcionalidad sobre diseño**: Que funcione primero, que se vea bonito después
4. **Testing continuo**: Prueba cada feature inmediatamente después de implementarla
5. **Git branches**: Una rama por feature grande
6. **División de trabajo**: Si trabajan en equipo, asignen fases completas a cada persona

---

## 🚨 Checklist de Entrega Final

- [ ] Login/Logout funciona con Spotify OAuth
- [ ] Layout responsive (breakpoint 430px)
- [ ] Header y footer fijos
- [ ] Menu funcional (overlay en móvil)
- [ ] Home muestra categorías y playlists
- [ ] Profile muestra datos del usuario
- [ ] Favorites muestra tracks guardados
- [ ] Playlists lista y navega a detalles
- [ ] Search busca y reproduce tracks
- [ ] Player play/pause funciona
- [ ] Docker funciona (Dockerfile + docker-compose.yml)
- [ ] README.md completo
- [ ] Sin tokens en el repo
- [ ] Todas las listas limitadas a 50 items

---

**¡Éxito con el proyecto! 🎵🚀**
