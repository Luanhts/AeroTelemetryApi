export interface Telemetry {
    id: string;
    vehicleId: string;
    timestamp: Date;
    speed: number;
    rpm?: number;
    engineTemperature: number;
    fuelLevel: number;
}