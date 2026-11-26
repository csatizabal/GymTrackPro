# GymTrackPro

App de gimnasio en **Expo SDK 57 + Expo Router + TypeScript estricto**. Digitaliza la ficha de
entrenamiento y la convierte en un tracker: plan semanal lunes–sábado, catálogo de 37 ejercicios con
imagen en 11 grupos, **registro de series (repeticiones y peso) con historial y progresión**, perfil
editable del socio con lesiones, medidas mensuales con IMC (OMS) y **recordatorios locales** de entreno.
Los datos viven en **SQLite** en el teléfono.

## Cómo correrla

```bash
cd GymTrackPro
npm install
npx expo start        # QR con Expo Go (SDK 57), "a" Android, "w" web
```

Verificación (lo mismo que corre la CI):

```bash
npx tsc --noEmit
npx expo lint
npm test                         # Jest + React Native Testing Library
npx expo export --platform web
```

> Las pruebas de base de datos usan `node:sqlite`, que requiere **Node 22.13 o superior** (recomendado Node 24 LTS).

## Qué hay en el MVP

| Funcionalidad | Dónde |
| --- | --- |
| Registrar series de hoy (reps + peso; 0 kg = peso corporal), eliminar, volumen | `components/RegistroSeries.tsx` en `/ejercicio/[id]` |
| Progresión por ejercicio: mejor serie por sesión, 1RM estimado (Epley), gráfico de barras y tendencia | `components/ProgresionEjercicio.tsx`, `utils/progresion.ts` |
| Pestaña **Historial**: sesiones por fecha, series y volumen total | `app/(tabs)/historial.tsx` |
| Al registrar una serie de un ejercicio del plan de hoy, se marca como completado | `context/GymContext.tsx` |
| Persistencia en SQLite con migraciones versionadas (`PRAGMA user_version`) | `db/esquema.ts`, `db/repositorio.ts` |
| Migración automática de los datos que la versión anterior guardaba en AsyncStorage | `db/inicializar.ts` |
| Recordatorio semanal (lunes a sábado, hora configurable) con `expo-notifications` | `services/recordatorios.ts`, `components/TarjetaRecordatorio.tsx` en Perfil |
| Pruebas: 39 casos (lógica, SQL real, componentes) | `__tests__/` |
| CI en GitHub Actions: tipos, lint, pruebas y build web; build Android opcional con EAS | `.github/workflows/ci.yml` |
| Perfiles de EAS Build: `development`, `preview` (APK interno) y `production` | `eas.json` |

### Modelo de datos (SQLite, `gymtrackpro.db`)

| Tabla | Contenido |
| --- | --- |
| `socio` | Una fila (`id = 1`) con el socio en JSON |
| `medidas` | Una fila por mes (`mes` es la clave) |
| `completados` | Checklist del plan: (`dia`, `ejercicio_id`) |
| `series` | `fecha`, `ejercicio_id`, `repeticiones` (> 0), `peso_kg` (≥ 0), `creado_en` |
| `ajustes` | Clave-valor; hoy guarda el `recordatorio` |

### Notas de plataforma

- **Notificaciones:** las locales funcionan en Expo Go. Para probarlas como en producción (y en iOS con
  todas las opciones) usa un build de desarrollo: `eas build --profile development`. En web no existen;
  la tarjeta de Perfil lo indica.
- **Web:** expo-sqlite usa WebAssembly. `metro.config.js` agrega `.wasm` y los encabezados COOP/COEP del
  servidor de desarrollo. Si publicas la carpeta `dist/`, el hosting también debe enviar
  `Cross-Origin-Opener-Policy: same-origin` y `Cross-Origin-Embedder-Policy: credentialless`.

## Builds con EAS

```bash
npm install -g eas-cli
eas login
eas init                                   # enlaza el proyecto (agrega projectId a app.json)
eas build --platform android --profile preview      # APK para instalar directo
eas build --platform ios --profile production       # requiere cuenta de Apple Developer
```

Para que la CI lance el build Android en cada push a `main`: crea el secreto `EXPO_TOKEN` y la variable
de repositorio `EAS_BUILD=true` en GitHub.

## Qué queda para la versión 2

Backend y autenticación (Supabase o Firebase) para respaldo y multidispositivo, rutinas creadas por el
usuario, gráficas de medidas, onboarding, Sentry/analítica, pruebas E2E con Maestro e i18n.

## De dónde salió cada parte

Fusión de dos entregas del parcial final de Desarrollo de Aplicaciones Móviles (2026-2):
**GymTrack2** (CarBlox23 · Carlos Stevan Córdoba, Luis Ángel Ruiz), proyecto **base**, y
**GymTrack** (Luisa-gironza · Juan Camilo Jiménez, Luisa Gironza).

| Parte | Origen | Cambios |
| --- | --- | --- |
| Estructura, rutas, layouts, imágenes de los 37 ejercicios, paleta `COLORES_APP` | GymTrack2 | `SafeAreaProvider`/`StatusBar` de GymTrack; web en modo `single`; `SQLiteProvider` en el layout raíz (MVP). |
| `data/` (plan, socio, ejercicios) | GymTrack2 | + utilidades de búsqueda y validación de GymTrack. |
| Guardas de tipo (`utils/guardas.ts`) | GymTrack | Extraídas del contexto para probarlas y reutilizarlas. |
| `context/GymContext.tsx` | GymTrack2 + GymTrack | En el MVP pasa de AsyncStorage a SQLite y suma series y recordatorio. |
| Inicio, Catálogo, detalle de día / grupo / ejercicio | GymTrack2 | `PantallaError`, `TarjetaGrupo`, animaciones y cuadrícula adaptable de GymTrack. |
| Temporizador de descanso, `BotonAnimado`, `EntradaAnimada` | GymTrack | Colores de la paleta común. |
| Medidas | GymTrack2 (resumen e historial) | `FormularioMedida` de GymTrack. |
| Perfil | GymTrack2 (encabezado, tarjeta médica, restaurar) | `FormularioPerfil` + `SelectorLesiones` de GymTrack; recordatorio (MVP). |

## Para trabajar con Claude Code

`CLAUDE.md` resume las convenciones y `.claude/skills/` trae cuatro skills del proyecto:
`expo-router-ts`, `nueva-pantalla-componente`, `base-datos-sqlite` y `verificar-app`.

> El socio "Andrés Gómez" es ficticio. No cargar datos personales ni de salud reales.
