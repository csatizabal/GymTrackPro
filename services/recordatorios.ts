import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { NOMBRES_DIA } from '@/constants/colores';
import type { DiaPlan, DiaSemana, Recordatorio } from '@/types/gym';

export const CANAL_ANDROID = 'recordatorios';

/** true dentro de Expo Go (app de la tienda), donde expo-notifications está limitado. */
export const esExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

/** Las notificaciones locales solo funcionan en un development build o en la app instalada. */
export function notificacionesDisponibles(): boolean {
  return Platform.OS !== 'web' && !esExpoGo;
}

type ModuloNotificaciones = typeof import('expo-notifications');
let moduloNotificaciones: Promise<ModuloNotificaciones> | undefined;

/**
 * Carga expo-notifications bajo demanda. Un import estático en Expo Go dispara
 * advertencias al arrancar aunque no se use, por eso solo se importa fuera de él.
 */
function cargarNotificaciones(): Promise<ModuloNotificaciones> {
  moduloNotificaciones ??= import('expo-notifications');
  return moduloNotificaciones;
}

/** Día de la semana en el formato de expo-notifications: 1 = domingo … 7 = sábado. */
const WEEKDAY: Record<DiaSemana, number> = {
  lunes: 2,
  martes: 3,
  miercoles: 4,
  jueves: 5,
  viernes: 6,
  sabado: 7,
};

export interface AvisoProgramado {
  weekday: number;
  hour: number;
  minute: number;
  title: string;
  body: string;
}

/** Función pura: qué avisos semanales corresponden al plan (uno por día de entreno). */
export function construirAvisos(plan: DiaPlan[], r: Recordatorio): AvisoProgramado[] {
  if (!r.activo) return [];
  return plan.map((p) => ({
    weekday: WEEKDAY[p.dia],
    hour: r.hora,
    minute: r.minuto,
    title: `Hoy toca ${NOMBRES_DIA[p.dia]}: ${p.enfoque}`,
    body: `${p.ejercicios.length} ejercicios · 4 × 12${p.cardioMin ? ` + ${p.cardioMin} min de cardio` : ''}. ¡A entrenar!`,
  }));
}

/** "06:00" → { hora: 6, minuto: 0 }; null si el formato no es HH:MM válido. */
export function parsearHora(texto: string): { hora: number; minuto: number } | null {
  const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(texto.trim());
  if (!m) return null;
  return { hora: Number(m[1]), minuto: Number(m[2]) };
}

export function formatearHora(r: Pick<Recordatorio, 'hora' | 'minuto'>): string {
  return `${String(r.hora).padStart(2, '0')}:${String(r.minuto).padStart(2, '0')}`;
}

export type ResultadoProgramacion = 'programado' | 'desactivado' | 'sin-permiso' | 'no-disponible';

/** Reemplaza los recordatorios programados por los del plan actual. */
export async function programarRecordatorios(
  plan: DiaPlan[],
  r: Recordatorio
): Promise<ResultadoProgramacion> {
  if (!notificacionesDisponibles()) return 'no-disponible';

  const Notifications = await cargarNotificaciones();
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!r.activo) return 'desactivado';

  let permiso = await Notifications.getPermissionsAsync();
  if (!permiso.granted) permiso = await Notifications.requestPermissionsAsync();
  if (!permiso.granted) return 'sin-permiso';

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
      name: 'Recordatorios de entrenamiento',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  for (const aviso of construirAvisos(plan, r)) {
    await Notifications.scheduleNotificationAsync({
      content: { title: aviso.title, body: aviso.body },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: aviso.weekday,
        hour: aviso.hour,
        minute: aviso.minute,
        channelId: CANAL_ANDROID,
      },
    });
  }
  return 'programado';
}

/** Cómo mostrar las notificaciones si llegan con la app abierta. Llamar una vez al arrancar. */
export async function configurarManejadorNotificaciones(): Promise<void> {
  if (!notificacionesDisponibles()) return;
  const Notifications = await cargarNotificaciones();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}
