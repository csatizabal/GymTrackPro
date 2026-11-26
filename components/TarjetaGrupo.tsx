import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { BotonAnimado } from '@/components/BotonAnimado';
import { NOMBRES_GRUPO, COLORES_APP } from '@/constants/colores';
import { GRUPOS_MUSCULARES } from '@/constants/grupos';
import type { GrupoMuscular } from '@/types/gym';

interface TarjetaGrupoProps {
  grupo: GrupoMuscular;
  cantidad: number;
  anchoPorcentaje: `${number}%`;
  tieneLesion?: boolean;
  onPress: () => void;
}

function iconoDe(grupo: GrupoMuscular): keyof typeof Ionicons.glyphMap {
  return GRUPOS_MUSCULARES.find((g) => g.clave === grupo)?.icono ?? 'barbell-outline';
}

export function TarjetaGrupo({
  grupo,
  cantidad,
  anchoPorcentaje,
  tieneLesion = false,
  onPress,
}: TarjetaGrupoProps) {
  return (
    <View style={[styles.envoltura, { width: anchoPorcentaje }]}>
      <BotonAnimado
        onPress={onPress}
        haptic="light"
        accessibilityLabel={`Abrir ejercicios de ${NOMBRES_GRUPO[grupo]}`}
        style={[styles.tarjeta, tieneLesion && styles.tarjetaLesion]}
      >
        <View style={styles.filaIconos}>
          <View style={styles.iconoFondo}>
            <Ionicons name={iconoDe(grupo)} size={22} color={COLORES_APP.primario} />
          </View>
          {tieneLesion && (
            <Ionicons name="warning" size={18} color={COLORES_APP.advertencia} />
          )}
        </View>
        <View style={styles.textos}>
          <Text style={styles.nombre}>{NOMBRES_GRUPO[grupo]}</Text>
          <Text style={styles.contador}>
            {cantidad} {cantidad === 1 ? 'ejercicio' : 'ejercicios'}
          </Text>
        </View>
      </BotonAnimado>
    </View>
  );
}

const styles = StyleSheet.create({
  envoltura: {
    padding: 6,
  },
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 16,
    minHeight: 122,
    justifyContent: 'space-between',
    gap: 12,
  },
  tarjetaLesion: {
    borderColor: COLORES_APP.advertencia,
  },
  filaIconos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconoFondo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORES_APP.primarioFondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    gap: 2,
  },
  nombre: {
    color: COLORES_APP.texto,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  contador: {
    color: COLORES_APP.textoSecundario,
    fontSize: 14,
  },
});
