import { z } from 'zod';

export const createTelemetrySchema = z.object({
  body: z
    .object({
      recordedAt: z.string().datetime().optional(),
      speedMps: z.number().optional(),
      accelerationMps2: z.number().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      throttlePct: z.number().min(0).max(100).optional(),
      rpm: z.number().optional(),
      gear: z.number().int().optional(),
      engineTemperatureC: z.number().optional(),
      steeringAngleDeg: z.number().optional(),
      brakePct: z.number().min(0).max(100).optional(),
      altitudeM: z.number().optional(),
      verticalSpeedMps: z.number().optional(),
      pitchDeg: z.number().optional(),
      rollDeg: z.number().optional(),
      yawDeg: z.number().optional(),
      headingDeg: z.number().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'É necessário enviar pelo menos um dado de telemetria',
    }),
});
