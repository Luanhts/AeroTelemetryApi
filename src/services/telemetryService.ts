import {
  TelemetryRepository,
  type TelemetryInput,
} from '../repositories/telemetryRepository.js';
import type { VehicleType } from '../types/VehicleType.js';
import type { TelemetrySessionStatus } from '../types/telemetrySessionStatus.js';

type SessionWithVehicleType = {
  id: string;
  status: TelemetrySessionStatus;
  vehicle_type: VehicleType;
};

export class TelemetrySessionNotFoundError extends Error {
  constructor() {
    super('Telemetry session not found');
  }
}

export class TelemetrySessionNotActiveError extends Error {
  constructor() {
    super('Telemetry session is not active');
  }
}

export class InvalidTelemetryPayloadError extends Error {
  constructor() {
    super('Telemetry payload does not match the session vehicle type');
  }
}

export class UnsupportedVehicleTypeError extends Error {
  constructor() {
    super('Unsupported vehicle type');
  }
}

const telemetryRepository = new TelemetryRepository();
const carTelemetryFields: Array<keyof TelemetryInput> = [
  'rpm',
  'gear',
  'engineTemperatureC',
  'steeringAngleDeg',
  'brakePct',
];
const aircraftTelemetryFields: Array<keyof TelemetryInput> = [
  'altitudeM',
  'verticalSpeedMps',
  'pitchDeg',
  'rollDeg',
  'yawDeg',
  'headingDeg',
];

export class TelemetryService {
  async create(sessionId: string, userId: string, data: TelemetryInput) {
    const session = (await telemetryRepository.findSessionWithVehicleType(
      sessionId,
      userId,
    )) as SessionWithVehicleType | undefined;

    if (!session) {
      throw new TelemetrySessionNotFoundError();
    }

    if (session.status !== 'ACTIVE') {
      throw new TelemetrySessionNotActiveError();
    }

    this.validatePayloadForVehicleType(session.vehicle_type, data);

    return telemetryRepository.create(sessionId, session.vehicle_type, data);
  }

  async getAllBySessionId(sessionId: string, userId: string) {
    const session = await telemetryRepository.findSessionWithVehicleType(
      sessionId,
      userId,
    );

    if (!session) {
      throw new TelemetrySessionNotFoundError();
    }

    return telemetryRepository.getAllBySessionId(sessionId, userId);
  }

  async getById(telemetryId: string, userId: string) {
    return telemetryRepository.getById(telemetryId, userId);
  }

  async delete(telemetryId: string, userId: string) {
    return telemetryRepository.delete(telemetryId, userId);
  }

  private validatePayloadForVehicleType(
    vehicleType: VehicleType,
    data: TelemetryInput,
  ) {
    if (vehicleType === 'CAR') {
      if (aircraftTelemetryFields.some((field) => data[field] !== undefined)) {
        throw new InvalidTelemetryPayloadError();
      }

      return;
    }

    if (vehicleType === 'AIRCRAFT') {
      if (carTelemetryFields.some((field) => data[field] !== undefined)) {
        throw new InvalidTelemetryPayloadError();
      }

      return;
    }

    throw new UnsupportedVehicleTypeError();
  }
}
