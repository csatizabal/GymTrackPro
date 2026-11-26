import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { DiaPlan } from '@/types/gym';
import { COLORES_APP, NOMBRES_DIA } from '@/constants/colores';
import { ESPACIO, RADIO, TIPO } from '@/constants/tema';

export interface TarjetaDiaProps {
  plan: DiaPlan;
  esHoy: boolean;
  completadosCount?: number;
}

/** Tarjeta de un día del plan: franja de color del día, progreso y acceso al detalle. */
export function TarjetaDia({ plan, esHoy, completadosCount = 0 }: TarjetaDiaProps) {
  const router = useRouter();
  const nombreDia = NOMBRES_DIA[plan.dia];
  const total = plan.ejercicios.length;
  const progresoPct = total > 0 ? Math.round((completadosCount / total) * 100) : 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tarjeta,
        esHoy && { borderColor: plan.color },
        { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Día ${nombreDia}, enfoque ${plan.enfoque}`}
      onPress={() => router.push({ pathname: '/dia/[dia]', params: { dia: plan.dia } })}>
      <View style={[styles.franja, { backgroundColor: plan.color }]} />
      <View style={styles.cuerpo}>
        <View style={styles.filaTitulo}>
          <Text style={styles.nombreDia}>{nombreDia}</Text>
          {esHoy && (
            <View style={[styles.badgeHoy, { backgroundColor: plan.color }]}>
              <Text style={styles.badgeTexto}>HOY</Text>
            </View>
          )}
          <View style={styles.espaciador} />
          <Ionicons name="chevron-forward" size={18} color={COLORES_APP.textoSecundario} />
        </View>
        <Text style={[styles.enfoque, { color: plan.color }]}>{plan.enfoque}</Text>

        <View style={styles.filaMeta}>
          <View style={styles.chip}>
            <Ionicons name="barbell-outline" size={14} color={COLORES_APP.textoSecundario} />
            <Text style={styles.chipTexto}>{total} ejercicios</Text>
          </View>
          {plan.cardioMin !== undefined && (
            <View style={styles.chip}>
              <Ionicons name="heart-outline" size={14} color={COLORES_APP.textoSecundario} />
              <Text style={styles.chipTexto}>{plan.cardioMin} min cardio</Text>
            </View>
          )}
          <Text style={styles.porcentaje}>{progresoPct}%</Text>
        </View>

        <View style={styles.barraContenedor}>
          <View style={[styles.barraRelleno, { width: `${progresoPct}%`, backgroundColor: plan.color }]} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    backgroundColor: COLORES_APP.superficie,
    borderRadius: RADIO.lg,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: ESPACIO.md,
    overflow: 'hidden',
  },
  franja: { width: 5 },
  cuerpo: { flex: 1, padding: ESPACIO.lg, gap: ESPACIO.xs },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: ESPACIO.sm },
  espaciador: { flex: 1 },
  nombreDia: { ...TIPO.subtitulo, color: COLORES_APP.texto },
  badgeHoy: { paddingHorizontal: ESPACIO.sm, paddingVertical: 2, borderRadius: RADIO.pill },
  badgeTexto: { color: COLORES_APP.fondo, fontWeight: '800', fontSize: 12, letterSpacing: 0.8 },
  enfoque: { fontSize: 15, fontWeight: '600' },
  filaMeta: { flexDirection: 'row', alignItems: 'center', gap: ESPACIO.sm, marginTop: ESPACIO.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORES_APP.superficieClara,
    paddingHorizontal: ESPACIO.sm,
    paddingVertical: 4,
    borderRadius: RADIO.pill,
  },
  chipTexto: { fontSize: 14, color: COLORES_APP.textoSecundario },
  porcentaje: { marginLeft: 'auto', fontSize: 14, fontWeight: '700', color: COLORES_APP.texto },
  barraContenedor: {
    height: 6,
    backgroundColor: COLORES_APP.superficieClara,
    borderRadius: RADIO.pill,
    overflow: 'hidden',
    marginTop: ESPACIO.sm,
  },
  barraRelleno: { height: '100%', borderRadius: RADIO.pill },
});
