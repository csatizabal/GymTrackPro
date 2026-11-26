import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import { COLORES_APP } from '@/constants/colores';

/** Escala de espaciado (múltiplos de 4). Úsala en padding, margin y gap. */
export const ESPACIO = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Radios de borde: tarjetas grandes y suaves, botones tipo píldora. */
export const RADIO = { sm: 10, md: 14, lg: 20, pill: 999 } as const;

/** Escala tipográfica (fuente del sistema; ningún texto por debajo de 14 salvo leyendas de gráficos). */
export const TIPO = {
  display: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  titulo: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  subtitulo: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  cuerpo: { fontSize: 15, fontWeight: '400' },
  etiqueta: { fontSize: 14, fontWeight: '600' },
  marca: { fontSize: 13, fontWeight: '800', letterSpacing: 1.6 },
} satisfies Record<string, TextStyle>;

/** Sombra suave para tarjetas destacadas (iOS/Android/web). */
export const SOMBRA: ViewStyle = Platform.select<ViewStyle>({
  ios: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  android: { elevation: 6 },
  default: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.35)' },
});

/** Base de tarjeta reutilizable. */
export const TARJETA: ViewStyle = {
  backgroundColor: COLORES_APP.superficie,
  borderRadius: RADIO.lg,
  borderWidth: 1,
  borderColor: COLORES_APP.borde,
  padding: ESPACIO.lg,
};
