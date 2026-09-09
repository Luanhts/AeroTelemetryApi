import express from 'express';
import VehiclesController from '../../controllers/vehiclesController.js';
import { authenticate } from '../../middlewares/Authenticator.js';

const router = express.Router();

router.use('/vehicles', authenticate);

router.post('/vehicles', VehiclesController.createVehicle);
router.get('/vehicles', VehiclesController.getVehicles);
router.get('/vehicles/:id', VehiclesController.getVehicleById);
router.put('/vehicles/:id', VehiclesController.updateVehicle);
router.delete('/vehicles/:id', VehiclesController.deleteVehicle);

export default router;
