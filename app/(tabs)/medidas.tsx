import { useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGym } from '@/context/GymContext';
import { TarjetaResumenImc } from '@/components/TarjetaResumenImc';
import { ItemHistorialMedida } from '@/components/ItemHistorialMedida';
import { FormularioMedida } from '@/components/FormularioMedida';
import { EntradaAnimada } from '@/components/EntradaAnimada';
import { COLORES_APP } from '@/constants/colores';
import type { Medida } from '@/types/gym';

// Resumen IMC e historial: GymTrack2. Formulario con validación de formato
// AAAA-MM, coma decimal y los 8 perímetros obligatorios: GymTrack.
export default function MedidasScreen() {
  const { medidas, agregarMedida } = useGym();
  const [mostrarForm, setMostrarForm] = useState(false);

  const historialOrdenado = useMemo(
    () => [...medidas].sort((a, b) => b.mes.localeCompare(a.mes)),
    [medidas]
  );

  const manejarGuardar = (nueva: Medida) => {
    agregarMedida(nueva);
    setMostrarForm(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.titulo}>Seguimiento Corporal</Text>
          <TarjetaResumenImc medidaActual={historialOrdenado[0]} medidaAnterior={historialOrdenado[1]} />

          <Pressable
            style={styles.botonToggle}
            onPress={() => setMostrarForm((prev) => !prev)}
            accessibilityRole="button">
            <Ionicons name={mostrarForm ? 'chevron-up' : 'add-circle-outline'} size={20} color={COLORES_APP.fondo} />
            <Text style={styles.textoBotonToggle}>
              {mostrarForm ? 'Ocultar Formulario' : 'Registrar Nuevo Mes'}
            </Text>
          </Pressable>

          {mostrarForm && (
            <EntradaAnimada indice={0} style={styles.bloqueForm}>
              <FormularioMedida
                mesesExistentes={historialOrdenado.map((m) => m.mes)}
                onGuardar={manejarGuardar}
              />
            </EntradaAnimada>
          )}

          <Text style={styles.tituloHistorial}>Historial de Registros ({historialOrdenado.length})</Text>
          {historialOrdenado.map((item, indice) => (
            <EntradaAnimada key={item.mes} indice={indice}>
              <ItemHistorialMedida item={item} />
            </EntradaAnimada>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  flex: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: COLORES_APP.texto, marginBottom: 12 },
  botonToggle: {
    backgroundColor: COLORES_APP.primario,
    borderRadius: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  textoBotonToggle: { color: COLORES_APP.fondo, fontSize: 16, fontWeight: 'bold' },
  bloqueForm: { marginBottom: 20 },
  tituloHistorial: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginVertical: 12 },
});
