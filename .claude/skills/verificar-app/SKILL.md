---
name: verificar-app
description: Verificación obligatoria de GymTrackPro (tipos, lint, pruebas y build web) antes de dar por terminado un cambio. Úsala al cerrar cualquier tarea de código.
---

# Verificar GymTrackPro

En la raíz del proyecto, en este orden (es lo mismo que corre `.github/workflows/ci.yml`).
No declares la tarea terminada si alguno falla:

```bash
npm install                      # solo si cambió package.json o no existe node_modules
npx tsc --noEmit                 # 0 errores de tipos
npx expo lint                    # 0 errores ni advertencias
npm test                         # todas las pruebas en verde (Node ≥ 22.13)
npx expo export --platform web   # el bundle compila; genera dist/ (ignorado por git)
```

Si fallan pocas pruebas, corre solo esas mientras corriges: `npx jest __tests__/progresion.test.ts -t "Epley"`.

## Si falla
- **tsc**: corrige el tipo; nunca `any` ni `@ts-ignore`. Si dice que no encuentra `describe`/`expect`,
  revisa `"types": ["jest"]` en `tsconfig.json`.
- **lint**: reglas de hooks: hooks antes de returns; no leer refs en render
  (usa `useState(() => new Animated.Value(x))` como en `EntradaAnimada`).
- **jest / repositorio**: `node:sqlite` no existe → actualiza Node a 22.13+ (recomendado 24 LTS).
- **export web**: `require` de imagen con ruta mal escrita en `data/ejercicios.ts` (nombres con tildes y
  espacios) o falta `wasm` en `metro.config.js`.

## Prueba manual mínima (`npx expo start`, Expo Go SDK 57 o `w` para web)
1. Inicio: 6 días con color, "HOY" en el día actual, aviso de descanso el domingo.
2. `/ejercicio/pec-01`: registrar 2 series → aparecen con volumen; recargar la app → siguen ahí;
   la sección Progresión muestra la sesión. Si es día de pecho, el ejercicio queda marcado en el plan.
3. Pestaña Historial: la sesión de hoy con sus series y volumen.
4. `/dia/domingo` y `/grupo/xyz`: pantalla de error con "Volver al Inicio".
5. Catálogo: buscar "extension" (sin tilde) encuentra "Extensión…"; Pierna y Lumbar con advertencia.
6. Medidas: guardar vacío muestra errores; mes repetido se rechaza.
7. Perfil: activar el recordatorio pide permiso y programa avisos (en teléfono); "Restaurar" vuelve a la ficha inicial.
