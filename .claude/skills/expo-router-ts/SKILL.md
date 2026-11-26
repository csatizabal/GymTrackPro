---
name: expo-router-ts
description: Convenciones de Expo Router y TypeScript estricto en GymTrackPro. Úsala antes de escribir o revisar cualquier archivo .ts/.tsx del proyecto.
---

# Convenciones Expo Router + TypeScript estricto

## Rutas (carpeta `app/`)
- Cada archivo en `app/` es una ruta; `_layout.tsx` define el navegador. Nada que no sea
  pantalla vive en `app/` (componentes en `components/`, lógica en `utils/`, `services/` o `db/`).
- Layout raíz: `SafeAreaProvider` > `SQLiteProvider` (onInit = `inicializarBaseDatos`) > `GymProvider` > `Stack`.
  Las tabs están en `app/(tabs)/`.
- Rutas dinámicas: `app/dia/[dia].tsx`, `app/grupo/[grupo].tsx`, `app/ejercicio/[id].tsx`.
- Título dinámico con `<Stack.Screen options={{ title }} />` dentro de la pantalla.
- Navega con objetos tipados (typedRoutes está activo en `app.json`):
  `router.push({ pathname: '/grupo/[grupo]', params: { grupo } })`.

## Parámetros de ruta
```tsx
const { dia } = useLocalSearchParams<{ dia: string }>();
const diaValido = typeof dia === 'string' && esDiaSemanaValido(dia) ? dia : null;
// ...todos los hooks aquí...
if (!diaValido) return <PantallaError titulo="Día inválido" mensaje="..." />;
```
Nunca tipar el parámetro directamente como `DiaSemana`: llega como texto libre de la URL.

## TypeScript
- `strict: true` (TypeScript 6). Prohibido `any`, `@ts-ignore`, `@ts-expect-error` y casts para callar errores.
- `JSON.parse` y filas de SQLite se tratan como `unknown` y se validan con `utils/guardas.ts`.
- Props como `interface XProps`; uniones de literales para valores cerrados (`DiaSemana`, `GrupoMuscular`).
- `Record<Clave, T>` para mapas completos (`NOMBRES_GRUPO`, `COLORES_DIAS`).
- No uses `as const` en `COLORES_APP`: rompe la reasignación de variables tipadas con sus valores.
- TS 6 deja `types` vacío por defecto: `tsconfig.json` declara `"types": ["jest"]`. Los tipos de Node
  solo se cargan donde hacen falta (`/// <reference types="node" />` en `test-utils/`).

## Estado y datos
- Estado global solo por `useGym()`. Las acciones actualizan la memoria y llaman a `db/repositorio.ts`.
- Nada de AsyncStorage para datos nuevos: SQLite (ver skill `base-datos-sqlite`).

## Estilo
- `StyleSheet.create` al final del archivo; colores de `@/constants/colores`. Imports con alias `@/`.
