export type CarSimulationPhase =
  'IDLE' | 'ACCELERATING' | 'CRUISING' | 'BRAKING' | 'STOPPED';

export interface CarSimulationState {
  phase: CarSimulationPhase;

  speedMps: number;
  accelerationMps2: number;

  throttlePct: number;
  brakePct: number;

  rpm: number;
  gear: number;

  engineTemperatureC: number;
  steeringAngleDeg: number;
}
