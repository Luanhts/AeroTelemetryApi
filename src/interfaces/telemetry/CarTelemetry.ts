export interface CarTelemetry {
  telemetryId: string;

  rpm: number | null;

  gear: number | null;

  engineTemperatureC: number | null;

  steeringAngleDeg: number | null;

  brakePct: number | null;
}
