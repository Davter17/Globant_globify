# 🚀 Quick Start Guide

## Comandos Principales

### Iniciar el proyecto
```bash
make up
```

### Ver logs en tiempo real
```bash
make logs
```

### Detener el proyecto
```bash
make down
```

### Reiniciar (después de hacer cambios)
```bash
make restart
```

### Reconstruir imagen y reiniciar
```bash
make rebuild
```

### Ver todos los comandos disponibles
```bash
make help
```

### Limpiar todo (contenedores, imágenes, volúmenes)
```bash
make clean
```

---

## Acceso

**URL**: https://localhost:8080

⚠️ **Nota**: Tu navegador mostrará una advertencia de seguridad porque usamos un certificado autofirmado. Esto es normal para desarrollo local. Simplemente acepta el riesgo y continúa.

---

## Flujo de Trabajo

1. **Primera vez:**
   ```bash
   make setup    # Crea config.local.js
   # Edita src/scripts/config.local.js con tu Client ID
   make up       # Inicia la aplicación
   ```

2. **Desarrollo diario:**
   ```bash
   make up       # Iniciar
   # ... haces cambios en src/ ...
   make restart  # Reiniciar para ver cambios
   make down     # Detener al finalizar
   ```

3. **Después de cambios grandes:**
   ```bash
   make rebuild  # Reconstruir imagen completa
   ```

---

## Estado del Contenedor

```bash
# Ver si está corriendo
make test

# Ver logs
make logs

# Ver contenedores Docker
docker ps
```

---

## Troubleshooting

### El puerto 8080 está en uso
```bash
# Detener el contenedor actual
make down

# O cambiar el puerto en docker-compose.yml
```

### Cambios no se reflejan
```bash
# Reconstruir la imagen
make rebuild
```

### Limpiar y empezar de cero
```bash
make clean
make build
make up
```
