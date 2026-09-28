# MEDLA Empresarial

Sitio corporativo multipágina, servido como HTML estático con interfaces React precompiladas y una función de Vercel para el formulario de contacto.

## Puesta en marcha

Requiere Node.js 20 o posterior.

```bash
pnpm install
pnpm run build
pnpm run dev
```

La web queda disponible en [http://127.0.0.1:4174](http://127.0.0.1:4174). `pnpm run check` regenera los bundles, comprueba la sintaxis, valida los recursos y rutas publicados, y prueba el proxy de contacto sin hacer llamadas externas.

El servidor local incluye la ruta `/api/contact`. Sin `HIGHLEVEL_WEBHOOK_URL` responde de forma segura con estado 503; al configurar esa variable, permite probar el mismo flujo que ejecutará Vercel. No uses una URL real en archivos versionados.

## Fuentes y archivos generados

No edites directamente los bundles generados; cambia su fuente y ejecuta `pnpm run build`.

| Fuente | Salida publicada |
| --- | --- |
| `app.jsx`, `components/medla-aperture.jsx` | `app.js` |
| `contacto.jsx` | `contacto.js` |
| `servicios-entry.jsx`, `services.jsx` y componentes importados | `servicios.js` |
| `nosotros.jsx` | `nosotros.js` |
| `blog.jsx` | `blog.js` |
| `specialty.jsx` | `specialty.js` |
| `home-executive.css` | `home-executive.min.css` |
| `specialty.css` | `specialty.min.css` |
| `privacy-entry.css`, `privacy-styles.css` y `privacy-fixes.css` | `privacy.min.css` |

Los estilos `styles.css`, `services-styles.css`, `contacto-styles.css`, `nosotros-styles.css` y `blog-styles.css` se publican directamente y no necesitan compilación.

## Formulario y despliegue

Antes de desplegar, rota cualquier webhook que se hubiera versionado en revisiones anteriores y crea en Vercel la variable de entorno `HIGHLEVEL_WEBHOOK_URL` con la nueva URL privada. Usa `.env.example` como referencia y no subas valores reales al repositorio.

Vercel sirve las páginas estáticas, aplica las redirecciones y cabeceras de `vercel.json`, y ejecuta `api/contact.js` como función del servidor. Las rutas principales son Inicio, Qué resolvemos, Cómo trabajamos, Notas de decisión, Contacto, las ocho especialidades y Privacidad.
