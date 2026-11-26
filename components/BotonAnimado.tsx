import * as Haptics from 'expo-haptics';
import { useState, type ReactNode } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  type AccessibilityRole,
  type AccessibilityState,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type TipoHaptic = 'light' | 'medium' | 'success' | 'none';

interface BotonAnimadoProps {
  children: ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  contenedorStyle?: StyleProp<ViewStyle>;
  escalaActiva?: number;
  haptic?: TipoHaptic;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityState?: AccessibilityState;
}

function dispararHaptic(tipo: TipoHaptic): void {
  if (Platform.OS === 'web' || tipo === 'none') {
    return;
  }
  if (tipo === 'success') {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
    return;
  }
  const estilo =
    tipo === 'medium'
      ? Haptics.ImpactFeedbackStyle.Medium
      : Haptics.ImpactFeedbackStyle.Light;
  void Haptics.impactAsync(estilo).catch(() => {});
}

export function BotonAnimado({
  children,
  onPress,
  style,
  contenedorStyle,
  escalaActiva = 0.97,
  haptic = 'light',
  accessibilityRole = 'button',
  accessibilityLabel,
  accessibilityState,
}: BotonAnimadoProps) {
  const [escala] = useState(() => new Animated.Value(1));

  const alPresionar = () => {
    Animated.spring(escala, {
      toValue: escalaActiva,
      useNativeDriver: true,
      speed: 36,
      bounciness: 4,
    }).start();
  };

  const alSoltar = () => {
    Animated.spring(escala, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  const manejarPress = () => {
    dispararHaptic(haptic);
    onPress();
  };

  return (
    <Animated.View
      style={[contenedorStyle, { transform: [{ scale: escala }] }]}
    >
      <Pressable
        onPress={manejarPress}
        onPressIn={alPresionar}
        onPressOut={alSoltar}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={accessibilityState}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
