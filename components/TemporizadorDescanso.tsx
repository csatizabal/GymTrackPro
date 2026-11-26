import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { BotonAnimado } from '@/components/BotonAnimado';
import { COLORES_APP } from '@/constants/colores';

const SEGUNDOS_INICIALES = 60;

interface TemporizadorDescansoProps {
  colorAcento?: string;
}

function formatearTiempo(segundos: number): string {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(resto).padStart(2, '0')}`;
}

export function TemporizadorDescanso({
  colorAcento,
}: TemporizadorDescansoProps) {
  const [segundos, setSegundos] = useState(SEGUNDOS_INICIALES);
  const [activo, setActivo] = useState(false);
  const [progresoAnim] = useState(() => new Animated.Value(100));
  const [pulsoReloj] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!activo) {
      return;
    }

    const intervalo = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          setActivo(false);
          if (Platform.OS !== 'web') {
            void Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            ).catch(() => {});
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo]);

  useEffect(() => {
    const porcentaje = (segundos / SEGUNDOS_INICIALES) * 100;
    const animacion = Animated.timing(progresoAnim, {
      toValue: porcentaje,
      duration: 280,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    });
    animacion.start();
    return () => {
      animacion.stop();
    };
  }, [segundos, progresoAnim]);

  useEffect(() => {
    if (!activo && segundos > 0) return;
    const animacion = Animated.sequence([
      Animated.timing(pulsoReloj, {
        toValue: 1.06,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(pulsoReloj, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]);
    animacion.start();
    return () => {
      animacion.stop();
    };
  }, [segundos, activo, pulsoReloj]);

  const alternar = () => {
    if (segundos === 0) {
      setSegundos(SEGUNDOS_INICIALES);
      setActivo(true);
      return;
    }
    setActivo((prev) => !prev);
  };

  const reiniciar = () => {
    setActivo(false);
    setSegundos(SEGUNDOS_INICIALES);
  };

  const finalizado = segundos === 0;
  const anchoBarra = progresoAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.tarjeta, finalizado && styles.tarjetaFinalizada]}>
      <View style={styles.encabezado}>
        <View style={styles.tituloFila}>
          <View style={styles.iconoFondo}>
            <Ionicons name="timer" size={20} color={COLORES_APP.primario} />
          </View>
          <View style={styles.tituloTextos}>
            <Text style={styles.titulo}>Descanso entre series</Text>
            <Text style={styles.estadoTexto}>
              {activo ? 'En curso' : finalizado ? '¡Tiempo cumplido!' : '60 segundos'}
            </Text>
          </View>
        </View>

        <View style={styles.relojBloque}>
          {colorAcento !== undefined && (
            <View style={[styles.puntoAcento, { backgroundColor: colorAcento }]} />
          )}
          <Animated.Text
            style={[styles.reloj, { transform: [{ scale: pulsoReloj }] }]}
          >
            {formatearTiempo(segundos)}
          </Animated.Text>
        </View>
      </View>

      <View style={styles.pista}>
        <Animated.View style={[styles.relleno, { width: anchoBarra }]} />
      </View>

      {finalizado && (
        <Text style={styles.mensajeListo}>
          Descanso finalizado. Listo para la siguiente serie.
        </Text>
      )}

      <View style={styles.acciones}>
        <BotonAnimado
          onPress={alternar}
          haptic="medium"
          contenedorStyle={styles.flex}
          style={styles.botonPrimario}
        >
          <Ionicons
            name={activo ? 'pause' : 'play'}
            size={18}
            color={COLORES_APP.fondo}
          />
          <Text style={styles.textoPrimario}>
            {activo ? 'Pausar' : finalizado ? 'Repetir 60 s' : 'Iniciar 60 s'}
          </Text>
        </BotonAnimado>

        <BotonAnimado
          onPress={reiniciar}
          haptic="light"
          style={styles.botonSecundario}
        >
          <Ionicons name="refresh" size={18} color={COLORES_APP.texto} />
          <Text style={styles.textoSecundario}>Reiniciar</Text>
        </BotonAnimado>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 18,
    gap: 14,
  },
  tarjetaFinalizada: {
    borderColor: COLORES_APP.primario,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  tituloFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconoFondo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORES_APP.primarioFondo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloTextos: {
    flex: 1,
  },
  titulo: {
    color: COLORES_APP.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  estadoTexto: {
    color: COLORES_APP.textoSecundario,
    fontSize: 14,
  },
  relojBloque: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  puntoAcento: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reloj: {
    color: COLORES_APP.primario,
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  pista: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORES_APP.superficieClara,
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORES_APP.primario,
  },
  mensajeListo: {
    color: COLORES_APP.primario,
    fontSize: 14,
    fontWeight: '700',
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  botonPrimario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: COLORES_APP.primario,
    paddingHorizontal: 18,
    gap: 8,
  },
  botonSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: COLORES_APP.superficieClara,
    gap: 6,
  },
  textoPrimario: {
    color: COLORES_APP.fondo,
    fontSize: 15,
    fontWeight: '800',
  },
  textoSecundario: {
    color: COLORES_APP.texto,
    fontSize: 15,
    fontWeight: '700',
  },
});
