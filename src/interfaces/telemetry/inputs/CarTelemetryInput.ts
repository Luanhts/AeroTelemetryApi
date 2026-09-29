import { BaseTelemetryInput } from './BaseTelemetryInput.js';

export interface CarTelemetryInput extends BaseTelemetryInput {
  rpm?: number;

  gear?: number;

  engineTemperatureC?: number;

  steeringAngleDeg?: number;

  brakePct?: number;
}
