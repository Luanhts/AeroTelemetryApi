export interface TelemetryData {
  id: string;
  sessionId: string;

  recordedAt: Date;

  speedMps?: number;
  accelerationMps2?: number;
  latitude?: number;
  longitude?: number;
  throttlePct?: number;
}
