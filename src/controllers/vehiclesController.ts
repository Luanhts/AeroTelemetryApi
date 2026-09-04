import { type Request, type Response } from 'express';
import Vehicle from '../types/Vehicle.js';

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Boeing 737',
    type: 'AIRCRAFT',
    active: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Airbus A320',
    type: 'AIRCRAFT',
    active: false,
    createdAt: new Date(),
  },
];

class VehiclesController {
    static getVehicles = async (req: Request, res: Response): Promise<void> => {
        try {
            // const vehcilesResult: Vehicle[] = await mockVehicles.();

            res.status(200).json(mockVehicles);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vehicles' });
        }
    }

    static getVehicleById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const vehicle: Vehicle | undefined = mockVehicles.find(v => v.id === id);
            if (!vehicle) {
                res.status(404).json({ message: 'Vehicle not found' });
                return;
            }
            res.status(200).json(vehicle);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vehicle' });
        }
    }

    static createVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, type, active } = req.body;
            const newVehicle: Vehicle = {
                id: (mockVehicles.length + 1).toString(),
                name,
                type,
                active,
                createdAt: new Date(),
            };
            mockVehicles.push(newVehicle);
            res.status(201).json(newVehicle);
        } catch (error) {
            res.status(500).json({ message: 'Error creating vehicle' });
        }
    }

    static updateVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { name, type, active } = req.body;
            const vehicleIndex: number = mockVehicles.findIndex(v => v.id === id);
            if (vehicleIndex === -1) {
                res.status(404).json({ message: 'Vehicle not found' });
                return;
            }
            const updatedVehicle: Vehicle = {
                ...mockVehicles[vehicleIndex],
                name,
                type,
                active,
            };
            mockVehicles[vehicleIndex] = updatedVehicle;
            res.status(200).json(updatedVehicle);
        } catch (error) {
            res.status(500).json({ message: 'Error updating vehicle' });
        }
    }

    static deleteVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const vehicleIndex: number = mockVehicles.findIndex(v => v.id === id);
            if (vehicleIndex === -1) {
                res.status(404).json({ message: 'Vehicle not found' });
                return;
            }
            mockVehicles.splice(vehicleIndex, 1);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ message: 'Error deleting vehicle' });
        }
    }
}

export default VehiclesController;
