import { useState } from 'react';
import { Platform, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BotonAnimado } from '@/components/BotonAnimado';
import { CampoFormulario } from '@/components/CampoFormulario';
import { COLORES_APP } from '@/constants/colores';
import { formatearHora, parsearHora, type ResultadoProgramacion } from '@/services/recordatorios';
import type { Recordatorio } from '@/types/gym';

interface TarjetaRecordatorioProps {
  recordatorio: Recordatorio;
  onGuardar: (r: Recordatorio) => Promise<ResultadoProgramacion>;
}

const MENSAJES: Record<ResultadoProgramacion, string> = {
  programado: 'Listo: recibirás un aviso cada día de entreno (lunes a sábado).',
  desactivado: 'Recordatorios desactivados.',
  'sin-permiso': 'No hay permiso de notificaciones. Actívalo en los ajustes del teléfono.',
  'no-disponible': 'Las notificaciones locales no están disponibles en la versión web.',
};

/** Activa y programa el recordatorio semanal de entrenamiento (expo-notifications). */
export function TarjetaRecordatorio({ recordatorio, onGuardar }: TarjetaRecordatorioProps) {
  const [hora, setHora] = useState(formatearHora(recordatorio));
  const [error, setError] = useState<string | undefined>();
  const [mensaje, setMensaje] = useState<string | undefined>(
    Platform.OS === 'web' ? MENSAJES['no-disponible'] : undefined
  );

  const guardar = async (nuevoActivo: boolean) => {
    const parseada = parsearHora(hora);
    if (!parseada) {
      setError('Usa el formato HH:MM de 24 horas (ej. 06:00).');
      return;
    }
    setError(undefined);
    const resultado = await onGuardar({ activo: nuevoActivo, ...parseada });
    setMensaje(MENSAJES[resultado]);
  };

  // El interruptor refleja lo guardado en el contexto (si se niega el permiso, vuelve a apagado).
  const alternar = (valor: boolean) => {
    void guardar(valor);
  };

  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <Ionicons name="notifications-outline" size={20} color={COLORES_APP.primario} />
        <View style={styles.textos}>
          <Text style={styles.titulo}>Recordatorio de entreno</Text>
          <Text style={styles.sub}>Aviso semanal a la hora elegida, de lunes a sábado.</Text>
        </View>
        <Switch
          value={recordatorio.activo}
          onValueChange={alternar}
          trackColor={{ true: COLORES_APP.primario, false: COLORES_APP.superficieClara }}
          accessibilityLabel="Activar recordatorio de entrenamiento"
        />
      </View>

      <View style={styles.filaHora}>
        <View style={styles.campoHora}>
          <CampoFormulario
            etiqueta="Hora (HH:MM)"
            value={hora}
            onChangeText={setHora}
            placeholder="06:00"
            keyboardType="numbers-and-punctuation"
            error={error}
          />
        </View>
        <BotonAnimado
          onPress={() => void guardar(recordatorio.activo)}
          style={styles.boton}
          accessibilityLabel="Guardar hora del recordatorio">
          <Text style={styles.textoBoton}>Guardar hora</Text>
        </BotonAnimado>
      </View>

      {mensaje && <Text style={styles.mensaje}>{mensaje}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 14,
    marginBottom: 14,
  },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  textos: { flex: 1 },
  titulo: { fontSize: 15, fontWeight: 'bold', color: COLORES_APP.texto },
  sub: { fontSize: 14, color: COLORES_APP.textoSecundario },
  filaHora: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  campoHora: { flex: 1 },
  boton: {
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: COLORES_APP.superficieClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: { color: COLORES_APP.texto, fontSize: 14, fontWeight: 'bold' },
  mensaje: { fontSize: 14, color: COLORES_APP.textoSecundario },
});
