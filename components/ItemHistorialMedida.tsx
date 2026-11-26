import { View, Text, StyleSheet } from 'react-native';
import type { Medida } from '@/types/gym';
import { PERIMETROS_DEF } from '@/constants/perimetros';
import { COLORES_APP } from '@/constants/colores';

export interface ItemHistorialMedidaProps {
  item: Medida;
}

export function ItemHistorialMedida({ item }: ItemHistorialMedidaProps) {
  return (
    <View style={styles.item}>
      <View style={styles.encabezado}>
        <Text style={styles.mes}>{item.mes}</Text>
        <Text style={styles.resumen}>
          {item.pesoKg} kg • {item.estaturaM} m
        </Text>
      </View>
      <View style={styles.tags}>
        {PERIMETROS_DEF.map(({ clave, etiqueta }) => (
          <Text key={clave} style={styles.tag}>
            {etiqueta}: {item.perimetrosCm[clave]}cm
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mes: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  resumen: { fontSize: 14, color: COLORES_APP.primario, fontWeight: '600' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: COLORES_APP.superficieClara,
    color: COLORES_APP.textoSecundario,
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
