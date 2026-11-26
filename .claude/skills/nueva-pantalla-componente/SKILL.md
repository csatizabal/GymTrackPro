---
name: nueva-pantalla-componente
description: Paso a paso para crear una pantalla (ruta) o un componente nuevo en GymTrackPro siguiendo sus convenciones. Úsala cuando pidan agregar una vista, tab, ruta dinámica o componente.
---

# Crear pantalla o componente

## Componente (`components/NombreEnPascalCase.tsx`)
1. Exportación con nombre: `export function TarjetaX(props: TarjetaXProps)`.
2. Define `interface TarjetaXProps`; callbacks como `onAlgo: () => void` (o `Promise<void>` si guardan).
3. Recibe datos por props en lugar de leer `useGym()`: así se prueba con RNTL sin contexto ni base
   (ejemplo: `RegistroSeries` recibe `series`, `onRegistrar`, `onEliminar`).
4. Botones: `BotonAnimado` (escala + haptics, ignora haptics en web) o `Pressable` con
   `accessibilityRole` y `accessibilityLabel`; mínimo 44 × 44. Las pruebas buscan por `getByLabelText`.
5. Animación de entrada en listas: `<EntradaAnimada indice={i}>`.
6. Colores de `COLORES_APP`; textos ≥ 14. Gráficos simples con `View` (ver `ProgresionEjercicio`), sin librerías.

## Pantalla en tabs (`app/(tabs)/nombre.tsx`)
1. `export default function NombreScreen()`.
2. Raíz: `<SafeAreaView style={{ flex: 1, backgroundColor: COLORES_APP.fondo }} edges={['bottom', 'left', 'right']}>`
   y un `ScrollView` (`keyboardShouldPersistTaps="handled"` si hay formularios).
3. Registra la tab en `app/(tabs)/_layout.tsx` con `<Tabs.Screen name="nombre" options={{ title, tabBarIcon }} />`.

## Ruta dinámica (`app/carpeta/[param].tsx`)
1. Registra el título por defecto en `app/_layout.tsx` con `<Stack.Screen name="carpeta/[param]" />`.
2. Lee el parámetro como `string`, valídalo con `esXValido(valor): valor is X` en `data/` y muestra `<PantallaError />` si falla.
3. Todos los hooks antes del `return` de error.

## Formularios
- Estado controlado con `useState<string>` por campo; convierte al guardar (coma decimal: `replace(',', '.')`).
- La validación va en una función pura en `utils/` (ej. `validarSerie`) que devuelve `{ valores?, errores }`.
- Errores visibles con `CampoFormulario error=...`.

## Pruebas
- Función pura nueva → caso en `__tests__/<tema>.test.ts`.
- Componente con formulario → prueba en `__tests__/componentes.test.tsx` (render, `fireEvent`, `getByLabelText`).

## Al terminar
Ejecuta la skill `verificar-app`.
