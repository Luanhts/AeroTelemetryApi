import { TelemetrySessionStatus } from '../../types/telemetrySessionStatus.js';

export interface TelemetrySession {
  id: string;
  vehicleId: string;

  startedAt: Date;
  endedAt?: Date;

  status: TelemetrySessionStatus;

  createdAt: Date;
}
