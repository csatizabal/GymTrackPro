import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES_APP } from '@/constants/colores';
import type { Serie } from '@/types/gym';
import { formatearSerie, progresionEjercicio, tendencia1RM } from '@/utils/progresion';

interface ProgresionEjercicioProps {
  ejercicioId: string;
  series: Serie[];
  /** Cuántas sesiones mostrar (las más recientes). */
  maxSesiones?: number;
  color?: string;
}

/**
 * Historial del ejercicio con gráfico de barras del 1RM estimado (Epley).
 * Barras hechas con View: no requiere librerías de gráficos.
 */
export function ProgresionEjercicio({
  ejercicioId,
  series,
  maxSesiones = 6,
  color = COLORES_APP.primario,
}: ProgresionEjercicioProps) {
  const puntos = progresionEjercicio(series, ejercicioId).slice(-maxSesiones);
  const delta = tendencia1RM(puntos);
  const maximo = Math.max(1, ...puntos.map((p) => p.rm1));

  return (
    <View style={styles.tarjeta}>
      <View style={styles.filaTitulo}>
        <Ionicons name="trending-up-outline" size={20} color={color} />
        <Text style={styles.titulo}>Progresión</Text>
        {delta !== null && (
          <Text
            style={[
              styles.delta,
              { color: delta > 0 ? COLORES_APP.exito : delta < 0 ? COLORES_APP.peligro : COLORES_APP.textoSecundario },
            ]}>
            {delta > 0 ? '+' : ''}
            {delta} kg 1RM
          </Text>
        )}
      </View>

      {puntos.length === 0 ? (
        <Text style={styles.vacio}>
          Aún no hay series registradas. Registra la primera para ver tu progresión.
        </Text>
      ) : (
        <>
          <View style={styles.grafico} accessibilityLabel="Gráfico de 1RM estimado por sesión">
            {puntos.map((p) => (
              <View key={p.fecha} style={styles.columna}>
                <Text style={styles.valorBarra}>{p.rm1}</Text>
                <View style={[styles.barra, { height: Math.max(6, (p.rm1 / maximo) * 100), backgroundColor: color }]} />
                <Text style={styles.fechaBarra}>{p.fecha.slice(5)}</Text>
              </View>
            ))}
          </View>
          {[...puntos].reverse().map((p) => (
            <View key={p.fecha} style={styles.fila}>
              <Text style={styles.fecha}>{p.fecha}</Text>
              <Text style={styles.detalle}>
                {p.numSeries} series · mejor {formatearSerie(p.mejorSerie)}
              </Text>
            </View>
          ))}
          <Text style={styles.nota}>1RM estimado con la fórmula de Epley: peso × (1 + reps / 30).</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 16,
    marginBottom: 14,
  },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  titulo: { flex: 1, fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  delta: { fontSize: 14, fontWeight: 'bold' },
  vacio: { fontSize: 14, color: COLORES_APP.textoSecundario },
  grafico: { flexDirection: 'row', alignItems: 'flex-end', height: 150, gap: 8, marginBottom: 12 },
  columna: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  valorBarra: { fontSize: 14, color: COLORES_APP.texto, marginBottom: 4 },
  barra: { width: '70%', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  fechaBarra: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 4 },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: COLORES_APP.borde,
    gap: 8,
  },
  fecha: { fontSize: 14, fontWeight: '600', color: COLORES_APP.texto },
  detalle: { flex: 1, textAlign: 'right', fontSize: 14, color: COLORES_APP.textoSecundario },
  nota: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 8 },
});
