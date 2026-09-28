import express from 'express';
import { authenticate } from '../../middlewares/Authenticator.js';
import { validate } from '../../middlewares/validateResource.js';
import { updateVehicleSchema } from '../../schemas/vehicleSchema.js';
import { VehicleController } from '../../controllers/vehiclesController.js';

const router = express.Router();
const vehicleController = new VehicleController();

router.use('/vehicles', authenticate);

router.post('/vehicles', vehicleController.create);
router.get('/vehicles', vehicleController.getVehicles);
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.put('/vehicles/:id', validate(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

export default router;
