import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GymProvider } from '@/context/GymContext';
import { COLORES_APP } from '@/constants/colores';
import { NOMBRE_BD } from '@/db/esquema';
import { inicializarBaseDatos } from '@/db/inicializar';
import { configurarManejadorNotificaciones } from '@/services/recordatorios';

configurarManejadorNotificaciones();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Abre la base, aplica migraciones y pasa los datos viejos de AsyncStorage. */}
      <SQLiteProvider databaseName={NOMBRE_BD} onInit={inicializarBaseDatos}>
        <GymProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: COLORES_APP.superficie },
              headerTintColor: COLORES_APP.texto,
              headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
              contentStyle: { backgroundColor: COLORES_APP.fondo },
              headerBackTitle: 'Atrás',
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="dia/[dia]" options={{ title: 'Detalle del Día', headerBackTitle: 'Inicio' }} />
            <Stack.Screen name="grupo/[grupo]" options={{ title: 'Grupo Muscular', headerBackTitle: 'Catálogo' }} />
            <Stack.Screen name="ejercicio/[id]" options={{ title: 'Ejercicio' }} />
          </Stack>
        </GymProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
