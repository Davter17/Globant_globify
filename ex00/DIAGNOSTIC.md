# 🔍 Diagnóstico de Error de Autenticación

## Error Actual
```
error=unsupported_response_type&state=...
```

## Causa Probable
Spotify está rechazando el `response_type=code` porque:
1. La app en Spotify Dashboard no está configurada correctamente
2. El tipo de app no permite Authorization Code Flow

## ✅ Checklist de Spotify Dashboard

### Paso 1: Verifica el Tipo de App
Ve a: https://developer.spotify.com/dashboard

1. Abre tu app: **Globify** (Client ID: `c9e4eb111a75462bbf6ad56e6b3e902e`)
2. Click en **Settings**
3. Verifica que en **App settings** tengas:
   - ✅ **Web API** checked
   - ✅ **Web Playback SDK** checked (si usas reproductor)

### Paso 2: Redirect URIs
En **Settings > Redirect URIs** debe estar EXACTAMENTE:
```
http://127.0.0.1:8080/callback
```

**IMPORTANTE**: 
- NO `https://`
- NO `localhost` (debe ser `127.0.0.1`)
- NO trailing slash
- Guarda los cambios con el botón **SAVE**

### Paso 3: API/SDKs
En la página principal de tu app, verifica que esté seleccionado:
- ✅ **Which API/SDKs are you planning to use?** → Web API

## 🔧 Solución Alternativa

Si el problema persiste, puede ser que Spotify requiera que uses el **Authorization Code Flow** tradicional (sin PKCE) o que la app deba ser de tipo "Web App" específicamente.

### Opción 1: Verificar que la App es de tipo "Web App"
Cuando creaste la app en Spotify Dashboard, debiste seleccionar:
- **App type**: Web app (no Mobile app, ni Backend app)

### Opción 2: Recrear la App
Si la app fue creada con configuración incorrecta:
1. Ve a https://developer.spotify.com/dashboard
2. Create App
3. **App name**: Globify
4. **App description**: Music player for Globant Piscine
5. **Website**: http://127.0.0.1:8080
6. **Redirect URI**: http://127.0.0.1:8080/callback
7. **Which API/SDKs**: Web API ✅
8. **App type**: Website (esto es crítico)
9. Acepta los términos
10. Copia el nuevo CLIENT_ID
11. Actualiza `src/scripts/config.local.js`

## 🧪 Test Manual

Una vez configurado, prueba manualmente la URL de autorización.

Abre esta URL en el navegador (reemplaza CLIENT_ID):
```
https://accounts.spotify.com/authorize?client_id=c9e4eb111a75462bbf6ad56e6b3e902e&response_type=code&redirect_uri=http://127.0.0.1:8080/callback&scope=user-read-private%20user-read-email&state=test123
```

Si funciona correctamente:
- ✅ Te pedirá login de Spotify
- ✅ Te mostrará pantalla de permisos
- ✅ Te redirigirá a `http://127.0.0.1:8080/callback?code=XXX&state=test123`

Si ves el error:
- ❌ Aparece `error=unsupported_response_type`
- 🔧 La app necesita ser reconfigurada en el Dashboard

## 📞 Siguiente Paso

1. Verifica el Dashboard con los pasos de arriba
2. Intenta la URL manual de test
3. Si sigue fallando, recrea la app en Spotify Dashboard
