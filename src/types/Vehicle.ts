type VehicleType = "RACE_CAR" | "AIRCRAFT";

export default interface Vehicle {
    id: string;
    name: string;
    type: VehicleType;
    active: boolean;
    createdAt: Date;
}