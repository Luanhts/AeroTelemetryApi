export interface AirCraftTelemetry {
  telemetryId: string;

  altitudeM?: number;

  verticalSpeedMps?: number;

  pitchDeg?: number;
  rollDeg?: number;
  yawDeg?: number;

  headingDeg?: number;
}
