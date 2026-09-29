import { BaseTelemetryInput } from './BaseTelemetryInput.js';

export interface AircraftTelemetryInput extends BaseTelemetryInput {
  altitudeM?: number;

  verticalSpeedMps?: number;

  pitchDeg?: number;

  rollDeg?: number;

  yawDeg?: number;

  headingDeg?: number;
}
