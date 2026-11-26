import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { EntradaAnimada } from '@/components/EntradaAnimada';
import { COLORES_APP, NOMBRES_GRUPO } from '@/constants/colores';
import { useGym } from '@/context/GymContext';
import { buscarEjercicioPorId } from '@/data/ejercicios';
import { formatearSerie, resumirSesiones, volumenTotal } from '@/utils/progresion';

/** Historial de sesiones registradas (una por fecha) con volumen y series. */
export default function HistorialScreen() {
  const { series } = useGym();
  const sesiones = useMemo(() => resumirSesiones(series), [series]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.resumen}>
          <Dato valor={sesiones.length} etiqueta="Sesiones" />
          <Dato valor={series.length} etiqueta="Series" />
          <Dato valor={Math.round(volumenTotal(series)).toLocaleString('es-CO')} etiqueta="Volumen (kg)" />
        </View>

        {sesiones.length === 0 && (
          <View style={styles.vacio}>
            <Ionicons name="barbell-outline" size={40} color={COLORES_APP.textoSecundario} />
            <Text style={styles.textoVacio}>
              Todavía no hay sesiones. Abre un ejercicio desde el plan del día y registra tus series.
            </Text>
          </View>
        )}

        {sesiones.map((sesion, i) => (
          <EntradaAnimada key={sesion.fecha} indice={i}>
            <View style={styles.tarjeta}>
              <View style={styles.encabezado}>
                <Text style={styles.fecha}>{sesion.fecha}</Text>
                <Text style={styles.volumen}>{Math.round(sesion.volumen).toLocaleString('es-CO')} kg</Text>
              </View>
              {sesion.ejercicios.map((id) => {
                const ejercicio = buscarEjercicioPorId(id);
                const suyas = sesion.series.filter((s) => s.ejercicioId === id);
                return (
                  <View key={id} style={styles.filaEjercicio}>
                    <Text style={styles.nombre}>
                      {ejercicio?.nombre ?? id}
                      {ejercicio ? <Text style={styles.grupo}> · {NOMBRES_GRUPO[ejercicio.grupo]}</Text> : null}
                    </Text>
                    <Text style={styles.series}>{suyas.map(formatearSerie).join('  ·  ')}</Text>
                  </View>
                );
              })}
            </View>
          </EntradaAnimada>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function Dato({ valor, etiqueta }: { valor: number | string; etiqueta: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.valorDato}>{valor}</Text>
      <Text style={styles.etiquetaDato}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  resumen: {
    flexDirection: 'row',
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    paddingVertical: 14,
    marginBottom: 16,
  },
  dato: { flex: 1, alignItems: 'center' },
  valorDato: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.primario },
  etiquetaDato: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 2 },
  vacio: { alignItems: 'center', padding: 24, gap: 10 },
  textoVacio: { fontSize: 15, color: COLORES_APP.textoSecundario, textAlign: 'center' },
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 14,
    marginBottom: 12,
  },
  encabezado: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  fecha: { fontSize: 17, fontWeight: 'bold', color: COLORES_APP.texto },
  volumen: { fontSize: 15, fontWeight: '600', color: COLORES_APP.primario },
  filaEjercicio: { paddingVertical: 6, borderTopWidth: 1, borderTopColor: COLORES_APP.borde },
  nombre: { fontSize: 15, fontWeight: '600', color: COLORES_APP.texto },
  grupo: { fontSize: 14, fontWeight: 'normal', color: COLORES_APP.textoSecundario },
  series: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 2 },
});
