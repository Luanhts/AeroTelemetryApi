export interface Session {
    id: string;
    vehicleId: string;

    createdAt: Date;
    endAt?: Date;
    status: string;

    name?: string;
}