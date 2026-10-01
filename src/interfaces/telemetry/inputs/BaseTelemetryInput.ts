export interface BaseTelemetryInput {
  recordedAt?: string;

  speedMps?: number;

  accelerationMps2?: number;

  latitude?: number;

  longitude?: number;

  throttlePct?: number;
}
