import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORES_APP } from '@/constants/colores';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORES_APP.fondo },
        headerShadowVisible: false,
        headerTintColor: COLORES_APP.texto,
        headerTitleStyle: { fontWeight: '800', fontSize: 20 },
        headerTitleAlign: 'left',
        tabBarStyle: {
          backgroundColor: COLORES_APP.superficie,
          borderTopColor: COLORES_APP.borde,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORES_APP.primario,
        tabBarInactiveTintColor: COLORES_APP.textoSecundario,
        tabBarLabelStyle: { fontSize: 14, fontWeight: '700' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalogo"
        options={{
          title: 'Catálogo',
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'barbell' : 'barbell-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medidas"
        options={{
          title: 'Medidas',
          tabBarLabel: 'Medidas',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'fitness' : 'fitness-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
