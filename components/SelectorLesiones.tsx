import { StyleSheet, Text, View } from 'react-native';
import { BotonAnimado } from '@/components/BotonAnimado';
import { GRUPOS_ORDEN, NOMBRES_GRUPO, COLORES_APP } from '@/constants/colores';
import type { GrupoMuscular } from '@/types/gym';

interface SelectorLesionesProps {
  seleccionadas: GrupoMuscular[];
  onAlternar: (grupo: GrupoMuscular) => void;
}

export function SelectorLesiones({
  seleccionadas,
  onAlternar,
}: SelectorLesionesProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>Lesiones o zonas con restricción</Text>
      <Text style={styles.ayuda}>
        Los grupos marcados mostrarán advertencias en el plan y catálogo.
      </Text>
      <View style={styles.chips}>
        {GRUPOS_ORDEN.map((grupo) => {
          const activo = seleccionadas.includes(grupo);
          return (
            <BotonAnimado
              key={grupo}
              onPress={() => onAlternar(grupo)}
              haptic="light"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: activo }}
              style={[styles.chip, activo && styles.chipActivo]}
            >
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>
                {NOMBRES_GRUPO[grupo]}
              </Text>
            </BotonAnimado>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    gap: 8,
  },
  etiqueta: {
    color: COLORES_APP.texto,
    fontSize: 14,
    fontWeight: '700',
  },
  ayuda: {
    color: COLORES_APP.textoSecundario,
    fontSize: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORES_APP.fondo,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActivo: {
    backgroundColor: COLORES_APP.advertenciaFondo,
    borderColor: COLORES_APP.advertencia,
  },
  chipTexto: {
    color: COLORES_APP.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },
  chipTextoActivo: {
    color: COLORES_APP.advertencia,
    fontWeight: '700',
  },
});
