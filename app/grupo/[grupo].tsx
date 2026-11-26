import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ejercicios, esGrupoMuscularValido } from '@/data/ejercicios';
import { useGym } from '@/context/GymContext';
import { AlertaLesion } from '@/components/AlertaLesion';
import { PantallaError } from '@/components/PantallaError';
import { COLORES_APP, NOMBRES_GRUPO } from '@/constants/colores';

export default function GrupoMuscularScreen() {
  const router = useRouter();
  const { grupo: grupoParam } = useLocalSearchParams<{ grupo: string }>();
  const { socio } = useGym();

  const grupo = typeof grupoParam === 'string' && esGrupoMuscularValido(grupoParam) ? grupoParam : null;
  const items = useMemo(() => (grupo ? ejercicios.filter(e => e.grupo === grupo) : []), [grupo]);

  if (!grupo) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Grupo no encontrado' }} />
        <PantallaError
          titulo="Grupo no encontrado"
          mensaje="El grupo muscular seleccionado no existe en el catálogo."
        />
      </SafeAreaView>
    );
  }

  const nombreGrupo = NOMBRES_GRUPO[grupo];
  const tieneLesion = socio.lesiones.includes(grupo);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: `Grupo: ${nombreGrupo}` }} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.cabecera}>
          <Text style={styles.titulo}>{nombreGrupo}</Text>
          <Text style={styles.subtitulo}>{items.length} ejercicios disponibles</Text>
        </View>

        {tieneLesion && <AlertaLesion grupo={grupo} />}

        <View style={styles.lista}>
          {items.map(item => (
            <Pressable
              key={item.id}
              style={styles.tarjetaEjercicio}
              onPress={() =>
                router.push({
                  pathname: '/ejercicio/[id]',
                  params: { id: item.id },
                })
              }
              accessibilityRole="button"
              accessibilityLabel={`Ver detalle de ${item.nombre}`}>
              {item.imagen && (
                <Image source={item.imagen} style={styles.miniatura} resizeMode="cover" />
              )}
              <View style={styles.infoEjercicio}>
                <Text style={styles.nombreEjercicio}>{item.nombre}</Text>
                <Text style={styles.metaEjercicio}>
                  Esquema: {item.series} series × {item.repeticiones} reps
                </Text>
              </View>
              <View style={styles.botonAccion}>
                <Ionicons name="chevron-forward" size={20} color={COLORES_APP.textoSecundario} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scrollContent: { padding: 16, paddingBottom: 24 },
  cabecera: { marginBottom: 12 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 2 },
  subtitulo: { fontSize: 14, color: COLORES_APP.textoSecundario },
  lista: { gap: 10, marginTop: 4 },
  tarjetaEjercicio: {
    backgroundColor: COLORES_APP.superficie, borderRadius: 20, padding: 14,
    borderWidth: 1, borderColor: COLORES_APP.borde, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', minHeight: 54,
  },
  miniatura: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: COLORES_APP.superficieClara,
  },
  infoEjercicio: { flex: 1 },
  nombreEjercicio: { fontSize: 16, fontWeight: '600', color: COLORES_APP.texto, marginBottom: 2 },
  metaEjercicio: { fontSize: 13, color: COLORES_APP.textoSecundario },
  botonAccion: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
