import { type Request, type Response } from 'express';
import Vehicle from '../interfaces/Vehicle.js';
import { VehicleRepository } from '../repositories/vehicleRepository.js';

const vehicleRepository = new VehicleRepository();

export class VehicleController {
  async create(req: Request, res: Response) {
    try {
      const { name, type } = req.body;

      const userId = res.locals.user.id;

      if (!name || !type) {
        return res.status(400).json({
          message: 'Name and type are required',
        });
      }

      const newVehicle = await vehicleRepository.create(name, type, userId);

      return res.status(201).json(newVehicle);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error creating vehicle',
      });
    }
  }

  async getVehicles(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;

      const vehicles = await vehicleRepository.getVehicles(userId);
      res.status(200).json(vehicles);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error to find vehicles',
      });
    }
  }

  async getVehicleById(req: Request, res: Response) {
    try {
      const vehicleId = req.params.id as string;
      const userId = res.locals.user.id;

      const vehicle = await vehicleRepository.findById(vehicleId, userId);

      if (!vehicle) {
        return res.status(404).json({
          message: 'Vehicle not found',
        });
      }

      return res.status(200).json(vehicle);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error to find vehicle',
      });
    }
  }

  async updateVehicle(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const vehicleId = req.params.id as string;

      const { name, type, active } = req.body;

      if (!vehicleId) {
        return res.status(400).json({
          message: 'Vehicle ID is required',
        });
      }

      const updatedVehicle = await vehicleRepository.updateVehicle(
        userId,
        vehicleId,
        { name, type, active },
      );

      if (!updatedVehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      res.status(200).json({
        message: 'Vehicle updated successfully',
        vehicle: updatedVehicle,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error to update vehicle',
      });
    }
  }

  async deleteVehicle(req: Request, res: Response) {
    try {
      const userId = res.locals.user.id;
      const vehicleId = req.params.id as string;

      if (!vehicleId) {
        return res.status(400).json({ message: 'Vehicle ID is required' });
      }

      const vehicle = await vehicleRepository.deleteVehicle(userId, vehicleId);

      // if (!vehicle) {
      //   return res.status(404).json({
      //     message: 'Vehicle not found',
      //   });
      // }

      return res.status(200).json({
        message: 'Vehicle removed successfully',
        vehicle,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Error to delete vehicle',
      });
    }
  }
}
//   async create(req: Request, res: Response) {
//     try {
//       const { name, type, active } = req.body;

//       const userId = req.user.id;

//       if (!name || !type) {
//         return res.status(400).json({
//           message: 'Name and type are required',
//         });
//       }

//       const newVehicle = await VehicleRepository.create(name, type, userId);

//       res.status(201).json(newVehicle);
//     } catch (error) {
//       res.status(500).json({ message: 'Error creating vehicle' });
//     }
//   }

// static updateVehicle = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const { name, type, active } = req.body;
//         const vehicleIndex: number = mockVehicles.findIndex(v => v.id === id);
//         if (vehicleIndex === -1) {
//             res.status(404).json({ message: 'Vehicle not found' });
//             return;
//         }
//         const updatedVehicle: Vehicle = {
//             ...mockVehicles[vehicleIndex],
//             name,
//             type,
//             active,
//         };
//         mockVehicles[vehicleIndex] = updatedVehicle;
//         res.status(200).json(updatedVehicle);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating vehicle' });
//     }
// }

// static deleteVehicle = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { id } = req.params;
//         const vehicleIndex: number = mockVehicles.findIndex(v => v.id === id);
//         if (vehicleIndex === -1) {
//             res.status(404).json({ message: 'Vehicle not found' });
//             return;
//         }
//         mockVehicles.splice(vehicleIndex, 1);
//         res.status(204).send();
//     }
//     catch (error) {
//         res.status(500).json({ message: 'Error deleting vehicle' });
//     }
// }
