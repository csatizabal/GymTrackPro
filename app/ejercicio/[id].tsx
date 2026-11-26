import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { buscarEjercicioPorId } from '@/data/ejercicios';
import { planSemanal } from '@/data/plan';
import { useGym } from '@/context/GymContext';
import { AlertaLesion } from '@/components/AlertaLesion';
import { PantallaError } from '@/components/PantallaError';
import { TemporizadorDescanso } from '@/components/TemporizadorDescanso';
import { RegistroSeries } from '@/components/RegistroSeries';
import { ProgresionEjercicio } from '@/components/ProgresionEjercicio';
import { COLORES_APP, NOMBRES_DIA, NOMBRES_GRUPO } from '@/constants/colores';

export default function EjercicioDetalleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { socio, series, registrarSerie, eliminarSerie } = useGym();

  const ejercicio = useMemo(() => (typeof id === 'string' ? buscarEjercicioPorId(id) : undefined), [id]);

  const diasAsignados = useMemo(() => {
    if (typeof id !== 'string') return [];
    return planSemanal.filter(p => p.ejercicios.includes(id));
  }, [id]);

  if (!ejercicio) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Ejercicio no encontrado' }} />
        <PantallaError
          titulo="Ejercicio no encontrado"
          mensaje="No existe un ejercicio registrado con el identificador indicado."
        />
      </SafeAreaView>
    );
  }

  const tieneLesion = socio.lesiones.includes(ejercicio.grupo);
  const nombreGrupo = NOMBRES_GRUPO[ejercicio.grupo];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: ejercicio.nombre }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {ejercicio.imagen ? (
          <View style={styles.tarjetaImagenContenedor}>
            <Image source={ejercicio.imagen} style={styles.imagenEjercicio} resizeMode="cover" />
            <View style={styles.idBadgeFlotante}>
              <Text style={styles.idBadgeTexto}>ID: {ejercicio.id}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.tarjetaImagenPlaceholder}>
            <Ionicons name="barbell-outline" size={60} color={COLORES_APP.primario} />
            <Text style={styles.textoPlaceholder}>Ilustración Técnica</Text>
            <Text style={styles.idBadge}>ID: {ejercicio.id}</Text>
          </View>
        )}

        <View style={styles.tarjetaInfo}>
          <Text style={styles.nombreEjercicio}>{ejercicio.nombre}</Text>
          <View style={styles.badgeGrupo}>
            <Text style={styles.textoGrupo}>{nombreGrupo}</Text>
          </View>

          <View style={styles.filaMetricas}>
            <View style={styles.cajaMetrica}>
              <Text style={styles.valorMetrica}>{ejercicio.series}</Text>
              <Text style={styles.etiquetaMetrica}>Series</Text>
            </View>
            <View style={styles.separadorMetrica} />
            <View style={styles.cajaMetrica}>
              <Text style={styles.valorMetrica}>{ejercicio.repeticiones}</Text>
              <Text style={styles.etiquetaMetrica}>Repeticiones</Text>
            </View>
            <View style={styles.separadorMetrica} />
            <View style={styles.cajaMetrica}>
              <Text style={styles.valorMetrica}>{`${ejercicio.series} × ${ejercicio.repeticiones}`}</Text>
              <Text style={styles.etiquetaMetrica}>Esquema</Text>
            </View>
          </View>
        </View>

        {tieneLesion && <AlertaLesion grupo={ejercicio.grupo} />}

        <RegistroSeries
          ejercicioId={ejercicio.id}
          series={series}
          onRegistrar={registrarSerie}
          onEliminar={eliminarSerie}
          repeticionesObjetivo={ejercicio.repeticiones}
        />

        <TemporizadorDescanso colorAcento={diasAsignados[0]?.color} />

        <ProgresionEjercicio ejercicioId={ejercicio.id} series={series} color={diasAsignados[0]?.color} />

        <View style={styles.seccionDias}>
          <Text style={styles.tituloDias}>Días asignados en tu plan semanal</Text>
          {diasAsignados.length === 0 ? (
            <View style={styles.sinDias}>
              <Ionicons name="information-circle-outline" size={20} color={COLORES_APP.textoSecundario} />
              <Text style={styles.sinDiasTexto}>
                No está asignado en tu plan actual.
              </Text>
            </View>
          ) : (
            diasAsignados.map(plan => (
              <Pressable
                key={plan.dia}
                style={[styles.tarjetaDiaAsignado, { borderLeftColor: plan.color }]}
                onPress={() => router.push({ pathname: '/dia/[dia]', params: { dia: plan.dia } })}>
                <View style={styles.infoDiaAsignado}>
                  <Text style={styles.nombreDiaAsignado}>
                    {NOMBRES_DIA[plan.dia]}
                  </Text>
                  <Text style={[styles.enfoqueDiaAsignado, { color: plan.color }]}>
                    {plan.enfoque}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={COLORES_APP.textoSecundario} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scrollContent: { padding: 16, paddingBottom: 24 },
  tarjetaImagenContenedor: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 16,
    height: 190,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: 14,
    position: 'relative',
  },
  imagenEjercicio: {
    width: '100%',
    height: '100%',
  },
  idBadgeFlotante: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  idBadgeTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES_APP.primario,
  },
  tarjetaImagenPlaceholder: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 16, height: 160,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORES_APP.borde, marginBottom: 14,
  },
  textoPlaceholder: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 6 },
  idBadge: {
    marginTop: 4, fontSize: 12, color: COLORES_APP.primario,
    backgroundColor: COLORES_APP.superficieClara, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  tarjetaInfo: { backgroundColor: COLORES_APP.superficie, borderRadius: 14, padding: 16, marginBottom: 12 },
  nombreEjercicio: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 6 },
  badgeGrupo: { backgroundColor: COLORES_APP.superficieClara, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 12 },
  textoGrupo: { color: COLORES_APP.primario, fontWeight: '600', fontSize: 13 },
  filaMetricas: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: COLORES_APP.borde, paddingTop: 12 },
  cajaMetrica: { alignItems: 'center' },
  valorMetrica: { fontSize: 20, fontWeight: 'bold', color: COLORES_APP.texto },
  etiquetaMetrica: { fontSize: 12, color: COLORES_APP.textoSecundario, marginTop: 2 },
  separadorMetrica: { width: 1, height: 28, backgroundColor: COLORES_APP.borde },
  seccionDias: { marginTop: 4 },
  tituloDias: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 8 },
  sinDias: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORES_APP.superficie, padding: 12, borderRadius: 10 },
  sinDiasTexto: { fontSize: 14, color: COLORES_APP.textoSecundario, flex: 1 },
  tarjetaDiaAsignado: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 10, padding: 12, marginBottom: 8,
    borderLeftWidth: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48,
  },
  infoDiaAsignado: { flex: 1 },
  nombreDiaAsignado: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.texto },
  enfoqueDiaAsignado: { fontSize: 13, fontWeight: '500', marginTop: 2 },
});
