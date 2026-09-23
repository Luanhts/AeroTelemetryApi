export interface Telemetry {
    id: string;
    sessionId: string;

    timestamp: Date;
    speed: number;
    rpm?: number;
    engineTemperature: number;
    fuelLevel: number;
}