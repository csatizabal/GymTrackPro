import { Alert } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { FormularioMedida } from '@/components/FormularioMedida';
import { RegistroSeries } from '@/components/RegistroSeries';
import { BarraProgreso } from '@/components/BarraProgreso';
import { fechaLocalISO } from '@/utils/progresion';

jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('FormularioMedida', () => {
  it('muestra errores si se guarda vacío y no llama a onGuardar', () => {
    const onGuardar = jest.fn();
    render(<FormularioMedida mesesExistentes={[]} onGuardar={onGuardar} />);
    fireEvent.press(screen.getByText('Guardar medida mensual'));
    expect(screen.getByText('Usa el formato AAAA-MM (ej. 2026-12).')).toBeTruthy();
    expect(screen.getByText('El peso debe estar entre 30 y 300 kg.')).toBeTruthy();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it('rechaza un mes repetido', () => {
    render(<FormularioMedida mesesExistentes={['2026-11']} onGuardar={jest.fn()} />);
    fireEvent.changeText(screen.getByLabelText('Mes (AAAA-MM)'), '2026-11');
    fireEvent.press(screen.getByText('Guardar medida mensual'));
    expect(screen.getByText('Ese mes ya está registrado en el historial.')).toBeTruthy();
  });

  it('guarda una medida válida con coma decimal', () => {
    const onGuardar = jest.fn();
    render(<FormularioMedida mesesExistentes={[]} onGuardar={onGuardar} />);
    fireEvent.changeText(screen.getByLabelText('Mes (AAAA-MM)'), '2026-12');
    fireEvent.changeText(screen.getByLabelText('Estatura (m)'), '1,75');
    fireEvent.changeText(screen.getByLabelText('Peso (kg)'), '96,5');
    for (const campo of ['Hombro', 'Brazo', 'Antebrazo', 'Pecho', 'Abdomen', 'Cadera', 'Pierna', 'Pantorrilla']) {
      fireEvent.changeText(screen.getByLabelText(campo), '40');
    }
    fireEvent.press(screen.getByText('Guardar medida mensual'));
    expect(onGuardar).toHaveBeenCalledWith(
      expect.objectContaining({ mes: '2026-12', estaturaM: 1.75, pesoKg: 96.5 })
    );
  });
});

describe('RegistroSeries', () => {
  it('valida y registra una serie', async () => {
    const onRegistrar = jest.fn().mockResolvedValue(undefined);
    render(<RegistroSeries ejercicioId="pec-01" series={[]} onRegistrar={onRegistrar} onEliminar={jest.fn()} />);
    fireEvent.press(screen.getByLabelText('Agregar serie'));
    expect(await screen.findByText('Peso entre 0 y 500 kg.')).toBeTruthy();
    expect(onRegistrar).not.toHaveBeenCalled();

    fireEvent.changeText(screen.getByLabelText('Peso'), '42,5');
    fireEvent.press(screen.getByLabelText('Agregar serie'));
    await screen.findByText('Agregar serie 1');
    expect(onRegistrar).toHaveBeenCalledWith({ ejercicioId: 'pec-01', repeticiones: 12, pesoKg: 42.5 });
  });

  it('lista las series de hoy y permite eliminarlas', () => {
    const onEliminar = jest.fn();
    const hoy = fechaLocalISO();
    render(
      <RegistroSeries
        ejercicioId="pec-01"
        series={[
          { id: 7, fecha: hoy, ejercicioId: 'pec-01', repeticiones: 12, pesoKg: 40 },
          { id: 8, fecha: '2020-01-01', ejercicioId: 'pec-01', repeticiones: 12, pesoKg: 30 },
        ]}
        onRegistrar={jest.fn()}
        onEliminar={onEliminar}
      />
    );
    expect(screen.getByText('12 × 40 kg')).toBeTruthy();
    expect(screen.queryByText('12 × 30 kg')).toBeNull();
    fireEvent.press(screen.getByLabelText('Eliminar serie 1'));
    expect(onEliminar).toHaveBeenCalledWith(7);
  });
});

describe('BarraProgreso', () => {
  it('muestra el porcentaje', () => {
    render(<BarraProgreso valor={3} total={7} />);
    expect(screen.getByText('3 de 7 (43%)')).toBeTruthy();
  });
});
