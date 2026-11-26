import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BotonAnimado } from '@/components/BotonAnimado';
import { COLORES_APP, NOMBRES_DIA } from '@/constants/colores';
import { ESPACIO, RADIO, SOMBRA, TIPO } from '@/constants/tema';
import type { DiaPlan } from '@/types/gym';

interface TarjetaHoyProps {
  /** Plan del día actual; `undefined` el domingo (descanso). */
  plan?: DiaPlan;
  completados: number;
  seriesHoy: number;
}

/** Tarjeta destacada de Inicio: entrenamiento de hoy, progreso y botón para empezar. */
export function TarjetaHoy({ plan, completados, seriesHoy }: TarjetaHoyProps) {
  const router = useRouter();

  if (!plan) {
    return (
      <View style={[styles.tarjeta, styles.descanso]}>
        <Ionicons name="moon-outline" size={28} color={COLORES_APP.acento} />
        <Text style={styles.etiqueta}>HOY · DOMINGO</Text>
        <Text style={styles.titulo}>Día de descanso</Text>
        <Text style={styles.texto}>Recupera, hidrátate y prepárate para el lunes.</Text>
      </View>
    );
  }

  const total = plan.ejercicios.length;
  const pct = total > 0 ? Math.round((completados / total) * 100) : 0;
  const terminado = completados >= total && total > 0;

  return (
    <View style={[styles.tarjeta, { borderColor: plan.color }]}>
      <View style={styles.filaSuperior}>
        <Text style={[styles.etiqueta, { color: plan.color }]}>HOY · {NOMBRES_DIA[plan.dia].toUpperCase()}</Text>
        <Text style={styles.pct}>{pct}%</Text>
      </View>
      <Text style={styles.titulo}>{plan.enfoque}</Text>

      <View style={styles.metricas}>
        <Metrica valor={`${completados}/${total}`} etiqueta="Ejercicios" />
        <Metrica valor={String(seriesHoy)} etiqueta="Series" />
        <Metrica valor={plan.cardioMin ? `${plan.cardioMin}′` : '—'} etiqueta="Cardio" />
      </View>

      <View style={styles.pista}>
        <View style={[styles.relleno, { width: `${pct}%`, backgroundColor: plan.color }]} />
      </View>

      <BotonAnimado
        onPress={() => router.push({ pathname: '/dia/[dia]', params: { dia: plan.dia } })}
        haptic="medium"
        style={[styles.boton, { backgroundColor: plan.color }]}
        accessibilityLabel={terminado ? 'Ver entrenamiento de hoy' : 'Empezar entrenamiento de hoy'}>
        <Ionicons name={terminado ? 'checkmark-done' : 'play'} size={18} color={COLORES_APP.fondo} />
        <Text style={styles.textoBoton}>{terminado ? '¡Completado! Ver sesión' : completados > 0 ? 'Continuar entrenamiento' : 'Empezar entrenamiento'}</Text>
      </BotonAnimado>
    </View>
  );
}

function Metrica({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <View style={styles.metrica}>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.texto}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: RADIO.lg + 4,
    borderWidth: 1.5,
    borderColor: COLORES_APP.borde,
    padding: ESPACIO.xl - 4,
    marginBottom: ESPACIO.xl,
    gap: ESPACIO.sm,
    ...SOMBRA,
  },
  descanso: { borderColor: COLORES_APP.acento, alignItems: 'flex-start' },
  filaSuperior: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  etiqueta: { ...TIPO.marca, color: COLORES_APP.textoSecundario },
  pct: { ...TIPO.subtitulo, color: COLORES_APP.texto },
  titulo: { ...TIPO.display, color: COLORES_APP.texto },
  texto: { fontSize: 14, color: COLORES_APP.textoSecundario },
  metricas: { flexDirection: 'row', gap: ESPACIO.sm, marginTop: ESPACIO.xs },
  metrica: {
    flex: 1,
    backgroundColor: COLORES_APP.superficieClara,
    borderRadius: RADIO.md,
    paddingVertical: ESPACIO.md,
    alignItems: 'center',
  },
  valor: { ...TIPO.titulo, color: COLORES_APP.texto },
  pista: { height: 8, borderRadius: RADIO.pill, backgroundColor: COLORES_APP.superficieClara, overflow: 'hidden', marginTop: ESPACIO.xs },
  relleno: { height: '100%', borderRadius: RADIO.pill },
  boton: {
    marginTop: ESPACIO.sm,
    minHeight: 52,
    borderRadius: RADIO.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIO.sm,
  },
  textoBoton: { color: COLORES_APP.fondo, fontSize: 16, fontWeight: '800' },
});
