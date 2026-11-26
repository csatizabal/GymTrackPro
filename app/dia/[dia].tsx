import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CALENTAMIENTO_FINAL_MIN, CALENTAMIENTO_INICIAL_MIN, CALENTAMIENTO_OPCIONES, esDiaSemanaValido, obtenerPlanPorDia } from '@/data/plan';
import { buscarEjercicioPorId } from '@/data/ejercicios';
import { useGym } from '@/context/GymContext';
import { BarraProgreso } from '@/components/BarraProgreso';
import { ItemEjercicio } from '@/components/ItemEjercicio';
import { TemporizadorDescanso } from '@/components/TemporizadorDescanso';
import { TarjetaCalentamiento } from '@/components/TarjetaCalentamiento';
import { PantallaError } from '@/components/PantallaError';
import { COLORES_APP, NOMBRES_DIA, NOMBRES_GRUPO } from '@/constants/colores';
import type { Ejercicio, GrupoMuscular } from '@/types/gym';

export default function DetalleDiaScreen() {
  const router = useRouter();
  const { dia } = useLocalSearchParams<{ dia: string }>();
  const { completados, alternarEjercicio, socio } = useGym();

  // Validación del parámetro con guarda de tipo (origen: GymTrack).
  const diaValido = typeof dia === 'string' && esDiaSemanaValido(dia) ? dia : null;
  const plan = useMemo(() => (diaValido ? obtenerPlanPorDia(diaValido) : undefined), [diaValido]);

  const listaEjercicios = useMemo(() => {
    if (!plan) return [];
    return plan.ejercicios
      .map(id => buscarEjercicioPorId(id))
      .filter((e): e is Ejercicio => e !== undefined);
  }, [plan]);

  const ejerciciosPorGrupo = useMemo(() => {
    const grupos: Record<string, Ejercicio[]> = {};
    listaEjercicios.forEach(e => {
      if (!grupos[e.grupo]) grupos[e.grupo] = [];
      grupos[e.grupo].push(e);
    });
    return Object.entries(grupos) as [GrupoMuscular, Ejercicio[]][];
  }, [listaEjercicios]);

  if (!diaValido || !plan) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <Stack.Screen options={{ title: 'Día no encontrado' }} />
        <PantallaError
          titulo="Día inválido"
          mensaje="El día solicitado no hace parte del plan semanal (lunes a sábado)."
        />
      </SafeAreaView>
    );
  }

  const nombreDia = NOMBRES_DIA[plan.dia];
  const completadosDia = completados[plan.dia] || [];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <Stack.Screen options={{ title: `${nombreDia} • ${plan.enfoque}` }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.tarjetaEncabezado}>
          <Text style={styles.subtituloEnfoque}>Enfoque del día</Text>
          <Text style={[styles.enfoquePrincipal, { color: plan.color }]}>{plan.enfoque}</Text>
          <BarraProgreso valor={completadosDia.length} total={listaEjercicios.length} color={plan.color} />
        </View>

        <TemporizadorDescanso colorAcento={plan.color} />

        <TarjetaCalentamiento
          tipo="inicio"
          titulo="Calentamiento inicial"
          duracion={`${CALENTAMIENTO_INICIAL_MIN} min`}
          descripcion={`${CALENTAMIENTO_OPCIONES} a ritmo moderado.`}
        />

        {plan.cardioMin !== undefined && (
          <TarjetaCalentamiento
            tipo="cardio"
            titulo="Cardio específico"
            duracion={`${plan.cardioMin} min`}
            descripcion="Intervalos en cinta o elíptica según resistencia recomendada."
          />
        )}

        <Text style={styles.seccionTitulo}>Ejercicios Asignados (4 × 12)</Text>

        {ejerciciosPorGrupo.map(([grupo, items]) => (
          <View key={grupo} style={styles.bloqueGrupo}>
            <Text style={styles.tituloGrupo}>{NOMBRES_GRUPO[grupo].toUpperCase()} ({items.length})</Text>
            {items.map(item => (
              <ItemEjercicio
                key={item.id}
                ejercicio={item}
                completado={completadosDia.includes(item.id)}
                tieneAdvertencia={socio.lesiones.includes(item.grupo)}
                onAlternar={() => alternarEjercicio(plan.dia, item.id)}
                onVerDetalle={() =>
                  router.push({ pathname: '/ejercicio/[id]', params: { id: item.id } })
                }
              />
            ))}
          </View>
        ))}

        <TarjetaCalentamiento
          tipo="fin"
          titulo="Vuelta a la calma / Final"
          duracion={`${CALENTAMIENTO_FINAL_MIN} min`}
          descripcion={`${CALENTAMIENTO_OPCIONES} muy suave y estiramientos de recuperación.`}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORES_APP.fondo },
  scroll: { padding: 16, paddingBottom: 32 },
  tarjetaEncabezado: { backgroundColor: COLORES_APP.superficie, borderRadius: 20, padding: 16, marginBottom: 4 },
  subtituloEnfoque: { fontSize: 14, color: COLORES_APP.textoSecundario },
  enfoquePrincipal: { fontSize: 22, fontWeight: 'bold', marginVertical: 4 },
  seccionTitulo: { fontSize: 18, fontWeight: 'bold', color: COLORES_APP.texto, marginTop: 12, marginBottom: 8 },
  bloqueGrupo: { marginBottom: 10 },
  tituloGrupo: { fontSize: 13, fontWeight: 'bold', color: COLORES_APP.textoSecundario, marginBottom: 6, letterSpacing: 1 },
});
