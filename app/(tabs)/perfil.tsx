import { View, Text, StyleSheet, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGym } from '@/context/GymContext';
import { FormularioPerfil } from '@/components/FormularioPerfil';
import { EntradaAnimada } from '@/components/EntradaAnimada';
import { TarjetaRecordatorio } from '@/components/TarjetaRecordatorio';
import { COLORES_APP, NOMBRES_GRUPO } from '@/constants/colores';

// Encabezado, tarjeta médica y "Restaurar datos": GymTrack2.
// Formulario con observaciones y selector de lesiones editables: GymTrack.
export default function PerfilScreen() {
  const { socio, setSocio, reiniciarDatos, recordatorio, actualizarRecordatorio } = useGym();

  const confirmarReinicio = () => {
    Alert.alert(
      'Restaurar Datos de Prueba',
      '¿Deseas restaurar el socio, las medidas y el progreso a los valores originales de la ficha?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restaurar',
          style: 'destructive',
          onPress: async () => {
            await reiniciarDatos();
            Alert.alert('Restaurado', 'Datos restablecidos a los valores iniciales.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.encabezado}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={36} color={COLORES_APP.primario} />
            </View>
            <View style={styles.infoEncabezado}>
              <Text style={styles.nombre}>{socio.nombre}</Text>
              <Text style={styles.meta}>
                {socio.edad} años · Asignado: {socio.fechaAsignacion}
              </Text>
            </View>
          </View>

          <View style={styles.tarjeta}>
            <View style={styles.filaTitulo}>
              <Ionicons name="medical" size={18} color={COLORES_APP.advertencia} />
              <Text style={styles.tituloMedica}>Observaciones Médicas y Lesiones</Text>
            </View>
            {socio.observaciones.length === 0 && (
              <Text style={styles.textoObs}>Sin observaciones registradas.</Text>
            )}
            {socio.observaciones.map((obs) => (
              <View key={obs} style={styles.itemObs}>
                <Ionicons name="alert-circle-outline" size={16} color={COLORES_APP.advertencia} />
                <Text style={styles.textoObs}>{obs}</Text>
              </View>
            ))}
            <View style={styles.badges}>
              {socio.lesiones.map((lesion) => (
                <View key={lesion} style={styles.badge}>
                  <Text style={styles.textoBadge}>{NOMBRES_GRUPO[lesion].toUpperCase()}</Text>
                </View>
              ))}
            </View>
          </View>

          <TarjetaRecordatorio
            recordatorio={recordatorio}
            onGuardar={actualizarRecordatorio}
          />

          <Text style={styles.tituloSeccion}>Editar Datos del Socio</Text>
          <EntradaAnimada indice={0}>
            {/* La key fuerza a reiniciar el formulario cuando el socio cambia (p. ej. al restaurar). */}
            <FormularioPerfil
              key={`${socio.nombre}-${socio.edad}-${socio.objetivo}-${socio.lesiones.join(',')}-${socio.observaciones.join('|')}`}
              socioInicial={socio}
              onGuardar={setSocio}
            />
          </EntradaAnimada>

          <Pressable style={styles.botonReinicio} onPress={confirmarReinicio} accessibilityRole="button">
            <Ionicons name="refresh-outline" size={18} color={COLORES_APP.textoSecundario} />
            <Text style={styles.textoBotonReinicio}>Restaurar Datos Iniciales</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORES_APP.superficieClara,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoEncabezado: { flex: 1 },
  nombre: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto },
  meta: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 2 },
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: 14,
  },
  tituloSeccion: { fontSize: 17, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 10 },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  tituloMedica: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.texto },
  itemObs: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 6 },
  textoObs: { fontSize: 14, color: COLORES_APP.texto, flex: 1, lineHeight: 18 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  badge: { backgroundColor: COLORES_APP.advertenciaFondo, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  textoBadge: { color: COLORES_APP.advertencia, fontSize: 12, fontWeight: 'bold' },
  botonReinicio: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    marginTop: 12,
  },
  textoBotonReinicio: { color: COLORES_APP.textoSecundario, fontSize: 14, fontWeight: '500' },
});
