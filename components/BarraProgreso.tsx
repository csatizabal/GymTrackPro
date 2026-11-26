import { View, Text, StyleSheet } from 'react-native';
import { COLORES_APP } from '@/constants/colores';

export interface BarraProgresoProps {
  valor: number;
  total: number;
  color?: string;
}

export function BarraProgreso({
  valor,
  total,
  color = COLORES_APP.primario,
}: BarraProgresoProps) {
  const porcentaje = total > 0 ? Math.round((valor / total) * 100) : 0;

  return (
    <View style={styles.contenedor}>
      <View style={styles.filaTexto}>
        <Text style={styles.etiqueta}>Progreso de la sesión</Text>
        <Text style={styles.porcentaje}>
          {valor} de {total} ({porcentaje}%)
        </Text>
      </View>
      <View style={styles.pista}>
        <View
          style={[
            styles.relleno,
            {
              width: `${Math.min(100, Math.max(0, porcentaje))}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginVertical: 12,
  },
  filaTexto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  etiqueta: {
    fontSize: 14,
    color: COLORES_APP.textoSecundario,
    fontWeight: '500',
  },
  porcentaje: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
  },
  pista: {
    height: 10,
    backgroundColor: COLORES_APP.superficieClara,
    borderRadius: 5,
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
    borderRadius: 5,
  },
});
