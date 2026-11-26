import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { obtenerDiaActual, planSemanal } from '@/data/plan';
import { useGym } from '@/context/GymContext';
import { TarjetaDia } from '@/components/TarjetaDia';
import { EntradaAnimada } from '@/components/EntradaAnimada';
import { COLORES_APP } from '@/constants/colores';

// Base: GymTrack2. De GymTrack: entrada animada escalonada y cuadrícula de
// 2 columnas cuando el ancho supera 600 pt (tabletas / web).
export default function InicioScreen() {
  const { completados, socio } = useGym();
  const { width } = useWindowDimensions();
  const diaActual = obtenerDiaActual();
  const esAncho = width > 600;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecera}>
          <Text style={styles.marca}>GYMTRACK PRO</Text>
          <Text style={styles.saludo}>¡Hola, {socio.nombre}!</Text>
          <Text style={styles.subtitulo}>Objetivo: {socio.objetivo}</Text>
        </View>

        {diaActual === null && (
          <EntradaAnimada indice={0}>
            <View style={styles.tarjetaDescanso}>
              <Ionicons name="sunny-outline" size={32} color={COLORES_APP.advertencia} style={styles.iconoDescanso} />
              <View style={styles.infoDescanso}>
                <Text style={styles.tituloDescanso}>¡Hoy es domingo!</Text>
                <Text style={styles.textoDescanso}>
                  Día de recuperación y descanso muscular. Prepárate para iniciar la semana con toda la energía.
                </Text>
              </View>
            </View>
          </EntradaAnimada>
        )}

        <View style={styles.seccionTitulo}>
          <Text style={styles.tituloPlan}>Plan Semanal</Text>
          <Text style={styles.subtituloPlan}>
            Selecciona un día para ver tus ejercicios y registrar tu progreso
          </Text>
        </View>

        <View style={esAncho ? styles.cuadricula : undefined}>
          {planSemanal.map((plan, indice) => (
            <EntradaAnimada key={plan.dia} indice={indice} style={esAncho ? styles.celdaAncha : undefined}>
              <TarjetaDia
                plan={plan}
                esHoy={plan.dia === diaActual}
                completadosCount={completados[plan.dia]?.length ?? 0}
              />
            </EntradaAnimada>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scrollContent: { padding: 16, paddingBottom: 24 },
  cabecera: { marginBottom: 16 },
  marca: { color: COLORES_APP.primario, fontSize: 14, fontWeight: '800', letterSpacing: 1.4, marginBottom: 4 },
  saludo: { fontSize: 24, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 4 },
  subtitulo: { fontSize: 15, color: COLORES_APP.textoSecundario },
  tarjetaDescanso: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    borderColor: COLORES_APP.advertencia,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoDescanso: { marginRight: 14 },
  infoDescanso: { flex: 1 },
  tituloDescanso: { fontSize: 17, fontWeight: 'bold', color: COLORES_APP.advertencia, marginBottom: 4 },
  textoDescanso: { fontSize: 14, color: COLORES_APP.textoSecundario, lineHeight: 20 },
  seccionTitulo: { marginBottom: 14 },
  tituloPlan: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 2 },
  subtituloPlan: { fontSize: 14, color: COLORES_APP.textoSecundario },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -7 },
  celdaAncha: { width: '50%', paddingHorizontal: 7 },
});
