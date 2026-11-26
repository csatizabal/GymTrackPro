jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { executionEnvironment: 'storeClient' },
  ExecutionEnvironment: { Bare: 'bare', Standalone: 'standalone', StoreClient: 'storeClient' },
}));

const mockCargado = jest.fn();
jest.mock('expo-notifications', () => {
  mockCargado();
  return {};
});

import { planSemanal } from '@/data/plan';
import {
  configurarManejadorNotificaciones,
  esExpoGo,
  notificacionesDisponibles,
  programarRecordatorios,
} from '@/services/recordatorios';

describe('recordatorios en Expo Go', () => {
  it('detecta Expo Go y no carga expo-notifications', async () => {
    expect(esExpoGo).toBe(true);
    expect(notificacionesDisponibles()).toBe(false);
    await configurarManejadorNotificaciones();
    await expect(programarRecordatorios(planSemanal, { activo: true, hora: 6, minuto: 0 })).resolves.toBe(
      'no-disponible'
    );
    expect(mockCargado).not.toHaveBeenCalled();
  });
});
