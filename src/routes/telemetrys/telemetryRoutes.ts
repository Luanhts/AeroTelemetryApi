import express from 'express';
import { authenticate } from '../../middlewares/Authenticator.js';
import { validate } from '../../middlewares/validateResource.js';
import { TelemetryController } from '../../controllers/telemetryController.js';

const router = express.Router();
const telemetryController = new TelemetryController();

router.use('/telemetrys', authenticate);
