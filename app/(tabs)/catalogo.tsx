import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ejercicios } from '@/data/ejercicios';
import { normalizar } from '@/utils/texto';
import { GRUPOS_MUSCULARES } from '@/constants/grupos';
import { COLORES_APP } from '@/constants/colores';
import { useGym } from '@/context/GymContext';
import { TarjetaGrupo } from '@/components/TarjetaGrupo';

export default function CatalogoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [busqueda, setBusqueda] = useState('');

  const { socio } = useGym();
  // Cuadrícula adaptable (origen: GymTrack): 3 columnas en pantallas > 600 pt.
  const anchoColumna: `${number}%` = width > 600 ? '33.33%' : '50%';

  const ejerciciosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return [];
    const term = normalizar(busqueda);
    return ejercicios.filter(e => normalizar(e.nombre).includes(term));
  }, [busqueda]);

  const conteoPorGrupo = useMemo(() => {
    const conteo: Record<string, number> = {};
    ejercicios.forEach(e => {
      conteo[e.grupo] = (conteo[e.grupo] || 0) + 1;
    });
    return conteo;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.contenedor}>
        <View style={styles.barraBusqueda}>
          <Ionicons name="search" size={20} color={COLORES_APP.textoSecundario} style={styles.iconoBusqueda} />
          <TextInput
            style={styles.inputBusqueda}
            placeholder="Buscar ejercicio (ej. extensión)..."
            placeholderTextColor={COLORES_APP.textoSecundario}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {busqueda.length > 0 && (
            <Pressable
              style={styles.botonLimpiar}
              onPress={() => setBusqueda('')}
              accessibilityRole="button"
              accessibilityLabel="Limpiar búsqueda">
              <Ionicons name="close-circle" size={20} color={COLORES_APP.textoSecundario} />
            </Pressable>
          )}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {busqueda.trim().length > 0 ? (
            <View>
              <Text style={styles.tituloResultados}>Resultados ({ejerciciosFiltrados.length})</Text>
              {ejerciciosFiltrados.length === 0 ? (
                <View style={styles.sinResultados}>
                  <Ionicons name="alert-circle-outline" size={48} color={COLORES_APP.textoSecundario} />
                  <Text style={styles.sinResultadosTexto}>
                    {`No se encontraron ejercicios con "${busqueda}"`}
                  </Text>
                </View>
              ) : (
                ejerciciosFiltrados.map(item => (
                  <Pressable
                    key={item.id}
                    style={styles.itemResultado}
                    onPress={() =>
                      router.push({ pathname: '/ejercicio/[id]', params: { id: item.id } })
                    }>
                    {item.imagen && (
                      <Image source={item.imagen} style={styles.miniaturaResultado} resizeMode="cover" />
                    )}
                    <View style={styles.infoResultado}>
                      <Text style={styles.nombreResultado}>{item.nombre}</Text>
                      <Text style={styles.grupoResultado}>
                        {item.grupo} • {item.series} × {item.repeticiones}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORES_APP.textoSecundario} />
                  </Pressable>
                ))
              )}
            </View>
          ) : (
            <View>
              <Text style={styles.tituloSeccion}>Grupos Musculares (11)</Text>
              <View style={styles.cuadricula}>
                {GRUPOS_MUSCULARES.map(grupo => (
                  <TarjetaGrupo
                    key={grupo.clave}
                    grupo={grupo.clave}
                    cantidad={conteoPorGrupo[grupo.clave] || 0}
                    anchoPorcentaje={anchoColumna}
                    tieneLesion={socio.lesiones.includes(grupo.clave)}
                    onPress={() =>
                      router.push({ pathname: '/grupo/[grupo]', params: { grupo: grupo.clave } })
                    }
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  contenedor: { flex: 1, padding: 16 },
  barraBusqueda: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: 16,
  },
  iconoBusqueda: { marginRight: 8 },
  inputBusqueda: { flex: 1, color: COLORES_APP.texto, fontSize: 16, minHeight: 44 },
  botonLimpiar: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingBottom: 24 },
  tituloSeccion: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 14 },
  tituloResultados: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 12 },
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  itemResultado: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    minHeight: 56,
  },
  miniaturaResultado: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: COLORES_APP.superficieClara,
  },
  infoResultado: { flex: 1 },
  nombreResultado: { fontSize: 16, fontWeight: '600', color: COLORES_APP.texto, marginBottom: 2 },
  grupoResultado: { fontSize: 14, color: COLORES_APP.textoSecundario, textTransform: 'capitalize' },
  sinResultados: { alignItems: 'center', paddingVertical: 40 },
  sinResultadosTexto: { fontSize: 15, color: COLORES_APP.textoSecundario, textAlign: 'center', marginTop: 10 },
});
