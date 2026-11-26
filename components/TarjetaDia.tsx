import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { DiaPlan } from '@/types/gym';
import { COLORES_APP } from '@/constants/colores';

export interface TarjetaDiaProps {
  plan: DiaPlan;
  esHoy: boolean;
  completadosCount?: number;
}

export function TarjetaDia({ plan, esHoy, completadosCount = 0 }: TarjetaDiaProps) {
  const router = useRouter();
  const nombreDia = plan.dia.charAt(0).toUpperCase() + plan.dia.slice(1);
  const total = plan.ejercicios.length;
  const progresoPct = total > 0 ? Math.round((completadosCount / total) * 100) : 0;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tarjeta,
        {
          borderColor: plan.color,
          borderWidth: esHoy ? 3 : 1.5,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Día ${nombreDia}, enfoque ${plan.enfoque}`}
      onPress={() => router.push(`/dia/${plan.dia}`)}>
      <View style={styles.encabezado}>
        <View style={styles.filaTitulo}>
          <Text style={styles.nombreDia}>{nombreDia}</Text>
          {esHoy && (
            <View style={[styles.badgeHoy, { backgroundColor: plan.color }]}>
              <Text style={styles.badgeTexto}>HOY</Text>
            </View>
          )}
        </View>
        <Text style={[styles.enfoque, { color: plan.color }]}>{plan.enfoque}</Text>
      </View>

      <View style={styles.pie}>
        <Text style={styles.infoEjercicios}>
          {total} ejercicios • 4 × 12
        </Text>
        {plan.cardioMin && (
          <View style={styles.badgeCardio}>
            <Text style={styles.cardioTexto}>Cardio: {plan.cardioMin} min</Text>
          </View>
        )}
      </View>

      {total > 0 && (
        <View style={styles.barraContenedor}>
          <View
            style={[
              styles.barraRelleno,
              { width: `${progresoPct}%`, backgroundColor: plan.color },
            ]}
          />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  encabezado: {
    marginBottom: 10,
  },
  filaTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nombreDia: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
  },
  badgeHoy: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeTexto: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  enfoque: {
    fontSize: 16,
    fontWeight: '600',
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  infoEjercicios: {
    fontSize: 14,
    color: COLORES_APP.textoSecundario,
  },
  badgeCardio: {
    backgroundColor: COLORES_APP.superficieClara,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cardioTexto: {
    fontSize: 13,
    color: COLORES_APP.texto,
    fontWeight: '500',
  },
  barraContenedor: {
    height: 5,
    backgroundColor: COLORES_APP.superficieClara,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
  },
  barraRelleno: {
    height: '100%',
  },
});
