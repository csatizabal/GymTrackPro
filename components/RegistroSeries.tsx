import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BotonAnimado } from '@/components/BotonAnimado';
import { CampoFormulario } from '@/components/CampoFormulario';
import { COLORES_APP } from '@/constants/colores';
import type { Serie } from '@/types/gym';
import { fechaLocalISO, formatearSerie, validarSerie, volumenTotal } from '@/utils/progresion';

interface RegistroSeriesProps {
  ejercicioId: string;
  /** Todas las series guardadas (se filtran las de hoy de este ejercicio). */
  series: Serie[];
  onRegistrar: (datos: { ejercicioId: string; repeticiones: number; pesoKg: number }) => Promise<void>;
  onEliminar: (id: number) => void;
  /** Repeticiones sugeridas por el plan (4 × 12). */
  repeticionesObjetivo?: number;
}

/** Formulario para registrar las series de hoy (reps + peso) y lista de lo ya hecho. */
export function RegistroSeries({
  ejercicioId,
  series,
  onRegistrar,
  onEliminar,
  repeticionesObjetivo = 12,
}: RegistroSeriesProps) {
  const hoy = fechaLocalISO();
  const delEjercicio = series.filter((s) => s.ejercicioId === ejercicioId);
  const deHoy = delEjercicio.filter((s) => s.fecha === hoy);
  const ultima = delEjercicio[delEjercicio.length - 1];

  // Se precarga con la última serie registrada para no reescribir el peso cada vez.
  const [reps, setReps] = useState(String(ultima?.repeticiones ?? repeticionesObjetivo));
  const [peso, setPeso] = useState(ultima ? String(ultima.pesoKg) : '');
  const [errores, setErrores] = useState<{ repeticiones?: string; pesoKg?: string }>({});
  const [guardando, setGuardando] = useState(false);

  const agregar = async () => {
    const { valores, errores: nuevos } = validarSerie(reps, peso);
    setErrores(nuevos);
    if (!valores) return;
    setGuardando(true);
    try {
      await onRegistrar({ ejercicioId, ...valores });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.tarjeta}>
      <View style={styles.filaTitulo}>
        <Ionicons name="create-outline" size={20} color={COLORES_APP.primario} />
        <Text style={styles.titulo}>Registrar series de hoy</Text>
      </View>

      <View style={styles.filaCampos}>
        <View style={styles.campo}>
          <CampoFormulario
            etiqueta="Repeticiones"
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            error={errores.repeticiones}
          />
        </View>
        <View style={styles.campo}>
          <CampoFormulario
            etiqueta="Peso"
            value={peso}
            onChangeText={setPeso}
            keyboardType="decimal-pad"
            placeholder="0 = corporal"
            unidad="kg"
            error={errores.pesoKg}
          />
        </View>
      </View>

      <BotonAnimado
        onPress={agregar}
        haptic="success"
        style={[styles.boton, guardando && styles.botonDeshabilitado]}
        accessibilityLabel="Agregar serie">
        <Ionicons name="add" size={20} color={COLORES_APP.fondo} />
        <Text style={styles.textoBoton}>Agregar serie {deHoy.length + 1}</Text>
      </BotonAnimado>

      {deHoy.length > 0 && (
        <View style={styles.lista}>
          {deHoy.map((s, i) => (
            <View key={s.id} style={styles.filaSerie}>
              <Text style={styles.numero}>{i + 1}</Text>
              <Text style={styles.textoSerie}>{formatearSerie(s)}</Text>
              <Pressable
                onPress={() => onEliminar(s.id)}
                style={styles.botonEliminar}
                accessibilityRole="button"
                accessibilityLabel={`Eliminar serie ${i + 1}`}>
                <Ionicons name="trash-outline" size={18} color={COLORES_APP.peligro} />
              </Pressable>
            </View>
          ))}
          <Text style={styles.resumen}>
            {deHoy.length} series · volumen {volumenTotal(deHoy).toLocaleString('es-CO')} kg
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 16,
    marginBottom: 14,
  },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: COLORES_APP.texto },
  filaCampos: { flexDirection: 'row', gap: 10 },
  campo: { flex: 1 },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: COLORES_APP.primario,
  },
  botonDeshabilitado: { opacity: 0.6 },
  textoBoton: { color: COLORES_APP.fondo, fontSize: 16, fontWeight: 'bold' },
  lista: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORES_APP.borde, paddingTop: 8 },
  filaSerie: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  numero: {
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: COLORES_APP.superficieClara,
    color: COLORES_APP.texto,
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    overflow: 'hidden',
  },
  textoSerie: { flex: 1, fontSize: 15, color: COLORES_APP.texto },
  botonEliminar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  resumen: { fontSize: 14, color: COLORES_APP.textoSecundario, marginTop: 6 },
});
