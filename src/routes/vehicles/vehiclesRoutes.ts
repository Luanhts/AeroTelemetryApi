import express, { type Express, type Request, type Response } from 'express';
import VehiclesController from '../../controllers/vehiclesController.js';

const router = express.Router();

router.post('/vehicles', VehiclesController.createVehicle);
router.get('/vehicles', VehiclesController.getVehicles);
router.get('/vehicles/:id', VehiclesController.getVehicleById);
router.put('/vehicles/:id', VehiclesController.updateVehicle);
router.delete('/vehicles/:id', VehiclesController.deleteVehicle);

export default router;