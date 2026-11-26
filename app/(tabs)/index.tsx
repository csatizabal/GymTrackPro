import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { obtenerDiaActual, planSemanal } from '@/data/plan';
import { useGym } from '@/context/GymContext';
import { TarjetaDia } from '@/components/TarjetaDia';
import { TarjetaHoy } from '@/components/TarjetaHoy';
import { EntradaAnimada } from '@/components/EntradaAnimada';
import { COLORES_APP } from '@/constants/colores';
import { ESPACIO, TIPO } from '@/constants/tema';
import { fechaLocalISO } from '@/utils/progresion';

function saludo(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

// Inicio: saludo, tarjeta destacada del día y plan semanal (2 columnas > 600 pt).
export default function InicioScreen() {
  const { completados, socio, series } = useGym();
  const { width } = useWindowDimensions();
  const diaActual = obtenerDiaActual();
  const planHoy = planSemanal.find((p) => p.dia === diaActual);
  const hoy = fechaLocalISO();
  const seriesHoy = series.filter((s) => s.fecha === hoy).length;
  const esAncho = width > 600;
  const primerNombre = socio.nombre.split(' ')[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecera}>
          <Text style={styles.marca}>GYMTRACK PRO</Text>
          <Text style={styles.saludo}>
            {saludo()}, {primerNombre}
          </Text>
          <Text style={styles.subtitulo}>Objetivo: {socio.objetivo}</Text>
        </View>

        <EntradaAnimada indice={0}>
          <TarjetaHoy
            plan={planHoy}
            completados={diaActual ? completados[diaActual].length : 0}
            seriesHoy={seriesHoy}
          />
        </EntradaAnimada>

        <Text style={styles.tituloPlan}>Plan semanal</Text>

        <View style={esAncho ? styles.cuadricula : undefined}>
          {planSemanal.map((plan, indice) => (
            <EntradaAnimada key={plan.dia} indice={indice + 1} style={esAncho ? styles.celdaAncha : undefined}>
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
  scrollContent: { padding: ESPACIO.lg + 4, paddingBottom: ESPACIO.xxl },
  cabecera: { marginBottom: ESPACIO.xl, gap: ESPACIO.xs },
  marca: { ...TIPO.marca, color: COLORES_APP.primario },
  saludo: { ...TIPO.display, color: COLORES_APP.texto },
  subtitulo: { fontSize: 15, color: COLORES_APP.textoSecundario },
  tituloPlan: { ...TIPO.titulo, color: COLORES_APP.texto, marginBottom: ESPACIO.md },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  celdaAncha: { width: '50%', paddingHorizontal: 6 },
});
