import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BotonAnimado } from '@/components/BotonAnimado';
import { CampoFormulario } from '@/components/CampoFormulario';
import { SelectorLesiones } from '@/components/SelectorLesiones';
import { COLORES_APP } from '@/constants/colores';
import type { GrupoMuscular, Socio } from '@/types/gym';

interface FormularioPerfilProps {
  socioInicial: Socio;
  onGuardar: (actualizado: Socio) => void;
}

interface ErroresPerfil {
  nombre?: string;
  edad?: string;
  objetivo?: string;
}

export function FormularioPerfil({
  socioInicial,
  onGuardar,
}: FormularioPerfilProps) {
  const [nombre, setNombre] = useState(socioInicial.nombre);
  const [edadTexto, setEdadTexto] = useState(String(socioInicial.edad));
  const [objetivo, setObjetivo] = useState(socioInicial.objetivo);
  const [observacionesTexto, setObservacionesTexto] = useState(
    socioInicial.observaciones.join('\n')
  );
  const [lesiones, setLesiones] = useState<GrupoMuscular[]>(socioInicial.lesiones);
  const [errores, setErrores] = useState<ErroresPerfil>({});

  const alternarLesion = (grupo: GrupoMuscular) => {
    setLesiones((prev) =>
      prev.includes(grupo) ? prev.filter((item) => item !== grupo) : [...prev, grupo]
    );
  };

  const guardarPerfil = () => {
    const nuevosErrores: ErroresPerfil = {};
    const nombreLimpio = nombre.trim();
    const edadLimpia = edadTexto.trim();
    const objetivoLimpio = objetivo.trim();

    if (nombreLimpio.length === 0) {
      nuevosErrores.nombre = 'El nombre no puede estar vacío.';
    }

    if (edadLimpia.length === 0 || !/^\d+$/.test(edadLimpia)) {
      nuevosErrores.edad = 'Ingresa una edad entera válida.';
    } else {
      const edadNumero = Number(edadLimpia);
      if (edadNumero < 14 || edadNumero > 90) {
        nuevosErrores.edad = 'La edad debe estar entre 14 y 90 años.';
      }
    }

    if (objetivoLimpio.length === 0) {
      nuevosErrores.objetivo = 'Indica el objetivo de entrenamiento.';
    }

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    const observaciones = observacionesTexto
      .split('\n')
      .map((linea) => linea.trim())
      .filter((linea) => linea.length > 0);

    onGuardar({
      ...socioInicial,
      nombre: nombreLimpio,
      edad: Number(edadLimpia),
      objetivo: objetivoLimpio,
      observaciones,
      lesiones,
    });

    Alert.alert('Perfil guardado', 'Los datos del socio se actualizaron correctamente.');
  };

  return (
    <View style={styles.tarjeta}>
      <CampoFormulario
        etiqueta="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Ej. Andrés Gómez"
        error={errores.nombre}
      />

      <CampoFormulario
        etiqueta="Edad (años)"
        value={edadTexto}
        onChangeText={setEdadTexto}
        placeholder="14 - 90"
        keyboardType="numeric"
        error={errores.edad}
      />

      <CampoFormulario
        etiqueta="Objetivo principal"
        value={objetivo}
        onChangeText={setObjetivo}
        placeholder="Ej. Bajar de peso, ganar fuerza..."
        error={errores.objetivo}
      />

      <CampoFormulario
        etiqueta="Observaciones médicas"
        value={observacionesTexto}
        onChangeText={setObservacionesTexto}
        placeholder="Una observación por línea"
        multiline
        ayuda="Escribe cada lesión o condición médica en una línea separada."
      />

      <SelectorLesiones seleccionadas={lesiones} onAlternar={alternarLesion} />

      <BotonAnimado
        onPress={guardarPerfil}
        haptic="success"
        style={styles.botonGuardar}
      >
        <Text style={styles.textoBoton}>Guardar cambios</Text>
      </BotonAnimado>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: COLORES_APP.superficie,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORES_APP.borde,
    padding: 18,
    gap: 4,
  },
  botonGuardar: {
    backgroundColor: COLORES_APP.primario,
    borderRadius: 999,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  textoBoton: {
    color: COLORES_APP.fondo,
    fontSize: 16,
    fontWeight: '800',
  },
});
