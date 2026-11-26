import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

interface EntradaAnimadaProps {
  children: ReactNode;
  indice?: number;
  style?: StyleProp<ViewStyle>;
}

export function EntradaAnimada({
  children,
  indice = 0,
  style,
}: EntradaAnimadaProps) {
  const [opacidad] = useState(() => new Animated.Value(0));
  const [desplazamiento] = useState(() => new Animated.Value(14));

  useEffect(() => {
    const retardo = Math.min(indice * 45, 270);
    const animacion = Animated.parallel([
      Animated.timing(opacidad, {
        toValue: 1,
        duration: 320,
        delay: retardo,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(desplazamiento, {
        toValue: 0,
        duration: 340,
        delay: retardo,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animacion.start();
    return () => {
      animacion.stop();
    };
  }, [indice, opacidad, desplazamiento]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacidad,
          transform: [{ translateY: desplazamiento }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
