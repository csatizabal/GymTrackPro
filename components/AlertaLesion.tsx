import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES_APP } from '@/constants/colores';

export interface AlertaLesionProps {
  grupo: string;
}

export function AlertaLesion({ grupo }: AlertaLesionProps) {
  const nombre = grupo.charAt(0).toUpperCase() + grupo.slice(1);
  return (
    <View style={styles.alerta}>
      <Ionicons name="warning" size={22} color={COLORES_APP.advertencia} />
      <View style={styles.contenido}>
        <Text style={styles.titulo}>Restricción Médica (RF09)</Text>
        <Text style={styles.texto}>
          {`Lesión registrada en "${nombre}". Ejecuta los ejercicios con peso moderado y técnica estricta.`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alerta: {
    backgroundColor: COLORES_APP.advertenciaFondo,
    borderColor: COLORES_APP.advertenciaBorde,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  contenido: { flex: 1 },
  titulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORES_APP.advertencia,
    marginBottom: 2,
  },
  texto: { fontSize: 13, color: COLORES_APP.texto, lineHeight: 18 },
});
