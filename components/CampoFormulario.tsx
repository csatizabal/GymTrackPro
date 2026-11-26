import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { COLORES_APP } from '@/constants/colores';

// Base: GymTrack2 (extiende TextInputProps y admite `unidad`).
// Añadido de GymTrack: texto de `ayuda` y soporte visual para `multiline`.
export interface CampoFormularioProps extends TextInputProps {
  etiqueta: string;
  error?: string;
  unidad?: string;
  ayuda?: string;
}

export function CampoFormulario({
  etiqueta,
  error,
  unidad,
  ayuda,
  style,
  multiline,
  ...props
}: CampoFormularioProps) {
  const tieneError = Boolean(error);

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      <View
        style={[
          styles.filaInput,
          multiline && styles.filaInputMultilinea,
          tieneError && styles.filaInputError,
        ]}>
        <TextInput
          style={[styles.input, multiline && styles.inputMultilinea, style]}
          placeholderTextColor={COLORES_APP.textoSecundario}
          accessibilityLabel={etiqueta}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {unidad && <Text style={styles.unidad}>{unidad}</Text>}
      </View>
      {ayuda && !tieneError && <Text style={styles.ayuda}>{ayuda}</Text>}
      {tieneError && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 14,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES_APP.texto,
    marginBottom: 6,
  },
  filaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.fondo,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  filaInputMultilinea: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  filaInputError: {
    borderColor: COLORES_APP.peligro,
  },
  input: {
    flex: 1,
    color: COLORES_APP.texto,
    fontSize: 16,
    minHeight: 44,
  },
  inputMultilinea: {
    minHeight: 88,
  },
  unidad: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES_APP.textoSecundario,
    marginLeft: 6,
  },
  ayuda: {
    fontSize: 13,
    color: COLORES_APP.textoSecundario,
    marginTop: 4,
  },
  error: {
    fontSize: 13,
    color: COLORES_APP.peligro,
    marginTop: 4,
    fontWeight: '500',
  },
});
