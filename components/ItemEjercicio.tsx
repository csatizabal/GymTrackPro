import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Ejercicio } from '@/types/gym';
import { COLORES_APP } from '@/constants/colores';

export interface ItemEjercicioProps {
  ejercicio: Ejercicio;
  completado: boolean;
  onAlternar: () => void;
  tieneAdvertencia?: boolean;
  onVerDetalle?: () => void;
}

export function ItemEjercicio({
  ejercicio,
  completado,
  onAlternar,
  tieneAdvertencia = false,
  onVerDetalle,
}: ItemEjercicioProps) {
  return (
    <View
      style={[
        styles.contenedor,
        completado && styles.contenedorCompletado,
        tieneAdvertencia && styles.contenedorAdvertencia,
      ]}>
      <Pressable
        style={styles.areaToque}
        onPress={onAlternar}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completado }}
        accessibilityLabel={`Marcar ${ejercicio.nombre} como ${completado ? 'pendiente' : 'completado'}`}>
        <View style={[styles.checkbox, completado && styles.checkboxMarcado]}>
          {completado && (
            <Ionicons name="checkmark" size={18} color={COLORES_APP.fondo} />
          )}
        </View>

        {ejercicio.imagen ? (
          <Image source={ejercicio.imagen} style={styles.miniatura} resizeMode="cover" />
        ) : null}

        <View style={styles.info}>
          <Text
            style={[styles.nombre, completado && styles.nombreCompletado]}
            numberOfLines={2}>
            {ejercicio.nombre}
          </Text>
          <Text style={styles.detalles}>
            {ejercicio.series} series × {ejercicio.repeticiones} reps •{' '}
            <Text style={styles.grupoTexto}>{ejercicio.grupo}</Text>
          </Text>

          {tieneAdvertencia && (
            <View style={styles.badgeAdvertencia}>
              <Ionicons name="warning" size={14} color={COLORES_APP.advertencia} />
              <Text style={styles.textoAdvertencia}>
                Atención: Lesión registrada en {ejercicio.grupo}
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      {onVerDetalle && (
        <Pressable
          style={styles.botonDetalle}
          onPress={onVerDetalle}
          accessibilityRole="button"
          accessibilityLabel={`Ver detalle de ${ejercicio.nombre}`}>
          <Ionicons
            name="chevron-forward"
            size={22}
            color={COLORES_APP.textoSecundario}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    overflow: 'hidden',
  },
  contenedorCompletado: {
    opacity: 0.65,
    backgroundColor: COLORES_APP.fondo,
  },
  contenedorAdvertencia: {
    borderColor: COLORES_APP.advertenciaBorde,
  },
  areaToque: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 56,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORES_APP.textoSecundario,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxMarcado: {
    backgroundColor: COLORES_APP.exito,
    borderColor: COLORES_APP.exito,
  },
  miniatura: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: COLORES_APP.superficieClara,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES_APP.texto,
    marginBottom: 2,
  },
  nombreCompletado: {
    textDecorationLine: 'line-through',
    color: COLORES_APP.textoSecundario,
  },
  detalles: {
    fontSize: 14,
    color: COLORES_APP.textoSecundario,
  },
  grupoTexto: {
    textTransform: 'capitalize',
    color: COLORES_APP.primario,
  },
  badgeAdvertencia: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.advertenciaFondo,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
    alignSelf: 'flex-start',
    gap: 4,
  },
  textoAdvertencia: {
    fontSize: 12,
    color: COLORES_APP.advertencia,
    fontWeight: '500',
  },
  botonDetalle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 6,
  },
});
