import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Medida } from '@/types/gym';
import { calcularImc, clasificarImc } from '@/utils/imc';
import { COLORES_APP } from '@/constants/colores';

export interface TarjetaResumenImcProps {
  medidaActual?: Medida;
  medidaAnterior?: Medida;
}

export function TarjetaResumenImc({
  medidaActual,
  medidaAnterior,
}: TarjetaResumenImcProps) {
  if (!medidaActual) {
    return (
      <View style={styles.contenedor}>
        <Text style={styles.sinDatos}>No hay medidas registradas aún.</Text>
      </View>
    );
  }

  const imc = calcularImc(medidaActual.pesoKg, medidaActual.estaturaM);
  const clasificacion = clasificarImc(imc);

  let difTexto = 'Sin cambio';
  let difColor = COLORES_APP.textoSecundario;
  let difIcono: keyof typeof Ionicons.glyphMap = 'remove-outline';

  if (medidaAnterior) {
    const dif = Math.round((medidaActual.pesoKg - medidaAnterior.pesoKg) * 10) / 10;
    if (dif < 0) {
      difTexto = `${dif.toFixed(1)} kg`;
      difColor = COLORES_APP.exito;
      difIcono = 'trending-down-outline';
    } else if (dif > 0) {
      difTexto = `+${dif.toFixed(1)} kg`;
      difColor = COLORES_APP.advertencia;
      difIcono = 'trending-up-outline';
    } else {
      difTexto = '0.0 kg';
      difColor = COLORES_APP.textoSecundario;
    }
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.filaMes}>
        <Text style={styles.mesTexto}>Mes actual: {medidaActual.mes}</Text>
        <View style={styles.badgeDif}>
          <Ionicons name={difIcono} size={16} color={difColor} />
          <Text style={[styles.difTexto, { color: difColor }]}>{difTexto}</Text>
        </View>
      </View>

      <View style={styles.filaMetricas}>
        <View style={styles.bloqueMetrica}>
          <Text style={styles.valorPrincipal}>{medidaActual.pesoKg} kg</Text>
          <Text style={styles.etiqueta}>Peso ({medidaActual.estaturaM} m)</Text>
        </View>

        <View style={styles.separador} />

        <View style={styles.bloqueMetrica}>
          <Text style={styles.valorImc}>{imc.toFixed(1)}</Text>
          <Text style={styles.etiqueta}>IMC ({clasificacion})</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    marginBottom: 16,
  },
  filaMes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mesTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
  },
  badgeDif: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES_APP.superficieClara,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  difTexto: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  filaMetricas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORES_APP.borde,
    paddingTop: 12,
  },
  bloqueMetrica: {
    alignItems: 'center',
  },
  valorPrincipal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES_APP.texto,
  },
  valorImc: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORES_APP.primario,
  },
  etiqueta: {
    fontSize: 13,
    color: COLORES_APP.textoSecundario,
    marginTop: 2,
  },
  separador: {
    width: 1,
    height: 36,
    backgroundColor: COLORES_APP.borde,
  },
  sinDatos: {
    fontSize: 14,
    color: COLORES_APP.textoSecundario,
    textAlign: 'center',
  },
});
