import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES_APP } from '@/constants/colores';

export interface TarjetaCalentamientoProps {
  titulo: string;
  duracion: string;
  descripcion: string;
  tipo: 'inicio' | 'fin' | 'cardio';
}

export function TarjetaCalentamiento({
  titulo,
  duracion,
  descripcion,
  tipo,
}: TarjetaCalentamientoProps) {
  const esCardio = tipo === 'cardio';
  const esInicio = tipo === 'inicio';

  return (
    <View
      style={[
        styles.contenedor,
        esCardio ? styles.contenedorCardio : styles.contenedorCalentamiento,
        esInicio && styles.bordeInicio,
      ]}>
      <View style={styles.filaTitulo}>
        <Ionicons
          name={esCardio ? 'heart-outline' : esInicio ? 'flame-outline' : 'snow-outline'}
          size={20}
          color={esCardio ? COLORES_APP.peligro : esInicio ? COLORES_APP.advertencia : COLORES_APP.primario}
        />
        <Text style={[styles.titulo, esCardio && styles.tituloCardio]}>
          {titulo} ({duracion})
        </Text>
      </View>
      <Text style={[styles.descripcion, esCardio && styles.descCardio]}>
        {descripcion}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    borderRadius: 20,
    padding: 12,
    marginVertical: 6,
  },
  contenedorCalentamiento: {
    backgroundColor: COLORES_APP.superficie,
    borderLeftWidth: 4,
    borderLeftColor: COLORES_APP.primario,
  },
  bordeInicio: {
    borderLeftColor: COLORES_APP.advertencia,
  },
  contenedorCardio: {
    backgroundColor: COLORES_APP.peligroFondo,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.35)',
  },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  titulo: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.texto },
  tituloCardio: { color: COLORES_APP.peligro },
  descripcion: { fontSize: 13, color: COLORES_APP.textoSecundario, lineHeight: 18 },
  descCardio: { color: COLORES_APP.textoSecundario },
});
