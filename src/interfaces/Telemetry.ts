export interface Telemetry {
  id: string;
  sessionId: string;

  timestamp: Date;
  engineTemperature: number;
  fuelLevel: number;
  speed: number;
  altitude: number;
  latitude: number;
  longitude: number;
  acceleration: number;
  pitch: number;
  roll: number;
  yaw: number;
  throttle: number;
}
