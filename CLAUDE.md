# GymTrackPro — guía para Claude

App Expo (SDK 57) + Expo Router + TypeScript estricto: tracker de gimnasio con plan lunes–sábado,
catálogo de 37 ejercicios, registro de series con progresión, perfil, medidas con IMC y recordatorios.
Datos en SQLite (expo-sqlite). El origen de cada parte (GymTrack2 / GymTrack / MVP) está en `README.md`.

Lee también `AGENTS.md` (reglas de Expo: no confiar en APIs de memoria, consultar
https://docs.expo.dev/versions/v57.0.0/ y usar `npx expo install` para dependencias).

## Estructura

| Carpeta | Contenido |
| --- | --- |
| `app/` | Solo rutas. `(tabs)/` = Inicio, Catálogo, Historial, Medidas, Perfil. Dinámicas: `dia/[dia]`, `grupo/[grupo]`, `ejercicio/[id]`. |
| `components/` | Componentes reutilizables, exportación con nombre (`export function X`). |
| `constants/` | `colores.ts` (paleta `COLORES_APP`, `COLORES_DIAS`, nombres y orden), `grupos.ts`, `perimetros.ts`. |
| `context/GymContext.tsx` | Estado en memoria + acciones; escribe en SQLite. Hook `useGym()`. |
| `db/` | `esquema.ts` (interfaz `BaseDatos`, migraciones), `repositorio.ts` (todo el SQL), `inicializar.ts` (`onInit` + migración desde AsyncStorage). |
| `services/recordatorios.ts` | expo-notifications: avisos semanales. Lógica pura en `construirAvisos`. |
| `data/` | Datos de la ficha (socio ficticio, plan, ejercicios) y utilidades de búsqueda/validación. |
| `utils/` | Funciones puras: `imc`, `texto`, `guardas`, `progresion`. |
| `__tests__/`, `test-utils/` | Jest + React Native Testing Library; `bdMemoria.ts` = SQLite real con `node:sqlite`. |

## Reglas

- TypeScript `strict`: prohibido `any`, `@ts-ignore` y `as` para silenciar errores. Datos externos
  (`JSON.parse`, filas de SQLite, parámetros de ruta) entran como `unknown` y pasan por guardas de `utils/guardas.ts`.
- Todo el SQL vive en `db/repositorio.ts` y recibe `db: BaseDatos`; nunca SQL en pantallas ni componentes.
  Parámetros siempre con `?`, jamás concatenando valores.
- Cambiar el esquema = **agregar** una migración al final de `MIGRACIONES` (nunca editar una publicada) y una prueba.
- Lógica nueva = función pura en `utils/` o `services/` con su prueba en `__tests__/`.
- Parámetros de ruta: léelos como `string` y valídalos (`esDiaSemanaValido`, `esGrupoMuscularValido`,
  `buscarEjercicioPorId`); si fallan, `<PantallaError />`.
- Navegación tipada: `router.push({ pathname: '/ejercicio/[id]', params: { id } })`.
- Colores solo desde `COLORES_APP` / `COLORES_DIAS`. Táctiles ≥ 44 × 44, texto ≥ 14, `accessibilityLabel` en botones.
- Hooks siempre antes de cualquier `return` temprano. Pantallas en `app/` ≤ 200 líneas.
- Notificaciones: siempre por `services/recordatorios.ts`, que ya ignora la web.
- Dependencias nativas: `npx expo install <paquete>` (versiones del SDK 57).
- El socio es ficticio (Andrés Gómez). No agregues datos personales reales.

## Verificación obligatoria antes de dar algo por terminado

```bash
npx tsc --noEmit
npx expo lint
npm test
npx expo export --platform web
```

Skills del proyecto en `.claude/skills/`: `expo-router-ts`, `nueva-pantalla-componente`,
`base-datos-sqlite` y `verificar-app`.
